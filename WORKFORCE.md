# Workforce — OpenSIN-AI

> **Stand:** 2026-04-19 (T-4 vor Launch). All counts in this document are **derived live** from `templates/teams/*.json`, the GitHub org catalogue, and `registry/MASTER_INDEX.md`. See [`scripts/check-workforce.js`](./scripts/check-workforce.js) and `scripts/build-oh-my-sin.js`'s phantom-agent accounting. CI fails on drift.
>
> **Audit summary (run 2026-04-19):**
> - **2** active org maintainers (`DaSINci`, `Delqhi`)
> - **17** team manifests (teams live as manifest files in this repo; there are no `Team-SIN-*` GitHub repos)
> - **89** agent-role assignments across the 17 manifests
> - **87** unique agent IDs referenced
> - **17** agent IDs with a live backing repo — these are the only agents the marketplace can actually sell on 2026-04-23
> - **70** unique phantom agent IDs (manifest says "buy this" but no repo exists → launch blocker tracked as **MAN-1** in [`docs/FOLLOWUPS.md`](./docs/FOLLOWUPS.md))
> - **24** live `A2A-SIN-*` repos in the org (55 repos total, 49 live, 6 archived)
> - **7** live `A2A-SIN-*` repos not registered in any manifest (orphans → **MAN-2**)

---

## 1. Three layers of workforce

| Layer | Count | What they do | Canonical index |
|---|---:|---|---|
| **Human maintainers** | **2** (`DaSINci`, `Delqhi`) | Own the canon-locked files, approve canon-lock PRs, run launch-week Go/No-Go. Every human workflow in [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md) must be executable by 2 people. | [`.github/CODEOWNERS`](./.github/CODEOWNERS) + [`GOVERNANCE.md`](./GOVERNANCE.md) |
| **Team orchestrators** (`Team-SIN-*`) | 17 manifests | Each team is a **metadata manifest** describing a bundle of agent workers + pricing + permissions. Wave-4 decision: *teams are manifests, not code packages — no `Team-SIN-*` GitHub repo exists.* | [`templates/teams/*.json`](./templates/teams/) |
| **Agent workers + A2A integrations** | **17 live / 70 phantom** (of 87 unique IDs) | The actual units of work. Each worker is a narrow capability (send a Telegram message, open a Safari tab, scrape a HN thread). Lives as an `A2A-SIN-*` repo on HuggingFace Spaces, **or** as a plugin inside `OpenSIN-Code`. | Per-team `team.json` + `templates/oh-my-sin.json` + [`registry/MASTER_INDEX.md`](./registry/MASTER_INDEX.md) |

### How the three layers talk to each other

```
user request
     │
     ▼
OpenSIN-backend  (A2A Fleet Control Plane)
     │  dispatches to team orchestrator
     ▼
Team-SIN-<Domain>  (team manifest → list of worker IDs, pricing, permissions)
     │  fans out to live worker IDs only (phantom IDs hidden at aggregate time)
     ▼
A2A-SIN-<Integration>  (HF Space or local worker)
     │  executes, returns A2A message
     ▼
OpenSIN-WebApp  (chat.opensin.ai — user sees the result)
```

---

## 2. The 17 Team Orchestrators

Each row is a Marketplace-buyable bundle. Columns:

- **Assigned** — `agents[].length` from the team's `team.json` (role assignments, duplicates counted)
- **Live** — subset whose backing `A2A-SIN-*` repo currently exists in the org (shippable on 2026-04-23)
- **Phantom** — the rest (manifest lists the ID but no repo) → **these are hidden from the marketplace** by `build-oh-my-sin.js` coercing the team to `status: "coming-soon"` when every agent is a phantom

| Team | Assigned | Live | Phantom | Ship-ready? | Manifest |
|---|---:|---:|---:|---|---|
| Apple | 12 | 0 | 12 | coerced to coming-soon | [`templates/teams/Team-SIN-Apple.json`](./templates/teams/Team-SIN-Apple.json) |
| Code-Backend | 2 | 0 | 2 | coerced to coming-soon | [`templates/teams/Team-SIN-Code-Backend.json`](./templates/teams/Team-SIN-Code-Backend.json) |
| Code-Core | 3 | 0 | 3 | coerced to coming-soon | [`templates/teams/Team-SIN-Code-Core.json`](./templates/teams/Team-SIN-Code-Core.json) |
| Code-CyberSec | 16 | 0 | 16 | coerced to coming-soon | [`templates/teams/Team-SIN-Code-CyberSec.json`](./templates/teams/Team-SIN-Code-CyberSec.json) |
| Code-Frontend | 2 | 0 | 2 | coerced to coming-soon | [`templates/teams/Team-SIN-Code-Frontend.json`](./templates/teams/Team-SIN-Code-Frontend.json) |
| Commerce | 5 | 1 | 4 | yes — Stripe live | [`templates/teams/Team-SIN-Commerce.json`](./templates/teams/Team-SIN-Commerce.json) |
| Community | 3 | 0 | 3 | coerced to coming-soon | [`templates/teams/Team-SIN-Community.json`](./templates/teams/Team-SIN-Community.json) |
| Forum | 5 | 0 | 5 | coerced to coming-soon | [`templates/teams/Team-SIN-Forum.json`](./templates/teams/Team-SIN-Forum.json) |
| Google | 2 | 1 | 1 | yes — Google-Chat live | [`templates/teams/Team-SIN-Google.json`](./templates/teams/Team-SIN-Google.json) |
| Infrastructure | 6 | 0 | 6 | coerced to coming-soon | [`templates/teams/Team-SIN-Infrastructure.json`](./templates/teams/Team-SIN-Infrastructure.json) |
| Legal | 7 | 0 | 7 | coerced to coming-soon | [`templates/teams/Team-SIN-Legal.json`](./templates/teams/Team-SIN-Legal.json) |
| Media-ComfyUI | 1 | 0 | 1 | coerced to coming-soon | [`templates/teams/Team-SIN-Media-ComfyUI.json`](./templates/teams/Team-SIN-Media-ComfyUI.json) |
| Media-Music | 0 | 0 | 0 | **empty manifest — delete or fill (MAN-3)** | [`templates/teams/Team-SIN-Media-Music.json`](./templates/teams/Team-SIN-Media-Music.json) |
| Messaging | 12 | 10 | 2 | yes — 10 live bridges | [`templates/teams/Team-SIN-Messaging.json`](./templates/teams/Team-SIN-Messaging.json) |
| Microsoft | 1 | 1 | 0 | yes — Teams live | [`templates/teams/Team-SIN-Microsoft.json`](./templates/teams/Team-SIN-Microsoft.json) |
| Research | 3 | 0 | 3 | coerced to coming-soon | [`templates/teams/Team-SIN-Research.json`](./templates/teams/Team-SIN-Research.json) |
| Social | 9 | 0 | 9 | coerced to coming-soon | [`templates/teams/Team-SIN-Social.json`](./templates/teams/Team-SIN-Social.json) |
| **Total** | **89** | **13 of 17 unique IDs; 4 teams ship-ready** | **70 unique phantoms** | | |

> **Numbers sanity:** the `Live` column counts *live assignments per team* (can double-count an ID that's re-listed elsewhere), while "17 unique live agent IDs" is the de-duplicated count used for launch messaging. `scripts/build-oh-my-sin.js` emits both as `live_agent_count` per-team and `agents_live` in the root aggregate.
>
> **Contract:** [`scripts/check-workforce.js`](./scripts/check-workforce.js) recomputes the `Assigned` column and fails CI on drift; `build-oh-my-sin.js` recomputes `Live`/`Phantom` against the live GitHub catalogue and coerces any all-phantom team to `coming-soon` so the marketplace UI never renders a 404 buy-button.

### Ship-ready surface (2026-04-23 T-0)

Four teams have at least one live worker and will render on the marketplace on launch day with real buy-buttons:

1. **Messaging** (10 live bridges: Beeper, BlueBubbles, Chatroom, IRC, LINE, Matrix, Nostr, Signal, SMS, WeChat) — the strongest launch surface
2. **Commerce** (Stripe)
3. **Google** (Google-Chat, with Feishu adjacent)
4. **Microsoft** (Teams)

Plus standalones: Email, Box-Storage, Medusa — not sold as a team bundle, sold as individual skills.

Everything else (13 of 17 teams) ships as `coming-soon` on launch day. That is fine for a staged launch — see [LAUNCH-CHECKLIST § 3 Risiken](./LAUNCH-CHECKLIST.md) MAN-1 mitigation.

---

## 3. The agent workers — where the actual work happens

Every worker is one of:

- **`A2A-SIN-*` repo** — a HuggingFace Space (or local runner) exposing the A2A protocol at `/a2a/v1`. Fleet control plane dispatches tasks here. **24 live** today.
- **Plugin inside `OpenSIN-Code`** — an in-process capability bundled with the CLI, addressable via the same A2A envelope but over IPC.
- **Skill inside `Infra-SIN-OpenCode-Stack`** — a stateless capability exposed to any OpenCode agent; routed via the MCP gateway.

### All 17 live A2A repos (2026-04-19 snapshot)

```
Messaging bridges:   Beeper, BlueBubbles, Chatroom, IRC, LINE, Matrix, Nostr, Signal, SMS, WeChat
Cross-platform:      Email, Feishu, Google-Chat, Teams
Commerce:            Medusa, Stripe
Storage:             Box-Storage
```

Source of truth: `gh repo list OpenSIN-AI --limit 400 | grep A2A-SIN-` **intersected with** agent IDs in `templates/teams/*.json`.

### 7 orphans — live repos with no team assignment (MAN-2)

Listed in the org but not registered to any team manifest: `A2A-SIN-Nintendo`, `A2A-SIN-PlayStation`, `A2A-SIN-WebChat`, `A2A-SIN-WhatsApp`, `A2A-SIN-Worker-heypiggy`, `A2A-SIN-Xbox`, `A2A-SIN-Zoom`. Either assign them pre-launch or they sit dark in the marketplace. Tracked as **MAN-2** in [`docs/FOLLOWUPS.md`](./docs/FOLLOWUPS.md).

---

## 4. Human maintainers (the honest version)

**The org has exactly 2 active members** (`DaSINci`, `Delqhi`). Every launch-week plan that says "all maintainers" resolves to those two people. This has two hard consequences:

1. **No concurrent pager rotation.** One person is primary; the other is secondary. A third failure mode is downtime. See [LAUNCH-CHECKLIST § 3 Risiken](./LAUNCH-CHECKLIST.md) MAINT-1.
2. **CODEOWNERS team refs (`@OpenSIN-AI/core`) may be inert.** The v0 bot has no `admin:org` scope to verify GitHub Teams exist; if they don't, CODEOWNERS rules are silently ignored and branch-protection falls back to repo-admin approval. Before launch, verify each team in `.github/CODEOWNERS` with `gh api orgs/OpenSIN-AI/teams`. Tracked as **MAN-4**.

### Canonical-repo leadership (single-owner rule)

Each launchable surface needs exactly one DRI. With 2 maintainers, some people wear multiple hats — that is acknowledged, documented, not papered over. **The per-surface DRI assignments are not finalised** and must be pinned by the CTO in a PR before 2026-04-22 T-1 code-freeze. Tracked as **MAN-6** in [`docs/FOLLOWUPS.md`](./docs/FOLLOWUPS.md). Without this, the Pager-Rotation column in [LAUNCH-CHECKLIST § 2 Tag 5](./LAUNCH-CHECKLIST.md) has no one to page.

---

## 5. How a new worker joins the workforce

1. Pick the team it belongs to. If none fits, open a [Feature Request](./.github/ISSUE_TEMPLATE/feature-request.yml) proposing a new team (rare — budget enforced by governance).
2. Scaffold the worker repo from [`Template-SIN-Agent`](https://github.com/OpenSIN-AI/Template-SIN-Agent) *(if missing, tracked as MAN-5 — see FOLLOWUPS)*. The template ships: A2A protocol handler, HF Space config, health check, structured logging, release workflow.
3. Register the worker ID in the team's `team.json` in this repo under `templates/teams/<Team>.json`. The next aggregator run picks it up automatically; the phantom-count goes down by one.
4. The nightly GH Action in `governance/workflows-proposed/oh-my-sin-build.yml` rebuilds `templates/oh-my-sin.json` and publishes it to the three consumers (marketplace UI, chat entitlements, Infra-SIN-OpenCode-Stack mirror). See [`schemas/oh-my-sin.schema.json`](./schemas/oh-my-sin.schema.json).

---

## 6. Why this matters

The claim "OpenSIN is an *Agent OS*, not an Agent App" (see [PRODUCT-VISION § Der Pitch in einem Satz](./PRODUCT-VISION.md)) only holds if this workforce is real, addressable, and organized. This document is the audit trail:

- Every count is derivable from live data (`templates/teams/*.json` + `gh repo list`).
- Every agent is resolvable to a repo (or honestly marked phantom).
- Every team is resolvable to a Stripe product (or honestly marked `coming-soon`).

If you find a drift — a worker on the org page that has no repo, a team with unresolvable agent IDs, a count that does not match `registry/MASTER_INDEX.md`, a phantom agent rendering a buy-button — file it as a [Bug Report](./.github/ISSUE_TEMPLATE/bug-report.yml) with the `workforce-drift` label. We treat those as canon bugs and fix them before launching. The prelaunch sweep (`npm run prelaunch:offline`) runs `scripts/check-workforce.js` on every PR so this class of drift gets caught at review time.
