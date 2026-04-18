# State of the Union — OpenSIN-AI

> **Stand:** 2026-04-18, nach Wave 3 Consolidation.
> **Zweck dieses Dokuments:** Ein ehrlicher Lagebericht. Nicht Marketing, nicht Wunschdenken. Was existiert wirklich, was läuft, was ist tot, was ist kaputt. Wer schnell wissen will wohin es geht, liest [PRODUCT-VISION.md](./PRODUCT-VISION.md). Wer wissen will was zu tun ist, liest [docs/FOLLOWUPS.md](./docs/FOLLOWUPS.md) + dieses Dokument.

## TL;DR

Die Org hat **200 Repositories**. Sie zerfällt in drei Kategorien:

- **Der Kern ist real und substantiell** — 4 canonical Code-Repos + 3 Infra-Repos haben echten, aktiv gewarteten Code (836 MB OpenSIN, 975 MB OpenSIN-backend, 366 MB OpenSIN-Code).
- **Das Business-Narrativ hat ein Loch** — die Websites und der Marketplace sind konzeptionell doppelt besetzt. `website-my.opensin.ai` und `OpenSIN-WebApp` behaupten beide dieselbe Rolle ("User login, Billing, API keys"). Das muss entschieden werden.
- **Die Peripherie ist ein Friedhof mit Leuchttürmen** — von 109 A2A-SIN-*-Repos sind einige groß und real (Discord 25 MB, X-Twitter 26 MB, MiroFish 6.7 MB), viele mittel (Marketing-Agents 100-170 kb), aber mindestens **4 sind komplett leer** (0 kb) und **17 Team-SIN-*-Repos** sind Scaffolds von 26-35 kb. Das sind keine Agenten — das sind Platzhalter mit Repo-URL.

Das Gute: der Kern trägt. Das Schlechte: du wirst nie das "weltbeste Agentensystem" bauen, solange 70% deiner Repos Scaffolds sind die so aussehen als wäre da Code. Entweder ausbauen oder wegschmeißen.

---

## Der Kern — was wirklich existiert und läuft

### Code-Engine (4 canonical repos)

| Repo | Sichtbarkeit | Größe | Sprache | Beschreibung | Lebenszeichen |
|---|---|---|---|---|---|
| [OpenSIN](https://github.com/OpenSIN-AI/OpenSIN) | Public | 836 MB | Python | "Core — 310+ packages across 25+ domains" | aktiv, letzter push 2026-04-18 |
| [OpenSIN-Code](https://github.com/OpenSIN-AI/OpenSIN-Code) | Public | 366 MB | TypeScript | "The autonomous OpenSIN-Code CLI" | aktiv, letzter push 2026-04-18 |
| [OpenSIN-backend](https://github.com/OpenSIN-AI/OpenSIN-backend) | Private | 975 MB | TypeScript | "Backend and A2A fleet control plane" | aktiv, letzter push 2026-04-18 |
| [Team-SIN-Code-Core](https://github.com/OpenSIN-AI/Team-SIN-Code-Core) | Private | **57 kb** | TypeScript | Post-Wave-1 Monorepo für Coding-Agenten | **Problem:** 57 kb ist nach einer "Konsolidierung von 3 Repos" viel zu wenig. Entweder die Wave-1-Absorption hat Code verloren oder das Monorepo ist nur ein Skelett |

**Status:** 3 von 4 tragen echten Code. Team-SIN-Code-Core ist verdächtig klein — [OpenSIN-overview#34](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/34) bzw. neue Untersuchung nötig.

### Infrastructure (3 canonical repos)

| Repo | Sichtbarkeit | Größe | Rolle |
|---|---|---|---|
| [Infra-SIN-OpenCode-Stack](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) | Public | 3.8 MB | Kanonische OpenCode-Config, `sin-sync`-Target |
| [Infra-SIN-Global-Brain](https://github.com/OpenSIN-AI/Infra-SIN-Global-Brain) | Public | 788 kb | PCPM v4 — Persistent Agent Memory |
| [Infra-SIN-Dev-Setup](https://github.com/OpenSIN-AI/Infra-SIN-Dev-Setup) | Public | 149 kb | Dev-Environment Setup + User-Onboarding |

**Status:** Alle 3 real. PCPM v4 ist echte Differenzierung — kein anderes OSS-Agentensystem hat persistenten Cross-Session-Speicher.

### UI-Layer (4 Web-Repos) — **Rollenkonflikt**

| Repo | Domain | Größe | Was die GitHub-Description sagt | Was die README sagt |
|---|---|---|---|---|
| [website-opensin.ai](https://github.com/OpenSIN-AI/website-opensin.ai) | opensin.ai | 765 kb | "Webseite für unsere OpenSIN Open-Source Version" | (Marketing für OSS) |
| [website-my.opensin.ai](https://github.com/OpenSIN-AI/website-my.opensin.ai) | my.opensin.ai | 2 MB | "User loggen sich ein, verwalten ihre Cloud-Agenten, hinterlegen ihre Kreditkarte und holen sich ihre API-Keys" | "Premium marketplace website for the MyOpenSIN subscription layer. Marketplace for modular paid teams" |
| [OpenSIN-WebApp](https://github.com/OpenSIN-AI/OpenSIN-WebApp) | chat.opensin.ai | 59 MB | "Authenticated dashboard web app at chat.opensin.ai — login, agent fleet management, billing, API keys. Next.js 16 + Supabase. Paid layer" | (nicht geprüft) |
| [OpenSIN-documentation](https://github.com/OpenSIN-AI/OpenSIN-documentation) | docs.opensin.ai | 50 MB | "Official documentation" | (Docusaurus) |

**Das Problem:** `website-my.opensin.ai` UND `OpenSIN-WebApp` behaupten beide die Rolle "User-Login + Billing + Kreditkarte". Einer von beiden muss Marketing-Only sein. Die logische Trennung wäre:

- `my.opensin.ai` = **Marketing + Checkout-Funnel** (unauthentifiziert, Stripe Checkout, "Buy Pro")
- `chat.opensin.ai` (OpenSIN-WebApp) = **Authenticated App** (eingeloggte User, Agent-Fleet, API-Keys)

Aber die heutige README von my.opensin.ai beschreibt sich als Login-Portal. Das muss geklärt und dokumentiert werden.

**Zusätzliches Problem:** Die my.opensin.ai README referenziert noch die alte `Delqhi/upgraded-opencode-stack` URL. L1-Link-Sweep ist unvollständig.

### Meta / Governance (2 canonical repos)

| Repo | Rolle | Status |
|---|---|---|
| [OpenSIN-overview](https://github.com/OpenSIN-AI/OpenSIN-overview) | SSOT für Struktur, Routing, Vision (= dieses Repo) | gesund, aktiv gepflegt |
| [OpenSIN-documentation](https://github.com/OpenSIN-AI/OpenSIN-documentation) | Public-facing Docusaurus @ docs.opensin.ai | aktiv, 50 MB |

---

## Die Peripherie — A2A-Fleet + Teams (126 Repos)

### A2A-SIN-* — 109 Platform-Integration-Agenten

Realität nach `gh repo list`-Audit:

- **Substantiell (> 100 kb)** — echte Implementierung vermutet:
  - `A2A-SIN-Discord` (25.8 MB), `A2A-SIN-X-Twitter` (26.1 MB) — beide Flaggschiff-Platforms
  - `A2A-SIN-MiroFish` (6.7 MB) — Swarm Intelligence Prediction Engine
  - `A2A-SIN-Worker-heypiggy` (586 kb), `A2A-SIN-Worker-Prolific` (224 kb) — Marketplace-Worker
  - 11 Marketing-Agents (Telegram, LinkedIn, HackerNews, etc.) mit je 100-170 kb
  - `A2A-SIN-IndieHackers` (172 kb), `A2A-SIN-Quora` (133 kb), `A2A-SIN-StackOverflow` (130 kb)
- **Mittel (30-100 kb)** — wahrscheinlich Agent-Scaffold + etwas Integration: ~60 Repos
- **Klein (< 30 kb)** — verdächtig, wahrscheinlich nur Boilerplate:
  - `A2A-SIN-Code-Backend`, `-Command`, `-Frontend`, `-Fullstack`, `-Plugin`, `-Tool` — alle genau 9-10 kb, alle mit derselben generischen Beschreibung "A2A Cloud Coder Agent —". Das sind 6 praktisch identische leere Shells.
  - `A2A-SIN-Team-MyCompany` (12 kb)
- **Tote Repos (0 kb, archived=false):**
  - `A2A-SIN-Facebook`
  - `A2A-SIN-Mattermost`
  - `A2A-SIN-RocketChat`
  - `A2A-SIN-Slack`
  
  → Diese 4 sind mit identischer Pattern-Description ("OpenSIN AI Agent for X platform integration") angelegt und dann nie befüllt worden. Entweder löschen oder einen Template-Commit landen.

**Empfehlung:** Automatisierter Audit (neues Skript in `scripts/`), der für jedes `A2A-SIN-*`-Repo zählt: LOC, letzte aussagekräftige Commit-Message (nicht "chore: scaffold"), ob ein `main.py`/`index.ts`-Entry-Point existiert. Ergebnis: 3 Klassen (`alive`, `scaffold`, `dead`). Dead-Repos archivieren, Scaffold-Repos entweder priorisieren oder ebenfalls archivieren. Ein Repo das niemand anfasst ist Lärm.

### Team-SIN-* — 17 "Team"-Repos

| Repo | Größe | Deutung |
|---|---|---|
| `Team-SIN-Code-Core` | 57 kb | Wave-1 Monorepo — suspekt klein |
| `Team-SIN-Apple` | 35 kb | Scaffold |
| `Team-SIN-Code-Backend` | 34 kb | Scaffold |
| `Team-SIN-Google` | 34 kb | Scaffold |
| `Team-SIN-Media-ComfyUI` | 34 kb | Scaffold |
| `Team-SIN-Code-CyberSec` | 34 kb | Scaffold |
| `Team-SIN-Commerce` | 33 kb | Scaffold |
| `Team-SIN-Code-Frontend` | 33 kb | Scaffold |
| `Team-SIN-Infrastructure` | 33 kb | Scaffold |
| `Team-SIN-Media-Music` | 33 kb | Scaffold |
| `Team-SIN-Messaging` | 33 kb | Scaffold |
| `Team-SIN-Forum` | 32 kb | Scaffold |
| `Team-SIN-Social` | 32 kb | Scaffold |
| `Team-SIN-Legal` | 31 kb | Scaffold |
| `Team-SIN-Research` | 30 kb | Scaffold |
| `Team-SIN-Microsoft` | 30 kb | Scaffold |
| `Team-SIN-Community` | 26 kb | Scaffold |

**Das ist der Elefant im Raum.** Die 17 Team-SIN-Repos sind laut Konzept die "Marketplace-Bundles" die im Pro/Marketplace-Tier verkauft werden sollen — aber keines davon hat echten Code. Es sind Marker-Repos.

Zwei Szenarien:
1. **Legitim:** Teams sind **Metadata-Repos** — sie referenzieren welche A2A-Agenten zusammengehören, die eigentliche Implementierung liegt in den A2A-SIN-*. Dann brauchen sie je ein `team.json` + README, nicht 30 kb generischen Code.
2. **Kaputt:** Teams waren als echte Code-Pakete gedacht, wurden aber nie implementiert. Dann ist das Marketplace-Versprechen leer.

**Empfehlung:** Eine Design-Entscheidung treffen (siehe [PRODUCT-VISION.md § Marketplace](./PRODUCT-VISION.md#marketplace-der-entscheidungspunkt)) und dokumentieren. Dann die 17 Repos entsprechend behandeln (entweder als Metadata-Manifeste normalisieren oder als Scaffolds archivieren).

### Biz-SIN-* — 7 Business-Ops-Repos

Alle real, alle aktiv gepflegt, alle mit klarer Rolle:

- `Biz-SIN-Marketing` (7.3 MB) — Marketing & Release Strategy
- `Biz-SIN-Patents` (2.4 MB) — Patent Portfolio
- `Biz-SIN-Blog-Posts` (495 kb) — Blog-Content
- `Biz-SIN-Blueprints` (92 kb) — Product Blueprints
- `Biz-SIN-Jobs` (88 kb) — Career-Board
- `Biz-SIN-Competitor-Tracker` (47 kb) — Competitive Research
- `Biz-SIN-Ledger` (34 kb) — A2A-Fleet Activity Log

**Status:** Gesund. Keine Action nötig.

### Core-SIN-* — 1 Repo

- `Core-SIN-Control-Plane` (166 kb) — "Shared Doctor/Preflight/Eval layer for SIN-Solver"

**Status:** Existiert, aber unklar wie es sich zu `OpenSIN-backend` (dem anderen "Control Plane") verhält. Naming-Kollision. Gehört geklärt: sind das zwei Ebenen (dev-time control plane vs. runtime control plane)? Oder ist das Legacy?

### Template-SIN-* — 4 Repos

Für das Klonen neuer Agenten. [Template-SIN-Agent#156](https://github.com/OpenSIN-AI/Template-SIN-Agent/issues/156) hält das frisch.

---

## Die Wurzel-Probleme

Unabhängig von Zählungen — das sind die strukturellen Probleme, die gelöst werden müssen, bevor OpenSIN gegen Manus AI oder Google Agents überhaupt antritt:

### 1. Rollen-Overlap zwischen `my.opensin.ai` und `OpenSIN-WebApp`

Beide claimen "User-Login + Billing". Das ist nicht nur ein Doku-Fehler — das heißt, zwei Teams bauen potentiell dieselbe Logik. **Muss entschieden werden.** Vorschlag in [PRODUCT-VISION.md § UI-Schichtung](./PRODUCT-VISION.md#ui-schichtung-4-oberflächen-4-rollen).

### 2. Team-SIN-* sind leer

Das gesamte Marketplace-Narrativ ("modular paid teams like Team-SIN-Google") hängt an Repos, die alle unter 60 kb sind. Entweder der Marketplace verkauft Hüllen — oder die echte Team-Logik steckt woanders (in `oh-my-sin.json` im Infra-SIN-OpenCode-Stack?) und die Repos sind nur URL-Anker.

### 3. Tote A2A-Repos

4 Repos mit 0 kb, 6 Repos mit 9 kb. Jemand hat CI oder Skripte laufen lassen die leere Repos erzeugt haben. Das verwässert die "109 Platform-Integrations"-Geschichte.

### 4. Team-SIN-Code-Core post-Merge-Größe

Wave-1 hat "Coding-CEO + Code-AI → Monorepo" absorbiert, aber das Ergebnis ist 57 kb groß. Das riecht danach, dass die Merges zwar die History verschmolzen, aber der Code nie real reimportiert wurde. Neue Untersuchung nötig.

### 5. `Core-SIN-Control-Plane` vs `OpenSIN-backend`

Beide haben "Control Plane" im Beschreibungstext. Wenn beides gewollt ist, braucht es klare Naming-Konvention (z. B. `Dev-Control-Plane` vs `Runtime-Control-Plane`).

### 6. Drift zwischen MASTER_INDEX (188) und Realität (200)

12 Repos Differenz. Das Auto-Regeneration-Skript ist nicht gelaufen. [OpenSIN-overview#34](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/34) deckt das ab (C1+C2).

---

## Was davon ist gut, was ist schlecht, was ist exzellent

**Exzellent:**
- `OpenSIN-Code` (autonomous CLI) + `Infra-SIN-Global-Brain` (persistent memory) — dieses Pärchen ist echte Differenzierung vs. Claude Code / OpenCode
- `Biz-SIN-*` Ops-Schicht — selten dass eine Agent-Org sowas überhaupt hat
- `A2A-SIN-Discord` + `A2A-SIN-X-Twitter` — substantielle Platform-Integrationen
- Wave-3 Consolidation-Docs — erste Org im Dev-Universum die sowas ehrlich dokumentiert

**Gut:**
- `OpenSIN` Core Package mit 310+ packages — wenn das wirklich funktional ist, ist das allein schon "world-class"
- 11 Marketing-Agents + 4 Forum-Agents + 13 Security-Agents mit je 40-170 kb — das ist echte Fleet-Tiefe

**Schlecht:**
- UI-Layer-Rollenkonflikt
- 17 Team-SIN-* Hüllen
- 4 null-kb Repos
- README-Drift (`my.opensin.ai` zeigt noch auf Delqhi)

**Gefährlich (Business-relevant):**
- Der Marketplace-Pitch verkauft Team-Packages, die nicht existieren
- Stripe-Integration (`A2A-SIN-Stripe`, 65 kb) — unklar ob der Onboarding-Flow end-to-end läuft
- `OpenSIN-WebApp`-Rolle vs `my.opensin.ai`-Rolle — Kunden landen wo?

---

## Empfohlene Reihenfolge

Nicht "fix alles gleichzeitig". Sondern in dieser Reihenfolge:

1. **UI-Schichtung klären** (1 Entscheidung, ≤ 1 Tag) — siehe [PRODUCT-VISION.md § UI-Schichtung](./PRODUCT-VISION.md#ui-schichtung-4-oberflächen-4-rollen). Das ist der Blocker für alles weitere, weil es entscheidet wo `Buy`-Buttons hin sollen.
2. **Marketplace-Mechanik festlegen** (1 Entscheidung) — siehe [PRODUCT-VISION.md § Marketplace](./PRODUCT-VISION.md#marketplace-der-entscheidungspunkt). Sind Team-SIN-* Metadata oder Code?
3. **Scaffold-Audit-Skript** (1 Tag Arbeit) — liefert harte Zahlen: `alive/scaffold/dead` pro Repo. Danach 4 tote Repos archivieren, 6 Code-Scaffolds priorisieren-oder-archivieren.
4. **Team-SIN-Code-Core Integritäts-Check** (1 Tag) — entweder der Wave-1-Merge hat Code verloren, oder das Monorepo braucht noch einen Content-Transfer.
5. **Stripe-Billing end-to-end Test** (1 Tag) — ein echter Kauf durchspielen von Landing → Checkout → Pro-Tier-Freischaltung. Wenn das nicht läuft, bringt der ganze Business-Stack nichts.
6. **Erst danach** Feature-Arbeit (Agent-Loop, Heartbeat, neue A2A-Agents etc.).

Das sind 5-6 Tage klare Arbeit. Nach diesen 5-6 Tagen weiß jeder in der Org wo er steht, und **dann** kann man ehrlich gegen Manus AI antreten.

---

Weiter mit: [PRODUCT-VISION.md](./PRODUCT-VISION.md).
