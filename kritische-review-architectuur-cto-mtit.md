# Kritische review — Platform Decision Model v4.2

**Scope:** `lowcode-decision-model.html` (incl. de recente two-axis-refactor: Technology Fit vs. Organisational Readiness, en de nieuwe fase-break/skip-functionaliteit).
**Methode:** de code, scoringlogica, exportlogica en datamodel zijn direct geïnspecteerd (geen aannames) om te bepalen welke vragen architecten, de CTO en MT-IT zouden stellen als dit model hun aan een Architecture Review Board of investeringsbeslissing werd gepresenteerd. Elke bevinding is geverifieerd tegen de daadwerkelijke code — geen speculatie over gedrag dat niet is gecontroleerd.
**Uitgangspunt:** dit is een kritische review, dus ook het werk uit de vorige twee wijzigingssessies (de assen-splitsing en de skip-optie) wordt hier niet vrijgesteld van kritiek.

---

## Samenvatting vooraf

Het model is inhoudelijk goed doordacht op vraagniveau en de recente scheiding tussen Technology Fit en Organisational Readiness is een echte verbetering. Maar drie fundamentele spanningen blijven onopgelost:

1. **Het is een zelf-gerapporteerd, zelf-scorend instrument zonder onafhankelijke verificatie** — niets controleert of de antwoorden de werkelijkheid weerspiegelen of de gewenste uitkomst.
2. **Het instrument heeft geen institutioneel geheugen** — elke sessie leeft alleen in de lokale browser (localStorage); er is geen portfolio-overzicht, geen centrale opslag, geen trendanalyse voor MT-IT.
3. **De nieuwe "skip"-optie op Organisational Readiness kan het net opgeloste probleem in een andere vorm terugbrengen**: iets dat overslaanbaar is en geen consequenties heeft, wordt in de praktijk overgeslagen — zeker onder tijdsdruk.

---

## 1. Vragen en bevindingen — Architect

### 1.1 "Waar komen de score-waarden (lc/hy/hc per antwoord) vandaan? Wie heeft ze gevalideerd?" — 🟡 deels geadresseerd tijdens deze review

**Bevinding:** de 1-3-puntswaarden per antwoordoptie (bv. `lc:3,hy:1,hc:0`) zijn nergens herleidbaar naar een bron, benchmark of expertpanel — ze staan hardcoded in `FULL_CATS`/`QUICK_SCAN` zonder toelichting waaróm bijvoorbeeld "complexe domeinlogica" precies `lc:0,hy:1,hc:3` scoort in plaats van `lc:0,hy:2,hc:2`. Er is geen changelog, RFC, of sign-off-proces voor deze cijfers zichtbaar in de repo.
**Risico:** een tool die zich presenteert als "defensible, auditable" (README) heeft in de kern een ongevalideerde puntentabel. Bij een audit is de vraag "waarom weegt dit zo?" niet te beantwoorden met iets anders dan "dat leek de auteur logisch."
**Verbetervoorstel:** voeg een `rationale`-veld per optie toe (of een apart calibratiedocument) met de onderbouwing, en laat de puntenwaarden formeel vaststellen door een klein architectuur-panel (2-3 architecten) met versiebeheer op wijzigingen — niet door één ontwikkelaar in een los bestand.

**Doorgevoerde wijziging:** `CALIBRATION.md` toegevoegd — een calibratieregister dat voor élke score-waarde in `HARD_RULES`, `QUICK_SCAN`, `FULL_CATS` én `ORG_READINESS_CHECKS` de (huidige, impliciete) onderbouwing expliciet maakt, plus een governanceproces (§2: voorstellen via PR, 2-3 architecten akkoord, changelog, versienummer) en een sign-off-structuur (§4) voor het nog te vormen architectuurpanel. Het document is gekoppeld aan de tool: een sidebar-knop ("📖 Scoring calibration & rationale") opent het register, en het geëxporteerde Decision Report vermeldt nu de gekoppelde calibratieversie in de header.
**Nog open:** dit lost de vindbaarheid en het proces op, niet de validatie zelf — elke regel in het register staat nog op **Draft** totdat het architectuurpanel (nog niet samengesteld) hem daadwerkelijk beoordeelt. Zie `CALIBRATION.md` §9 voor de openstaande beslispunten voor de eerste panelsessie. Dit geldt ook voor 4.1 (ORG_READINESS_CHECKS-gewichten), die in hetzelfde register zijn opgenomen.

### 1.2 "Waarom zijn er alleen harde constraints richting High-Code — nooit richting Low-Code of tegen Hybrid als zodanig?"

**Geverifieerd:** alle 5 KO-regels (`no_ui_full`, `no_ui_qs`, `extreme_latency`, `extreme_elasticity`, `zero_trust`) hebben `forceKey:'hc'`. Er bestaat geen enkele regel die Low-Code afdwingt of High-Code blokkeert. De 2 `block`-regels en de ene `warn`-regel gelden uitsluitend als Hybrid wint.
**Risico:** dit is een structurele asymmetrie die de "Low-Code is de strategische default"-aanname (zie de disclaimer onderaan het scherm) impliciet in de regel-architectuur verankert, niet alleen in de weging. Zijn er echt nooit harde technische of compliance-redenen om Low-Code te forceren (bv. een auditverplichting die alleen het gecertificeerde platform toestaat) of High-Code hard te blokkeren? Dat is een aanname die een architect expliciet zou willen bevestigen, niet stilzwijgend laten staan.
**Verbetervoorstel:** laat het architectuurteam expliciet vaststellen of dit eenzijdige ontwerp bewust is (en waarom), en documenteer dat besluit. Zo niet, ontwerp minstens één scenario per platform waarin een hard constraint ook Low-Code of Hybrid zou kunnen forceren/blokkeren, voor symmetrie.

### 1.3 "Is 'High-Code' hier synoniem met 'AWS'? Wat als we straks (deels) Azure/GCP of on-prem overwegen?" — ✅ opgelost tijdens deze review

**Geverifieerd:** de tool en het cost-model spraken consequent over "AWS-native / High-Code" (zie cost drawer, RISK_RULES-tekst `aws_cost_risk`, en de README-titel "AWS-native High-Code"). Er was geen abstractie voor "ander cloud-native platform."
**Risico:** een governance-tool die AWS hardcoded in zijn definitie van "High-Code" heeft, bevriest een cloudkeuze in wat zich voordoet als een neutrale technologiebeoordeling. Als de cloudstrategie verschuift, moet het hele instrument herschreven worden — het is geen instrument-los-van-vendor.
**Verbetervoorstel:** ontkoppel het concept "High-Code" van "AWS" in taal en cost-model; benoem AWS als het huidige voorbeeld/referentiepunt, niet als synoniem, zodat een strategiewijziging niet het hele model raakt.

**Doorgevoerde wijziging:**

- Eén constante `HIGH_CODE_CLOUD_REF = 'AWS'` toegevoegd bovenaan de script-sectie (met toelichting waaróm: "niet als synoniem"). Alle plekken die voorheen hardcoded "AWS" bevatten (RISK_RULES-tekst, `runtime_cost`- en `budget`-vraagbeschrijvingen, de trade-off-tekst, de geëxporteerde Cost Model-sectie, en de statische cost-drawer-HTML) verwijzen nu naar deze ene constante — een cloudstrategiewijziging vergt straks één regel, niet een tekstuele zoek-en-vervang door het hele bestand.
- De RISK_RULES-regel `aws_cost_risk` is hernoemd naar `cloud_native_cost_risk` met generieke tekst ("High-Code cloud-native cost risk (reference platform: AWS)").
- De cost drawer toont nu "High-Code (reference: AWS)" in plaats van "AWS-native / High-Code" — High-Code is het primaire label, AWS het expliciet gelabelde referentiepunt.
- README-omschrijving aangepast: "Low-Code, High-Code, of Hybrid" in plaats van "Low-Code, AWS-native High-Code, of Hybrid", met een expliciete zin dat AWS het huidige referentieplatform is, geen synoniem.
- **Bewust niet aangepast:** de vraagoptie bij `cloud` ("Private cloud / AWS / Azure met een Low-Code container") — die noemde AWS al naast Azure als voorbeeld, niet als synoniem, en had dus geen ontkoppeling nodig.

### 1.4 "Hoe wordt de logica zelf getest? Ik zie geen testsuite." — ✅ opgelost tijdens deze review

**Geverifieerd:** er was geen geautomatiseerde test (geen `test/`-map, geen CI-configuratie in de repo). Verificatie tijdens de laatste twee wijzigingen gebeurde ad-hoc via handmatige Node-scripts buiten de repo — die waren nergens vastgelegd of herhaalbaar gemaakt.
**Risico:** een 1900+ regel single-file applicatie met complexe scoringlogica (drie lagen, twee assen, hard rules, hybrid-gate) zonder regressietests is één "kleine" wijziging verwijderd van een stil verkeerde aanbeveling — en niemand zou het merken tot een architect het handmatig doorrekent, zoals nu is gebeurd tijdens de refactor.
**Verbetervoorstel:** minstens een klein setje geautomatiseerde scenario-tests (de Scenario A/B/B2-achtige checks die tijdens deze refactor handmatig zijn gedraaid) vastleggen als een script in de repo dat bij elke wijziging opnieuw gedraaid kan worden — geen framework nodig, een simpel Node-scriptje volstaat en is oneindig beter dan niets.

**Doorgevoerde wijziging:**

- `tests/run-tests.js` toegevoegd — een dependency-vrij Node-script (`node tests/run-tests.js`) dat de daadwerkelijke `HARD_RULES`/`FULL_CATS`/`QUICK_SCAN`-data en de daadwerkelijke `computeScores()`/`evaluateRules()`-functies rechtstreeks uit `lowcode-decision-model.html` extraheert en in een Node `vm`-context draait. Dit test de daadwerkelijk uitgeleverde logica, geen herimplementatie ervan.
- Om dat zonder een nagebouwde DOM te kunnen doen, is de winnaar-selectielogica (Layer 1 hard-constraint-override + Layer 3 Hybrid-gate-fallback), die voorheen inline en gedupliceerd in `updateScores()` stond, geëxtraheerd naar een nieuwe pure functie `determineWinner(raw, answers)` — gedragsneutrale refactor, `updateScores()` roept hem nu aan in plaats van de logica te herhalen.
- **Testdekking (28 scenario's, allemaal groen — inmiddels uitgebreid naar 35, zie 1.6's Quick Scan-vervolgpunt hieronder):** alle 20 applicaties uit `testset-real-world-applicaties-technology-fit.md` (`tests/fixtures/technology-fit-testset.js`, inclusief een exacte score-cross-check voor applicatie 18: lc=33/hy=62/hc=30, zoals gedocumenteerd), plus 8 gerichte edge-cases voor wat de testset bewust niet raakt — op dat moment nog inclusief Quick Scan's `no_ui_qs`-knock-out (die regel bestaat sinds het 1.6-vervolgpunt niet meer, de test is meegewijzigd), elk van de vier Layer 1 hard constraints los getest tegen een verder maximaal Low-Code-profiel, een expliciete regressie-pin voor de 1.6-fix ("geen UI" alleen forceert niet langer High-Code), en de drie Layer 3 Hybrid-gate-regels (`hybrid_no_boundary`, `hybrid_no_ownership`, `hybrid_mission_critical`) (`tests/fixtures/edge-case-scenarios.js`).
- Bij het opstellen van de testset-fixtures is elke Nederlandse antwoordtekst per applicatie handmatig gemapt naar de exacte optie-index in `FULL_CATS`; de exacte score-match voor applicatie 18 (en de overige 19 uitkomsten) bevestigt dat deze mapping correct is.
  **Nog open:** er is geen CI-configuratie die dit script automatisch draait bij elke wijziging — het moet vooralsnog handmatig gedraaid worden. Zie ook README.md § "Regression tests".

### 1.5 "Eén HTML-bestand van bijna 2000 regels met alle logica, data, styling en UI erin — hoe onderhoudbaar is dit over 2-3 jaar?"

**Bevinding:** bewuste keuze (README: "no build step, no dependencies") — begrijpelijk voor een laagdrempelig, deelbaar tool, maar het maakt het model, de UI en de export onlosmakelijk met elkaar verweven. Elke wijziging aan bijvoorbeeld de scoringlogica raakt hetzelfde bestand als de CSS.
**Risico:** bus-factor-risico (wie kan dit onderhouden buiten de huidige auteur?) en toenemende wijzigingskosten naarmate het bestand groeit.
**Verbetervoorstel:** geen ingrijpende migratie nu nodig, maar leg wel vast wanneer dit bestand "te groot" wordt (bv. een regel-limiet of complexiteitsdrempel) waarna een module-opsplitsing (logica/data gescheiden van UI) overwogen moet worden — nu documenteren voorkomt dat dit later een crisis wordt.

### 1.6 "Is 'geen UI → altijd High-Code' wel een juiste harde constraint?" — ✅ opgelost tijdens deze review

**Bevinding:** de oorspronkelijke regel `no_ui_full` bundelde twee inhoudelijk verschillende situaties onder één onvoorwaardelijke knock-out naar High-Code: (a) een applicatie zonder enige UI, en (b) een applicatie met een *specialistische visualisatie/volledig custom interface*. Dat zijn geen gelijkwaardige gevallen:

- **(a) Geen UI** is een redelijk, maar niet universeel juist uitgangspunt — sommige low-code-platformen ondersteunen expliciet headless procesautomatisering/business-rule-engines zonder eindgebruikersscherm. Het is een sterk signaal, geen harde technische onmogelijkheid zoals bij sub-milliseconde latency of custom cryptografie.
- **(b) Specialistische visualisatie** is inhoudelijk vaak een **Hybrid**-signaal, geen High-Code-signaal: een custom kaart-/tijdlijncomponent kan prima leven binnen een verder low-code-gebouwde applicatieschil (proces, notificaties, klantcommunicatie). Door dit onder dezelfde harde knock-out te scharen, sloot het model die Hybrid-uitkomst structureel uit voor dit soort — in de praktijk veelvoorkomende — gevallen.

**Concreet bewijs uit de testset** (`testset-real-world-applicaties-technology-fit.md`, applicatie 18, Mobiele Bezorgapp): een overwegend gemengd/Hybrid-profiel (planning, statusschermen, integraties) met één specialistische mobiele UI (scannen/camera/GPS/offline) werd vóór de wijziging onvoorwaardelijk naar High-Code geforceerd. Functioneel is dit echter een schoolvoorbeeld van Hybrid: low-code voor de schil, custom code voor het scan-/navigatiecomponent.

**Doorgevoerde wijziging:**

- `ui_complexity` is verplaatst van Layer 1 (hard constraint) naar Layer 2 (gewogen scoring), met het gewicht opgehoogd van ×2 naar ×3 (maximaal) — "geen UI" blijft dus het zwaarst mogelijke signaal richting High-Code, maar kan niet langer alle andere antwoorden overrulen.
- De optie "Specialistische visualisatie of volledig custom interface" is herwaardeerd van `lc:0,hy:1,hc:3` naar `lc:0,hy:3,hc:1` — een sterk Hybrid-signaal in plaats van een geforceerde High-Code-uitkomst.
- De bijbehorende `no_ui_full`-regel is verwijderd uit `HARD_RULES`. Quick Scan's equivalente knock-out (`qs_ui`/`no_ui_qs`) is **bewust ongewijzigd gelaten** — die vraag heeft geen "specialistische visualisatie"-variant en dus niet hetzelfde bundelingsprobleem; dit is een aparte afweging die nog los besproken kan worden.
- **Geverifieerd met de daadwerkelijke scoringlogica** (niet handmatig geschat): van de 20 testset-applicaties verandert alleen applicatie 18 van uitkomst (High-Code → Hybrid, lc=33/hy=62/hc=30); de overige 19 blijven ongewijzigd, óók de vier applicaties die "geen UI" als enige hard constraint hadden (route-optimalisatie, EDI-koppelvlak, tariefengine, mainframe-ontsluitingslaag) — die landen nu via de gewogen score alsnog correct op High-Code, wat bevestigt dat de knock-out voor die gevallen sowieso overbodig was.

**Openstaand vervolgpunt — ✅ alsnog opgelost (later in dezelfde review):** dezelfde vraag geldt in principe voor Quick Scan's `qs_ui`-knock-out (alleen de "geen UI"-casus, niet de bundeling, want die variant bestaat niet in Quick Scan).

- De `no_ui_qs`-regel is verwijderd uit `HARD_RULES`. De optie "None — no meaningful user-facing UI" van `qs_ui` scoort ongewijzigd `lc:0,hy:0,hc:3` maar is nu een Layer 2-signaal in plaats van een onvoorwaardelijke override.
- `qs_ui`'s standaardgewicht is opgehoogd van ×2 naar ×3 (het maximum, net als `ui_complexity` in Full Assessment) zodat "geen UI" het zwaarst mogelijke signaal in de 5-vragen-scan blijft, ook zonder hard constraint.
- **Geverifieerd, niet alleen aangenomen:** 4 realistische Quick-Scan-vertalingen van dezelfde testset-applicaties die hierboven al voor Full Assessment zijn doorgerekend (route-optimalisatie, EDI, tariefengine, mainframe-ontsluitingslaag) landen via de gewogen score alsnog correct op High-Code — vastgelegd als geregressietest in `tests/fixtures/edge-case-scenarios.js`. Een geïsoleerd "geen UI"-antwoord tegen een verder maximaal Low-Code-profiel forceert, net als bij Full Assessment, niet langer High-Code — dat is bewust geaccepteerd gedrag (één signaal kan door vier andere worden overstemd), geen bug.
- `CALIBRATION.md` bijgewerkt (v0.4): de `no_ui_qs`-rij in §6 is gemarkeerd als verwijderd (met reden), en `qs_ui` in §7 is bijgewerkt met het nieuwe gewicht en de validatie.

---

## 2. Vragen en bevindingen — CTO

### 2.1 "Is dit instrument verplicht, of vrijblijvend? Wat gebeurt er als iemand het niet gebruikt, of een andere uitkomst kiest dan het model adviseert?"

**Bevinding:** de tool heeft geen koppeling met enig governance-proces buiten zichzelf. Het geëxporteerde Decision Report is een Markdown/PDF-bestand dat een assessor zelf downloadt — er is geen verplicht inleverpunt, geen ARB-checklist die het bestand als bijlage eist, geen systeem dat controleert of een DR bestaat vóórdat een project budget/architectuurgoedkeuring krijgt.
**Risico:** een prachtig doordacht model dat niemand verplicht hoeft te raadplegen, wordt in de praktijk alleen gebruikt door mensen die toch al zorgvuldig zijn — precies de groep die het minst nodig heeft. Het risico zit bij de projecten die het overslaan.
**Verbetervoorstel:** koppel het gebruik van de tool aan een bestaand governance-gate (bv. verplicht bijlage bij architectuurgoedkeuring of investeringsaanvraag > € X), met een minimale eis (Full Assessment, niet Quick Scan) voordat een project verder mag.

### 2.2 "Wat als de aanbeveling niet is wat de business wil? Is er een formeel afwijkingsproces?" — ✅ opgelost tijdens deze review

**Geverifieerd:** er was geen "override met reden"-veld in het model. Bij een hard constraint (KO) was er zelfs geen enkele manier om het systeem te laten vastleggen dat er bewust van is afgeweken — de enige weg was dat de assessor een ander antwoord invult dan de werkelijkheid, om de KO te vermijden.
**Risico:** dit is een reëel governance-gat: het instrument dwingt impliciet tot "eerlijk antwoorden dan blokkeer je jezelf" versus "antwoorden zo invullen dat het uitkomt." Er is geen nette, geregistreerde uitzonderingsroute, dus de oneerlijke route wordt de enige praktische route bij een terechte uitzondering.
**Verbetervoorstel:** voeg een expliciet "Afwijking van aanbeveling"-veld toe aan het Decision Report: gekozen platform, reden, en naam/rol van de goedkeurende architect — zichtbaar in de export, niet verstopt. Dit maakt eerlijke uitzonderingen zichtbaar en auditeerbaar in plaats van ze te verbieden.

**Doorgevoerde wijziging:**

- Nieuwe sidebar-sectie "⚠ Deviation from recommendation" toegevoegd (checkbox + velden), zichtbaar in zowel Quick Scan als Full Assessment, direct boven de export-knoppen. Standaard uitgeschakeld en leeg — bestaande rapporten/sessies zonder afwijking blijven ongewijzigd.
- Bij inschakelen worden vier velden getoond: gekozen platform (dropdown Low-Code/Hybrid/High-Code), reden voor afwijking (vrije tekst), en naam + rol van de goedkeurende architect. Deze velden worden, net als project/assessor, automatisch opgeslagen in `localStorage` (`saveState()`/`loadState()`) zodat ze een sessie overleven.
- In het geëxporteerde Decision Report (Markdown én de PDF-export, die dezelfde Markdown hergebruikt) staat de afwijking **niet verstopt**: een `🔴 Yes — see below`-regel direct in de Report Metadata-tabel bovenaan, gevolgd door een eigen `## 🔴 Deviation from Recommendation`-sectie direct na de Decision-sectie (vóór Risks/Trade-offs) met model-aanbeveling, gekozen platform, reden en goedkeurende architect naast elkaar in een tabel.
- Alleen zichtbaar/actief bij een reguliere assessment — niet gekoppeld aan Blind Assessment-sessies (die tonen sowieso geen aanbeveling aan de geïnterviewde en zijn bedoeld voor modelvalidatie, niet voor een governance-besluit).
  **Nog open:** dit legt de afwijking vast in het geëxporteerde rapport, maar er is nog geen centrale opslag die dit soort afwijkingen portfolio-breed verzamelt of bewaakt (zie 2.3/3.4) — dat blijft een apart, groter openstaand punt.

### 2.3 "Hoe weet ik als CTO hoeveel projecten Low-Code vs. Hybrid vs. High-Code hebben gekozen, en of dat volgens plan gaat?"

**Bevinding:** er is geen centrale opslag. Elke sessie leeft in `localStorage` van de browser van de assessor; export is een los MD/JSON-bestand per project, handmatig gedeeld (de Blind Assessment-flow vraagt zelfs expliciet om het bestand "per e-mail naar de model owner" te sturen).
**Risico:** geen portfolio-rapportage, geen trend ("kiezen we steeds vaker Hybrid, en waarom?"), geen manier om te zien welke teams het model wel/niet gebruiken. Voor een instrument met de ambitie "Engineering Governance" (headerbadge) ontbreekt de basisvoorziening die governance normaliter vereist: een centraal, doorzoekbaar register van besluiten.
**Verbetervoorstel:** minstens een simpel, centraal ingestpunt (zelfs een gedeelde SharePoint-map met een naamconventie, of beter: een lichte backend/formulier die JSON-exports verzamelt) zodat er periodiek portfolio-rapportage mogelijk is.

### 2.4 "De validatie (Blind Assessment / Compare) leunt op hoeveel echte data?"

**Geverifieerd:** er staan 3 bestanden in `Results/`. De Compare-functie berekent een match-percentage op basis daarvan.
**Risico:** een match-score op n=3 is statistisch nagenoeg betekenisloos, maar oogt in de UI ("X/Y match the model's recommendation (Z%)") als een kwantitatieve validatie. Dit kan makkelijk overschat worden door iemand die de kleine steekproef niet kent.
**Verbetervoorstel:** toon een expliciete steekproefgrootte-waarschuwing in de Compare-UI zelf (bv. "n<10: resultaten zijn indicatief, niet statistisch betrouwbaar") en maak retroactieve Blind Assessments verplicht voor recent opgeleverde projecten om de steekproef snel te vergroten.

### 2.5 "Wat is de total cost of ownership van dit ínstrument zelf?"

**Bevinding:** geen onderhoudsplan, geen eigenaarschap buiten de huidige auteur zichtbaar in de repo (CLAUDE.md beschrijft een reviewersrol, geen team/proces), geen periodieke revisiecyclus voor de gewichten/regels vastgelegd.
**Verbetervoorstel:** wijs een eigenaar (rol, niet persoon) aan met een vaste revisiecyclus (bv. jaarlijks) waarin gewichten, hard rules en het cost-model worden getoetst aan actuele contracten/pricing — nu is niets daarvan geborgd buiten de huidige sessie.

---

## 3. Vragen en bevindingen — MT-IT

### 3.1 "Als Organisational Readiness overgeslagen kán worden en tóch geen effect heeft op de aanbeveling — waarom zou een team het ooit invullen onder tijdsdruk?" — ✅ opgelost tijdens deze review

**Dit is de belangrijkste bevinding van deze review, en het raakt de zojuist gebouwde functionaliteit.**
**Bevinding:** de skip-flow was één klik ("Skip — finish assessment now"), zonder enige wrijving, waarschuwing met gewicht, of verplichte reden. Het exportrapport toonde bij skip netjes "_Skipped by the assessor for this run — not evaluated._" — maar dat was een informatieve regel, geen blokkade of vereiste toelichting.
**Risico:** precies het probleem dat de assen-splitsing moest oplossen (organisatie-signalen die worden genegeerd) keert in een nieuwe vorm terug: als er geen enkele consequentie aan het overslaan hangt, is de voorspelling dat het merendeel van de assessments dit onder deadline-druk zal overslaan — waarmee de hele Organisational Readiness-as in de praktijk dode functionaliteit wordt.
**Verbetervoorstel:** maak skippen mogelijk (het móet optioneel blijven, dat was een bewuste, goede keuze), maar voeg lichte frictie toe: verplicht een kort tekstveld "Reden voor overslaan" bij skip, en toon een duidelijk zichtbare "⚠ Organisational Readiness: Skipped" badge op elke plek waar de aanbeveling wordt getoond (niet alleen op de kaart in de sidebar) — inclusief in het geëxporteerde rapport bovenaan, niet pas in een aparte sectie verderop.

**Doorgevoerde wijziging:**

- "Skip — finish assessment now" opent niet langer direct de skip; het toont nu een verplicht tekstveld "Reason for skipping (required)" met een "Confirm skip"-knop die uitgeschakeld blijft tot er tekst is ingevuld ("Cancel" brengt je terug zonder te skippen). Skippen blijft dus mogelijk zonder blokkade — alleen de reden is verplicht, niet een goedkeuring van iemand anders.
- De opgegeven reden wordt opgeslagen (`orgSkipReason`, meegenomen in `saveState()`/`loadState()`) en overal getoond waar de skip-status al zichtbaar was, plus op de nieuwe plekken hieronder.
- Nieuwe, duidelijk zichtbare "⚠ Organisational Readiness: Skipped"-badge (oranje/warn-styling) toegevoegd op **elke plek waar de aanbeveling wordt getoond**, niet alleen de sidebar-kaart:
  - direct in de aanbevelings-kaart (`recBox`) in de sidebar, zodra er een aanbeveling is;
  - op het finish-scherm, direct onder de titel;
  - de bestaande Organisational-Readiness-kaart zelf kreeg ook een duidelijkere oranje "⚠ Skipped"-badge (was een neutrale, kleurloze badge) en toont nu de opgegeven reden.
- In het geëxporteerde rapport staat de skip-status **niet verstopt**: een regel in de Report Metadata-tabel bovenaan ("⚠ Skipped — see below"), gevolgd door een eigen `## ⚠ Organisational Readiness: Skipped`-sectie direct na de Decision-sectie (vóór Risks/Trade-offs) met de opgegeven reden — de latere, uitgebreide Organisational-Readiness-sectie verderop in het rapport toont de reden ook, ter referentie.
  **Nog open:** de reden is verplicht bij het skippen zelf, maar er is geen verdere procesregel die bijvoorbeeld een architect verplicht die reden te beoordelen — dat blijft, net als bij 2.2, een groter openstaand governance-punt (zie 2.1/2.3).

### 3.2 "Zijn de antwoorden van verschillende assessors onderling vergelijkbaar? Twee PO's kunnen 'hoe complex is de UI' heel verschillend interpreteren." — 🟡 deels geadresseerd tijdens deze review

**Bevinding:** er was geen voorbeeldenbank, geen kalibratiesessie, geen "zo beantwoord je dit correct"-richtlijn per vraag anders dan de korte `desc`-tekst per vraag.
**Risico:** subjectieve interpretatieverschillen tussen assessors ondermijnen de vergelijkbaarheid van uitkomsten across het portfolio — twee vergelijkbare projecten kunnen tegengestelde aanbevelingen krijgen puur door interpretatieverschil, niet door een echt verschil in de applicatie.
**Verbetervoorstel:** voeg per vraag 1-2 concrete voorbeeldapplicaties toe per antwoordoptie (bv. bij "complexe domeinlogica": "vergelijkbaar met tarief-engine X") om interpretatie te verankeren, en organiseer een jaarlijkse kalibratiesessie met een paar architecten die dezelfde casus onafhankelijk scoren.

**Doorgevoerde wijziging:** `CALIBRATION.md` §9 toegevoegd — een voorbeeldenbank met 1-2 concrete applicaties per antwoordoptie:

- Voor de **16 Technology Fit-vragen** hergebruikt (niet dubbel opgebouwd) uit `testset-real-world-applicaties-technology-fit.md`, inclusief de bestaande "waarom"-toelichting per app als ankertekst. Dekking: **55 van de 58 opties (95%)** heeft al een echt testset-voorbeeld; de 3 resterende gaten (`cloud` "private cloud/container", `lifespan` "short-term/tactisch", `reuse` "standalone") zijn opgevuld met expliciet gelabelde geconstrueerde voorbeelden.
- Voor de **8 Organisational Readiness-vragen** — waarvoor de testset bewust geen dekking heeft (die vraagt expliciet buiten scope gehouden bij het opstellen ervan) — is een volledig nieuwe set van 24 illustratieve scenario's geschreven, expliciet gelabeld als "Draft (constructed)": niet ontleend aan een geaudite, echte PostNL-casus.
- Toegankelijk via dezelfde tool-koppeling als het bestaande calibratieregister (sidebar-knop "📖 Scoring calibration & rationale"), dus geen aparte nieuwe UI nodig — het document waarnaar die knop al verwees is nu uitgebreid.
  **Nog open:** (1) de 4 opties die nog maar op één testset-app leunen (`ui_complexity` "specialistische visualisatie", `integration` "weinig standaardintegraties", `cloud` "on-premise", `change_rate` "snelle initiële levering") zouden een tweede, onafhankelijke voorbeeld verdienen; (2) alle 24 Organisational-Readiness-voorbeelden zijn geconstrueerd, niet uit echte casussen — dat is de grootste resterende kloof; (3) de jaarlijkse kalibratiesessie zelf (architecten die onafhankelijk dezelfde casus scoren) is nog niet gepland — zie `CALIBRATION.md` §10 voor de volledige lijst openstaande punten. Dit is dus een inhoudelijk complete, maar nog niet door een panel gevalideerde, eerste versie — vandaar 🟡 in plaats van ✅.

### 3.3 "Wat gebeurt er met een gesignaleerde 'Gap' in Organisational Readiness? Wie pakt dat op?"

**Bevinding:** de kaart en het rapport tonen keurig welke organisatorische criteria een "GAP" zijn (bv. teamvaardigheden, ownership), maar er is geen vervolgactie, geen eigenaar, geen deadline, geen koppeling naar een HR-/opleidingsproces. Het is een constatering zonder actie-loop.
**Risico:** signalering zonder opvolging is theater — het voelt als risicomanagement maar verandert niets aan de daadwerkelijke bemensing/opleiding.
**Verbetervoorstel:** voeg bij elke "GAP" een verplicht mini-actieveld toe in het rapport (actie, eigenaar, streefdatum) zodra Organisational Readiness wél wordt ingevuld — desnoods vrij tekstueel, maar wél verplicht zodra er een gap is gevonden, zodat het rapport een claim ("we hebben dit gezien") omzet in een commitment.

### 3.4 "Waar staan de data van deze assessments, en zijn dat gevoelige/strategische gegevens?"

**Bevinding:** alles staat in `localStorage` van de browser van de gebruiker — geen versleuteling, geen back-up, geen retentiebeleid, geen classificatie van de gevoeligheid van projectnamen/strategische keuzes die hierin staan.
**Risico:** bij verlies van het apparaat, een gedeelde/publieke machine, of simpelweg het wissen van browserdata is een assessment onherroepelijk kwijt — en er is geen data-classificatiebeleid voor wat er in die lokale opslag terechtkomt (projectnamen, architecturale keuzes, mogelijk concurrentiegevoelig).
**Verbetervoorstel:** MT-IT zou hier een expliciet standpunt over willen: is lokale, ongeversleutelde opslag van dit soort assessments acceptabel volgens het informatiebeveiligingsbeleid? Zo niet, dan is centrale opslag (zie 2.3) niet alleen een governance-wens maar een compliance-noodzaak.

### 3.5 "Is de 'Confidence'-badge (Low/Medium/High) een garantie dat de aanbeveling klopt?" — ✅ opgelost tijdens deze review

**Geverifieerd:** `conf` wordt puur berekend uit het scoreverschil tussen de hoogste twee platforms (`gap>8?'High':gap>3?'Medium':'Low'`) — dus uit dezelfde, mogelijk gestuurde of subjectief ingevulde antwoorden. Het meet interne consistentie van de score, niet de juistheid van de onderliggende antwoorden.
**Risico:** een manager die "High confidence" leest, kan dat verkeerd interpreteren als "we zijn zeker dat dit de juiste keuze is," terwijl het feitelijk alleen betekent "de antwoorden wezen eenduidig één kant op" — ongeacht of die antwoorden zelf correct/eerlijk waren.
**Verbetervoorstel:** hernoem het label naar iets preciezer, bv. "Score separation: High/Medium/Low" met een tooltip die expliciet uitlegt dat dit géén oordeel is over de juistheid van de invoer.

**Doorgevoerde wijziging:** het label "Confidence" is overal hernoemd naar **"Score separation"** — in de sidebar (met een ⓘ-tooltip, `title`-attribuut, zelfde patroon als de bestaande tooltips op "Blind assessment"/"Compare results") en in de Report Metadata-tabel van het geëxporteerde rapport, waar bovendien een expliciete toelichtingsregel is toegevoegd direct onder de tabel: dat dit de scheiding tussen de top-2 platformscores meet, geen oordeel over de juistheid, volledigheid of eerlijkheid van de onderliggende antwoorden. De onderliggende berekening (`gap>8?'High':gap>3?'Medium':'Low'`) is ongewijzigd — dit is uitsluitend een label-/toelichting-fix, geen logicawijziging.

---

## 4. Zelfkritiek op de twee meest recente wijzigingen (deze sessie en de vorige)

Omdat kritisch ook betekent: kritisch op het eigen werk.

### 4.1 De vaste gewichten in `ORG_READINESS_CHECKS` zijn zelf ongevalideerd

De basisgewichten (20/18/14/14/12/8/6/6) die de Organisational Readiness-score bepalen, zijn een redelijke maar door mij bedachte inschatting — niet getoetst bij architecten of HR/portfolio-management. Dit is exact hetzelfde probleem als bevinding 1.1, nu opnieuw geïntroduceerd in de nieuwe as. **Dit stond al als open risico genoteerd na de vorige sessie, en is nog niet opgevolgd.** *(Update: deze gewichten staan nu gedocumenteerd — als **Draft**, niet gevalideerd — in `CALIBRATION.md` §8.5, inclusief het expliciete open punt over de 20-vs-18-gewichtsprong tussen `arch_boundary` en `team_ownership`. Het onderliggende validatieprobleem blijft openstaan tot het architectuurpanel bestaat.)*

### 4.2 De `goodIdx`/`badIdx`-heuristiek meet "duidelijkheid van profiel," niet "past bij de aanbevolen technologie" — ✅ opgelost tijdens deze review

Bijvoorbeeld: `team_skills: goodIdx:[0,3]` beloonde zowel een sterk Low-Code- als een sterk High-Code-team als "ready" — ongeacht welk platform de Technology Fit-score daadwerkelijk aanbeveelt. Een sterk Low-Code-team op een project dat de score naar High-Code stuurt, scoorde dus ten onrechte "ready" op teamvaardigheden. **Dit is een inhoudelijke fout, geen stijlkeuze**: readiness zou moeten worden getoetst tegen de daadwerkelijke winnaar, niet tegen "heeft het team ergens een duidelijk profiel."
**Verbetervoorstel:** bereken `team_skills`-readiness relatief aan `winner.key` (het platform dat won), niet als vaste goodIdx-lijst.

**Doorgevoerde wijziging:**

- `ORG_READINESS_CHECKS`'s `team_skills`-entry vervangen: `goodIdx:[0,3]` → `relativeToWinner:true`. Readiness wordt nu berekend door de gekozen antwoordoptie's eigen `lc`/`hy`/`hc`-score-triple (dezelfde vorm die elke Technology Fit-vraag al gebruikt, en die voor `team_skills` toch al in de data stond maar ongebruikt was sinds de assen-splitsing) te vergelijken met `winner.key`: "ready" betekent dat het gewonnen platform de sterkste fit is van die optie.
- **Dezelfde fout bleek ook in `qs_capability` te zitten** (Quick Scan's enige organisatiesignaal, structureel identiek aan `team_skills`) — niet expliciet genoemd in de bevinding, maar dezelfde `goodIdx:[0,2]`-constructie met exact hetzelfde probleem. Meegenomen in dezelfde fix, anders was de asymmetrie (Full Assessment gefixed, Quick Scan nog stuk) zelf weer een nieuwe kritiekpunt geweest.
- Omdat zowel `computeOrgReadiness()` als `orgReadinessBreakdown()` nu de winnende platformsleutel nodig hebben, is `updateScores()` opgeschoond: de winnaar-bepaling (`determineWinner()`, al geëxtraheerd tijdens 1.4) wordt nu één keer vroeg in de functie berekend in plaats van twee keer.
- **Geregressietest:** 3 nieuwe scenario's in `tests/fixtures/edge-case-scenarios.js` pinnen expliciet beide richtingen van de bug — een sterk Low-Code-team scoort niet meer "ready" op een High-Code-winnend project, en een full-stack/Hybrid-profiel (dat onder de oude vaste lijst nooit "ready" kon zijn) scoort nu wél "ready" op een Hybrid-winnend project. `tests/run-tests.js` is uitgebreid om `team_skills`/`qs_capability`-gereedheid mee te toetsen. Alle 31 scenario's (was 28) slagen.
- `CALIBRATION.md` §8.5 bijgewerkt: de "Known defect"-notitie is vervangen door een "✅ fixed"-notitie met uitleg van het nieuwe mechanisme (v0.3).

### 4.3 De weight-drawer op de Technology Fit-as heeft nog steeds het "gaming"-risico dat de assen-splitsing net oploste voor organisatie — ✅ opgelost tijdens deze review

De assen-splitsing verhinderde dat organisatiegewichten de platformkeuze konden ombuigen. Maar de 16 Technology Fit-vragen waren nog volledig vrij te wegen (1-3) door de assessor zélf, zonder log van wie welk gewicht wanneer en waarom heeft aangepast. Niets verhinderde dat iemand `vendor` of `runtime_cost` naar gewicht 3 zet om een al vooraf gewenste uitkomst te forceren — precies hetzelfde patroon, nu verplaatst naar de as die er het meest toe doet.
**Verbetervoorstel:** log gewichtwijzigingen (wie/wanneer/van-naar) in het export-rapport als een zichtbare "Weight deviations"-sectie bovenaan (niet verstopt in de vraag-transcript onderaan), zodat afwijkingen van de default meteen opvallen voor een reviewer.

**Doorgevoerde wijziging:**

- Elke gewichtwijziging via de Weight Drawer (`cw()`) wordt nu getimestamped bijgehouden in `weightChangeLog` (per vraag, alleen zolang het gewicht van de default afwijkt — teruggezet naar default = verwijderd uit de log, want dan is er niets meer te melden). Persistent via `saveState()`/`loadState()`, dus overleeft een sessie.
- Nieuwe, prominente `## ⚖ Weight Deviations`-sectie in het geëxporteerde rapport, direct na de Decision-sectie (vóór Organisational Readiness/Deviation-secties) — dus bovenaan, niet in de vraag-transcript onderaan. Per afwijkende vraag: naam, default → huidig gewicht, en wanneer het voor het laatst is gewijzigd.
- De Report Metadata-tabel bovenaan toont nu een `Weight deviations`-regel (was `Custom weights`) die direct het aantal afwijkingen noemt in plaats van alleen "Yes/No".
- **"Wie"** is bewust niet per wijziging vastgelegd — de tool heeft geen multi-user/login-concept, dus elke gewichtwijziging in een sessie wordt toegeschreven aan de ene "Assessed by"-naam die al in het rapport staat; dat wordt expliciet zo benoemd in de sectie zelf, in plaats van een niet-bestaand "wie" te suggereren.
  **Nog open:** dit logt wélke gewichten zijn aangepast en wanneer, maar er is geen verplicht "waarom"-veld per gewichtwijziging (in tegenstelling tot bijvoorbeeld de skip-reden bij 3.1) — een assessor kan nog steeds een gewicht ombuigen zonder toelichting, alleen niet meer onopgemerkt. Een verplicht reden-veld per gewichtwijziging zou de volgende stap zijn als dit in de praktijk onvoldoende drempel blijkt.

### 4.4 De skip-functionaliteit (zie 3.1) is de meest urgente bevinding uit deze hele review — ✅ opgelost tijdens deze review

Zie sectie 3.1 — dit verdiende prioriteit boven de andere punten omdat het net gebouwde functionaliteit direct raakte en het risico reëel en onmiddellijk was (elke assessment kon dit patroon vertonen). Zie 3.1 voor de doorgevoerde wijziging.

---

## 5. Geprioriteerd verbetervoorstel

| Prioriteit          | Verbetering                                                                                                                                                                                                                | Adresseert                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **✅ Gedaan**        | `ui_complexity` van Layer 1 naar Layer 2 verplaatst; "specialistische visualisatie" herwaardeerd naar Hybrid-signaal i.p.v. geforceerd High-Code                                                                           | 1.6                          |
| **✅ Gedaan**        | Frictie + verplichte reden bij "Skip Organisational Readiness"; zichtbare skip-badge overal waar de aanbeveling getoond wordt, inclusief bovenaan het rapport                                                              | 3.1 / 4.4                    |
| **✅ Gedaan**        | "Afwijking van aanbeveling"-veld (platform, reden, akkoord) toegevoegd aan sidebar én export                                                                                                                               | 2.2                          |
| **✅ Gedaan**        | "Confidence"-label hernoemd naar "Score separation" (sidebar + export), met tooltip/toelichting dat dit geen oordeel is over de juistheid van de invoer                                                                    | 3.5                          |
| **✅ Gedaan**        | Zelfde heroverweging toegepast op Quick Scan's `qs_ui`-knock-out (`no_ui_qs` verwijderd, gewicht ×2→×3, empirisch gevalideerd + geregressietest)                                                                           | 1.6 (openstaand vervolgpunt) |
| **✅ Gedaan**        | `team_skills`- én `qs_capability`-readiness relatief aan de daadwerkelijke winnaar berekend i.p.v. vaste goodIdx-lijst; geregressietest toegevoegd                                                                         | 4.2                          |
| **✅ Gedaan**        | "Weight deviations"-sectie bovenaan het rapport toegevoegd, met getimestampte log per gewichtwijziging                                                                                                                     | 4.3                          |
| **Kort**            | Steekproefwaarschuwing in de Compare-UI (n<10)                                                                                                                                                                             | 2.4                          |
| **✅ Gedaan**        | `tests/run-tests.js` toegevoegd — 28 geautomatiseerde scenario-tests (20 testset-applicaties + 8 edge cases) tegen de daadwerkelijke scoringlogica                                                                         | 1.4                          |
| **🟡 Deels gedaan** | `CALIBRATION.md` toegevoegd (register + governanceproces + tool-koppeling); panelbeoordeling van de individuele waarden staat nog open                                                                                     | 1.1 / 4.1                    |
| **🟡 Deels gedaan** | `CALIBRATION.md` §9 toegevoegd — voorbeeldapplicaties per antwoordoptie (55/58 Technology-Fit-opties uit de testset, 24 geconstrueerde Organisational-Readiness-voorbeelden); jaarlijkse kalibratiesessie nog niet gepland | 3.2                          |
| **Strategisch**     | Centrale opslag/portfolio-rapportage i.p.v. localStorage-per-browser                                                                                                                                                       | 2.3 / 3.4                    |
| **✅ Gedaan**        | "AWS" losgekoppeld van de definitie van "High-Code" in taal en cost-model (één centrale `HIGH_CODE_CLOUD_REF`-constante)                                                                                                   | 1.3                          |
| **Strategisch**     | Koppeling met een verplicht governance-gate (ARB / investeringsproces)                                                                                                                                                     | 2.1                          |
| **Strategisch**     | Eigenaarschap + jaarlijkse revisiecyclus voor gewichten/regels formaliseren                                                                                                                                                | 2.5                          |

---

## 6. Wat het model wél goed doet (voor de balans)

- De drielagen-architectuur (hard constraints → gewogen score → Hybrid-gate) is conceptueel solide en nu, na de assen-splitsing, ook zuiverder gescheiden tussen "wat de applicatie vereist" en "of de organisatie klaar is."
- De Blind Assessment / Compare-functionaliteit is — ondanks de kleine steekproef (2.4) — een goed idee: weinig governance-tools bouwen actief een mechanisme om zichzelf tegen de werkelijkheid te toetsen.
- Het cost-model-onderwijs (capacity- vs. usage-based, met expliciete caveats in beide richtingen) is ongebruikelijk eerlijk voor een tool die makkelijk richting het eigen platform had kunnen sturen.
- Determinisme en transparantie van de scoreberekening (geen black box, alle regels leesbaar in de code) is een sterk architectonisch uitgangspunt dat behouden moet blijven bij elke toekomstige uitbreiding.
