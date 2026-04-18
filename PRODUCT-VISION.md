# Product Vision — OpenSIN-AI

> **Stand:** 2026-04-18.
> **Zweck dieses Dokuments:** Wohin OpenSIN-AI geht und wie die 200 Repos zusammen ein einziges Produkt ergeben. Für neue Menschen und Agenten, die in 5 Minuten das große Bild brauchen. Für den aktuellen Ist-Zustand siehe [STATE-OF-THE-UNION.md](./STATE-OF-THE-UNION.md).

## Der Pitch in einem Satz

**OpenSIN ist das Agent-Betriebssystem, das in Teams organisierte Agenten, persistenten Gedächtnis-Daemon und einen modularen Marktplatz in einem Open-Source-Kern und einer bezahlten Cloud-Schicht zusammenführt — statt, wie OpenCode, Claude Code, Manus AI oder Google Jules, einen einzelnen isolierten Agenten anzubieten.**

Wenn der Satz zu lang ist: **"Agent OS, nicht Agent App."**

---

## Das 3-Tier-Modell

Drei Tiers. Jedes Tier hat einen klaren URL, einen klaren Kunden, eine klare Value-Prop.

### Tier 1 — OpenSIN (Free, Open Source)

- **URL:** [opensin.ai](https://opensin.ai) (Marketing) + [github.com/OpenSIN-AI](https://github.com/OpenSIN-AI) (Code) + [docs.opensin.ai](https://docs.opensin.ai) (Docs)
- **Zielgruppe:** Developer, Tinkerer, OSS-Enthusiasten, Security-Researcher
- **Value:**
  - Vollständiger `OpenSIN` Core (Python, 310+ packages) — lokal klonbar, lokal ausführbar
  - `OpenSIN-Code` autonomous CLI — wie Claude Code / OpenCode, nur mit Multi-Agent-Koordination und persistent memory
  - `Infra-SIN-OpenCode-Stack` — kanonische OpenCode-Konfiguration mit 44 Skills, 27 MCPs, 5 Providern
  - `Infra-SIN-Global-Brain` (PCPM v4) — persistenter Agent-Speicher, lokal betreibbar
  - Zugriff auf den gesamten A2A-SIN-* Fleet als Blaupausen — jeder kann eigene Agenten klonen
- **Preis:** 0
- **Betriebsmodell:** User läuft es auf eigener Hardware, mit eigenen API-Keys

### Tier 2 — My.OpenSIN (Paid Subscription)

- **URL:** [my.opensin.ai](https://my.opensin.ai) (Marketing + Checkout) → [chat.opensin.ai](https://chat.opensin.ai) (Authenticated App)
- **Zielgruppe:** Solo-Founder, kleine Teams, Professionals die keinen Bock auf Self-Hosting haben
- **Value:**
  - **Gehostete Agent-Flotte** — User bekommt seinen eigenen Tenant mit 24/7 laufenden Agenten
  - **Pre-konfigurierte API-Keys** — OpenAI, Anthropic, Google, xAI, Groq inklusive, User muss keine eigenen Keys managen
  - **Premium-Dashboard** — fleet health, Budget-Tracking, Agent-Logs, PCPM-Memory-Browser
  - **SLA + Support** — Discord-Priority-Channel, Incident-Response
  - **Cloud-PCPM** — persistent memory das zwischen allen Sessions des Users synchronisiert
- **Preis:** Monatliches Abo (z. B. €29/mo Starter, €99/mo Pro, custom Enterprise — finale Preise setzt `Biz-SIN-Marketing`)
- **Betriebsmodell:** OpenSIN hostet, User zahlt per Stripe

### Tier 3 — Marketplace (Add-on Mini-Abos auf Tier 2)

- **URL:** `my.opensin.ai/marketplace/` (Browse/Buy) → in `chat.opensin.ai` freigeschaltet
- **Zielgruppe:** Pro-User aus Tier 2, die spezifische Kapazitäten brauchen (z. B. TikTok-Shop-Automation, Patent-Recherche, Cyber-Security-Red-Team)
- **Value:**
  - Modulare **Team-Bundles** — z. B. `Team-SIN-Apple` (alle 12 Apple-Integrations), `Team-SIN-Commerce` (TikTok-Shop + Shop-Finance + Shop-Logistic), `Team-SIN-Media-Music` (Musik-Produktions-Pipeline)
  - Jedes Bundle ist als **separates Mini-Abo** buchbar (z. B. +€9/mo für `Team-SIN-Apple`)
  - User kann Bundles ein- und ausschalten ohne Basis-Abo zu wechseln
- **Preis:** Mini-Abos zusätzlich zur Tier-2-Base
- **Betriebsmodell:** Marketplace-Katalog rendert aus `oh-my-sin.json` (canonical team manifest in `Infra-SIN-OpenCode-Stack`), jedes Bundle ist ein Stripe-Add-on-Product

---

## UI-Schichtung (4 Oberflächen, 4 Rollen)

Das ist die **Entscheidung**, die nach [STATE-OF-THE-UNION.md § 1](./STATE-OF-THE-UNION.md#1-rollen-overlap-zwischen-myopensinai-und-opensin-webapp) getroffen werden muss.

**Empfohlene Trennung (strikt durchgezogen):**

| Repo | Domain | Rolle | Auth | Payment |
|---|---|---|---|---|
| `website-opensin.ai` | opensin.ai | **Marketing für OSS** — "Clone repo, run locally, join Discord" | keine | keine |
| `OpenSIN-documentation` | docs.opensin.ai | **Dokumentation** (Docusaurus) | keine | keine |
| `website-my.opensin.ai` | my.opensin.ai | **Marketing für Paid + Marketplace-Katalog + Stripe-Checkout** — "Buy Pro / Browse Teams / Redirect nach Kauf auf chat.opensin.ai" | keine (außer Session nach Kauf) | Stripe Checkout |
| `OpenSIN-WebApp` | chat.opensin.ai | **Authenticated Dashboard** — fleet management, API keys, PCPM memory browser, billing portal | Supabase Auth (required) | Stripe Customer Portal (upgrade/downgrade) |

**Warum diese Trennung:**

- `my.opensin.ai` ist **Vor-dem-Login** — Marketing + Commerce. Das ist klassisches "Funnel-Design". Unauthenticated User sehen hier Preise, kaufen hier.
- `chat.opensin.ai` ist **Nach-dem-Login** — das eigentliche Produkt. Kein Marketing mehr, nur noch das Tool.
- Beide dürfen Stripe-APIs anfassen, aber mit unterschiedlichen Rollen: `my.opensin.ai` macht **Checkout** (neu zahlen), `chat.opensin.ai` macht **Customer Portal** (bestehendes Abo managen).

**Action-Items** (werden in neuen Tracking-Issues angelegt):

1. README von `website-my.opensin.ai` präzisieren: Marketing + Checkout, **nicht** "User loggen sich ein". Der Login-Button auf my.opensin.ai redirectet auf `chat.opensin.ai`.
2. README von `OpenSIN-WebApp` präzisieren: Dashboard at chat.opensin.ai, **nicht** Marketing. Keine Landing-Page-Copy hier.
3. Beide READMEs deep-linken zu **diesem** Dokument als Single-Source-of-Truth für die Rolle.

---

## Marketplace — der Entscheidungspunkt

**Frage:** Sind `Team-SIN-*` Repos Code-Pakete oder Metadata-Manifeste?

**Evidenz (siehe [STATE-OF-THE-UNION.md § Team-SIN-*](./STATE-OF-THE-UNION.md#team-sin-----17-team-repos)):** Alle 17 sind 26-35 kb groß. Das ist zu wenig für echten Code, zu viel für reine Metadata.

**Zwei valide Architekturen — eine muss gewählt werden:**

### Option A — Teams sind Metadata-Manifeste (empfohlen)

- Jedes `Team-SIN-*`-Repo enthält nur `team.json`, `README.md`, `pricing.json`, ggf. Marketing-Assets (screenshots, demo-gif)
- Die **Agenten selbst** liegen in `A2A-SIN-*` Repos (was sie schon tun)
- `team.json` listet auf, welche A2A-Agenten zum Team gehören + welche Permissions + welche Rate-Limits
- Der Marketplace rendert aus `team.json` die Produktseite, Stripe-Kauf schaltet die Agent-IDs in `chat.opensin.ai` frei
- Die heutigen 30-35 kb sind vermutlich Scaffold, der normalisiert werden muss (zB. Scaffold-Code entfernen, saubere `team.json` bauen)

**Vorteile:** Keine Code-Duplikation. Ein Agent wird genau einmal geschrieben. Team-Änderungen sind ein JSON-Edit. Neue Bundles in Minuten, nicht Tagen.

**Nachteile:** Die "Team"-Repos haben wenig Eigensubstanz. Man könnte argumentieren, sie gehören als Ordner in ein einziges `OpenSIN-Marketplace`-Monorepo.

### Option B — Teams sind echte Code-Pakete

- Jedes `Team-SIN-*`-Repo enthält ein Python-Package, das die Agenten importiert, konfiguriert, orchestriert
- Der Marketplace verkauft `pip install opensin-team-apple`
- User kann das Team auch **offline / on-prem** nutzen, nicht nur in `chat.opensin.ai`

**Vorteile:** Käufer bekommt echten Code. Funktioniert auch ohne Tier-2-Cloud.

**Nachteile:** Teams duplizieren was A2A-Agenten schon tun. Wartungsaufwand explodiert.

### Empfehlung: **Option A**

Option A passt zum OSS-Versprechen (Code ist offen, Komposition ist kommerziell), ist schneller iterierbar, und erklärt die heutige Repo-Größe besser.

**Konsequenz:**

1. Schema für `team.json` definieren (agents-list, pricing, permissions, default-budget)
2. Canonical location entscheiden:
   - **Empfohlen:** das schon-existierende `oh-my-sin.json` in `Infra-SIN-OpenCode-Stack` ist die SSOT-Registry aller Teams. Die 17 `Team-SIN-*` Repos werden zu "Marketing-Shells" (1-Page-README + pricing.json), die ihre Agent-Liste aus `oh-my-sin.json` referenzieren.
   - **Alternative:** einzelne `team.json` pro Team-Repo, aggregiert in `oh-my-sin.json` via CI.
3. Marketplace-Frontend (in `website-my.opensin.ai/marketplace/`) rendert aus der Registry.

---

## Kompetitive Positionierung

Gegen jede realistische Konkurrenz. Kein Wunschdenken, keine Marketing-Lügen.

### vs. Claude Code / Cursor / OpenCode

**Was die tun:** Einzelner Coding-Agent im Editor. Session-basiert. Kein Team-Konzept. Kein persistentes Gedächtnis zwischen Sessions (Ausnahme: Claude Memory ist seit 2026 beta, aber vendor-locked).

**OpenSIN-Differenzierung:**
- **Multi-Agent native** — `OpenSIN-Code` startet Agent-Teams, nicht einzelne Prompts
- **PCPM v4** — persistentes Memory zwischen Sessions, zwischen Agenten, local oder cloud
- **OSS-Kern** — User kann das ganze System klonen, anpassen, self-hosten. Claude Code kann man nicht self-hosten.
- **Nicht nur Coding** — der gleiche Kern fährt 109 Platform-Integrationen, nicht nur Git

### vs. Manus AI

**Was sie tun:** General-purpose autonomous agent. Closed-source, Cloud-only, Preis nach Credits. Seit 2025 viel Hype.

**OpenSIN-Differenzierung:**
- **Open-Source-Kern** — Manus ist eine Black-Box, OpenSIN ist ein Repo das jeder klonen kann
- **Teams statt Einzelagent** — Manus ist ein Agent der alles kann, OpenSIN ist ein Orchestrator der spezialisierte Agenten dirigiert
- **Transparente Billing** — OpenSIN Pro hat klare Flat-Rates und Add-on-Mini-Abos; Manus hat intransparente Credit-Konsumption
- **Self-hostable für Privacy** — Enterprises mit Compliance-Pflichten können OpenSIN on-prem fahren, Manus nicht

### vs. Google Jules / OpenAI Agents / Anthropic Computer Use

**Was sie tun:** Einzelagent als Feature ihrer Foundation-Model-Plattform. Vendor-locked.

**OpenSIN-Differenzierung:**
- **Model-agnostisch via AI Gateway** — OpenSIN nutzt 5 Provider zero-config, User ist nie vendor-locked
- **Cross-vendor Workflows** — Agent A läuft auf Claude Opus, Agent B auf GPT-5, Agent C auf Gemini Flash, alle koordinieren über PCPM
- **Community-Fleet** — 109 Platform-Agents als OSS-Repos, die die Community erweitern kann; die geschlossenen Systeme sind vendor-definierte Feature-Listen

### Die eine Sache, die OpenSIN uniquely macht

**"The only OSS agent system that (a) organizes agents into teams, (b) has persistent cross-session memory, (c) has a real tiered business model, (d) speaks to 100+ real-world platforms — in one repo you can `git clone`."**

Wenn du das in einer Slide an einen Investor zeigst, gibt es heute (April 2026) kein System das alle vier Kästchen ankreuzt. Das ist der moat.

---

## Was das heißt für neue Agenten und Menschen

Wenn du in die Org kommst — egal ob als Mensch oder als A2A-Agent:

1. **Lies [START-HERE.md](./START-HERE.md)** (60 Sekunden, Repo-Routing)
2. **Lies dieses Dokument** (5 Minuten, Produktverständnis)
3. **Lies [STATE-OF-THE-UNION.md](./STATE-OF-THE-UNION.md)** (5 Minuten, Realitäts-Check: was ist gut, was ist kaputt)
4. **Lies [docs/CANONICAL-REPOS.md](./docs/CANONICAL-REPOS.md)** nur wenn du gleich Code änderst (wo committet man was)
5. **Lies [docs/FOLLOWUPS.md](./docs/FOLLOWUPS.md)** nur wenn du dich an einer bestimmten Aufgabe beteiligen willst

Jede Entscheidung die dem Dreier-Tier-Modell (OSS / Pro / Marketplace) widerspricht, muss hier begründet werden. Jede Entscheidung die die UI-Schichtung (opensin.ai vs my.opensin.ai vs chat.opensin.ai vs docs.opensin.ai) verwischt, ist ein Rollback.

---

## Offene strategische Entscheidungen (Prio-1)

Diese 5 müssen vor der nächsten Marketing-Push-Welle geklärt sein:

1. **UI-Schichtung final festnageln** (oben skizziert, braucht Approval) — blockt Marketplace-Release
2. **Marketplace-Mechanik final festnageln** (Option A vs B oben, empfohlen: A) — blockt Team-SIN-* Cleanup
3. **`OpenSIN-backend` vs `Core-SIN-Control-Plane`** — zwei "Control Planes", Naming muss disambiguiert werden
4. **Team-SIN-Code-Core Größe** — 57 kb nach Wave-1-Konsolidierung ist verdächtig. Prüfen ob die Absorption Code verloren hat
5. **Tote + Scaffold-Repos** — 4 null-kb + 6 9-kb + 17 Team-Scaffolds. Audit-Skript bauen, dann entscheiden

Jede dieser 5 Entscheidungen ist ein "1-Doc + 1-PR"-Umfang, nicht "1-Sprint". In 5-6 Tagen konzentrierter Arbeit durch.

---

Nach dieser Schicht wird die Org kohärent — und dann kann OpenSIN-AI ehrlich gegen Manus, OpenCode und Google Agents antreten. Vorher ist es ein Repo-Friedhof mit einem guten Kern.
