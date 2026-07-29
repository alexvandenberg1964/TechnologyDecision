// Machine-readable version of testset-real-world-applicaties-technology-fit.md.
//
// Each entry maps the Dutch prose answer for one of the 20 applications to the exact
// option index (0-based) of the matching FULL_CATS question in lowcode-decision-model.html,
// for the 16 Technology Fit ("axis:'tech'") questions only — Organisational Readiness is
// deliberately out of scope for this testset (see the .md file's intro) and is left
// unanswered here, which is also why hybrid_no_boundary/hybrid_no_ownership/
// hybrid_mission_critical never fire against this fixture set (they depend on org-axis
// answers that are always `undefined` here).
//
// Question order below matches the 16-row table order used in every application section
// of the .md file: domain, ui_complexity, business_logic, uniqueness, strategic_domain,
// performance, elasticity, runtime_cost, integration, observability, security, cloud,
// lifespan, change_rate, reuse, vendor.
//
// `expectedWinner` and `expectedConstraint` are taken directly from the "Overzichtstabel"
// in the .md file. Application 18 additionally cross-checks the exact documented raw score
// (lc=33, hy=62, hc=30) — see tests/run-tests.js.
//
// If FULL_CATS option order/count changes in lowcode-decision-model.html, the indices below
// must be re-derived from the .md file's prose answers — they are not auto-generated.

module.exports = [
  {
    id: 1, name: 'Zending Track & Trace Portal',
    expectedWinner: 'hc', expectedConstraint: 'extreme_elasticity',
    answers: { domain:3, ui_complexity:1, business_logic:1, uniqueness:1, strategic_domain:1,
      performance:2, elasticity:3, runtime_cost:2, integration:2, observability:3, security:1,
      cloud:0, lifespan:2, change_rate:2, reuse:2, vendor:1 },
  },
  {
    id: 2, name: 'Verlofaanvraag- en Goedkeuringsworkflow',
    expectedWinner: 'lc', expectedConstraint: null,
    answers: { domain:0, ui_complexity:0, business_logic:0, uniqueness:0, strategic_domain:0,
      performance:0, elasticity:0, runtime_cost:0, integration:0, observability:0, security:0,
      cloud:0, lifespan:1, change_rate:0, reuse:1, vendor:0 },
  },
  {
    id: 3, name: 'Route- en Beladingsoptimalisatie voor Bezorgvoertuigen',
    expectedWinner: 'hc', expectedConstraint: null,
    answers: { domain:1, ui_complexity:2, business_logic:2, uniqueness:2, strategic_domain:2,
      performance:2, elasticity:1, runtime_cost:2, integration:1, observability:3, security:0,
      cloud:0, lifespan:2, change_rate:3, reuse:2, vendor:2 },
  },
  {
    id: 4, name: 'Realtime Fraude- en Risicodetectie bij Verzendingen',
    expectedWinner: 'hc', expectedConstraint: 'extreme_latency',
    answers: { domain:2, ui_complexity:2, business_logic:3, uniqueness:2, strategic_domain:2,
      performance:3, elasticity:3, runtime_cost:2, integration:2, observability:3, security:2,
      cloud:0, lifespan:2, change_rate:3, reuse:2, vendor:2 },
  },
  {
    id: 5, name: 'Sorteercentrum Besturingssysteem',
    expectedWinner: 'hc', expectedConstraint: 'extreme_latency',
    answers: { domain:2, ui_complexity:2, business_logic:2, uniqueness:2, strategic_domain:2,
      performance:3, elasticity:0, runtime_cost:1, integration:2, observability:3, security:2,
      cloud:3, lifespan:2, change_rate:3, reuse:2, vendor:2 },
  },
  {
    id: 6, name: 'Klant Self-Service Klachten- en Retourportaal',
    expectedWinner: 'lc', expectedConstraint: null,
    answers: { domain:0, ui_complexity:0, business_logic:1, uniqueness:0, strategic_domain:0,
      performance:0, elasticity:1, runtime_cost:0, integration:1, observability:1, security:1,
      cloud:0, lifespan:2, change_rate:0, reuse:1, vendor:0 },
  },
  {
    id: 7, name: 'Facturatie- en Incassoproces voor Zakelijke Klanten',
    expectedWinner: 'lc', expectedConstraint: null,
    answers: { domain:0, ui_complexity:0, business_logic:1, uniqueness:0, strategic_domain:0,
      performance:0, elasticity:0, runtime_cost:0, integration:1, observability:1, security:1,
      cloud:0, lifespan:2, change_rate:0, reuse:1, vendor:1 },
  },
  {
    id: 8, name: 'Partner-koppelvlak voor Grootzakelijke Verladers (EDI)',
    expectedWinner: 'hc', expectedConstraint: null,
    answers: { domain:2, ui_complexity:2, business_logic:2, uniqueness:1, strategic_domain:2,
      performance:1, elasticity:1, runtime_cost:1, integration:3, observability:3, security:1,
      cloud:0, lifespan:2, change_rate:3, reuse:2, vendor:2 },
  },
  {
    id: 9, name: 'Operationeel Capaciteits- en Voorraaddashboard',
    expectedWinner: 'hy', expectedConstraint: null,
    answers: { domain:1, ui_complexity:1, business_logic:1, uniqueness:1, strategic_domain:1,
      performance:1, elasticity:1, runtime_cost:1, integration:1, observability:2, security:0,
      cloud:0, lifespan:1, change_rate:2, reuse:1, vendor:1 },
  },
  {
    id: 10, name: 'Virtuele Assistent voor Klantenservice (Chatbot)',
    expectedWinner: 'hy', expectedConstraint: null,
    answers: { domain:3, ui_complexity:1, business_logic:3, uniqueness:1, strategic_domain:1,
      performance:1, elasticity:2, runtime_cost:2, integration:1, observability:2, security:1,
      cloud:0, lifespan:1, change_rate:2, reuse:1, vendor:2 },
  },
  {
    id: 11, name: 'Onboarding-portaal voor Nieuwe Medewerkers',
    expectedWinner: 'lc', expectedConstraint: null,
    answers: { domain:0, ui_complexity:0, business_logic:0, uniqueness:0, strategic_domain:0,
      performance:0, elasticity:0, runtime_cost:0, integration:1, observability:0, security:0,
      cloud:0, lifespan:1, change_rate:0, reuse:1, vendor:0 },
  },
  {
    id: 12, name: 'Tarief- en Verzendkostencalculatie-engine',
    expectedWinner: 'hc', expectedConstraint: null,
    answers: { domain:1, ui_complexity:2, business_logic:2, uniqueness:2, strategic_domain:2,
      performance:2, elasticity:2, runtime_cost:2, integration:1, observability:3, security:0,
      cloud:0, lifespan:2, change_rate:3, reuse:2, vendor:2 },
  },
  {
    id: 13, name: 'Publieke Zendingen-API voor Externe Ontwikkelaars',
    expectedWinner: 'hc', expectedConstraint: 'extreme_elasticity',
    answers: { domain:2, ui_complexity:2, business_logic:1, uniqueness:1, strategic_domain:2,
      performance:1, elasticity:3, runtime_cost:2, integration:3, observability:3, security:3,
      cloud:0, lifespan:2, change_rate:3, reuse:2, vendor:2 },
  },
  {
    id: 14, name: 'Management-informatie en Rapportagedashboard',
    expectedWinner: 'lc', expectedConstraint: null,
    answers: { domain:1, ui_complexity:1, business_logic:1, uniqueness:0, strategic_domain:0,
      performance:0, elasticity:0, runtime_cost:0, integration:1, observability:1, security:1,
      cloud:0, lifespan:1, change_rate:1, reuse:1, vendor:0 },
  },
  {
    id: 15, name: 'Voertuig- en Wagenparkmonitoring (IoT Telemetrie)',
    expectedWinner: 'hc', expectedConstraint: 'extreme_elasticity',
    answers: { domain:2, ui_complexity:1, business_logic:2, uniqueness:1, strategic_domain:1,
      performance:2, elasticity:3, runtime_cost:2, integration:2, observability:3, security:1,
      cloud:3, lifespan:2, change_rate:3, reuse:2, vendor:2 },
  },
  {
    id: 16, name: 'Noodstop- en Veiligheidsbesturing Sorteerinstallatie',
    expectedWinner: 'hc', expectedConstraint: 'extreme_latency',
    answers: { domain:2, ui_complexity:2, business_logic:2, uniqueness:2, strategic_domain:2,
      performance:3, elasticity:0, runtime_cost:0, integration:2, observability:3, security:2,
      cloud:3, lifespan:2, change_rate:3, reuse:1, vendor:2 },
  },
  {
    id: 17, name: 'Marketing Campagnebeheer',
    expectedWinner: 'lc', expectedConstraint: null,
    answers: { domain:0, ui_complexity:0, business_logic:1, uniqueness:0, strategic_domain:0,
      performance:0, elasticity:1, runtime_cost:0, integration:1, observability:1, security:1,
      cloud:0, lifespan:1, change_rate:0, reuse:1, vendor:0 },
  },
  {
    id: 18, name: 'Mobiele Bezorgapp voor Bezorgers',
    expectedWinner: 'hy', expectedConstraint: null,
    expectedRawScore: { lc: 33, hy: 62, hc: 30 }, // documented in the .md file — exact cross-check
    answers: { domain:3, ui_complexity:3, business_logic:1, uniqueness:1, strategic_domain:1,
      performance:1, elasticity:1, runtime_cost:1, integration:1, observability:2, security:0,
      cloud:0, lifespan:2, change_rate:2, reuse:2, vendor:1 },
  },
  {
    id: 19, name: 'Klantloyaliteitsprogramma en -app',
    expectedWinner: 'hy', expectedConstraint: null,
    answers: { domain:3, ui_complexity:1, business_logic:1, uniqueness:1, strategic_domain:1,
      performance:0, elasticity:2, runtime_cost:1, integration:1, observability:2, security:1,
      cloud:0, lifespan:2, change_rate:2, reuse:1, vendor:1 },
  },
  {
    id: 20, name: 'Legacy Mainframe Ontsluitingslaag',
    expectedWinner: 'hc', expectedConstraint: null,
    answers: { domain:1, ui_complexity:2, business_logic:2, uniqueness:2, strategic_domain:2,
      performance:1, elasticity:1, runtime_cost:1, integration:2, observability:3, security:1,
      cloud:2, lifespan:2, change_rate:3, reuse:2, vendor:2 },
  },
];
