# Analyse: balans van de vragenlijst en scheiding technologie vs. organisatie

**Onderwerp:** `lowcode-decision-model.html` (v4.1)
**Vraag:** Genereert de vragenlijst een gebalanceerde beslissing tussen low-code- en high-code-kenmerken? En is het beter om technologie- en organisatie-invloeden te scheiden, zodat organisatie een aparte uitkomst/optie wordt in plaats van een input die de technologiebeslissing zelf stuurt?
**Antwoord in het kort:** De vragenlijst is technisch inhoudelijk sterk opgebouwd, maar is **niet gebalanceerd** in de zin dat organisatorische en puur technische signalen in dezelfde score worden opgeteld. Dat is een reëel risico voor een instrument dat zich presenteert als "defensible, auditable" voor governance boards. **Ja, het is beter om organisatie-invloed te scheiden** van de technologie-fit-score en als aparte as / aanbeveling te tonen — vergelijkbaar met hoe de Hybrid Readiness Gate dat nu al gedeeltelijk doet.

Onderstaande analyse is gebaseerd op het daadwerkelijk uitlezen van de vraagdata, gewichten en score-engine in de HTML/JS (`FULL_CATS`, `HARD_RULES`, `computeScores`, `computeHR`, `penaliseHybrid`), en op simulaties met de echte scoringlogica.

---

## 1. Hoe de vragenlijst is opgebouwd

Het model werkt in drie lagen:

| Laag | Wat het doet | Aard |
|---|---|---|
| **Laag 1 — Hard constraints** | 4 vragen (UI, performance, elasticiteit, security) kunnen de score volledig overrulen → forceren High-Code | **Zuiver technisch** |
| **Laag 2 — Gewogen scoring** | 24 vragen, elk met gewicht 1/2/3, tellen op tot een lc/hy/hc-score | **Gemengd technisch + organisatorisch** |
| **Laag 3 — Hybrid feasibility gate** | `arch_boundary`, `team_ownership`, `op_criticality`, `observability` bepalen een aparte "Hybrid Readiness"-score (0-100%); < 40% → Hybrid-score wordt met 30% gestraft | **Organisatorisch, deels al gescheiden** |

Layer 3 is dus het bewijs dat het model dit patroon al kent en het werkt: organisatorische gereedheid wordt daar *apart* gemeten en *als correctie* toegepast op de uitkomst, in plaats van vermengd te worden met de ruwe technische score. Het probleem is dat dit principe niet consistent is doorgevoerd naar de rest van de vragenlijst (zie §3).

---

## 2. Kwantitatieve balans: technologie vs. organisatie/business

De 24 vragen zijn verdeeld over vier categorieën. Gewicht-som is de som van de default-gewichten (1=standaard, 2=belangrijk, 3=kritiek) per categorie:

| Categorie | # vragen | Gewichtsom | Aard van de vragen |
|---|---|---|---|
| 🏗️ Application Characteristics | 5 | 9 | Wat de applicatie **is** (domein, UI-complexiteit, business logic, uniciteit, strategisch domein) |
| ⚙️ Technical Constraints | 7 | 12 | Wat de applicatie **technisch nodig heeft** (performance, elasticiteit, integraties, observability, security, cloud, cost model) |
| 🧑‍💻 Team & Organisation | 6 | 10 | Wat de **organisatie** kan/heeft (teamskills, teamgrootte, ownership, time-to-market-druk, maintainability) |
| 📊 Business & Strategic | 6 | 8 | Strategische/zakelijke randvoorwaarden (lifespan, change rate, boundary, reuse, vendor lock-in, budget) |
| **Totaal** | **24** | **39** | |

Puur technische fit (Application Characteristics + Technical Constraints) = 21/39 punten = **~54%** van het gewicht.
Team/organisatie + Business/Strategisch = 18/39 = **~46%** van het gewicht.

Dat is bijna 50/50 in een instrument dat wordt gepresenteerd als een **technologie**-beslissing (low-code / hybrid / high-code architectuurkeuze). Bijna de helft van het gewicht dat bepaalt "welk platform moet het worden" komt niet uit wat de applicatie technisch vereist, maar uit wie de applicatie op dit moment gaat bouwen, hoeveel budget/tijd er is, en hoe de organisatie is ingericht.

### Vragen die feitelijk organisatie meten, niet technologie

| Vraag-ID | Categorie (UI) | Wat het écht meet | Gewicht |
|---|---|---|---|
| `team_skills` | Team & Organisation | Huidige vaardigheden van het team | 2 |
| `team_size` | Team & Organisation | Teamomvang | 1 |
| `maintainability` | Team & Organisation | Wie onderhoud gaat doen | 1 |
| `time_to_market` | Team & Organisation | Tijdsdruk vanuit de business | 2 |
| `budget` | Business & Strategic | Of er al Low-Code licenties zijn ingekocht | 1 |
| `team_ownership`* | Team & Organisation | Of teams gescheiden eigenaarschap hebben | 2 |
| `arch_boundary`* | Business & Strategic | Of er een gedefinieerde architectuurgrens is | 2 |

\* `team_ownership` en `arch_boundary` zijn Layer-3-vragen: ze doen **dubbel werk** — ze tellen zowel mee in de basis lc/hy/hc-score (elk met gewicht 2) **als** in de aparte Hybrid Readiness-score die de Hybrid-uitkomst achteraf bestraft. Dat is geen verkeerde keuze op zich, maar het is een asymmetrie: voor Hybrid bestaat er al een apart "ben je er klaar voor"-mechanisme, voor Low-Code/High-Code niet.

Samen vertegenwoordigen deze zuiver organisatorische vragen 2+1+1+2+1 = **7 van de 39 punten (~18%)** — zonder `team_ownership`/`arch_boundary` mee te tellen, die al gedeeltelijk apart behandeld worden.

---

## 3. Empirisch bewijs: wat gebeurt er als techniek en organisatie tegenstrijdig zijn?

Ik heb de daadwerkelijke scoring-engine (`computeScores` uit de HTML) los gedraaid met gesimuleerde antwoordsets, om te testen hoe zwaar organisatie-antwoorden een technisch ondubbelzinnig signaal kunnen compenseren.

**Scenario A — technische kenmerken wijzen sterk op High-Code (event-driven, complexe logica, legacy-integraties, edge deployment, geen strategisch low-code domein), organisatie/business wijst volledig op Low-Code (klein team, citizen developers, hoge tijdsdruk, licenties aanwezig):**

```
lc: 38   hy: 45   hc: 71   → uitkomst: High-Code (juist, groot gat)
```
Hier wint High-Code nog duidelijk — het technische signaal is hier zo extreem dat het overeind blijft.

**Scenario B — een realistischer, minder extreem geval: technische kenmerken wijzen op Hybrid (gemengde technische/proces-eisen), organisatie/business wijst volledig op Low-Code:**

```
lc: 72   hy: 77   hc: 28   → uitkomst: Hybrid, maar met een gat van slechts 5 punten
                              (bij het model zelf: "Medium confidence")
```
Het organisatorische blok (`lc: 72`) zit hier al bijna gelijk met het technisch geïndiceerde Hybrid-signaal (`hy: 77`), puur op basis van default-gewichten.

**Scenario B2 — zelfde antwoorden als B, alleen de 5 organisatorische vragen (`team_skills`, `team_size`, `maintainability`, `time_to_market`, `budget`) op gewicht 3 gezet — een normale, in-app beschikbare actie via de "⚖ Edit question weights"-drawer, geen codewijziging:**

```
lc: 96   hy: 82   hc: 28   → uitkomst kantelt naar Low-Code
```

Met **uitsluitend organisatorische gewichten** — zonder één technisch antwoord te wijzigen — verschuift de aanbeveling van Hybrid naar Low-Code. Voor een tool die zich presenteert als "defensible scoring" voor architectuurgovernance is dit een significant risico: twee projecten met identieke technische requirements kunnen een andere platformaanbeveling krijgen puur omdat het ene project een junior/klein team heeft en het andere een team van senior engineers.

---

## 4. Waarom dit een probleem is

1. **Conflatie van "wat de applicatie nodig heeft" met "wat het team nu kan".** Teamvaardigheden en -omvang zijn tijdelijk en veranderlijk (aannames, opleiding, herallocatie); technische requirements (latency, integratiecomplexiteit, datavolume) zijn intrinsiek aan de applicatie en veel stabieler. Door ze in dezelfde score te stoppen, beloont het model impliciet "bouw wat het team nu toevallig kent" boven "bouw wat het probleem vereist" — en dat is precies de bias die een objectief beslissingsmodel zou moeten voorkomen.

2. **Zelfbevestigend effect op portfolio-niveau.** Omdat Low-Code "de PostNL strategische default" is (zie de disclaimer in de tool zelf), en teamsamenstelling vaak al low-code-skewed is, versterkt het meewegen van teamskills in de score een bestaande voorkeur in plaats van die kritisch te toetsen — terwijl dat toetsen het hele doel van het instrument is.

3. **Verlies van traceerbaarheid/auditeerbaarheid.** Het rapport (Decision Report) toont wél de score, de "Key signals" en de risico's, maar niet **waarom** een uitkomst is gekozen op basis van techniek versus organisatie. Een governance board dat een aanbeveling "High-Code" of "Low-Code" ziet, kan uit het rapport niet aflezen of dat komt doordat de applicatie het technisch vereist, of doordat het huidige team toevallig geen andere skillset heeft. Dat onderscheid is precies wat een architectuurboard nodig heeft om te beslissen: technologie aanpassen, of capaciteit/opleiding aanpassen.

4. **Asymmetrie tussen "hard" en "zacht" al aanwezig, maar niet doorgetrokken.** Layer 1 hard constraints zijn uitsluitend technisch (UI, latency, elasticiteit, security) en overrulen de score volledig — terecht, want dit zijn niet-onderhandelbare eisen. Er bestaat geen equivalent voor organisatie ("geen enkele low-code capaciteit beschikbaar", "geen enkele engineering capaciteit beschikbaar"): dat is ook terecht, want capaciteit is fungibel (te huren/trainen) en mag dus geen platform *knock-out* zijn — maar de huidige inrichting laat organisatie wél **impliciet gewicht meetellen in de basis-score**, wat inconsistent is met het idee dat organisatie iets anders is dan een harde technische eis.

5. **Het patroon bestaat al — voor Hybrid.** `computeHR()` en `penaliseHybrid()` laten zien dat de bouwers van dit model het onderscheid al hebben herkend: Hybrid readiness (boundary, ownership, criticality, observability) wordt apart gemeten en als **correctie op** — niet als **onderdeel van** — de ruwe score toegepast, met een eigen UI-blok ("Hybrid Readiness", met %, kleur en notitie). Dit bewijst dat het patroon technisch en UI-matig prima in dit model past; het ontbreekt alleen voor Low-Code en High-Code.

---

## 5. Voorstel: technologie en organisatie scheiden als twee assen

**Aanbeveling: ja, splits het model in twee expliciete uitkomsten in plaats van één samengevoegde score.**

### As 1 — Technology Fit (blijft de architectuurbeslissing sturen)
Bevat uitsluitend vragen die beschrijven wat de applicatie **is** en **technisch vereist**:
`domain`, `ui_complexity`, `business_logic`, `uniqueness`, `strategic_domain`, `performance`, `elasticity`, `runtime_cost`, `integration`, `observability`, `security`, `cloud`, plus strategische/architecturale randvoorwaarden die intrinsiek aan de oplossing zijn: `lifespan`, `change_rate`, `reuse`, `vendor` (lock-in-risico hoort bij de architectuurkeuze zelf, niet bij de huidige teamsamenstelling).
→ Dit blijft de score die "Low-Code / Hybrid / High-Code" bepaalt, met Layer 1 hard constraints ongewijzigd.

### As 2 — Organisational Readiness (aparte uitkomst, geen stem in het platformverdict)
Bevat: `team_skills`, `team_size`, `maintainability`, `time_to_market`, `budget`, en (generalisatie van het bestaande Hybrid-patroon) `team_ownership`, `arch_boundary`, `op_criticality`.
→ Wordt getoond als een **eigen badge/sectie** in de sidebar, naast de bestaande "Hybrid Readiness"-balk: bijv. "Organisational Readiness: 45% — Matig. Team heeft beperkte high-code-ervaring voor een applicatie die technisch High-Code vereist."
→ Genereert **acties/risico's**, geen scoreverschuiving: "upskilling-traject", "tijdelijke inhuur", "gefaseerde levering", "heroverweeg tijdlijn" — in plaats van stilzwijgend het platform te veranderen.

### Waarom dit beter werkt dan volledig weglaten
Organisatie-signalen zijn wél waardevol — een team zonder enige engineeringcapaciteit kán een High-Code-advies praktisch niet uitvoeren. Het punt is niet dat organisatie irrelevant is, maar dat het een **andere vraag** beantwoordt ("zijn we er klaar voor?") dan de technologievraag ("wat past het beste?"). Door ze te scheiden:
- blijft de technologie-aanbeveling stabiel en auditeerbaar, onafhankelijk van wie toevallig het team samenstelt;
- krijgt de organisatorische mismatch zichtbaarheid en een concreet vervolgtraject, in plaats van dat hij verdwijnt in een samengevoegd getal;
- wordt het patroon consistent: Layer 1 (hard/technisch) → overrule, As 1 (technisch, gewogen) → platformkeuze, As 2 (organisatorisch) → readiness/risico, precies zoals nu al voor Hybrid geldt.

### Wat te behouden zoals het is
- Layer 1 hard constraints (zuiver technisch, terecht een knock-out).
- De Hybrid Readiness Gate zelf — dit wordt het sjabloon voor As 2, niet iets om te vervangen.
- De Weight Drawer als concept — alleen zou deze per as moeten werken, zodat het aanpassen van organisatiegewicht nooit de technologie-uitkomst kan doen kantelen (zoals in Scenario B2 wél gebeurt met de huidige opzet).
- `vendor`, `lifespan`, `change_rate`, `reuse` horen bij As 1: dit zijn strategische eigenschappen van de **oplossing/architectuur**, geen eigenschappen van de organisatie die hem bouwt.

---

## 6. Samenvatting

| | Huidige situatie | Voorgesteld |
|---|---|---|
| Technologie- en organisatievragen | Opgeteld in dezelfde lc/hy/hc-score (46% van het gewicht is niet-technisch) | Gescheiden: technologie bepaalt het platform, organisatie bepaalt gereedheid/risico |
| Effect van teamsamenstelling | Kan de platformkeuze zelf doen kantelen (zie Scenario B2: gewicht ophogen van alleen organisatievragen verandert Hybrid → Low-Code) | Beïnvloedt een aparte readiness-indicator, niet het platformverdict |
| Consistentie in het model | Hybrid heeft al een aparte readiness-gate; Low-Code/High-Code niet | Zelfde patroon voor alle drie de platformen |
| Auditeerbaarheid voor governance | Eén score, oorzaak (techniek vs. organisatie) niet gescheiden zichtbaar | Twee assen, expliciet te herleiden "waarom dit platform" vs. "waarom deze risico's" |

**Conclusie:** de vragenlijst is inhoudelijk goed doordacht en de technische vragen zijn scherp geformuleerd, maar de huidige scoringopzet is **niet gebalanceerd tussen technologie en organisatie** — bijna de helft van het gewicht dat de platformkeuze bepaalt is organisatorisch/zakelijk van aard, en dat kan (aantoonbaar, zie §3) een technisch onderbouwde uitkomst overstemmen. Het scheiden van technologie-fit en organisatie-gereedheid in twee assen — het patroon dat het model al gebruikt voor Hybrid — maakt de aanbeveling stabieler, eerlijker richting de applicatie-eisen, en beter auditeerbaar voor een governance board.
