# Workforce — OpenSIN-AI

> **Stand:** 2026-04-19 (T-4 vor Launch). Auto-countable via [`scripts/generate-master-index.js`](./scripts/generate-master-index.js); the counts below are kept in sync with [`registry/MASTER_INDEX.md`](./registry/MASTER_INDEX.md).
> **Scope of this document:** Who does what work inside the OpenSIN-AI org. Human maintainers + 17 Team Orchestrators + 149 agent workers + 109 A2A integrations, organized so you can answer "which agent owns this?" in under 30 seconds.

---

## 1. Three layers of workforce

| Layer | Count | What they do | Canonical index |
|---|---:|---|---|
| **Human maintainers** | handful | Own the canon-locked files, approve canon-lock PRs, run launch-week Go/No-Go | [`.github/CODEOWNERS`](./.github/CODEOWNERS) |
| **Team orchestrators** (`Team-SIN-*`) | 17 | Each team is a **metadata manifest** describing a bundle of agent workers + pricing + permissions. Wave-4 decision: *Team-SIN-\* repos are manifests, not code packages.* | [`templates/teams/*.json`](./templates/teams/) |
| **Agent workers + A2A integrations** | 149 workers spread across ~109 `A2A-SIN-*` repos | The actual units of work. Each worker has a narrow capability (e.g. "send Telegram message", "open Safari tab", "scrape a HackerNews thread"). | Per-team `team.json` + [`registry/MASTER_INDEX.md`](./registry/MASTER_INDEX.md) |

### How the three layers talk to each other

```
user request
     │
     ▼
OpenSIN-backend  (A2A Fleet Control Plane)
     │  dispatches to team orchestrator
     ▼
Team-SIN-<Domain>  (team manifest → list of worker IDs)
     │  fans out to workers
     ▼
A2A-SIN-<Integration>  (HF Space or local worker)
     │  executes, returns A2A message
     ▼
OpenSIN-WebApp  (chat.opensin.ai — user sees the result)
```

---

## 2. The 17 Team Orchestrators (canonical bundles)

Each row is a Marketplace-buyable bundle. Pricing lives in the team's own `team.json`; aggregated into `templates/oh-my-sin.json`.

| Team | Workers | Focus | Repo |
|---|---:|---|---|
| Apple | 12 | macOS/iOS automation (Mail, Notes, Calendar, FaceTime, Safari, Shortcuts, …) | [`Team-SIN-Apple`](https://github.com/OpenSIN-AI/Team-SIN-Apple) |
| Code-Backend | 3 | Server, OracleCloud, Password-Manager | [`Team-SIN-Code-Backend`](https://github.com/OpenSIN-AI/Team-SIN-Code-Backend) |
| Code-Core | 4 | Coding-CEO, Code-AI, Code-DataScience, Code-DevOps | [`Team-SIN-Code-Core`](https://github.com/OpenSIN-AI/Team-SIN-Code-Core) |
| Code-CyberSec | 19 | BugBounty, Cloudflare, 16× Security specialists | [`Team-SIN-Code-CyberSec`](https://github.com/OpenSIN-AI/Team-SIN-Code-CyberSec) |
| Code-Frontend | 11 | Accessibility, App-Shell, Commerce-UI, Design-Systems, … | [`Team-SIN-Code-Frontend`](https://github.com/OpenSIN-AI/Team-SIN-Code-Frontend) |
| Commerce | 4 | Shop-Finance, Shop-Logistic, TikTok-Shop, Stripe | [`Team-SIN-Commerce`](https://github.com/OpenSIN-AI/Team-SIN-Commerce) |
| Community | 4 | Discord, WhatsApp, Telegram, YouTube community | [`Team-SIN-Community`](https://github.com/OpenSIN-AI/Team-SIN-Community) |
| Forum | 9 | Reddit, HackerNews, StackOverflow, Quora, Dev.to, … | [`Team-SIN-Forum`](https://github.com/OpenSIN-AI/Team-SIN-Forum) |
| Google | 3 | Google-Apps, Google-Chat, Opal | [`Team-SIN-Google`](https://github.com/OpenSIN-AI/Team-SIN-Google) |
| Infrastructure | 15 | Authenticator, Terminal, Storage, Supabase, n8n, CI/CD, … | [`Team-SIN-Infrastructure`](https://github.com/OpenSIN-AI/Team-SIN-Infrastructure) |
| Legal | 8 | ClaimWriter, Patents, Damages, Compliance, Contract, … | [`Team-SIN-Legal`](https://github.com/OpenSIN-AI/Team-SIN-Legal) |
| Media-ComfyUI | 3 | ImageGen, VideoGen, Workflow | [`Team-SIN-Media-ComfyUI`](https://github.com/OpenSIN-AI/Team-SIN-Media-ComfyUI) |
| Media-Music | 6 | Beats, Producer, Singer, Songwriter, Video-Gen, Community | [`Team-SIN-Media-Music`](https://github.com/OpenSIN-AI/Team-SIN-Media-Music) |
| Messaging | 19 | WhatsApp, Telegram, Signal, Discord, iMessage, … | [`Team-SIN-Messaging`](https://github.com/OpenSIN-AI/Team-SIN-Messaging) |
| Microsoft | 9 | 365, Teams, Outlook, OneDrive, Excel, Word, PowerPoint, … | [`Team-SIN-Microsoft`](https://github.com/OpenSIN-AI/Team-SIN-Microsoft) |
| Research | 1 | Deep-Research | [`Team-SIN-Research`](https://github.com/OpenSIN-AI/Team-SIN-Research) |
| Social | 19 | TikTok, Instagram, X, LinkedIn, Facebook, YouTube, … | [`Team-SIN-Social`](https://github.com/OpenSIN-AI/Team-SIN-Social) |
| **Total** | **149** | | |

> **Contract:** The numbers above are the `agents[].length` from each team's `team.json`. The schema enforces that every listed agent ID resolves to either a repo in `A2A-SIN-*` or to a worker inside `OpenSIN-Code`'s plugin tree. CI fails if an agent ID is unresolved.

---

## 3. The agent workers — where the actual work happens

Every worker is one of:

- **A2A-SIN-\*** repo — a HuggingFace Space (or local runner) exposing the A2A protocol at `/a2a/v1`. The fleet control plane dispatches tasks here.
- **Plugin inside `OpenSIN-Code`** — an in-process capability bundled with the CLI, addressable via the same A2A envelope but over IPC.
- **Skill inside `Infra-SIN-OpenCode-Stack`** — a stateless capability exposed to any OpenCode agent; routed via the MCP gateway.

### Top-5 flagship workers (by repo size, evidence of depth)

| Worker | Repo | Size | Purpose |
|---|---|---:|---|
| X/Twitter fleet agent | [`A2A-SIN-X-Twitter`](https://github.com/OpenSIN-AI/A2A-SIN-X-Twitter) | 26 MB | Full posting/DM/analytics pipeline |
| Discord fleet agent | [`A2A-SIN-Discord`](https://github.com/OpenSIN-AI/A2A-SIN-Discord) | 26 MB | Multi-server moderation + announcements |
| MiroFish (passive-income) | [`A2A-SIN-MiroFish`](https://github.com/OpenSIN-AI/A2A-SIN-MiroFish) | 6.7 MB | Autonomous passive-income workflows |
| HeyPiggy (passive-income) | [`A2A-SIN-Worker-heypiggy`](https://github.com/OpenSIN-AI/A2A-SIN-Worker-heypiggy) | 1.3 MB | Autonomous passive-income workflows |
| A2A Storage | [`A2A-SIN-Storage`](https://github.com/OpenSIN-AI/A2A-SIN-Storage) | ~100 kb | Cross-agent shared storage layer |

Substantial workers (100 kb – 1 MB): ~30 repos. Small workers (30–100 kb): ~60 repos. Scaffolds (currently 6): the `A2A-SIN-Code-*` set, tracked as **S2** in `docs/FOLLOWUPS.md`. Dead/archived: 4 (Facebook, Mattermost, RocketChat, Slack).

---

## 4. Human maintainers

Lightweight, CODEOWNERS-driven. See [`.github/CODEOWNERS`](./.github/CODEOWNERS) for the authoritative list. Each canonical repo has a *single* maintainer-lead who owns launch-day ship/no-ship for their tier — see [LAUNCH-CHECKLIST § 5 Single Ownership Rule](./LAUNCH-CHECKLIST.md#5-single-ownership-rule).

| Tier | Lead repo | Lead role |
|---|---|---|
| OSS | `OpenSIN` | Maintains `pip install opensin` and PyPI publish |
| OSS | `OpenSIN-Code` | Maintains `npm i -g opensin-code` and npm publish |
| Pro | `OpenSIN-WebApp` | Owns `chat.opensin.ai` uptime and Stripe customer portal |
| Pro | `OpenSIN-backend` | Owns fleet control plane + HF Spaces health |
| Marketplace | `website-my.opensin.ai` | Owns `my.opensin.ai` checkout + aggregator render |
| Meta / governance | `OpenSIN-overview` | Owns canon-locked files and launch-week command center |

---

## 5. How a new worker joins the workforce

1. Pick the team it belongs to. If none fits, open a [Feature Request](./.github/ISSUE_TEMPLATE/feature-request.yml) proposing a new team (rare — budget enforced by governance).
2. Scaffold the worker repo from [`Template-SIN-Agent`](https://github.com/OpenSIN-AI/Template-SIN-Agent). The template gives you: A2A protocol handler, HF Space config, health check, structured logging, release workflow.
3. Register the worker ID in the team's `team.json` in this repo under `templates/teams/<Team>.json` **and** in the team's own repo. CI will refuse a PR where the two drift.
4. CI in `Infra-SIN-OpenCode-Stack` rebuilds `oh-my-sin.json` nightly and publishes it to the three consumers (marketplace UI, chat entitlements, Infra-SIN-OpenCode-Stack mirror). See [`schemas/oh-my-sin.schema.json`](./schemas/oh-my-sin.schema.json).

---

## 6. Why this matters

The claim "OpenSIN is an *Agent OS*, not an Agent App" (see [PRODUCT-VISION § Der Pitch in einem Satz](./PRODUCT-VISION.md#der-pitch-in-einem-satz)) only holds if this workforce is real, addressable, and organized. This document is the audit trail. Every count here is derivable from live repo data; every agent is resolvable to a repo; every team is resolvable to a Stripe product.

If you find a drift — a worker on the org page that has no repo, a team with unresolvable agent IDs, a count that does not match `registry/MASTER_INDEX.md` — file it as a [Bug Report](./.github/ISSUE_TEMPLATE/bug-report.yml) with the `workforce-drift` label. We treat those as canon bugs and fix them before launching.
