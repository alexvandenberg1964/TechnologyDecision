# Testset — 20 real-world applicaties voor de Technology Fit-vragen

**Doel:** een gevarieerde set van herkenbare, functioneel beschreven applicaties om de 16 Technology Fit-vragen van het Platform Decision Model tegenaan te testen — los van de Organisational Readiness-as (team, ownership, budget, tijdsdruk), zoals gevraagd.
**Methode:** elke applicatie is functioneel omschreven (wát het doet, niet hóe het gebouwd is) en vervolgens gescoord op exact de 16 vragen/antwoordopties uit het model. Voor de technisch minder voor de hand liggende archetypes (real-time fraudedetectie, IoT-telemetrie, sorteercentrum-besturing, EDI-integratie, publieke API-beveiliging, veiligheidsbesturing, mainframe-modernisering, chatbots, low-code procesautomatisering) is dit getoetst aan externe bronnen — zie de bronnenlijst onderaan. Voor de overige, herkenbare bedrijfsproces-applicaties is gangbare vakkennis gebruikt; die zijn niet los gebronnen.
**Belangrijk:** dit is een testset om de vragenlijst tegenaan te houden — de gekozen antwoorden zijn een realistische inschatting per archetype, geen garantie dat elk specifiek PostNL-systeem er exact zo uitziet. Gebruik dit om te controleren of de aanbeveling van het model overeenkomt met de verwachting, niet als brondocument voor een echte assessment.

**Update na modelwijziging:** de vraag "Hoe complex en uniek is de UI/UX?" had voorheen twee opties (`Geen betekenisvolle UI nodig` en `Specialistische visualisatie of volledig custom interface`) die allebei een onvoorwaardelijke hard constraint naar High-Code afdwongen. Na kritische review is dit aangepast: "geen UI" is nu een maximaal gewogen (×3) Layer 2-signaal in plaats van een Layer 1-hard constraint, en "specialistische visualisatie" is omgezet naar een sterk Hybrid-signaal (`lc:0,hy:3,hc:1`) in plaats van een geforceerde High-Code-uitkomst. Alle 20 uitkomsten in dit document zijn opnieuw doorgerekend met de bijgewerkte logica — **applicatie 18 (Mobiele Bezorgapp) is daardoor van uitkomst veranderd** (was: High-Code via hard constraint; is nu: Hybrid via gewogen score), de overige 19 uitkomsten zijn ongewijzigd, al is bij een aantal de "hard constraint"-toelichting bijgewerkt omdat "geen UI" niet langer die status heeft.

---

## Overzichtstabel

| # | Applicatie | Kern van de functie | Verwachte uitkomst |
|---|---|---|---|
| 1 | Zending Track & Trace Portal | Klant volgt real-time status/locatie van een zending | 🟢 High-Code (hard constraint: piekvolume) |
| 2 | Verlofaanvraag- en Goedkeuringsworkflow | Medewerker vraagt verlof aan, manager keurt goed | 🔵 Low-Code |
| 3 | Route- en Beladingsoptimalisatie voor Bezorgvoertuigen | Berekent optimale routes/belading voor bezorgers | 🟢 High-Code (sterk gewogen score, geen hard constraint) |
| 4 | Realtime Fraude- en Risicodetectie bij Verzendingen | Beoordeelt zendingen/transacties op fraudepatronen | 🟢 High-Code (hard constraints: kritieke performance + elasticiteit) |
| 5 | Sorteercentrum Besturingssysteem | Stuurt banden, sorteerders en AGV's in een sorteercentrum aan | 🟢 High-Code (hard constraint: kritieke performance) |
| 6 | Klant Self-Service Klachten- en Retourportaal | Klant dient een klacht/retour in en volgt de afhandeling | 🔵 Low-Code |
| 7 | Facturatie- en Incassoproces voor Zakelijke Klanten | Genereert facturen en bewaakt betaling/aanmaningen | 🔵 Low-Code |
| 8 | Partner-koppelvlak voor Grootzakelijke Verladers (EDI) | Wisselt orders/zendingsdata uit met grootzakelijke klanten | 🟢 High-Code (sterk gewogen score, geen hard constraint) |
| 9 | Operationeel Capaciteits- en Voorraaddashboard | Toont actuele capaciteit/voorraad aan operationeel management | 🟣 Hybrid |
| 10 | Virtuele Assistent voor Klantenservice (Chatbot) | Beantwoordt klantvragen automatisch via chat | 🟣 Hybrid |
| 11 | Onboarding-portaal voor Nieuwe Medewerkers | Begeleidt nieuwe medewerkers door hun eerste weken | 🔵 Low-Code |
| 12 | Tarief- en Verzendkostencalculatie-engine | Berekent verzendtarief per zending voor alle kanalen | 🟢 High-Code (sterk gewogen score, geen hard constraint) |
| 13 | Publieke Zendingen-API voor Externe Ontwikkelaars | Externe partijen vragen zendinginformatie op via API | 🟢 High-Code (hard constraints: elasticiteit + zero-trust) |
| 14 | Management-informatie en Rapportagedashboard | Toont KPI's en trends aan het management | 🔵 Low-Code |
| 15 | Voertuig- en Wagenparkmonitoring (IoT Telemetrie) | Verzamelt en analyseert sensordata van bezorgvoertuigen | 🟢 High-Code (hard constraint: piekvolume + edge) |
| 16 | Noodstop- en Veiligheidsbesturing Sorteerinstallatie | Brengt installatie bij gevaar automatisch naar veilige staat | 🟢 High-Code (hard constraint: kritieke performance) |
| 17 | Marketing Campagnebeheer | Plant en beheert marketingcampagnes en doelgroepen | 🔵 Low-Code |
| 18 | Mobiele Bezorgapp voor Bezorgers | Begeleidt bezorgers door hun ronde, scannen, bewijs van bezorging | 🟣 Hybrid (was High-Code vóór de modelwijziging — zie toelichting) |
| 19 | Klantloyaliteitsprogramma en -app | Klant spaart en besteedt loyaliteitspunten | 🟣 Hybrid |
| 20 | Legacy Mainframe Ontsluitingslaag | Ontsluit data/transacties van een legacy mainframe voor moderne apps | 🟢 High-Code (sterk gewogen score, geen hard constraint) |

**Verdeling:** 6× Low-Code, 4× Hybrid, 10× High-Code (waarvan 6 met minstens één hard constraint). Dit is een bewust realistische verdeling, geen streven naar 33/33/33 — "echte" Hybrid-kandidaten zijn in de praktijk schaarser dan zuivere proces- of platformapplicaties, en dat blijkt ook hier. Ter controle zijn alle 20 uitkomsten opnieuw doorgerekend met de daadwerkelijke, bijgewerkte scoringlogica (niet handmatig geschat).

---

## 1. Zending Track & Trace Portal

**Functie:** een klant kan op elk moment de actuele status en locatie van een verzonden pakket opzoeken, een tijdlijn van gebeurtenissen (opgehaald, gesorteerd, onderweg, bezorgd) bekijken en zich laten notificeren bij statuswijzigingen.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Customer-facing product met unieke UX-eisen | Klantbeleving (tijdlijn/kaart) is de kern van de waarde |
| UI/UX-complexiteit | Enkele custom widgets op standaardpatroon | Tijdlijn/kaartweergave is custom, rest is standaard portaal |
| Business logic | Gemiddeld: meerdere beslispunten en integraties | Statusaggregatie over meerdere bronsystemen/vervoerders |
| Uniciteit | Enkele unieke features op standaardpatroon | Track&trace is een bekend patroon, PostNL-flow voegt eigenheid toe |
| Strategisch domein | Deels — klantschermen met technische onderlaag | Klantgezicht met zware event-verwerking eronder |
| Performance | Belangrijk en moet expliciet ontworpen worden | Near-real-time verwachting, geen sub-seconde eis |
| Elasticiteit | **Hoog/piekerig — hard constraint** | Piekbelasting rond feestdagen/Black Friday is industrie-breed bekend |
| Kostenmodel | Usage-based nodig | Volgt direct uit de piekbelasting |
| Integraties | Legacy systemen, binaire protocollen of event brokers | Meerdere databronnen (scanners, GPS, vervoerders) via een event bus |
| Observability | Diepe logs/metrics/traces/SLO's nodig | Datapijplijn-gezondheid moet continu bewaakt worden |
| Beveiliging | Branchegereguleerd — GDPR-kritisch | Persoonsgegevens van geadresseerden |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Microservices/container-architectuur is gangbaar patroon |
| Levensduur | Lange termijn strategisch (5+ jaar) | Kerncapaciteit voor klantervaring |
| Wijzigingsritme | Snelheid én technische flexibiliteit even belangrijk | Evolueert met nieuwe vervoerders/features, maar ook schaal-werk |
| Hergebruik | Kernplatform/gedeelde dienst binnen portfolio | Statusdata voedt app, website én klantenservice |
| Vendor lock-in | Acceptabel voor kern, vermijden voor integratielaag | Klantschil mag platformgebonden zijn, databus niet |

**Bronnen:** real-time notificaties, event-driven architectuur en horizontale schaling bij piekbelasting zijn goed gedocumenteerd voor dit type systeem — zie bronnenlijst.

---

## 2. Verlofaanvraag- en Goedkeuringsworkflow

**Functie:** een medewerker dient een verlofaanvraag in, deze wordt automatisch gerouteerd naar de juiste manager voor goedkeuring, en de uitkomst wordt teruggekoppeld en verwerkt in het verlofsaldo.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Business process management / CRUD / interne tooling | Schoolvoorbeeld van een goedkeuringsproces |
| UI/UX-complexiteit | Standaard formulieren, lijsten en dashboards | Formulier + goedkeuringsscherm, niets bijzonders |
| Business logic | Eenvoudige regels, goedkeuringen en workflowstappen | Rechtlijnig goedkeuringsproces |
| Uniciteit | Veelvoorkomend patroon — marktplaatsmodules bestaan | Verlofworkflows zijn een standaard low-code-voorbeeld |
| Strategisch domein | Ja — bedrijfsapp/procesautomatisering | Interne HR-tooling |
| Performance | Standaard enterprise — geen strikte SLA | Geen tijdskritische eis |
| Elasticiteit | Stabiel en bescheiden | Voorspelbaar volume, gebonden aan personeelsbestand |
| Kostenmodel | Capaciteitsmodel past goed | Standaard platformgebruik |
| Integraties | Weinig standaardintegraties | Koppeling met HR-systeem/verlofsaldo |
| Observability | Standaard platformmonitoring volstaat | Geen bijzondere operationele eisen |
| Beveiliging | Standaard enterprise — SSO/RBAC/audit trail | Interne HR-toepassing |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard bedrijfsapplicatie |
| Levensduur | Middellange termijn (2-5 jaar) | HR-beleid en -systemen worden periodiek herzien |
| Wijzigingsritme | Frequente proceswijzigingen | CAO/beleidswijzigingen passen vaak aan |
| Hergebruik | Enkele gedeelde diensten/UI-componenten | Goedkeuringsengine vaak gedeeld met andere HR-processen |
| Vendor lock-in | Geen aandachtspunt | Low-Code is hier expliciet passend |

---

## 3. Route- en Beladingsoptimalisatie voor Bezorgvoertuigen

**Functie:** berekent voor een gegeven set zendingen en voertuigen de meest efficiënte route en beladingsvolgorde, rekening houdend met tijdvensters, capaciteit en verkeer.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Data-heavy met complexe domeinlogica | Optimalisatie-algoritme, geen los proces |
| UI/UX-complexiteit | Geen betekenisvolle UI nodig (max. gewogen ×3, geen hard constraint) | Backend-dienst, geconsumeerd door planningstools/bezorgapp |
| Business logic | Complex: domeinalgoritmes of zware berekeningen | Vehicle-routing-problem-klasse algoritmiek |
| Uniciteit | Sterk onderscheidend of vernieuwend | Directe concurrentiefactor in bezorgkosten/snelheid |
| Strategisch domein | Nee — servicelaag/platformcomponent | Puur een rekendienst, geen bedrijfsapp op zich |
| Performance | Belangrijk en moet expliciet ontworpen worden | Planningsrun moet binnen een tijdsvenster (ochtendplanning) klaar zijn |
| Elasticiteit | Enigszins variabel, standaard schaalbaar op te vangen | Dagelijkse batchpiek, voorspelbaar |
| Kostenmodel | Usage-based nodig | Rekenintensieve batchverwerking |
| Integraties | Meerdere integraties met orkestratie | Voertuigdata, verkeersdata, orderdata |
| Observability | Diepe logs/metrics/traces/SLO's nodig | Correctheid en performance van het algoritme moeten meetbaar zijn |
| Beveiliging | Standaard enterprise | Geen bijzondere compliance-eisen op zichzelf |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Reken-intensieve batchjobs passen goed op standaard cloud |
| Levensduur | Lange termijn strategisch | Kernonderdeel van bezorgefficiëntie |
| Wijzigingsritme | Langetermijn technische controle en flexibiliteit cruciaal | Algoritme-tuning is doorlopende engineering-discipline |
| Hergebruik | Kernplatform/gedeelde dienst binnen portfolio | Gebruikt door meerdere regio's/business units |
| Vendor lock-in | Lock-in moet geminimaliseerd worden | Strategische rekencapaciteit, portabiliteit gewenst |

---

## 4. Realtime Fraude- en Risicodetectie bij Verzendingen

**Functie:** beoordeelt inkomende zendingen/transacties automatisch en vrijwel direct op patronen die op fraude of misbruik wijzen, en markeert verdachte gevallen voor verdere afhandeling.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Real-time, event-driven of high-throughput systeem | Continue stroom van te beoordelen transacties |
| UI/UX-complexiteit | Geen betekenisvolle UI nodig (max. gewogen ×3, geen hard constraint) | Scoringsdienst; een agent-dashboard is een apart, consumerend systeem |
| Business logic | AI/ML-inferentie of real-time verwerkingspijplijn | Scoringsmodellen op basis van patronen |
| Uniciteit | Sterk onderscheidend of vernieuwend | Fraudepatronen zijn organisatiespecifiek |
| Strategisch domein | Nee — servicelaag/platformcomponent | Pure detectiedienst |
| Performance | **Kritiek voor de oplossing — hard constraint** | Onderzoek toont doorlooptijden van enkele tientallen milliseconden als norm voor real-time transactiescoring |
| Elasticiteit | **Hoog/piekerig — hard constraint** | Transactievolume schommelt sterk met bedrijfsdrukte |
| Kostenmodel | Usage-based nodig | Volgt uit volume-gedreven verwerking |
| Integraties | Legacy systemen, binaire protocollen of event brokers | Streaming-ingestie vanuit meerdere bronnen |
| Observability | Diepe logs/metrics/traces/SLO's nodig | Nauwkeurigheid en fouttolerantie moeten continu bewaakt worden |
| Beveiliging | Kritieke infrastructuur / overheidsniveau-eisen | Zware modelgovernance/compliance rond fraudedetectie |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Streaming-architectuur past op standaard cloud-infra |
| Levensduur | Lange termijn strategisch | Kern van risicobeheersing |
| Wijzigingsritme | Langetermijn technische controle en flexibiliteit cruciaal | Modellen worden doorlopend herzien/getraind |
| Hergebruik | Kernplatform/gedeelde dienst binnen portfolio | Eén detectiedienst voor meerdere kanalen |
| Vendor lock-in | Lock-in moet geminimaliseerd worden | Strategisch te belangrijk om vast te zetten |

**Bronnen:** typische latency-eisen (tientallen milliseconden voor scoring, hoge-doorvoer streaming, tiered detectie) zijn direct ontleend aan onderzoek naar real-time fraudedetectiearchitecturen — zie bronnenlijst.

---

## 5. Sorteercentrum Besturingssysteem

**Functie:** stuurt in real time de fysieke installaties in een sorteercentrum aan — banden, sorteerders, scanners, AGV's — en beslist per pakket direct welke route het door de installatie neemt.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Real-time, event-driven of high-throughput systeem | Continue sensordata en directe besturingsbeslissingen |
| UI/UX-complexiteit | Geen betekenisvolle UI nodig (max. gewogen ×3, geen hard constraint) | Besturingslogica zelf heeft geen bedrijfs-UI; een monitoring-dashboard is een apart systeem |
| Business logic | Complex: domeinalgoritmes of zware berekeningen | Real-time routebeslissingen/state machines |
| Uniciteit | Sterk onderscheidend of vernieuwend | Fysieke automatisering is per installatie maatwerk |
| Strategisch domein | Nee — servicelaag/platformcomponent | Besturingslaag, geen bedrijfsapp |
| Performance | **Kritiek voor de oplossing — hard constraint** | Onderzoek naar warehouse control systems beschrijft "split-second decisions" |
| Elasticiteit | Stabiel en bescheiden | Fysiek beperkt door bandcapaciteit, niet cloud-elastisch |
| Kostenmodel | Gemengd | Vaste besturingshardware + event-verwerking |
| Integraties | Legacy systemen, binaire protocollen of event brokers | PLC/sensor-protocollen, event-driven architectuur |
| Observability | Diepe logs/metrics/traces/SLO's nodig | Veiligheids- en operationele bewaking essentieel |
| Beveiliging | Kritieke infrastructuur / overheidsniveau-eisen | Grenst aan veiligheidsinstrumentatie (zie ook applicatie 16) |
| Cloud/infrastructuur | Edge, embedded of IoT-deployment | Lokale besturing op/nabij de fysieke installatie |
| Levensduur | Lange termijn strategisch | Kapitaalintensieve installatie, lange levensduur |
| Wijzigingsritme | Langetermijn technische controle en flexibiliteit cruciaal | Wijzigingen vergen zorgvuldige engineering, geen snelle iteratie |
| Hergebruik | Kernplatform/gedeelde dienst binnen portfolio | Patronen hergebruikt over meerdere sorteercentra |
| Vendor lock-in | Lock-in moet geminimaliseerd worden | Strategische voorkeur, ook al is de praktijk vaak vendor-gebonden |

**Bronnen:** event-driven besturing met state machines en split-second beslissingen zijn direct beschreven in onderzoek naar Warehouse Control Systems — zie bronnenlijst.

---

## 6. Klant Self-Service Klachten- en Retourportaal

**Functie:** een klant dient zelf een klacht of retourverzoek in, kiest een gewenste afhandeling (terugbetaling/vervanging) en volgt de status tot afhandeling.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Business process management / CRUD / interne tooling | Casemanagement-proces, ondanks klantgezicht |
| UI/UX-complexiteit | Standaard formulieren, lijsten en dashboards | Klachtformulier + statusoverzicht |
| Business logic | Gemiddeld: meerdere beslispunten en integraties | Routeringsregels (terugbetaling/vervanging/onderzoek) |
| Uniciteit | Veelvoorkomend patroon | Klant-selfservice is een breed toegepast patroon |
| Strategisch domein | Ja — bedrijfsapp/procesautomatisering | Kernonderdeel klantenservice |
| Performance | Standaard enterprise — geen strikte SLA | Geen tijdskritische eis |
| Elasticiteit | Enigszins variabel, standaard schaalbaar op te vangen | Piek rond retourseizoen (na feestdagen) |
| Kostenmodel | Capaciteitsmodel past goed | Standaard platformgebruik |
| Integraties | Meerdere integraties met orkestratie | Orders, terugbetaling/betaalsysteem, retourlabels |
| Observability | Basale operationele inzichten en wat geautomatiseerde tests | Standaard proces-monitoring |
| Beveiliging | Branchegereguleerd — GDPR-kritisch | Persoons- en betaalgegevens |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard bedrijfsapplicatie |
| Levensduur | Lange termijn strategisch | Kerncapaciteit klantenservice |
| Wijzigingsritme | Frequente proceswijzigingen | Beleid rond retouren/terugbetaling wijzigt regelmatig |
| Hergebruik | Enkele gedeelde diensten/UI-componenten | Casemanagement-patroon gedeeld met andere klantprocessen |
| Vendor lock-in | Geen aandachtspunt | Passend bij Low-Code |

---

## 7. Facturatie- en Incassoproces voor Zakelijke Klanten

**Functie:** genereert periodieke facturen voor zakelijke klanten, bewaakt betalingstermijnen en start automatisch een aanmaning-/incassotraject bij te late betaling.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Business process management / CRUD / interne tooling | Financieel bedrijfsproces |
| UI/UX-complexiteit | Standaard formulieren, lijsten en dashboards | Factuuroverzichten, statusschermen |
| Business logic | Gemiddeld: meerdere beslispunten en integraties | Aanmaning-/escalatieregels |
| Uniciteit | Veelvoorkomend patroon | Standaard financieel proces |
| Strategisch domein | Ja — bedrijfsapp/procesautomatisering | Kern financieel proces |
| Performance | Standaard enterprise — geen strikte SLA | Batchgedreven, geen real-time eis |
| Elasticiteit | Stabiel en bescheiden | Maandelijkse factureringscyclus, voorspelbaar |
| Kostenmodel | Capaciteitsmodel past goed | Standaard platformgebruik |
| Integraties | Meerdere integraties met orkestratie | ERP/financiële systemen, betaalproviders |
| Observability | Basale operationele inzichten en wat geautomatiseerde tests | Standaard proces-monitoring |
| Beveiliging | Branchegereguleerd — GDPR-kritisch | Financiële gegevens |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard bedrijfsapplicatie |
| Levensduur | Lange termijn strategisch | Kern financieel proces |
| Wijzigingsritme | Frequente proceswijzigingen | Facturatiebeleid/tarieven wijzigen regelmatig |
| Hergebruik | Enkele gedeelde diensten/UI-componenten | Aanmaningsengine vaak breder ingezet |
| Vendor lock-in | Acceptabel voor kern, vermijden voor integratielaag | Koppeling naar ERP/betaalproviders behoort portabel te blijven |

---

## 8. Partner-koppelvlak voor Grootzakelijke Verladers (EDI)

**Functie:** wisselt geautomatiseerd orders, zendingsgegevens en statusupdates uit met de systemen van grootzakelijke verladers, in de berichtformaten die elke partner hanteert.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Real-time, event-driven of high-throughput systeem | Continue berichtenstroom tussen partnersystemen (imperfecte fit — zie toelichting onder de tabel) |
| UI/UX-complexiteit | Geen betekenisvolle UI nodig (max. gewogen ×3, geen hard constraint) | Machine-naar-machine berichtenuitwisseling |
| Business logic | Complex: domeinalgoritmes of zware berekeningen | Formaatvertaling (X12/EDIFACT/XML/JSON) en validatie per partner |
| Uniciteit | Enkele unieke features op standaardpatroon | EDI-patronen zijn industriestandaard, partnermapping is maatwerk |
| Strategisch domein | Nee — servicelaag/platformcomponent/integratiehub | Expliciet het schoolvoorbeeld uit de vraag zelf |
| Performance | Enige verwachtingen, geen harde latency-eis | Batch/near-real-time, geen sub-seconde eis |
| Elasticiteit | Enigszins variabel, standaard schaalbaar op te vangen | Partnervolume groeit geleidelijk |
| Kostenmodel | Gemengd | Vaste basis + per-partner berichtvolume |
| Integraties | **Volledige middleware-eigenaarschap vereist** | Onderzoek: EDI vereist eigen vertalers per partnerkoppeling en gespecialiseerde infrastructuur |
| Observability | Diepe logs/metrics/traces/SLO's nodig | Afleverbewijs/audit trail is contractueel vereist |
| Beveiliging | Branchegereguleerd — GDPR-kritisch | Zakelijke contractdata |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Moderne EDI verschuift naar cloud-/SaaS-achtige levering |
| Levensduur | Lange termijn strategisch | Partnercontracten lopen jarenlang |
| Wijzigingsritme | Langetermijn technische controle en flexibiliteit cruciaal | Voortdurend nieuwe partnerformaten |
| Hergebruik | Kernplatform/gedeelde dienst binnen portfolio | Eén hub bedient veel zakelijke klanten |
| Vendor lock-in | Lock-in moet geminimaliseerd worden | Portabiliteit tussen partnerformaten is het hele punt |

**Toelichting op de "Aard van de applicatie"-vraag:** geen van de vier antwoordopties past hier echt goed — dit is een observatie op zichzelf. Een integratiehub is niet "business process," niet puur "data-heavy," en ook niet echt "customer-facing." De dichtstbijzijnde optie is gekozen, maar dit laat zien dat de vraagset platformcomponenten minder scherp vangt dan procesapplicaties.
**Bronnen:** complexiteit van EDI-implementatie, formaatdiversiteit en de noodzaak van eigen vertalers per koppeling zijn direct ontleend aan onderzoek naar B2B EDI-integratie — zie bronnenlijst.

---

## 9. Operationeel Capaciteits- en Voorraaddashboard

**Functie:** toont operationeel management een actueel overzicht van beschikbare verwerkingscapaciteit en voorraadniveaus, met signalering bij dreigende overbelasting.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Data-heavy met complexe domeinlogica | Aggregatie van meerdere operationele databronnen |
| UI/UX-complexiteit | Enkele custom widgets op standaardpatroon | Grafieken/meters op een dashboard-basis |
| Business logic | Gemiddeld: meerdere beslispunten en integraties | Drempelwaarden, alertlogica over meerdere bronnen |
| Uniciteit | Enkele unieke features op standaardpatroon | Operationele KPI's zijn organisatiespecifiek |
| Strategisch domein | Deels — bedrijfsschermen met technische onderlaag | Businessgezicht op technische databronnen |
| Performance | Enige verwachtingen, geen harde latency-eis | Near-real-time verversing (seconden/minuten) volstaat |
| Elasticiteit | Enigszins variabel, standaard schaalbaar op te vangen | Meebewegend met operationele drukte |
| Kostenmodel | Gemengd | Combinatie van vaste dashboards en variabele databronnen |
| Integraties | Meerdere integraties met orkestratie | WMS/TMS/ERP-databronnen |
| Observability | Gemiddelde observability en testdekking nodig | Datakwaliteit/beschikbaarheid moet bewaakt worden |
| Beveiliging | Standaard enterprise — SSO/RBAC/audit trail | Intern operationeel gebruik |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard dashboard-architectuur |
| Levensduur | Middellange termijn (2-5 jaar) | Dashboards worden periodiek herzien |
| Wijzigingsritme | Snelheid én technische flexibiliteit even belangrijk | Nieuwe KPI's/bronnen komen doorlopend bij |
| Hergebruik | Enkele gedeelde diensten/UI-componenten | Componenten gedeeld met andere rapportageschermen |
| Vendor lock-in | Acceptabel voor kern, vermijden voor integratielaag | Databronkoppelingen moeten portabel blijven |

**Waarom dit een goed Hybrid-testgeval is:** vrijwel elk antwoord landt in de "gemengd/gemiddeld"-middenoptie — precies het profiel waarvoor Hybrid is bedoeld. Let op: of Hybrid ook daadwerkelijk wordt aanbevolen, hangt in het model mede af van de Organisational Readiness-as (boundary/ownership) — die blijft hier bewust buiten beschouwing.

---

## 10. Virtuele Assistent voor Klantenservice (Chatbot)

**Functie:** beantwoordt veelgestelde klantvragen automatisch via een chatvenster, herkent de intentie achter een vraag, en schakelt door naar een medewerker bij complexere vragen.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Customer-facing product met unieke UX-eisen | Directe klantinteractie is de kern |
| UI/UX-complexiteit | Enkele custom widgets op standaardpatroon | Chatvenster is een bekend UI-patroon, geen specialistische visualisatie |
| Business logic | AI/ML-inferentie of real-time verwerkingspijplijn | Intentieherkenning/NLP |
| Uniciteit | Enkele unieke features op standaardpatroon | Vaak gebouwd op bestaande NLP-engines (Watson/Lex/Dialogflow) |
| Strategisch domein | Deels — klantschermen met technische onderlaag | Klantgezicht met AI-onderlaag |
| Performance | Enige verwachtingen, geen harde latency-eis | Enkele seconden antwoordtijd is acceptabel |
| Elasticiteit | Kan materieel groeien/variëren | Piekbelasting bij campagnes/incidenten |
| Kostenmodel | Usage-based nodig | Per-gesprek/API-call-gedreven kosten van NLP-engines |
| Integraties | Meerdere integraties met orkestratie | CRM, agenda, orderstatus, chatkanalen |
| Observability | Gemiddelde observability en testdekking nodig | Gesprekskwaliteit/intentie-nauwkeurigheid moet gevolgd worden |
| Beveiliging | Branchegereguleerd — GDPR-kritisch | Persoonlijke gespreksdata |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard cloud-gehoste AI-dienst |
| Levensduur | Middellange termijn (2-5 jaar) | Conversational AI wordt vaak ververst/vervangen |
| Wijzigingsritme | Snelheid én technische flexibiliteit even belangrijk | Snel itereren op gesprekstromen |
| Hergebruik | Enkele gedeelde diensten/UI-componenten | Chat-widget vaak op meerdere kanalen ingezet |
| Vendor lock-in | Lock-in moet geminimaliseerd worden | Sterke afhankelijkheid van één NLP-vendor is een bekend risico |

**Bronnen:** architectuur (intentieherkenning, vendor-NLP-engines, kanaalintegraties) en de constatering dat technische complexiteit vaak los staat van de gewenste business-conversatielogica zijn ontleend aan onderzoek naar chatbot-architectuur — zie bronnenlijst.

---

## 11. Onboarding-portaal voor Nieuwe Medewerkers

**Functie:** begeleidt een nieuwe medewerker stap voor stap door de eerste weken: documenten tekenen, IT-middelen aanvragen, kennismakingsafspraken plannen.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Business process management / CRUD / interne tooling | Gestructureerd stappenproces |
| UI/UX-complexiteit | Standaard formulieren, lijsten en dashboards | Checklist-achtige portaalervaring |
| Business logic | Eenvoudige regels, goedkeuringen en workflowstappen | Vaste stappenreeks |
| Uniciteit | Veelvoorkomend patroon | Onboarding is expliciet genoemd als standaard low-code-toepassing |
| Strategisch domein | Ja — bedrijfsapp/procesautomatisering | Interne HR-tooling |
| Performance | Standaard enterprise — geen strikte SLA | Geen tijdskritische eis |
| Elasticiteit | Stabiel en bescheiden | Volume gekoppeld aan instroom nieuwe medewerkers |
| Kostenmodel | Capaciteitsmodel past goed | Standaard platformgebruik |
| Integraties | Meerdere integraties met orkestratie | HR-systeem, IT-provisioning, facilitaire zaken |
| Observability | Standaard platformmonitoring volstaat | Geen bijzondere operationele eisen |
| Beveiliging | Standaard enterprise — SSO/RBAC/audit trail | Interne HR-toepassing |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard bedrijfsapplicatie |
| Levensduur | Middellange termijn (2-5 jaar) | Onboarding-flow wordt periodiek vernieuwd |
| Wijzigingsritme | Frequente proceswijzigingen | HR-beleid verandert regelmatig |
| Hergebruik | Enkele gedeelde diensten/UI-componenten | Stappen-engine gedeeld met andere HR-processen |
| Vendor lock-in | Geen aandachtspunt | Passend bij Low-Code |

---

## 12. Tarief- en Verzendkostencalculatie-engine

**Functie:** berekent voor elke zending, ongeacht via welk kanaal (webshop, balie, klantportaal) deze wordt aangeboden, het geldende verzendtarief op basis van gewicht, zone, dienst en kortingen.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Data-heavy met complexe domeinlogica | Tariefregels, zonetabellen, kortingslogica |
| UI/UX-complexiteit | Geen betekenisvolle UI nodig (max. gewogen ×3, geen hard constraint) | Wordt via API aangeroepen door andere systemen |
| Business logic | Complex: domeinalgoritmes of zware berekeningen | Veel samenhangende regels/zone-/kortingstabellen |
| Uniciteit | Sterk onderscheidend of vernieuwend | Nauwkeurige tariefbepaling is een commerciële onderscheidende factor |
| Strategisch domein | Nee — servicelaag/platformcomponent | Puur een rekendienst |
| Performance | Belangrijk en moet expliciet ontworpen worden | Synchroon aangeroepen tijdens checkout |
| Elasticiteit | Kan materieel groeien/variëren | Schaalt mee met e-commerce ordervolume/piekmomenten |
| Kostenmodel | Usage-based nodig | Per-aanroep/per-offerte gedreven |
| Integraties | Meerdere integraties met orkestratie | Aangeroepen door webshop, labelprinten, klantportaal |
| Observability | Diepe logs/metrics/traces/SLO's nodig | Tariffouten hebben direct financiële/klantimpact |
| Beveiliging | Standaard enterprise | Geen bijzondere compliance-eisen op zichzelf |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard API-architectuur |
| Levensduur | Lange termijn strategisch | Kerncapaciteit voor alle verzendkanalen |
| Wijzigingsritme | Langetermijn technische controle en flexibiliteit cruciaal | Tariefwijzigingen vergen zorgvuldige, consistente uitrol |
| Hergebruik | **Kernplatform/gedeelde dienst binnen portfolio** | Expliciet gebruikt door meerdere kanalen/producten |
| Vendor lock-in | Lock-in moet geminimaliseerd worden | Strategisch te belangrijk om vast te zetten |

---

## 13. Publieke Zendingen-API voor Externe Ontwikkelaars

**Functie:** externe partijen (webshops, marktplaatsen, softwareleveranciers) kunnen via een goed gedocumenteerde API zendingen aanmaken, labels genereren en statusinformatie opvragen voor hun eigen klanten.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Real-time, event-driven of high-throughput systeem | Continue, hoogfrequente externe aanroepen |
| UI/UX-complexiteit | Geen betekenisvolle UI nodig (max. gewogen ×3, geen hard constraint) | Zuiver API-product; documentatieportaal is een apart systeem |
| Business logic | Gemiddeld: meerdere beslispunten en integraties | Rate-limiting, quota, scoped-access-logica |
| Uniciteit | Enkele unieke features op standaardpatroon | Publieke verzend-API's zijn een gangbaar patroon, bedrijfsregels zijn eigen |
| Strategisch domein | Nee — servicelaag/platformcomponent/integratiehub | Expliciete platformdienst |
| Performance | Enige verwachtingen, geen harde latency-eis | Redelijke API-responstijd, geen ultra-lage latency-eis |
| Elasticiteit | **Hoog/piekerig — hard constraint** | Extern ontwikkelaarsverkeer is onvoorspelbaar (integratietests, batchpieken) |
| Kostenmodel | Usage-based nodig | Betaald/gemeten per aanroep |
| Integraties | **Volledige middleware-eigenaarschap vereist** | API-gateway, rate-limiting, scoped keys |
| Observability | Diepe logs/metrics/traces/SLO's nodig | Externe SLA-afspraken vereisen sterke bewaking |
| Beveiliging | **Custom cryptografie/zero-trust vereist — hard constraint** | Onderzoek: elke API-aanroep moet continu geauthenticeerd/geautoriseerd worden, scoped keys, sterke cryptografische controls |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard API-gateway-architectuur |
| Levensduur | Lange termijn strategisch | Publieke API is een langjarige commitment naar partners |
| Wijzigingsritme | Langetermijn technische controle en flexibiliteit cruciaal | Versiebeheer/backward compatibility is een serieuze discipline |
| Hergebruik | Kernplatform/gedeelde dienst binnen portfolio | Eén API bedient alle externe partners |
| Vendor lock-in | Lock-in moet geminimaliseerd worden | Strategisch te belangrijk om vast te zetten |

**Bronnen:** zero-trust-eisen voor publieke API's (continue authenticatie/autorisatie, scoped keys, sterke cryptografische controls) zijn direct ontleend aan onderzoek naar API-beveiligingsarchitectuur — zie bronnenlijst.

---

## 14. Management-informatie en Rapportagedashboard

**Functie:** toont het management periodiek bijgewerkte kernindicatoren en trends over de bedrijfsvoering, met de mogelijkheid om door te klikken naar detailniveau.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Data-heavy met complexe domeinlogica | Aggregatie/transformatie van bedrijfsdata |
| UI/UX-complexiteit | Enkele custom widgets op standaardpatroon | Grafieken/pivot-achtige weergaven |
| Business logic | Gemiddeld: meerdere beslispunten en integraties | Data-aggregatie- en transformatielogica |
| Uniciteit | Veelvoorkomend patroon — marktplaatsmodules bestaan | BI-dashboards zijn een breed ondersteund patroon |
| Strategisch domein | Ja — bedrijfsapp/procesautomatisering | Interne beslisondersteuning |
| Performance | Standaard enterprise — geen strikte SLA | Periodieke ververing (dagelijks/uurlijks) volstaat |
| Elasticiteit | Stabiel en bescheiden | Voorspelbaar gebruikspatroon |
| Kostenmodel | Capaciteitsmodel past goed | Standaard platformgebruik |
| Integraties | Meerdere integraties met orkestratie | Datawarehouse/meerdere bronsystemen |
| Observability | Basale operationele inzichten en wat geautomatiseerde tests | Standaard rapportage-monitoring |
| Beveiliging | Branchegereguleerd — GDPR-kritisch | Bevat vaak gevoelige KPI's/persoonsgegevens |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard BI-architectuur |
| Levensduur | Middellange termijn (2-5 jaar) | Dashboards worden periodiek herzien |
| Wijzigingsritme | Snelle initiële levering belangrijker dan technische controle | Management wil snel inzicht, iteratief verbeterd |
| Hergebruik | Enkele gedeelde diensten/UI-componenten | Widgets gedeeld met operationele dashboards |
| Vendor lock-in | Geen aandachtspunt | Passend bij Low-Code/BI-platform |

---

## 15. Voertuig- en Wagenparkmonitoring (IoT Telemetrie)

**Functie:** verzamelt continu locatie-, snelheids- en voertuigstatusdata van het bezorgvoertuigenpark, en biedt hierop analyses voor onderhoud, routebewaking en veiligheid.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Real-time, event-driven of high-throughput systeem | Continue sensordatastroom vanuit het hele wagenpark |
| UI/UX-complexiteit | Enkele custom widgets op standaardpatroon | Wagenpark-kaart/dashboard, matig custom |
| Business logic | Complex: domeinalgoritmes of zware berekeningen | Anomaliedetectie, aggregatie/roll-up van sensordata |
| Uniciteit | Enkele unieke features op standaardpatroon | IoT-platformen zijn een gevestigd patroon, wagenparkregels zijn eigen |
| Strategisch domein | Deels — bedrijfsschermen met technische onderlaag | Operationeel gezicht op zware telemetrie-onderlaag |
| Performance | Belangrijk en moet expliciet ontworpen worden | Near-real-time verwerking van telemetrie |
| Elasticiteit | **Hoog/piekerig — hard constraint** | Onderzoek: miljoenen schrijfacties per seconde bij piekbelasting is een genoemde ontwerprandvoorwaarde |
| Kostenmodel | Usage-based nodig | Ingestievolume stuurt de kosten direct |
| Integraties | Legacy systemen, binaire protocollen of event brokers | Apparaatprotocollen (MQTT) en event-bus-architectuur |
| Observability | Diepe logs/metrics/traces/SLO's nodig | Wagenpark-veiligheid en operationele bewaking |
| Beveiliging | Branchegereguleerd — GDPR-kritisch | Voertuig-/locatiedata, apparaat-identiteit |
| Cloud/infrastructuur | **Edge, embedded of IoT-deployment** | Apparaten in voertuigen, edge-verwerking |
| Levensduur | Lange termijn strategisch | Kerncapaciteit voor wagenparkbeheer |
| Wijzigingsritme | Langetermijn technische controle en flexibiliteit cruciaal | Telemetrie-pijplijn vergt zorgvuldige doorontwikkeling |
| Hergebruik | Kernplatform/gedeelde dienst binnen portfolio | Voedt onderhoud, routeplanning én monitoring |
| Vendor lock-in | Lock-in moet geminimaliseerd worden | Strategische infrastructuur |

**Bronnen:** schaalbaarheidspatronen (event-streaming, elastische opslag, edge-verwerking, miljoenen schrijfacties per seconde) zijn direct ontleend aan onderzoek naar connected-vehicle- en IoT-telemetrie-architecturen — zie bronnenlijst.

---

## 16. Noodstop- en Veiligheidsbesturing Sorteerinstallatie

**Functie:** bewaakt continu de veiligheidscondities van een sorteerinstallatie en brengt de installatie automatisch en direct naar een veilige staat zodra een gevaarlijke situatie wordt gedetecteerd — volledig onafhankelijk van de normale procesbesturing.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Real-time, event-driven of high-throughput systeem | Continue sensorbewaking met directe respons |
| UI/UX-complexiteit | Geen betekenisvolle UI nodig (max. gewogen ×3, geen hard constraint) | De veiligheidslogica zelf heeft geen bedrijfs-UI; een operatorpaneel is apart en minimaal |
| Business logic | Complex: domeinalgoritmes of zware berekeningen | Veiligheidsfuncties (SIF's) per gevarenscenario, elk met een eigen integriteitsniveau |
| Uniciteit | Sterk onderscheidend of vernieuwend | Veiligheidsfuncties worden per installatie en gevarenscenario op maat ontworpen |
| Strategisch domein | Nee — servicelaag/platformcomponent | Losstaande beveiligingslaag, geen bedrijfsapp |
| Performance | **Kritiek voor de oplossing — hard constraint** | Reactietijd is per definitie veiligheidskritisch |
| Elasticiteit | Stabiel en bescheiden | Een veiligheidssysteem "schaalt" niet mee met bedrijfsdrukte — vaste, onafhankelijke regelkring |
| Kostenmodel | Capaciteitsmodel past goed | Vaste, dedicated hardware, niet verbruiksgedreven |
| Integraties | Legacy systemen, binaire protocollen of event brokers | Directe sensor-/actuator-I/O |
| Observability | Diepe logs/metrics/traces/SLO's nodig | Verplichte diagnostiek en periodieke proeftests onder veiligheidsnormen |
| Beveiliging | Kritieke infrastructuur / overheidsniveau-eisen | Veiligheidsinstrumentatie valt onder zware regelgeving (IEC 61508/61511) |
| Cloud/infrastructuur | Edge, embedded of IoT-deployment | Eigen, onafhankelijke hardware met eigen sensoren/actuatoren |
| Levensduur | Lange termijn strategisch | Gecertificeerd voor de levensduur van de installatie (vaak 10+ jaar) |
| Wijzigingsritme | Langetermijn technische controle en flexibiliteit cruciaal | Wijzigingen vereisen formele hercertificering — het tegenovergestelde van snel itereren |
| Hergebruik | Enkele gedeelde diensten/UI-componenten | Patronen hergebruikt, maar elke installatie apart gecertificeerd |
| Vendor lock-in | Lock-in moet geminimaliseerd worden | Strategische voorkeur, al is de praktijk vaak vendor-gebonden aan een gecertificeerd veiligheids-PLC-merk |

**Waarom dit een waardevol testgeval is:** de antwoorden op elasticiteit én kostenmodel zien er op zichzelf "Low-Code-vriendelijk" uit (stabiel, capaciteitsgedreven) — maar de kritieke-performance-hard-constraint overrult dat volledig. Sinds de modelwijziging is "geen UI" hier niet langer een tweede hard constraint (het telt nu zwaar mee in de score, wat bij dit overwegend High-Code-profiel toch tot dezelfde uitkomst leidt), maar de kritieke performance-eis blijft een echte, onvoorwaardelijke Layer 1-blokkade. Nog altijd een goed testgeval om te controleren of Layer 1 daadwerkelijk voorrang krijgt boven de gewogen score, ongeacht hoe de zachtere vragen zijn beantwoord.
**Bronnen:** de onafhankelijke, gecertificeerde architectuur van veiligheidsinstrumentatie (IEC 61508/61511, Safety Instrumented Systems, SIL-niveaus) is direct ontleend aan onderzoek naar functionele veiligheid in industriële automatisering — zie bronnenlijst.

---

## 17. Marketing Campagnebeheer

**Functie:** plant, plant in en beheert marketingcampagnes: doelgroepselectie, contactmomenten via e-mail/sms, en rapportage over respons.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Business process management / CRUD / interne tooling | Campagneplanningsproces |
| UI/UX-complexiteit | Standaard formulieren, lijsten en dashboards | Campagne-overzichten en planningsschermen |
| Business logic | Gemiddeld: meerdere beslispunten en integraties | Doelgroepregels, goedkeuringsstappen |
| Uniciteit | Veelvoorkomend patroon | Campagnebeheer is een gangbaar patroon |
| Strategisch domein | Ja — bedrijfsapp/procesautomatisering | Interne marketingtooling |
| Performance | Standaard enterprise — geen strikte SLA | Geen tijdskritische eis |
| Elasticiteit | Enigszins variabel, standaard schaalbaar op te vangen | Piek rond campagnelanceringen |
| Kostenmodel | Capaciteitsmodel past goed | Standaard platformgebruik |
| Integraties | Meerdere integraties met orkestratie | CRM, e-mail/sms-gateways, analytics |
| Observability | Basale operationele inzichten en wat geautomatiseerde tests | Standaard proces-monitoring |
| Beveiliging | Branchegereguleerd — GDPR-kritisch | Marketingtoestemming/persoonsgegevens |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard bedrijfsapplicatie |
| Levensduur | Middellange termijn (2-5 jaar) | Marketingtooling wordt periodiek vernieuwd |
| Wijzigingsritme | Frequente proceswijzigingen | Campagnestrategie wijzigt regelmatig |
| Hergebruik | Enkele gedeelde diensten/UI-componenten | Componenten gedeeld met andere klantcommunicatie |
| Vendor lock-in | Geen aandachtspunt | Passend bij Low-Code |

---

## 18. Mobiele Bezorgapp voor Bezorgers

**Functie:** begeleidt een bezorger door zijn/haar ronde: toont de volgorde van stops, laat scannen bij ophalen/afleveren, registreert bewijs van bezorging (foto/handtekening) en werkt ook offline door.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Customer-facing product met unieke UX-eisen | UX-kritische, toegespitste mobiele werkstroom voor een specifieke gebruikersgroep |
| UI/UX-complexiteit | Specialistische visualisatie/volledig custom interface (sterk Hybrid-signaal, geen hard constraint) | Scannen, camera, GPS en offline-synchronisatie vragen een genuinely custom mobiele UI — maar de rest van de app (planning, statusschermen) kan prima low-code |
| Business logic | Gemiddeld: meerdere beslispunten en integraties | Bezorgvolgorde, uitzonderingsafhandeling, bewijsregistratie |
| Uniciteit | Enkele unieke features op standaardpatroon | Bezorgapps zijn een bekend patroon, PostNL-workflow is eigen |
| Strategisch domein | Deels — bedrijfsschermen met technische onderlaag | Operationeel bedrijfsproces met zware mobiele techniek eronder |
| Performance | Enige verwachtingen, geen harde latency-eis | Offline-tolerante synchronisatie, geen sub-seconde eis |
| Elasticiteit | Enigszins variabel, standaard schaalbaar op te vangen | Voorspelbaar dagpatroon per dienst |
| Kostenmodel | Gemengd | Backend-verwerking + apparaatgebonden functionaliteit |
| Integraties | Meerdere integraties met orkestratie | Routeplanning, scansystemen, orderstatus |
| Observability | Gemiddelde observability en testdekking nodig | Crash-/synchronisatiemonitoring belangrijk voor veldbetrouwbaarheid |
| Beveiliging | Standaard enterprise — SSO/RBAC/audit trail | Interne, apparaatbeheerde workforce-app |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard backend, native mobiele voorkant |
| Levensduur | Lange termijn strategisch | Kern operationeel hulpmiddel voor de bezorgorganisatie |
| Wijzigingsritme | Snelheid én technische flexibiliteit even belangrijk | Doorlopende verbeteringen in het veld |
| Hergebruik | Kernplatform/gedeelde dienst binnen portfolio | Eén app hergebruikt over regio's/depots |
| Vendor lock-in | Acceptabel voor kern, vermijden voor integratielaag | Koppelvlakken moeten portabel blijven |

**Berekende score:** lc=33, hy=62, hc=30 → **Hybrid**.
**Waarom dit een interessant testgeval is:** vóór de modelwijziging forceerde de gespecialiseerde mobiele UI (scannen/camera/GPS/offline) hier onvoorwaardelijk High-Code, ook al wees de rest van het profiel duidelijk op Hybrid (low-code schil rond een custom scan-/navigatiecomponent — een architectuurpatroon dat in de praktijk heel gangbaar is). Na de wijziging telt deze vraag mee als een sterk Hybrid-signaal in plaats van een geforceerde uitkomst, en komt de aanbeveling nu overeen met wat je functioneel zou verwachten. Dit is dus het testgeval dat de fix zelf demonstreert.

---

## 19. Klantloyaliteitsprogramma en -app

**Functie:** een klant spaart punten bij aankopen/gebruik van diensten, ziet zijn/haar puntensaldo en kan punten inwisselen voor voordelen, in een eigen app/portaal.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Customer-facing product met unieke UX-eisen | Klantbeleving/merkbeleving staat centraal |
| UI/UX-complexiteit | Enkele custom widgets op standaardpatroon | Gebrande loyaliteits-UI, matig custom |
| Business logic | Gemiddeld: meerdere beslispunten en integraties | Puntenberekening, tier-regels, inwisselen |
| Uniciteit | Enkele unieke features op standaardpatroon | Loyaliteitsprogramma's zijn een bekend patroon |
| Strategisch domein | Deels — klantschermen met technische onderlaag | Klantgezicht met transactielogica eronder |
| Performance | Standaard enterprise — geen strikte SLA | Geen tijdskritische eis |
| Elasticiteit | Kan materieel groeien/variëren | Piek bij campagnes (bv. dubbele-punten-acties) |
| Kostenmodel | Gemengd | Vaste basis + campagnegedreven pieken |
| Integraties | Meerdere integraties met orkestratie | Ordersysteem, betaalsysteem, marketingplatform |
| Observability | Gemiddelde observability en testdekking nodig | Puntensaldo-integriteit moet bewaakt worden |
| Beveiliging | Branchegereguleerd — GDPR-kritisch | Persoons-/aankoopdata |
| Cloud/infrastructuur | Managed platformcloud of standaard Kubernetes | Standaard klant-app-architectuur |
| Levensduur | Lange termijn strategisch | Langlopend klantbindingsinstrument |
| Wijzigingsritme | Snelheid én technische flexibiliteit even belangrijk | Regelmatig nieuwe acties/functies |
| Hergebruik | Enkele gedeelde diensten/UI-componenten | Componenten gedeeld met andere klantkanalen |
| Vendor lock-in | Acceptabel voor kern, vermijden voor integratielaag | Klantschil mag platformgebonden zijn, transactiekoppelingen niet |

---

## 20. Legacy Mainframe Ontsluitingslaag

**Functie:** ontsluit data en transacties uit een bestaand mainframesysteem (bijvoorbeeld klant- of ordergegevens) zodat moderne applicaties deze kunnen raadplegen en bijwerken, zonder rechtstreeks op de mainframe te hoeven aansluiten.

| Dimensie | Antwoord | Waarom |
|---|---|---|
| Aard van de applicatie | Data-heavy met complexe domeinlogica | Ontsluiten van complexe legacy-data/transacties |
| UI/UX-complexiteit | Geen betekenisvolle UI nodig (max. gewogen ×3, geen hard constraint) | Pure ontsluitings-/integratielaag, geen eigen UI |
| Business logic | Complex: domeinalgoritmes of zware berekeningen | Protocol-/formaatvertaling, orkestratie van legacy-transacties |
| Uniciteit | Sterk onderscheidend of vernieuwend | Elke legacy-omgeving kent een eigen, historisch gegroeide integratie-uitdaging |
| Strategisch domein | Nee — servicelaag/platformcomponent/integratiehub | Exacte fit |
| Performance | Enige verwachtingen, geen harde latency-eis | Near-real-time via change-data-capture is gangbaar, geen sub-seconde eis |
| Elasticiteit | Enigszins variabel, standaard schaalbaar op te vangen | Volgt de vraag vanuit de moderne consumerende applicaties |
| Kostenmodel | Gemengd | Mainframe-capaciteitskosten + moderne, verbruiksgedreven consumenten |
| Integraties | **Legacy systemen, binaire protocollen of event brokers** | Onderzoek: sterk gekoppelde, complexe middleware en sterk uiteenlopende talen/aanpakken |
| Observability | Diepe logs/metrics/traces/SLO's nodig | Kritieke legacy-transacties vereisen sterke bewaking |
| Beveiliging | Branchegereguleerd — GDPR-kritisch | Vaak kernfinanciële/klantgegevens |
| Cloud/infrastructuur | On-premise met strikte infrastructuurrestricties | Mainframe blijft doorgaans on-premise, ook als de ontsluitingslaag moderniseert |
| Levensduur | Lange termijn strategisch | Legacy-omgevingen blijven vaak nog jarenlang bestaan tijdens gefaseerde modernisering |
| Wijzigingsritme | Langetermijn technische controle en flexibiliteit cruciaal | Zorgvuldige, risicomijdende wijzigingsdiscipline vereist |
| Hergebruik | Kernplatform/gedeelde dienst binnen portfolio | Veel moderne applicaties leunen op deze ene ontsluitingslaag |
| Vendor lock-in | Lock-in moet geminimaliseerd worden | Doel is juist het verminderen van mainframe-afhankelijkheid op termijn |

**Bronnen:** de karakteristieke uitdagingen van mainframe-integratie (hechte koppeling, complexe middleware, uiteenlopende technologieën, change-data-capture als moderne aanpak) zijn direct ontleend aan onderzoek naar mainframe-modernisering — zie bronnenlijst.

---

## Bronnen

- [A Cloud-Native Architecture For Real-Time Courier Tracking](https://tijer.org/jnrid/papers/JNRID2411010.pdf)
- [Real-Time Order Tracking System Architecture — Medium](https://medium.com/@myjob.rajesh/real-time-order-tracking-system-architecture-70a98e660906)
- [Parcel Management System Architecture — GoLinuxCloud](https://www.golinuxcloud.com/parcel-management-system-architecture/)
- [Real-Time Shipment Tracking: Architecture and Implementation — abemon](https://abemon.es/en/insights/real-time-shipment-tracking-architecture)
- [Warehouse Control System — Cubework Glossary](https://www.cubework.com/glossary/warehouse-control-system)
- [Design of Warehouse Control System for Real Time Management — ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2405896315005273)
- [Warehouse control system — Wikipedia](https://en.wikipedia.org/wiki/Warehouse_control_system)
- [Essential Components of a Warehouse Control System (WCS) — Control.com](https://control.com/technical-articles/Essential-Components-of-a-Warehouse-Control-System-WCS/)
- [Fraud Detection Architecture With Real-Time Intelligence — Microsoft Learn](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/architectures/fraud-detection)
- [Real-time transaction fraud detection — Nussknacker](https://nussknacker.io/blog/real-time-transaction-fraud-detection/)
- [AI fraud detection: How to build real-time systems that adapt — Redis](https://redis.io/blog/ai-fraud-detection-real-time-intelligence/)
- [Real-Time Fraud Detection Architecture: Where Coherence Breaks — Tacnode](https://tacnode.io/post/real-time-fraud-detection-architecture)
- [A Reference Architecture for Real-Time Fraud Detection — Materialize (whitepaper)](https://landing.materialize.com/hubfs/whitepapers/2024/a_reference_architetcture_for_real-time_fraud_detection.pdf)
- [The Evolution from EDI to Modern B2B Integration — SEEBURGER](https://blog.seeburger.com/the-evolution-from-edi-to-modern-b2b-integration/)
- [B2B EDI Integration Platform for Faster Partner Onboarding — Adeptia](https://www.adeptia.com/blog/b2b-edi-integration-best-practices)
- [B2B EDI Integration Best Practices Guide — Cleo](https://www.cleo.com/blog/best-practices-for-B2B-EDI-Integration)
- [EDI and B2B Integration for Logistics and Transportation — Remedi](https://www.remedi.com/edi-and-b2b-integration-for-logistics-and-transportation)
- [Zero Trust API Security: What It Is and Why It Matters — Cequence](https://www.cequence.ai/blog/api-security/zero-trust-api-security-model/)
- [The Practical Guide to Zero-Trust for APIs — Traceable](https://www.traceable.ai/blog-post/the-practical-guide-to-zero-trust-for-apis)
- [Zero-Trust Identity for API Gateways: A Developer's Guide — Didit](https://didit.me/blog/zero-trust-identity-api-gateways-developer-guide/)
- [API Gateway Security in Zero Trust — Jimber](https://jimber.io/blog/api-gateway-security-zero-trust-2026/)
- [IoT Sensor and Telemetry Data Analysis with Apache Druid — Imply](https://imply.io/whitepapers/iot-sensor-telemetry-data-analysis-apache-druid/)
- [AWS Connected Vehicle Reference Architecture](https://docs.aws.amazon.com/architecture-diagrams/latest/aws-connected-vehicle/aws-connected-vehicle.html)
- [Building a Real-Time Telemetry Platform for Ride-Hailing Services — Medium](https://sanchezsanchezsergio418.medium.com/building-a-real-time-telemetry-platform-for-ride-hailing-services-with-iot-and-big-data-53d09a1a80da)
- [Building and Modernizing Connected Vehicle platforms with AWS IoT](https://aws.amazon.com/blogs/iot/modernizing-connected-vehicle-platforms-with-aws-iot/)
- [How Do Chatbots Work? — DevRev](https://devrev.ai/blog/how-do-chatbots-work)
- [Chatbot Architecture | Engati](https://www.engati.ai/glossary/chatbot-architecture)
- [Understanding Chatbots and Natural Language Processing — SmythOS](https://smythos.com/ai-agents/chatbots/chatbots-and-natural-language-processing/)
- [A Comprehensive Guide to Low-Code Automation — Appsmith](https://www.appsmith.com/blog/low-code-automation)
- [10 Types of Applications You Can Create with Low-Code — AgilePoint](https://www.agilepoint.com/blog-post/low-code-application-examples)
- [5 Low-Code Examples and Use Cases — Appian](https://appian.com/blog/acp/low-code/low-code-examples)
- [9 Practical Low-Code Automation Use Cases — Pulpstream](https://pulpstream.com/resources/blog/low-code-automation)
- [Legacy Mainframe Modernization: A Complete Guide — Quinnox](https://www.quinnox.com/blogs/legacy-mainframe-modernization/)
- [What is mainframe modernization? — IBM](https://www.ibm.com/think/topics/mainframe-modernization)
- [Legacy Modernization: Architecting Real-Time Systems around a Mainframe — InfoQ](https://www.infoq.com/articles/architecting-real-time-systems-around-mainframe/)
- [Mainframe Modernization - Legacy API Integration — OpenLegacy](https://www.openlegacy.com/solutions/technology/mainframe-modernization)
- [Functional Safety in Industrial Manufacturing: IEC 61508, ISO 13849, IEC 10218 — Jama Software](https://www.jamasoftware.com/blog/2025/04/10/functional-safety-in-industrial-manufacturing-navigating-iec-61508-iso-13849-iec-10218-for-safer-smarter-operations/)
- [IEC 61511 — Wikipedia](https://en.wikipedia.org/wiki/IEC_61511)
- [Safety instrumented system — Wikipedia](https://en.wikipedia.org/wiki/Safety_instrumented_system)
- [How to create comprehensive automation safety for process industries — Control Engineering](https://www.controleng.com/how-to-create-comprehensive-automation-safety-for-process-industries/)
- [Functional Safety: Getting Safety Requirements Right — Intertek](https://www.intertek.com/blog/2026/07-08-functional-safety-getting-safety-requirements-right/)
