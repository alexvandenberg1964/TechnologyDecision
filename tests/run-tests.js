#!/usr/bin/env node
// Regression test script for the Platform Decision Model's scoring logic.
// No test framework, no dependencies — run with: node tests/run-tests.js
//
// Addresses kritische-review-architectuur-cto-mtit.md finding 1.4: the scoring logic
// previously had no automated coverage, only ad-hoc manual verification during changes.
//
// How it works: the actual HARD_RULES/FULL_CATS/QUICK_SCAN data and the actual
// computeScores()/evaluateRules()/determineWinner() functions are extracted straight out
// of lowcode-decision-model.html and run in a Node vm context — this tests the shipped
// logic itself, not a reimplementation of it. See loadModel() below for exactly where the
// extraction cuts off and why.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HTML_PATH = path.join(__dirname, '..', 'lowcode-decision-model.html');
// Everything before this comment (see lowcode-decision-model.html) is pure data literals
// and pure function definitions with no DOM access: HARD_RULES, RISK_RULES, QUICK_SCAN,
// FULL_CATS, initAllQ(), evaluateRules(), computeScores(), determineWinner(). Everything
// from this comment onward touches the DOM eagerly (this line populates .cloud-ref-tag
// spans, then the INIT IIFE runs immediately after) — deliberately excluded rather than
// papered over with a fake DOM.
const CUT_ANCHOR = '// Populate every static "current cloud reference" tag';

function loadModel() {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const openTag = '<script>', closeTag = '</script>';
  const scriptOpen = html.indexOf(openTag);
  const scriptClose = html.indexOf(closeTag);
  if (scriptOpen === -1 || scriptClose === -1) {
    throw new Error(`Could not find a <script> block in ${HTML_PATH}`);
  }
  const fullScript = html.slice(scriptOpen + openTag.length, scriptClose);

  const cutIdx = fullScript.indexOf(CUT_ANCHOR);
  if (cutIdx === -1) {
    throw new Error(
      'Extraction anchor not found in the script. The file was likely restructured — ' +
      'update CUT_ANCHOR in tests/run-tests.js to a comment that still sits right before ' +
      'the first DOM-touching top-level statement (currently the cloud-ref-tag population line).'
    );
  }
  const pureScript = fullScript.slice(0, cutIdx);

  const sandbox = {};
  vm.createContext(sandbox);
  try {
    vm.runInContext(pureScript, sandbox, { filename: 'lowcode-decision-model.html (extracted)' });
  } catch (e) {
    throw new Error(
      'Failed to evaluate the extracted model script. If this is a ReferenceError for ' +
      '`document` / `localStorage` / `window`, a DOM-touching statement crept above the ' +
      `extraction anchor (or the anchor needs to move down). Original error: ${e.message}`
    );
  }
  return sandbox;
}

function runScenario(sandbox, scenario) {
  const code = `(function(){
    mode = ${JSON.stringify(scenario.mode)};
    blindMode = false;
    answers = ${JSON.stringify(scenario.answers)};
    initAllQ();
    const raw = computeScores();
    const dw = determineWinner(raw, answers);
    const orBd = orgReadinessBreakdown(dw.isTie ? null : dw.winner.key);
    const teamSkillsRow = orBd.find(b => b.id === 'team_skills');
    const qsCapabilityRow = orBd.find(b => b.id === 'qs_capability');
    return JSON.stringify({
      lc: raw.lc, hy: raw.hy, hc: raw.hc, answered: raw.answered,
      winnerKey: dw.winner.key, winnerName: dw.winner.name,
      evId: dw.ev ? dw.ev.id : null, evLevel: dw.ev ? dw.ev.level : null,
      isTie: dw.isTie, tiedKeys: dw.tied.map(s => s.key),
      teamSkillsReady: teamSkillsRow ? teamSkillsRow.ready : null,
      qsCapabilityReady: qsCapabilityRow ? qsCapabilityRow.ready : null,
    });
  })();`;
  return JSON.parse(vm.runInContext(code, sandbox));
}

function check(expect, result) {
  const failures = [];
  if (expect.winnerKey !== undefined && result.winnerKey !== expect.winnerKey) {
    failures.push(`expected winner '${expect.winnerKey}', got '${result.winnerKey}' (${result.winnerName})`);
  }
  if (expect.winnerKeyNot !== undefined && result.winnerKey === expect.winnerKeyNot) {
    failures.push(`expected winner NOT to be '${expect.winnerKeyNot}', but it was`);
  }
  if (expect.evId !== undefined && result.evId !== expect.evId) {
    failures.push(`expected triggered rule '${expect.evId}', got '${result.evId}'`);
  }
  if (expect.evLevel !== undefined && result.evLevel !== expect.evLevel) {
    failures.push(`expected rule level '${expect.evLevel}', got '${result.evLevel}'`);
  }
  if (expect.rawScore) {
    ['lc', 'hy', 'hc'].forEach(k => {
      if (result[k] !== expect.rawScore[k]) {
        failures.push(`expected raw ${k}=${expect.rawScore[k]}, got ${result[k]}`);
      }
    });
  }
  if (expect.teamSkillsReady !== undefined && result.teamSkillsReady !== expect.teamSkillsReady) {
    failures.push(`expected team_skills readiness ${expect.teamSkillsReady}, got ${result.teamSkillsReady}`);
  }
  if (expect.qsCapabilityReady !== undefined && result.qsCapabilityReady !== expect.qsCapabilityReady) {
    failures.push(`expected qs_capability readiness ${expect.qsCapabilityReady}, got ${result.qsCapabilityReady}`);
  }
  if (expect.isTie !== undefined && result.isTie !== expect.isTie) {
    failures.push(`expected isTie=${expect.isTie}, got ${result.isTie}`);
  }
  if (expect.tiedKeys) {
    const got = [...result.tiedKeys].sort().join(',');
    const want = [...expect.tiedKeys].sort().join(',');
    if (got !== want) failures.push(`expected tiedKeys [${want}], got [${got}]`);
  }
  return failures;
}

function buildTestsetScenarios() {
  const testset = require('./fixtures/technology-fit-testset');
  return testset.map(app => ({
    name: `Testset #${app.id} — ${app.name}`,
    mode: 'full',
    answers: app.answers,
    expect: {
      winnerKey: app.expectedWinner,
      evId: app.expectedConstraint,
      evLevel: app.expectedConstraint ? 'ko' : null,
      rawScore: app.expectedRawScore,
    },
  }));
}

function main() {
  const scenarios = [...buildTestsetScenarios(), ...require('./fixtures/edge-case-scenarios')];
  const sandbox = loadModel();

  let pass = 0, fail = 0;
  console.log(`Running ${scenarios.length} scenarios against lowcode-decision-model.html\n`);
  scenarios.forEach(scenario => {
    let failures;
    try {
      const result = runScenario(sandbox, scenario);
      failures = check(scenario.expect, result);
    } catch (e) {
      failures = [`threw: ${e.message}`];
    }
    if (failures.length === 0) {
      pass++;
      console.log(`  PASS  ${scenario.name}`);
    } else {
      fail++;
      console.log(`  FAIL  ${scenario.name}`);
      failures.forEach(f => console.log(`          - ${f}`));
    }
  });

  console.log(`\n${pass} passed, ${fail} failed, ${scenarios.length} total`);
  if (fail > 0) process.exitCode = 1;
}

main();
