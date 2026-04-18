# Canonical Repos — Authoritative Map

> **State:** 2026-04-18, post-consolidation wave 2.
> If you open a PR against a repo marked `ARCHIVED` below, it will not be reviewed.

This document is the **single source of truth** for which repository in the
`OpenSIN-AI` organization (and a small number of external repos) owns which
responsibility. When new code is written, it goes into the repo listed here
as the canonical owner of that concern — not a duplicate, not a new repo.

Repos are grouped by domain. Every entry states: URL, actual GitHub name
(in case you knew it by an old alias), the owned surface, and any `DO NOT`
rules.

---

## 1. Core platform (Python)

### OpenSIN — Python kernel
- **URL:** https://github.com/OpenSIN-AI/OpenSIN
- **Domain prefix:** none (flagship repo, keeps the product name)
- **Owns:**
  - `opensin_core/` — QueryEngine, Hook System, Tool System, Permission System, MCP Client, Sandbox, Memory, Sessions
  - `opensin_cli/` — the `opensin` command-line tool
  - `opensin_api/` — HTTP API server
  - `opensin_sdk/` — Python SDK for programmatic access
  - `opensin_agent_platform/` — absorbed content from the archived `opensin-ai-code` repo (reference material; not wired into the build yet)
- **Do not:** open a new `opensin_*` package outside this repo.

---

## 2. Autonomous coding surface (TypeScript)

### OpenSIN-Code — Autonomous CLI
- **URL:** https://github.com/OpenSIN-AI/OpenSIN-Code
- **Domain prefix:** none
- **Owns:** the Claude-Code-class autonomous coding CLI. Standalone binary.
- **Not:** a VS Code extension. Any README that calls this a "VS Code Extension" is wrong.

### OpenSIN-backend — A2A fleet control plane
- **URL:** https://github.com/OpenSIN-AI/OpenSIN-backend
- **Domain prefix:** none
- **Owns:** the runtime control plane that orchestrates the agent fleet at runtime.

### Team-SIN-Code-Core — Coding-team monorepo
- **URL:** https://github.com/OpenSIN-AI/Team-SIN-Code-Core
- **Domain prefix:** `Team-SIN-*`
- **Owns:**
  - Root — Team Manager / orchestrator for the coding team
  - `agents/coding-ceo/` — the Coding-CEO agent (was `A2A-SIN-Coding-CEO`, archived)
  - `agents/code-ai/` — the Code-AI agent (was `A2A-SIN-Code-AI`, archived)
  - `packages/shared-helpers/` — `@opensin/shared-helpers` workspace package
- **Do not:** spin up a new repo for future coding-team agents (`code-devops`, `code-datascience`, ...). Add them as new folders under `agents/`.

### Template-SIN-Agent — Agent blueprint
- **URL:** https://github.com/OpenSIN-AI/Template-SIN-Agent (was `Template-A2A-SIN-Agent`)
- **Domain prefix:** `Template-SIN-*`
- **Owns:** the standardized starting point for any new A2A agent. Merged three earlier templates (Agent, Agent-Worker, Worker) into one.
- **Use:** when you need a brand-new agent that does NOT fit into `Team-SIN-Code-Core`.

---

## 3. Web surface (TypeScript)

Three repos for three distinct properties. Do not confuse them.

| Repo | Deployed at | Purpose |
|---|---|---|
| [`website-opensin.ai`](https://github.com/OpenSIN-AI/website-opensin.ai) | `opensin.ai` | **Open-source marketing site.** Developers, self-hosters, community. Static Vite/Bun site. |
| [`website-my.opensin.ai`](https://github.com/OpenSIN-AI/website-my.opensin.ai) | `my.opensin.ai` | **Paid-layer marketing + marketplace.** Team packages, bundles, conversion funnel. Static Vite/Bun site. |
| [`OpenSIN-WebApp`](https://github.com/OpenSIN-AI/OpenSIN-WebApp) (package: `opensin-chat`) | `chat.opensin.ai` | **Authenticated dashboard.** Login, agent fleet, chat, api-keys, billing. Next.js 16 + Supabase. **Private repo** — contains business logic. |

**Rule of thumb:**
- Anonymous visitor → `website-opensin.ai` or `website-my.opensin.ai`
- Logged-in user → `OpenSIN-WebApp`

---

## 4. Documentation

### OpenSIN-documentation — Public docs website
- **URL:** https://github.com/OpenSIN-AI/OpenSIN-documentation
- **Serves:** https://docs.opensin.ai
- **Owns:** all end-user documentation (guides, tutorials, API reference, install).
- **Not:** organizational / onboarding material. That lives here in `OpenSIN-overview`.

---

## 5. Infrastructure & Setup

### Infra-SIN-Dev-Setup — Everything-to-get-running repo
- **URL:** https://github.com/OpenSIN-AI/Infra-SIN-Dev-Setup
- **Domain prefix:** `Infra-SIN-*`
- **Owns:**
  - Developer environment setup — macOS, OCI, CloudFlare, OpenCode, Docker build
  - End-user first-run setup at `user-onboarding/` (absorbed from archived `OpenSIN-onboarding` repo)
- **Do not:** create a separate repo for new setup automation. Add it here.

---

## 6. Marketing & Launch

### Biz-SIN-Marketing — Launch hub and community strategy
- **URL:** https://github.com/OpenSIN-AI/Biz-SIN-Marketing (was `OpenSIN-Marketing-Release-Strategie`)
- **Domain prefix:** `Biz-SIN-*`
- **Owns:** blog posts, launch plan, press release, social media calendar, demo scripts. Source of truth for marketing copy.
- **Authoritative numbers live in `OpenSIN-overview/registry/`**, not in Marketing READMEs. Marketing consumes them.

---

## 7. Organizational meta repos

### OpenSIN-overview — Organizational SSOT (this repo)
- **URL:** https://github.com/OpenSIN-AI/OpenSIN-overview
- **Owns:** onboarding, repo registry, boundary rules, consolidation reports, naming conventions, agent lexicon.
- **Does not own:** production code. Link to owning repos for runtime / docs / product / control-plane details.

---

## 8. Infrastructure SSOT (formerly external — now in-org)

Two infrastructure repos that are declared SSOT by many other repos across the org. As of 2026-04-18 both were transferred from the personal `Delqhi` account to `OpenSIN-AI` and renamed per the `Infra-SIN-*` convention, so they now inherit org-level branch protection, team reviews, and audit logs.

### OpenSIN-AI/Infra-SIN-OpenCode-Stack
- **URL:** https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack
- **Legacy path (redirects):** `Delqhi/upgraded-opencode-stack`
- **Role:** canonical OpenCode configuration (v2.2.1, 44 skills, 27 MCPs, 5 providers) consumed via `sin-sync` by: OpenSIN, OpenSIN-Code, OpenSIN-WebApp, website-opensin.ai, website-my.opensin.ai, Template-SIN-Agent, Biz-SIN-Marketing.

### OpenSIN-AI/Infra-SIN-Global-Brain
- **URL:** https://github.com/OpenSIN-AI/Infra-SIN-Global-Brain
- **Legacy path (redirects):** `Delqhi/global-brain`
- **Role:** Persistent Code Plan Memory (PCPM v4) daemon. Referenced by all `A2A-SIN-*` agents across the org.

GitHub redirects the old `Delqhi/...` URLs, so any `sin-sync` tooling or older README link continues to resolve. A follow-up link-sweep will update all references to the canonical `OpenSIN-AI/Infra-SIN-*` paths.

---

## Naming convention

Two schemes coexist today. **Both are valid, for different reasons.**

### Flagship / product-facing names (no prefix)
Use the product name as-is:
- `OpenSIN`
- `OpenSIN-Code`
- `OpenSIN-backend`
- `OpenSIN-WebApp`
- `OpenSIN-overview`
- `OpenSIN-documentation`
- `website-opensin.ai`
- `website-my.opensin.ai`

These are the repos that a new user, investor, or contributor is expected to find via search. Using the product name directly is the right call.

### Domain-prefix names (`<Domain>-SIN-*`)
Used for repos that exist only to support the product and would be noise in search:

| Prefix | Meaning | Examples |
|---|---|---|
| `Team-SIN-*` | A coding/business team monorepo of sub-agents | `Team-SIN-Code-Core`, `Team-SIN-Google` (planned), `Team-SIN-BugBounty` (planned) |
| `Infra-SIN-*` | Infrastructure, setup, tooling, CI | `Infra-SIN-Dev-Setup` |
| `Biz-SIN-*` | Business/marketing/sales content | `Biz-SIN-Marketing`, `Biz-SIN-Blog-Posts` |
| `Template-SIN-*` | Templates / blueprints | `Template-SIN-Agent` |

### When to pick which scheme

- If it directly defines the product or its install surface → no prefix (`OpenSIN-*` or `website-*`).
- If it is a supporting artifact → domain prefix (`Infra-SIN-*`, `Biz-SIN-*`, `Team-SIN-*`, `Template-SIN-*`).

Do NOT introduce a third scheme. If you're tempted to, first open an issue in this repo — `repo-proposal: <name>` — and make the case.

---

## Archived repos (April 2026 consolidation)

| Repo | Canonical replacement |
|---|---|
| `OpenSIN-AI/A2A-SIN-Coding-CEO` | `Team-SIN-Code-Core/agents/coding-ceo/` |
| `OpenSIN-AI/A2A-SIN-Code-AI` | `Team-SIN-Code-Core/agents/code-ai/` |
| `OpenSIN-AI/opensin-ai-code` | `OpenSIN/opensin_agent_platform/` |
| `OpenSIN-AI/OpenSIN-onboarding` | `Infra-SIN-Dev-Setup/user-onboarding/` |

These stay on GitHub in read-only state for history. Their READMEs point here.

---

## How to propose a new code repo

Before creating any new `OpenSIN-AI/*` repo, open an issue in this repo
titled `repo-proposal: <name>` answering these four questions:

1. What responsibility does this repo own that no existing canonical repo owns?
2. Why can it not be a folder inside one of the canonical repos?
3. Which naming scheme does it use (product name or domain prefix) and why?
4. Who maintains it?

If the answer to (2) is not clearly **"because it must be deployed
independently, with its own release cycle, and a different language or
runtime than the candidate parent repo"** — the answer is: **make it a
folder, not a repo.**
