# State of the Union — OpenSIN-AI

> **Stand:** 2026-04-19 (Live-Audit via `gh repo list`, T-4 vor Launch).
> **Zweck dieses Dokuments:** Ein ehrlicher Lagebericht. Nicht Marketing, nicht Wunschdenken. Was existiert wirklich, was läuft, was ist tot, was ist kaputt.
> **Wer Zeitdruck hat:** Geht direkt zu [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md). Wer das große Bild will, liest [PRODUCT-VISION.md](./PRODUCT-VISION.md). Wer eine offene Aufgabe sucht, liest [docs/FOLLOWUPS.md](./docs/FOLLOWUPS.md).
> **Wer prüfen will dass diese Zahlen stimmen:** `gh repo list OpenSIN-AI --limit 300 --json name,diskUsage,isArchived,pushedAt | jq 'length'`

## TL;DR (2026-04-19)

- **205 Repositories total** (177 live, 28 archived). Drift ggü. [`registry/MASTER_INDEX.md`](./registry/MASTER_INDEX.md): +17. Index wurde in diesem Commit refreshed.
- **Wave 4 Artefakte landete gestern** — 17 Team-Manifeste, Schema, Audit-Script, Archival der 4 toten A2A-Repos. Alles sichtbar in [`templates/teams/`](./templates/teams), [`schemas/team.schema.json`](./schemas/team.schema.json), [`registry/SCAFFOLD_AUDIT.md`](./registry/SCAFFOLD_AUDIT.md).
- **Launch-Blocker #1 (frisch erkannt):** Alle 6 `a2a-sin-code-*` HuggingFace-Spaces antworten seit ≥ 3 Tagen mit **HTTP 503**. Ohne die läuft die A2A-Fleet-Control-Plane nicht. Tracking in [LAUNCH-CHECKLIST § Tag 1 → HF-1](./LAUNCH-CHECKLIST.md#tag-1--t-3-mittwoch-2026-04-19--infrastruktur--datenlage). Siehe auch [`registry/DEPLOYMENT_STATUS.md`](./registry/DEPLOYMENT_STATUS.md).
- **Der Kern trägt.** `OpenSIN` (836 MB), `OpenSIN-backend` (975 MB), `OpenSIN-Code` (366 MB), `OpenSIN-WebApp` (59 MB), `OpenSIN-documentation` (49 MB). Das sind reale, gepflegte Code-Basen.
- **Das Business-Narrativ ist jetzt entschieden.** UI-Schichtung und Marketplace-Architektur sind seit Wave 4 bindend (siehe [PRODUCT-VISION § Getroffene Entscheidungen](./PRODUCT-VISION.md#getroffene-entscheidungen-wave-4-2026-04-18)). Was bleibt ist Ausführung, nicht Entscheidungsfindung.
- **Die Peripherie ist gereinigt, aber nicht fertig.** 4 null-kb Repos sind archiviert. 6 9-kb Code-Scaffolds (`A2A-SIN-Code-Backend/-Command/-Frontend/-Fullstack/-Plugin/-Tool`) existieren noch, sind aber off der Launch-Checklist.

Kurz: Wir haben in den letzten 48 h mehr gefixt als viele Orgs in 2 Wochen. Jetzt fehlen 4 Tage saubere Ausführung — siehe [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md).

---

## 1. Zahlen, Live aus `gh repo list` (Stand 2026-04-19)

| Kategorie                           |             Count | Kommentar                                                                                                                                                                                |
| ----------------------------------- | ----------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Alle Repos**                      |               205 | inkl. `.github`, inkl. 3 Meta-Aggregat-Packages (`opensin_api`, `opensin_sdk`, `OpenSIN-Skills`)                                                                                         |
| Davon live (nicht archived)         |               177 |                                                                                                                                                                                          |
| Davon archived                      |                28 | Legacy + Wave 1/2/4 Archival                                                                                                                                                             |
| `A2A-SIN-*`                         |               109 | 4 davon gerade archiviert (Wave 4: Facebook/Mattermost/RocketChat/Slack)                                                                                                                 |
| `Team-SIN-*`                        |                17 | alle als Metadata-Manifeste in Wave 4 normalisiert                                                                                                                                       |
| `Biz-SIN-*`                         |                 7 |                                                                                                                                                                                          |
| `Infra-SIN-*`                       |                 6 |                                                                                                                                                                                          |
| `MCP-SIN-*`                         |                 7 |                                                                                                                                                                                          |
| `Template-SIN-*` + `Template-A2A-*` |                 5 |                                                                                                                                                                                          |
| `Skill-SIN-*`                       |                 3 |                                                                                                                                                                                          |
| `website-*`                         |                 4 |                                                                                                                                                                                          |
| Canonical Kern (keine Präfixe)      |               ~10 | `OpenSIN`, `OpenSIN-Code`, `OpenSIN-backend`, `OpenSIN-WebApp`, `OpenSIN-documentation`, `OpenSIN-overview`, `OpenSIN-Skills`, `OpenSIN-Bridge`, `OpenSIN-Neural-Bus`, `awesome-opensin` |
| Aktiv gepusht in letzten 7 Tagen    | 177 (= alle live) | der ganze Stall rennt, keine toten Würmer außer den archivierten                                                                                                                         |

---

## 2. Der Kern — was wirklich existiert und läuft

### 2.1 Code-Engine (Canonical)

| Repo                                                                     | Sichtbarkeit | Größe (MB) | Sprache    | Status                                                                   | Launch-Rolle                                    |
| ------------------------------------------------------------------------ | ------------ | ---------: | ---------- | ------------------------------------------------------------------------ | ----------------------------------------------- |
| [`OpenSIN`](https://github.com/OpenSIN-AI/OpenSIN)                       | Public       |    **836** | Python     | aktiv, push 2026-04-18                                                   | OSS Tier — `pip install opensin`                |
| [`OpenSIN-backend`](https://github.com/OpenSIN-AI/OpenSIN-backend)       | Private      |    **975** | TypeScript | aktiv, push 2026-04-18                                                   | Pro Tier — Fleet Control Plane                  |
| [`OpenSIN-Code`](https://github.com/OpenSIN-AI/OpenSIN-Code)             | Public       |    **366** | TypeScript | aktiv, push 2026-04-19                                                   | OSS Tier — `npm i -g opensin-code`              |
| [`OpenSIN-WebApp`](https://github.com/OpenSIN-AI/OpenSIN-WebApp)         | Private      |     **59** | Next.js 16 | aktiv, push 2026-04-18                                                   | Pro Tier — `chat.opensin.ai`                    |
| [`Team-SIN-Code-Core`](https://github.com/OpenSIN-AI/Team-SIN-Code-Core) | Private      |       0.06 | TS         | Scaffold (bestätigt in [`SCAFFOLD_AUDIT`](./registry/SCAFFOLD_AUDIT.md)) | Marketplace — als `team.json`-Repo normalisiert |

Status: 4 von 5 tragen echten Code. Team-SIN-Code-Core wurde in Wave 4 zum Metadata-Manifest umklassifiziert (siehe PRODUCT-VISION § Entscheidung 4). Keine offene Altlast mehr hier.

### 2.2 Infrastructure (Canonical)

| Repo                                                                                 | Sichtbarkeit |  Größe | Rolle                                                                 |
| ------------------------------------------------------------------------------------ | ------------ | -----: | --------------------------------------------------------------------- |
| [`Infra-SIN-OpenCode-Stack`](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) | Public       | 3.8 MB | SSOT für OpenCode-Config, Agent-Aggregator (`oh-my-sin.json` nightly) |
| [`Infra-SIN-Global-Brain`](https://github.com/OpenSIN-AI/Infra-SIN-Global-Brain)     | Public       | 788 kb | PCPM v4 (persistent cross-session memory)                             |
| [`Infra-SIN-Dev-Setup`](https://github.com/OpenSIN-AI/Infra-SIN-Dev-Setup)           | Public       | 186 kb | Dev Environment + User-Onboarding Setup + CI runtime secrets          |
| [`Infra-SIN-Docker-Empire`](https://github.com/OpenSIN-AI/Infra-SIN-Docker-Empire)   | Private      | 166 kb | Docker-Images für alle SIN-Worker                                     |
| [`Infra-SIN-Doc-Templates`](https://github.com/OpenSIN-AI/Infra-SIN-Doc-Templates)   | Public       |  46 kb | README-/CONTRIBUTING-Templates                                        |

Status: alle real. PCPM v4 ist echte Differenzierung — kein anderes OSS-Agentensystem hat persistenten Cross-Session-Speicher.

### 2.3 UI-Layer (Canonical, 4 Rollen, Wave-4-entschieden)

| Repo                                                                               | Domain          |  Größe | Rolle                                                      | Status |
| ---------------------------------------------------------------------------------- | --------------- | -----: | ---------------------------------------------------------- | ------ |
| [`website-opensin.ai`](https://github.com/OpenSIN-AI/website-opensin.ai)           | opensin.ai      | 792 kb | **OSS Marketing** (unauthenticated, keine Stripe)          | in Bau |
| [`website-my.opensin.ai`](https://github.com/OpenSIN-AI/website-my.opensin.ai)     | my.opensin.ai   |   2 MB | **Paid Marketing + Marketplace-Katalog + Stripe Checkout** | in Bau |
| [`OpenSIN-WebApp`](https://github.com/OpenSIN-AI/OpenSIN-WebApp)                   | chat.opensin.ai |  59 MB | **Authenticated App + Stripe Customer Portal**             | in Bau |
| [`OpenSIN-documentation`](https://github.com/OpenSIN-AI/OpenSIN-documentation)     | docs.opensin.ai |  49 MB | **Docusaurus Docs**                                        | aktiv  |
| [`website-blog.opensin.ai`](https://github.com/OpenSIN-AI/website-blog.opensin.ai) | blog.opensin.ai |  41 MB | Blog (optional für Launch)                                 | aktiv  |

Der Rollenkonflikt aus dem 2026-04-18-Stand ist aufgelöst. UI-Schichtung ist bindend.

### 2.4 Meta / Governance

| Repo                                                                           | Rolle                                | Status          |
| ------------------------------------------------------------------------------ | ------------------------------------ | --------------- |
| [`OpenSIN-overview`](https://github.com/OpenSIN-AI/OpenSIN-overview)           | SSOT für Org-Topologie (dieses Repo) | gesund          |
| [`OpenSIN-documentation`](https://github.com/OpenSIN-AI/OpenSIN-documentation) | Public Docusaurus                    | aktiv           |
| [`awesome-opensin`](https://github.com/OpenSIN-AI/awesome-opensin)             | Launch-Banner + kuratierte Linkliste | in Vorbereitung |

---

## 3. Die Peripherie

### 3.1 A2A-SIN-\* Fleet (109 Repos)

Klassifikation aus Live-`gh`-Audit und [`SCAFFOLD_AUDIT.md`](./registry/SCAFFOLD_AUDIT.md):

| Klasse                          |        Count | Beispiele                                                                                                               | Status             |
| ------------------------------- | -----------: | ----------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **Flagship** (> 1 MB)           |            5 | `A2A-SIN-X-Twitter` (26 MB), `A2A-SIN-Discord` (26 MB), `A2A-SIN-MiroFish` (6.7 MB), `A2A-SIN-Worker-heypiggy` (1.3 MB) | alive              |
| **Substantial** (100 kb – 1 MB) |          ~30 | Marketing-/Forum-/Security-Agenten                                                                                      | alive              |
| **Small** (30 – 100 kb)         |          ~60 | typische Integration-Scaffolds mit echtem Code                                                                          | alive              |
| **Code-Scaffolds** (9–12 kb)    |            6 | `A2A-SIN-Code-Backend/-Command/-Frontend/-Fullstack/-Plugin/-Tool`                                                      | scaffold, S2 offen |
| **Dead**                        | 4 (archived) | `A2A-SIN-Facebook/-Mattermost/-RocketChat/-Slack`                                                                       | archived ✅        |

Die 4 dead Repos sind in Wave 4 (2026-04-18) archiviert worden — verifiziert via `gh repo view`. Ticket S1 ist `DONE`.

### 3.2 Team-SIN-\* (17 Repos) — Metadata-Manifeste

Nach Wave-4-Entscheidung ist jedes `Team-SIN-*` ein Metadata-Manifest-Repo, keine Code-Basis. Alle 17 haben in diesem Repo eine Referenz-`team.json` in [`templates/teams/`](./templates/teams). Der Marketplace rendert nicht direkt aus diesen Repos, sondern aus dem aggregierten `oh-my-sin.json` (SSOT im `Infra-SIN-OpenCode-Stack`, via CI aus diesem Repo gebaut — siehe M2 in FOLLOWUPS).

Status: Die 17 Referenz-Manifeste existieren hier als SSOT. Die M1-Push-Action an die 17 Downstream-Repos ist `DONE` (Wave 4). Die M2-GitHub-Action im `Infra-SIN-OpenCode-Stack` ist **noch offen** und auf der Launch-Checklist (Tag 3).

### 3.3 Biz-SIN-\* (7 Repos) — Business Ops

Unverändert gesund. `Biz-SIN-Marketing` (7.3 MB) ist am Launch-Tag der Owner der Announcement-Pipeline.

### 3.4 Core-SIN-Control-Plane — CP1 noch offen

- Size: 168 kb, Stand 2026-04-18
- Status: **nicht archiviert**, nicht gemerged
- Launch-Impact: **keiner** (`OpenSIN-backend` ist die Produktion-Control-Plane, `Core-SIN-Control-Plane` ist interne Alt-Geschichte)
- Plan: Wave 5 Post-Launch (siehe [LAUNCH-CHECKLIST § 4](./LAUNCH-CHECKLIST.md#4-post-launch-wave-5-t1-bis-t14))

### 3.5 Rationalization — R1/R2/R3 noch offen

- `opensin-ai-cli` (262 kb, Public, push 2026-04-19): Rust-CLI-Duplikat zu `OpenSIN-Code/crates/*`. R1 in FOLLOWUPS. **Launch-Impact:** keiner solange `OpenSIN-Code` am Launch-Tag grün ist.
- `opensin-ai-platform` (10.9 MB, Public, push 2026-04-19): Plugin-Ecosystem-Duplikat zu `OpenSIN/opensin_agent_platform/`. R2 in FOLLOWUPS. **Launch-Impact:** keiner solange `pip install opensin` installiert.
- R3 (interner Diff `opensin_agent_platform/` vs `opensin_core/`) blockt R2. **Launch-Impact:** keiner.

Alle drei nach Wave 5.

---

## 4. Launch-Risiken (aus Live-Daten)

### 4.1 KRITISCH — HF Spaces Outage

**Problem:** Alle 6 HuggingFace-Spaces der `A2A-SIN-Code-*`-Worker sind 503 seit ≥ 3 Tagen. Live-Verifikation am 2026-04-19:

```
a2a-sin-code-plugin   -> 503
a2a-sin-code-command  -> 503
a2a-sin-code-tool     -> 503
a2a-sin-code-backend  -> 503
a2a-sin-code-fullstack-> 503
a2a-sin-code-frontend -> 503
```

**Impact:** Ohne diese 6 Worker kann `OpenSIN-backend` keine Coding-Tasks dispatchen. Das ist der Control-Plane-Happy-Path, den der Stripe-Smoke-Test (§4) testet.

**Fix:** HF-1 in [LAUNCH-CHECKLIST Tag 1](./LAUNCH-CHECKLIST.md#tag-1--t-3-mittwoch-2026-04-19--infrastruktur--datenlage). Cron + Auto-Restart. Owner: `OpenSIN-backend` maintainers.

### 4.2 MITTEL — Stripe End-to-End ungetestet

Weder `website-my.opensin.ai` noch `OpenSIN-WebApp` haben dokumentierten E2E-Kaufdurchlauf. Siehe [docs/STRIPE-SMOKE-TEST.md](./docs/STRIPE-SMOKE-TEST.md) — das Dokument gibt die Test-Choreographie vor, damit beide Teams denselben Flow testen.

### 4.3 MITTEL — PyPI/npm-Namensreservierung

`opensin` auf PyPI und `opensin-code` auf npm sind nicht vorab reserviert (oder nicht dokumentiert). Wenn die Namen am Launch-Tag weg sind, muss auf Fallback-Namen ausgewichen werden — das zerreißt alle Install-Instruktionen. Prio in LAUNCH-CHECKLIST Tag 1 (OSS-3/OSS-4 Precheck).

### 4.4 NIEDRIG — Drift zwischen MASTER_INDEX und Realität

MASTER_INDEX war bei 188 (vor Refresh), Realität ist 205. In diesem Commit auf 205 updated. Ticket C1/C2 damit `DONE`.

---

## 5. Was davon ist gut, was ist schlecht, was ist exzellent

**Exzellent:**

- 3 canonical UI-Repos mit klarer Rolle, keine Überlappung mehr (Wave 4)
- 17 Team-Manifeste mit JSON-Schema, CI-Validierung, aggregiertem Marketplace-Katalog
- Ehrliche Governance-Docs (dieses Dokument, LAUNCH-CHECKLIST, STRIPE-SMOKE-TEST, CANONICAL-REPOS) — selten in Agent-Orgs

**Gut:**

- 4 substantielle canonical Code-Repos
- PCPM v4 als OSS-Differenzierung
- 109 A2A-Agents mit echter Tiefe (30 mit > 100 kb)
- Biz-Ops-Repos existieren und werden gepflegt

**Schlecht (launchrelevant):**

- HF-Spaces Outage seit 3 Tagen
- Stripe-E2E unbekannt grün
- Keine Uptime-Monitoring-Infrastruktur in Produktion

**Schlecht (post-launch aufräumen):**

- 6 A2A-SIN-Code-\* Scaffolds (S2)
- `opensin-ai-cli` / `opensin-ai-platform` Duplikate (R1/R2)
- `Core-SIN-Control-Plane` Archival (CP1)

---

## 6. Reihenfolge

Diese Reihenfolge ist in [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md) operationalisiert. Kurz:

1. **Tag 1 (heute):** HF-Spaces restart + Keep-Alive. Stripe Test-Keys. Supabase. Uptime-Monitore.
2. **Tag 2:** OSS Tier fertig — Landing, Docs, PyPI-Publish, npm-Publish.
3. **Tag 3:** Pro + Marketplace fertig — Stripe Checkout, chat.opensin.ai Dashboard, Marketplace-Katalog. Voller E2E-Smoke-Test.
4. **Tag 4:** Go/No-Go. Live-Mode. Announcement. Monitoring.
5. **Post-Launch (Wave 5):** R1, R2, R3, CP1, S2 abarbeiten.

---

Nach T+0 ist die Org kohärent + gelauncht + hat zahlende Kunden. Ab dem Zeitpunkt messen wir am User-Traffic, nicht am Marketing-Claim.
