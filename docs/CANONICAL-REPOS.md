# Canonical Repos — Authoritative Map

> **State: April 2026, post-consolidation.**
> If you open a PR against a repo that is marked `ARCHIVED` below, it will not be reviewed.

This document is the **single source of truth** for which repository owns which
responsibility in OpenSIN-AI. When new code is written, it goes into the repo
listed here as the canonical owner of that concern — not a duplicate.

## Code repos

### OpenSIN — Python Kernel

**URL:** https://github.com/OpenSIN-AI/OpenSIN
**Language:** Python
**Owns:**

- `opensin_core/` — QueryEngine, Hook System, Tool System, Permission System, MCP Client, Sandbox, Memory, Sessions
- `opensin_cli/` — the `opensin` command-line tool
- `opensin_api/` — HTTP API server
- `opensin_sdk/` — Python SDK for programmatic access
- `opensin_agent_platform/` — absorbed content from the archived `opensin-ai-code` repo; reference material only, not yet wired into the build

**Do not** open a new `opensin_*` package outside this repo.

### OpenSIN-Code — Autonomous TypeScript CLI

**URL:** https://github.com/OpenSIN-AI/OpenSIN-Code
**Language:** TypeScript
**Owns:** the Claude-Code-class autonomous coding CLI. Standalone binary.

Distinct from the Python CLI at `OpenSIN/opensin_cli/`. They address different
use cases — Python CLI is for scripting the kernel, this one is a full
terminal coding agent.

### OpenSIN-backend — A2A Fleet Control Plane

**URL:** https://github.com/OpenSIN-AI/OpenSIN-backend
**Language:** TypeScript
**Owns:** the control plane that orchestrates the agent-to-agent fleet at runtime.

### Team-SIN-Code-Core — Coding Team Monorepo

**URL:** https://github.com/OpenSIN-AI/Team-SIN-Code-Core
**Language:** TypeScript (pnpm workspace)
**Owns:**

- Root — Team Manager / orchestrator for the coding team
- `agents/coding-ceo/` — the Coding-CEO agent (was `A2A-SIN-Coding-CEO`)
- `agents/code-ai/` — the Code-AI agent (was `A2A-SIN-Code-AI`)
- `packages/shared-helpers/` — `@opensin/shared-helpers` workspace package

All future coding-team agents (`code-devops`, `code-datascience`, ...)
are added as new folders under `agents/`. **Do not spin up a new repo for them.**

## Meta repos

### OpenSIN-overview — Organizational SSOT

**URL:** https://github.com/OpenSIN-AI/OpenSIN-overview (this repo)
**Owns:** onboarding, repo registry, boundary rules, consolidation reports.
**Does not own:** any production code. Link to owning repos for runtime/docs/product/control-plane details.

### OpenSIN-documentation — Public Docs Website

**URL:** https://github.com/OpenSIN-AI/OpenSIN-documentation
**Serves:** https://docs.opensin.ai
**Owns:** all user-facing documentation (guides, tutorials, API reference).

## Archived repos

| Repo | Status | Canonical replacement |
|---|---|---|
| `OpenSIN-AI/A2A-SIN-Coding-CEO` | ARCHIVED | `Team-SIN-Code-Core/agents/coding-ceo/` |
| `OpenSIN-AI/A2A-SIN-Code-AI`    | ARCHIVED | `Team-SIN-Code-Core/agents/code-ai/` |
| `OpenSIN-AI/opensin-ai-code`    | ARCHIVED | `OpenSIN/opensin_agent_platform/` |

These repos stay on GitHub in read-only state for history. Their READMEs point here.

## How to propose a new code repo

Before creating any new `OpenSIN-AI/*` repo, open an issue in **this** repo
titled `repo-proposal: <name>` answering:

1. What responsibility does this repo own that no existing canonical repo owns?
2. Why can it not be a folder inside one of the canonical repos?
3. Who maintains it?

If the answer to (2) is not clearly "because it must be deployed independently
with its own release cycle and a different language or runtime," the answer
is usually: **make it a folder, not a repo.**
