# PostNL Platform Decision Model

**v4.1 — Low-Code vs. High-Code vs. Hybrid**

An interactive decision-support tool for PostNL engineering teams evaluating whether to use **Low-Code**, **AWS-native High-Code**, or a **Hybrid architecture** for new or modernised applications.

---

## What it does

The tool guides you through a structured assessment and produces a scored recommendation with full rationale. It implements a three-layer model:

| Layer | What it checks | Effect |
|---|---|---|
| **1 — Hard constraints** | Technical or strategic blockers (e.g. zero-trust requirements, extreme latency SLAs, no-UI workloads) | Overrides scoring — forces a platform regardless of weighted score |
| **2 — Weighted scoring** | 24 questions across four dimensions | Produces Low-Code / Hybrid / High-Code scores |
| **3 — Hybrid feasibility gate** | Boundary clarity, team ownership, criticality, observability | Penalises hybrid 30% if readiness < 40% |

At the end you can export a formal **Decision Report (DR)** in Markdown, suitable for governance boards or architecture reviews.

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

## Project structure

```
TechnologyDecision/
└── lowcode-decision-model.html   # Complete self-contained application
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
