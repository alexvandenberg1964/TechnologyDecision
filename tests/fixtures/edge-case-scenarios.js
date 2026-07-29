// Targeted edge-case scenarios for the parts of the scoring logic the 20-application
// testset deliberately does not exercise: Quick Scan (a separate, coarser question set), and
// the Layer 3 Hybrid Feasibility Gate (which depends on Organisational Readiness answers — out
// of scope for testset-real-world-applicaties-technology-fit.md by design).
//
// These are the "Scenario A/B/B2"-style checks referenced in
// kritische-review-architectuur-cto-mtit.md finding 1.4 — previously run by hand during
// the ui_complexity refactor (finding 1.6), never captured in the repo. Capturing them
// here is what finding 1.4 asks for.

const testset = require('./technology-fit-testset');
const answersFor = id => testset.find(app => app.id === id).answers;

// All 16 Technology Fit questions at their most Low-Code-favouring option (index 0, or
// index 0 which for domain/business_logic/etc. is the lc:3-style option) — a deliberately
// extreme "everything points to Low-Code" baseline, so a single overridden answer's effect
// is unambiguous.
const ALL_LOW_CODE = {
  domain:0, ui_complexity:0, business_logic:0, uniqueness:0, strategic_domain:0,
  performance:0, elasticity:0, runtime_cost:0, integration:0, observability:0, security:0,
  cloud:0, lifespan:0, change_rate:0, reuse:0, vendor:0,
};
const allLowCodeExcept = overrides => ({ ...ALL_LOW_CODE, ...overrides });

module.exports = [
  {
    // Quick Scan's qs_ui "None" option used to be a hard `no_ui_qs` knock-out — closed as the
    // last open follow-up item of finding 1.6 (the same reconsideration already applied to Full
    // Assessment's ui_complexity: "no UI" is now the scan's strongest weighted signal, weight
    // raised 2→3, but not an automatic override). This mirrors the Full Assessment regression
    // pin below: an isolated no-UI signal against 4 otherwise-maxed-Low-Code answers still lands
    // on Low-Code — a single signal in a 5-question scan can be outweighed, same as in the
    // 16-question Full Assessment. qs_capability:0 correctly reads "ready" here because Low-Code
    // genuinely won (finding 4.2) — it would be wrong to read false the way the old KO forced it to.
    name: 'Quick Scan: "no meaningful UI" alone no longer forces High-Code (finding 1.6 follow-up, closed)',
    mode: 'quick',
    answers: { qs_shape: 0, qs_ui: 3, qs_volume: 0, qs_integration: 0, qs_capability: 0 },
    expect: { winnerKey: 'lc', evId: null, evLevel: null, qsCapabilityReady: true },
  },
  {
    // Realistic Quick Scan translations of 4 testset applications whose only Full Assessment hard
    // constraint used to be "no UI" (route optimisation, EDI, tariff engine, mainframe access
    // layer — see testset-real-world-applicaties-technology-fit.md and CALIBRATION.md §8.1).
    // Unlike the all-else-Low-Code case above, these combine "no UI" with realistically
    // technical answers on every other question — exactly how a genuine no-UI backend service
    // would actually score a 5-question scan — and should still land clearly on High-Code via
    // weighted score alone, with no hard constraint needed.
    name: 'Quick Scan: realistic no-UI backend service (route optimisation-shaped) still lands on High-Code via weighted score',
    mode: 'quick',
    answers: { qs_shape: 2, qs_ui: 3, qs_volume: 1, qs_integration: 2, qs_capability: 2 },
    expect: { winnerKey: 'hc', evId: null, evLevel: null },
  },
  {
    name: 'Quick Scan: realistic no-UI integration hub (EDI-shaped) still lands on High-Code via weighted score',
    mode: 'quick',
    answers: { qs_shape: 2, qs_ui: 3, qs_volume: 1, qs_integration: 2, qs_capability: 2 },
    expect: { winnerKey: 'hc', evId: null, evLevel: null },
  },
  {
    name: 'Quick Scan: realistic no-UI calculation engine (tariff-engine-shaped, spikier volume) still lands on High-Code via weighted score',
    mode: 'quick',
    answers: { qs_shape: 2, qs_ui: 3, qs_volume: 2, qs_integration: 2, qs_capability: 2 },
    expect: { winnerKey: 'hc', evId: null, evLevel: null },
  },
  {
    name: 'Quick Scan: realistic no-UI legacy access layer (mainframe-shaped) still lands on High-Code via weighted score',
    mode: 'quick',
    answers: { qs_shape: 2, qs_ui: 3, qs_volume: 1, qs_integration: 2, qs_capability: 2 },
    expect: { winnerKey: 'hc', evId: null, evLevel: null },
  },
  {
    name: 'Full Assessment: critical performance overrides an otherwise all-Low-Code profile',
    mode: 'full',
    answers: allLowCodeExcept({ performance: 3 }),
    expect: { winnerKey: 'hc', evId: 'extreme_latency', evLevel: 'ko' },
  },
  {
    name: 'Full Assessment: scale-to-zero/burst elasticity overrides an otherwise all-Low-Code profile',
    mode: 'full',
    answers: allLowCodeExcept({ elasticity: 3 }),
    expect: { winnerKey: 'hc', evId: 'extreme_elasticity', evLevel: 'ko' },
  },
  {
    name: 'Full Assessment: custom crypto / zero-trust overrides an otherwise all-Low-Code profile',
    mode: 'full',
    answers: allLowCodeExcept({ security: 3 }),
    expect: { winnerKey: 'hc', evId: 'zero_trust', evLevel: 'ko' },
  },
  {
    name: 'Full Assessment: "no meaningful UI" alone no longer forces High-Code (finding 1.6 regression pin)',
    mode: 'full',
    answers: allLowCodeExcept({ ui_complexity: 2 }),
    expect: { winnerKey: 'lc', evId: null, evLevel: null, rawScore: { lc: 72, hy: 21, hc: 9 } },
  },
  {
    name: 'Hybrid Feasibility Gate: undefined architectural boundary blocks a Hybrid-winning score',
    mode: 'full',
    answers: { ...answersFor(9), arch_boundary: 2 },
    expect: { winnerKeyNot: 'hy', evId: 'hybrid_no_boundary', evLevel: 'block' },
  },
  {
    name: 'Hybrid Feasibility Gate: unclear team ownership blocks a Hybrid-winning score',
    mode: 'full',
    answers: { ...answersFor(10), team_ownership: 2 },
    expect: { winnerKeyNot: 'hy', evId: 'hybrid_no_ownership', evLevel: 'block' },
  },
  {
    name: 'Hybrid Feasibility Gate: mission-critical is a warning, not a block — Hybrid still wins',
    mode: 'full',
    answers: { ...answersFor(18), op_criticality: 3 },
    expect: { winnerKey: 'hy', evId: 'hybrid_mission_critical', evLevel: 'warn' },
  },
  {
    // finding 4.2: the old ORG_READINESS_CHECKS entry `team_skills: goodIdx:[0,3]` marked a
    // strong Low-Code team "ready" regardless of which platform actually won — including on a
    // project the score forces to High-Code. team_skills:0 = "Citizen developers / business
    // analysts" (a strong Low-Code profile); security:3 forces the winner to High-Code via the
    // zero_trust hard constraint, so that team should read as NOT ready, not "ready" just
    // because the answer has a clear profile.
    name: 'Organisational Readiness (finding 4.2): a strong Low-Code team is NOT ready when the winning platform is High-Code',
    mode: 'full',
    answers: { ...allLowCodeExcept({ security: 3 }), team_skills: 0 },
    expect: { winnerKey: 'hc', evId: 'zero_trust', evLevel: 'ko', teamSkillsReady: false },
  },
  {
    // Flip side of the same bug: team_skills:2 = "Full-stack engineers with some Low-Code
    // exposure", the model's own stated Hybrid archetype (CALIBRATION.md §8.3). Under the old
    // fixed goodIdx:[0,3] list this was NEVER "ready" (index 2 isn't in the list), even on a
    // Hybrid-winning project where it's exactly the right team. Judged against the actual
    // winner, it should now read as ready.
    name: 'Organisational Readiness (finding 4.2): a full-stack/Hybrid-shaped team IS ready when Hybrid wins',
    mode: 'full',
    answers: { ...answersFor(9), team_skills: 2 },
    expect: { winnerKey: 'hy', teamSkillsReady: true },
  },
  {
    name: 'Organisational Readiness (finding 4.2): a strong Low-Code team IS ready when Low-Code wins (unchanged-good case)',
    mode: 'full',
    answers: { ...answersFor(2), team_skills: 0 },
    expect: { winnerKey: 'lc', teamSkillsReady: true },
  },
  {
    // finding 1.2 / "Low-Code is the strategic default": an exact score tie must be treated as
    // a real, first-class outcome — both platforms shown as equally valid options — not silently
    // resolved to whichever key happens to sort first (lc, by array order). domain:2 gives
    // lc0/hy2/hc6; vendor:0 gives lc6/hy2/hc0 — lc and hc tie at 6, hy trails at 4.
    name: 'Tie handling: an exact Low-Code/High-Code score tie is flagged as isTie, not silently resolved to Low-Code',
    mode: 'full',
    answers: { domain: 2, vendor: 0 },
    expect: {
      isTie: true, tiedKeys: ['lc', 'hc'], evId: null, evLevel: null,
      rawScore: { lc: 6, hy: 4, hc: 6 },
    },
  },
  {
    // Readiness cannot honestly be judged "relative to the winner" (finding 4.2's mechanism)
    // when there is no single winner — team_skills:0 should read neither ready nor unready,
    // it should read unknown (null), not silently compared against whichever key sorts first.
    name: 'Tie handling: team_skills readiness is null (unknown), not silently judged against a false single winner, when tied',
    mode: 'full',
    answers: { domain: 2, vendor: 0, team_skills: 0 },
    expect: { isTie: true, tiedKeys: ['lc', 'hc'], teamSkillsReady: null },
  },
];
