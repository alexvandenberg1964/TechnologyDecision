# PostNL Platform Decision Model

**v4.1 — Low-Code vs. High-Code vs. Hybrid**

An interactive decision-support tool for PostNL engineering teams evaluating whether to use **Low-Code**, **High-Code**, or a **Hybrid architecture** for new or modernised applications. Cost-model examples are illustrated with AWS, PostNL's current reference cloud platform — AWS is not a synonym for "High-Code," and the tool's language and cost model are decoupled from it (see `CALIBRATION.md` and `HIGH_CODE_CLOUD_REF` in the source) so a future cloud-strategy change doesn't require rewriting the model.

---

## What it does

The tool guides you through a structured assessment and produces a scored recommendation with full rationale. The platform recommendation itself is driven only by **Technology Fit** — questions about what the application *is* and technically *requires*:

| Layer                     | What it checks                                                                                                       | Effect                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **1 — Hard constraints**   | Technical or strategic blockers (e.g. zero-trust requirements, extreme latency SLAs, scale-to-zero/burst elasticity) | Overrides scoring — forces a platform regardless of weighted score |
| **2 — Weighted scoring**   | The Technology Fit questions (`axis:'tech'`), weighted                                                               | Produces Low-Code / Hybrid / High-Code scores                      |

Separately, **Organisational Readiness** questions (`axis:'org'` — team skills/size/ownership, time-to-market, operational criticality, architectural boundary clarity, budget) never contribute to that score or override the winner — they answer a different question, "are we ready to deliver this?", and are reported as their own readiness percentage and breakdown. Organisational answers can never move the technology recommendation; see "Skipping Organisational Readiness" below.

At the end you can export a formal **Decision Report (DR)** in Markdown, suitable for governance boards or architecture reviews.

No platform is treated as a default: weight defaults reflect general guidance, not a preference, and an exact score tie is shown as-is — all tied platforms presented as equally valid options — rather than silently resolved to whichever one happens to be listed first.

---

## Assessment modes

**Quick Scan** (5 questions)  
Rapid orientation — useful early in a project to get a directional signal before investing in a full assessment.

**Full Assessment** (24 questions across 4 categories)  
Defensible, auditable scoring. Questions are weighted (1 = standard, 2 = important, 3 = critical) and weights can be adjusted per project context.

Categories covered:

- Application Characteristics
- Technical Constraints
- Team & Organisation
- Business & Strategic

---

## How to use it

1. Open `lowcode-decision-model.html` in any modern browser — no installation, no server, no dependencies.
2. Choose **Quick Scan** or **Full Assessment**.
3. Answer each question; the score updates live in the sidebar.
4. Review the recommendation, identified risks, and architecture signals.
5. Optionally open the **Weight Drawer** (full mode) to adjust question priorities.
6. Click **Export DR** to download or copy the decision report as Markdown.

Session state is saved automatically in `localStorage` so you can close and resume later. Quick Scan and Full Assessment states are stored independently.

---

## Output

The exported DR includes:

- Project metadata (name, author, date)
- Decision summary and confidence level
- Weight deviations (Full Assessment), if any question's weight was changed from its default — which question, default → current, and when it was last changed, shown near the top rather than only as a small note in the answer transcript
- Deviation from recommendation, if recorded (chosen platform, reason, approving architect — see "Recording a deviation" below)
- Recommended architecture pattern (if hybrid)
- Score table with raw and adjusted scores
- Identified risks and trade-offs
- Cost model explanation per platform
- Assumptions log
- Full Q&A transcript with per-answer signals

---

## Validating the model against real applications

**Blind Assessment** lets you interview a Product Owner about an application that's already built, without biasing their answers with the model's own scoring:

1. Click **🔬 Blind assessment** — the sidebar and every scoring hint (weight badges, hard-constraint tags, the constraint banner) are hidden for the whole session.
2. The Product Owner answers all 24 questions plus one closing question: *"How is this application actually built today?"* (Low-Code / High-Code / Hybrid / Not sure).
3. No score or recommendation is ever shown to them. On completion they click **Download response file**, which exports a JSON file (their answers + the model's internally-computed recommendation), and send it back to the model owner.

**Compare results** loads one or more of those exported files and tabulates the model's recommendation against what was actually implemented, with a match count — use it to spot where the model's weights or hard constraints need tuning.

---

## Skipping Organisational Readiness

In Full Assessment, after the Technology Fit questions you can skip the Organisational Readiness phase and finish immediately — it never changes the platform recommendation, so this must stay optional. Skipping requires a short reason ("Reason for skipping") before the "Confirm skip" button becomes active; this is deliberately light friction, not a block. Once skipped, a "⚠ Organisational Readiness: Skipped" badge appears everywhere the recommendation is shown (sidebar, finish screen) and at the top of the exported report — not just in a section further down — so a skipped delivery-risk assessment stays visible rather than quietly disappearing under deadline pressure.

---

## Recording a deviation

If a project will not follow the model's recommendation, tick **⚠ Deviation from recommendation** in the sidebar (above the export buttons) and record the platform chosen instead, the reason, and the approving architect's name and role. This is deliberately not a blocker — the assessment still completes and exports normally — but the deviation is then shown prominently in the exported Decision Report (a flag in the metadata table plus its own section right after the Decision), so honest exceptions are visible and auditable instead of being hidden by quietly answering questions to avoid a hard constraint.

---

## Scoring calibration

Every `lc`/`hy`/`hc` score value and every question/hard-rule weight in the model is documented in [`CALIBRATION.md`](CALIBRATION.md) — accessible from the tool itself via the **📖 Scoring calibration & rationale** button in the sidebar. It is currently a **draft**: it records the reasoning behind today's values so an architecture panel has a concrete starting point, but no value is considered validated until the panel process described in that document has actually run.

The same document also anchors each answer *option* to a concrete example application (§9), so two assessors interpreting e.g. "how complex is the core business logic?" have a real reference point instead of guessing — 16 Technology Fit questions reuse examples from `testset-real-world-applicaties-technology-fit.md`, and 8 Organisational Readiness questions get newly constructed illustrative scenarios (that axis has no testset equivalent).

Those examples also show up right where they're useful: every Full Assessment question has a **🗂️ Examples** badge that opens a popup listing all of that question's options side by side with their example application — so you can compare "is my application more like *this* one?" while you're actually answering, not just when you happen to open `CALIBRATION.md` separately. Hidden during Blind Assessment, like every other scoring hint.

---

## Regression tests

The scoring logic (hard constraints, weighted scoring, the Hybrid feasibility gate) has automated regression coverage in `tests/` — run it with:

```
node tests/run-tests.js
```

No test framework and no dependencies: the script extracts the actual data and scoring functions straight out of `lowcode-decision-model.html` and runs them in a Node `vm` context, so it tests the shipped logic itself rather than a reimplementation of it. Coverage is 20 realistic scenarios from `testset-real-world-applicaties-technology-fit.md` (`tests/fixtures/technology-fit-testset.js`) plus targeted edge cases for the hard-constraint and Hybrid-gate rules that testset deliberately doesn't touch (`tests/fixtures/edge-case-scenarios.js`). Run this after any change to `HARD_RULES`, `FULL_CATS`, `QUICK_SCAN`, or the winner-selection logic in `determineWinner()`.

---

## Project structure

```
TechnologyDecision/
├── lowcode-decision-model.html   # Complete self-contained application
├── CALIBRATION.md                # Score/weight rationale register — see "Scoring calibration" below
└── tests/
    ├── run-tests.js              # Regression test runner — node tests/run-tests.js
    └── fixtures/
        ├── technology-fit-testset.js   # 20 scenarios derived from the real-world testset
        └── edge-case-scenarios.js      # Hard-constraint / Hybrid-gate edge cases
```

No build step, no package manager, no external dependencies. The entire application — logic, styling, and data — is in a single HTML file.

---

## Technology

- Vanilla HTML5 / CSS3 / ES6+ JavaScript
- Zero runtime dependencies
- Google Fonts: Inter, JetBrains Mono (loaded from CDN)
- Browser APIs: `localStorage`, `Blob`, `Clipboard`

---

## Maintainers

PostNL Platform & Architecture team. Raise issues or improvements via GitHub.
