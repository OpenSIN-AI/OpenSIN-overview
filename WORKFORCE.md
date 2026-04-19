# Workforce — OpenSIN-AI

> **Stand:** 2026-04-19 (T-4 vor Launch).
> Alle Zahlen in diesem Dokument sind **reproduzierbar** aus `templates/teams/*.json` und der authentifizierten GitHub-Org-Liste. Reproduziere sie selbst:
> ```bash
> GITHUB_TOKEN=<pat> npm run validate   # ruft validate-links, validate-team-manifests,
>                                       # check-workforce, reality-check, validate-codeowners
> ```
> CI schlägt auf Drift fehl — siehe [`governance/workflows-proposed/reality-check.yml`](./governance/workflows-proposed/reality-check.yml) (staged; bedarf einmaligem Admin-`install.sh` um in `.github/workflows/` zu landen).
>
> **Revision history:** Diese Datei wurde am 2026-04-19 vollständig neu geschrieben, nachdem die vorherige Revision auf einem **anonymen** GitHub-API-Audit beruhte und alle privaten Repos fälschlich als "nicht existent" meldete. Diagnose und Methode: [`docs/REALITY-CHECK-2026-04-19.md`](./docs/REALITY-CHECK-2026-04-19.md).

---

## 1. TL;DR — Executive Audit (2026-04-19, authenticated)

| Metric | Count | Notes |
|---|---:|---|
| Active org members | **2** | `DaSINci`, `Delqhi` (both org owners) |
| GitHub Teams configured on the org | **2** | `core-team`, `admin-team` — 17 Domain-Team-Slugs die die Canon-Docs früher referenzierten existieren **nicht** als GitHub Teams (siehe § 4 und **MAN-4**) |
| Canonical GitHub repos in `OpenSIN-AI` org | **205** | davon 6 archiviert, 199 live |
| Team orchestrator repos (`Team-SIN-*`) | **17** live | Jeder Team-Repo ist ein **echtes** Node/TS Service-Package (`server.js`, `Dockerfile`, `agent.json`, `team.json`), nicht bloß ein Manifest |
| Worker repos (`A2A-SIN-*`) | **103** live (+6 archived) | HuggingFace Spaces, exposen `/a2a/v1` |
| Agent-Assignments über alle Teams | **89** | `sum(agents[]) + sum(workers[])` across 17 `team.json` files; Duplikate gezählt |
| Unique agent IDs referenced in manifests | **87** | |
| Unique agent IDs die auf einen **live** Repo resolven | **87 / 87 (100 %)** | Null phantoms — jedes Marketplace-Item hat einen echten Backend-Repo |
| Live A2A repos **ohne** Team-Assignment ("orphans") | **16** | Shippable Code ohne UI-Oberfläche → siehe § 3.2, tracked als **MAN-2** |
| Team-Manifests mit **0** agents | **1** | `Team-SIN-Media-Music` → **MAN-3** |

**Launch-readiness summary (Marketplace 2026-04-23 T-0):**
Alle 17 Teams haben mindestens ein lauffähiges Backend. Die Frage ist nicht mehr *"existieren die Repos?"* (ja, alle), sondern *"ist jeder einzelne HF-Space healthy unter Last?"* — das entscheidet `registry/DEPLOYMENT_STATUS.md` und der **OPS-2** smoke test am T-1.

---

## 2. Die drei Schichten der Workforce

| Layer | Count | Repo pattern | Canonical index |
|---|---:|---|---|
| **Human maintainers** | 2 | — | [`.github/CODEOWNERS`](./.github/CODEOWNERS), [`GOVERNANCE.md`](./GOVERNANCE.md) |
| **Team orchestrator services** | 17 | `OpenSIN-AI/Team-SIN-*` | [`templates/teams/*.json`](./templates/teams/) |
| **Agent worker services** | 103 live A2A repos + skills/plugins | `OpenSIN-AI/A2A-SIN-*` + `Infra-SIN-OpenCode-Stack` skills | [`registry/MASTER_INDEX.md`](./registry/MASTER_INDEX.md) |

### Request flow (how the layers talk)

```
user request
     │
     ▼
OpenSIN-WebApp  (chat.opensin.ai — user surface)
     │
     ▼
OpenSIN-backend  (A2A Fleet Control Plane — routing, billing, entitlements)
     │  dispatches to team
     ▼
Team-SIN-<Domain>  (Node/TS service — orchestrator, team.json, server.js)
     │  fans out to its worker agents
     ▼
A2A-SIN-<Integration>  (HF Space — exposes /a2a/v1, executes, returns A2A message)
     │
     ▼
OpenSIN-backend  aggregates, meters, bills
     │
     ▼
OpenSIN-WebApp  renders result
```

Teams are **not** thin manifests — they are running Node services that hold per-team prompt logic, permission gating, pricing enforcement, and worker dispatch. The `team.json` is the data *inside* the service, not a replacement for it.

---

## 3. The 17 Team Orchestrators

Every row maps a **live repo** to its team manifest. Columns:

- **Assigned** = `agents[].length + workers[].length` aus der `team.json` (duplicates counted — Marketplace counts)
- **Live** = subset deren ID ein live `A2A-SIN-*` oder integrierter Worker ist
- **Orphans** = live A2A repos die diesem Team *logisch gehören* aber noch nicht zugewiesen sind (→ MAN-2)

| Team Repo | Manifest | Assigned | Live | Ship-ready? |
|---|---|---:|---:|---|
| `Team-SIN-Apple` | [manifest](./templates/teams/Team-SIN-Apple.json) | 12 | 12 | yes |
| `Team-SIN-Code-Backend` | [manifest](./templates/teams/Team-SIN-Code-Backend.json) | 2 | 2 | yes |
| `Team-SIN-Code-Core` | [manifest](./templates/teams/Team-SIN-Code-Core.json) | 3 | 3 | yes |
| `Team-SIN-Code-CyberSec` | [manifest](./templates/teams/Team-SIN-Code-CyberSec.json) | 16 | 16 | yes |
| `Team-SIN-Code-Frontend` | [manifest](./templates/teams/Team-SIN-Code-Frontend.json) | 2 | 2 | yes |
| `Team-SIN-Commerce` | [manifest](./templates/teams/Team-SIN-Commerce.json) | 5 | 5 | yes |
| `Team-SIN-Community` | [manifest](./templates/teams/Team-SIN-Community.json) | 3 | 3 | yes |
| `Team-SIN-Forum` | [manifest](./templates/teams/Team-SIN-Forum.json) | 5 | 5 | yes |
| `Team-SIN-Google` | [manifest](./templates/teams/Team-SIN-Google.json) | 2 | 2 | yes |
| `Team-SIN-Infrastructure` | [manifest](./templates/teams/Team-SIN-Infrastructure.json) | 6 | 6 | yes |
| `Team-SIN-Legal` | [manifest](./templates/teams/Team-SIN-Legal.json) | 7 | 7 | yes |
| `Team-SIN-Media-ComfyUI` | [manifest](./templates/teams/Team-SIN-Media-ComfyUI.json) | 1 | 1 | yes |
| `Team-SIN-Media-Music` | [manifest](./templates/teams/Team-SIN-Media-Music.json) | **0** | 0 | **leeres Manifest → MAN-3** |
| `Team-SIN-Messaging` | [manifest](./templates/teams/Team-SIN-Messaging.json) | 12 | 12 | yes |
| `Team-SIN-Microsoft` | [manifest](./templates/teams/Team-SIN-Microsoft.json) | 1 | 1 | yes |
| `Team-SIN-Research` | [manifest](./templates/teams/Team-SIN-Research.json) | 3 | 3 | yes |
| `Team-SIN-Social` | [manifest](./templates/teams/Team-SIN-Social.json) | 9 | 9 | yes |
| **Sum** | | **89** | **89** | **16 von 17 ship-ready** |

> **Contract:** [`scripts/check-workforce.js`](./scripts/check-workforce.js) rechnet `Assigned` und `Live` aus den live Quellen jeden PR neu aus. Drift → Red CI.

### 3.1 Real launch surface (what the marketplace renders on 2026-04-23)

Alle 17 Teams rendern auf der Marketplace-Seite am Launch-Tag. Ausnahme: `Team-SIN-Media-Music` erscheint als `coming-soon` bis sein Manifest gefüllt ist (**MAN-3**). Die stärksten vorzeigbaren Bundles für das Launch-Announcement (PR-5 in [`LAUNCH-CHECKLIST.md`](./LAUNCH-CHECKLIST.md)):

1. **Messaging** — 12 Bridges (Beeper, BlueBubbles, Chatroom, IRC, LINE, Matrix, Nostr, Signal, SMS, WeChat, Telegram, Discord)
2. **Apple-Productivity** — 12 first-party Apple integrations (Mail, Calendar, Reminders, Safari, Shortcuts, …)
3. **Code-CyberSec** — 16 Security Workers (das Domänen-Bundle mit der größten Tiefe)
4. **Social** — 9 social platforms
5. **Legal** — 7 legal-ops workers

### 3.2 16 A2A-Orphan-Repos (MAN-2)

Diese live A2A-Repos existieren aber sind **keinem** Team-Manifest zugewiesen — shippable Code ohne Marketplace-Zugang. Pre-Launch entweder ins passende Manifest einspielen oder als "direct skills" ausweisen:

| Orphan Repo | Vermutete Team-Zuordnung |
|---|---|
| `A2A-SIN-Code-Command` | Code-Core |
| `A2A-SIN-Code-Fullstack` | Code-Backend + Code-Frontend |
| `A2A-SIN-Code-Plugin` | Code-Core |
| `A2A-SIN-Code-Tool` | Code-Core |
| `A2A-SIN-Nintendo` | **new Team-SIN-Gaming?** |
| `A2A-SIN-PlayStation` | new Team-SIN-Gaming |
| `A2A-SIN-Xbox` | new Team-SIN-Gaming |
| `A2A-SIN-Team-MoneyEarners` | Commerce (oder Monetization sub-team) |
| `A2A-SIN-Team-MyCompany` | Commerce |
| `A2A-SIN-WebChat` | Messaging |
| `A2A-SIN-WhatsApp` | Messaging |
| `A2A-SIN-Worker-Prolific` | Research |
| `A2A-SIN-Worker-heypiggy` | Commerce |
| `A2A-SIN-X-Twitter` | Social |
| `A2A-SIN-YouTube` | Social oder Media |
| `A2A-SIN-Zoom` | Messaging |

Tracked as **MAN-2** in [`docs/FOLLOWUPS.md`](./docs/FOLLOWUPS.md). Entscheidung bis T-1.

---

## 4. Humans — the honest 2-person story

Der `OpenSIN-AI` Org hat **2 aktive Owner**: `DaSINci`, `Delqhi`. Das hat harte Konsequenzen für die Launch-Woche:

1. **Pager-Rotation ist keine Rotation.** Einer ist Primary, der andere Secondary. Ein dritter Ausfall ist Downtime. Eskalationsplan → **MAINT-1** in [`LAUNCH-CHECKLIST § 3`](./LAUNCH-CHECKLIST.md).
2. **`core-team` ist der einzig real existente Review-Channel.** Alle 17 Domain-Team-Slugs die historische Versionen der Canon-Docs und `templates/teams/*.json` in den Feldern `codeowners` / `review_teams` / `provenance.owner_team` referenzieren, **existieren nicht als GitHub Teams** — ein authenticated Call auf die GitHub Teams API liefert für die Org exakt zwei Einträge: `core-team` und `admin-team`. Konsequenz: CODEOWNERS-Einträge mit nicht-existenten Slugs werden von GitHub stillschweigend ignoriert. `.github/CODEOWNERS` und `.github/dependabot.yml` wurden am 2026-04-19 auf `core-team` korrigiert, und alle 17 `templates/teams/*.json` `provenance.owner_team` Felder wurden auf `core-team` (org-qualified) normalisiert. Tracked als **MAN-4** in [`docs/FOLLOWUPS.md`](./docs/FOLLOWUPS.md) — wenn per-Domain-Review später gewünscht ist, müssen zuerst die entsprechenden GitHub Teams angelegt werden, *dann* dürfen die Manifest-Felder zurück auf Domain-Slugs.

### Per-surface DRI matrix (nicht gespiegelt aus erfundenen Namen)

Mit 2 Owner:innen tragen Einzelpersonen mehrere Surfaces. **Die finale Zuordnung muss in einem separaten PR vom CTO vor T-1 gesetzt werden** — bis dahin steht hier bewusst Placeholder statt erfundener DRIs. Tracked als **MAN-6** in [`docs/FOLLOWUPS.md`](./docs/FOLLOWUPS.md).

| Canonical surface | Primary DRI | Secondary | Pager? |
|---|---|---|---|
| `OpenSIN-backend` (fleet control plane) | **TBD (MAN-6)** | **TBD** | T-1 |
| `OpenSIN-WebApp` (chat.opensin.ai) | **TBD** | **TBD** | T-1 |
| `OpenSIN-Code` (CLI) | **TBD** | **TBD** | T-0 (observability only) |
| `Infra-SIN-OpenCode-Stack` | **TBD** | **TBD** | T-1 |
| `website-opensin.ai` | **TBD** | **TBD** | T-0 |
| `website-my.opensin.ai` | **TBD** | **TBD** | T-0 |
| `Biz-SIN-Marketing` (announcement pipeline) | **TBD** | **TBD** | T-0 only |
| All 17 `Team-SIN-*` | **TBD (one of the 2 owners)** | **TBD** | only on alert |
| All 103 `A2A-SIN-*` | **TBD** | (auto-rotation via `core-team`) | alerts-only |

---

## 5. How a new worker joins the workforce

1. **Pick a team.** If none fits, open a [Feature Request](./.github/ISSUE_TEMPLATE/feature-request.yml) proposing a new team. Budget reviewed by `@OpenSIN-AI/core-team`.
2. **Scaffold the worker repo** from [`OpenSIN-AI/Template-SIN-Agent`](https://github.com/OpenSIN-AI/Template-SIN-Agent). Das Template liefert: A2A-Handler, HF-Space Config, health check, structured logging, release workflow, `agent.json`, `A2A-CARD.md`.
3. **Register the worker** in der Team-`team.json` unter `agents[]` oder `workers[]`. Der nächste Aggregator-Run (`scripts/build-oh-my-sin.js`) picked ihn automatisch; `check-workforce.js` verifiziert dass die ID auf einen live Repo resolvt.
4. **Nightly GH Action** in [`governance/workflows-proposed/oh-my-sin-build.yml`](./governance/workflows-proposed/oh-my-sin-build.yml) rebuild't `templates/oh-my-sin.json` und publishes an die drei Konsumenten: Marketplace UI, Chat-Entitlements, `Infra-SIN-OpenCode-Stack` mirror. Schema → [`schemas/oh-my-sin.schema.json`](./schemas/oh-my-sin.schema.json). Drift-Gate (reality-check, codeowners, workforce) läuft bei jedem PR via [`governance/workflows-proposed/reality-check.yml`](./governance/workflows-proposed/reality-check.yml).

---

## 6. Why this document exists

Die Aussage *"OpenSIN ist ein Agent OS, nicht eine Agent-App"* (siehe [`PRODUCT-VISION § Der Pitch in einem Satz`](./PRODUCT-VISION.md)) gilt nur, wenn diese Workforce real, addressierbar und organisiert ist. Dieses Dokument ist der Audit-Trail:

- Jede Zahl ist reproduzierbar (`GITHUB_TOKEN=<pat> npm run validate`).
- Jeder Agent ID resolvt zu einem live Repo (oder wird ehrlich als phantom markiert — derzeit 0).
- Jedes Team resolvt zu einem Stripe-Produkt (oder trägt `coming-soon`).
- Drift zwischen Manifest und Realität wird **am PR** gefangen, nicht im Production-Outage.

**Wenn du Drift findest** — Agent in einem Manifest ohne Repo, Team ohne Review-Channel, Orphan A2A-Repo, Buy-Button der 404t — öffne einen [Bug-Report](./.github/ISSUE_TEMPLATE/bug-report.yml) mit Label `workforce-drift`. Wir behandeln das als Canon-Bug und fixen es bevor die PR mergt.
