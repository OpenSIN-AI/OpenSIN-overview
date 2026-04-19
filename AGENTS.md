# AGENTS.md — agent contract for `OpenSIN-overview`

> This file is the machine-readable contract every AI agent (Claude Code, Cursor, Codex, GPT-Engineer, v0, etc.) MUST follow when editing this repo. Human contributors: read [CONTRIBUTING.md](./CONTRIBUTING.md) first, then this file.

---

## 1. What this repo is (and is not)

**Is:** the **org-map + governance index** for [OpenSIN-AI](https://github.com/OpenSIN-AI). It owns:

- The canonical list of repos, teams, agents, templates, skills, websites.
- Governance rules (`BOUNDARIES.md`, `GOVERNANCE.md`, `CONTRIBUTING.md`).
- The launch-operational scripts and runbooks for the 2026-04-23 launch.
- Cross-repo tracking issues.

**Is not** (these live in other repos — link, don't copy):

| Detail | Canonical repo |
|---|---|
| Python core runtime | [`OpenSIN`](https://github.com/OpenSIN-AI/OpenSIN) |
| TS CLI runtime | [`OpenSIN-Code`](https://github.com/OpenSIN-AI/OpenSIN-Code) |
| Docs canon | [`OpenSIN-documentation`](https://github.com/OpenSIN-AI/OpenSIN-documentation) |
| Fleet control-plane | [`OpenSIN-backend`](https://github.com/OpenSIN-AI/OpenSIN-backend) |
| OpenCode stack config | [`Infra-SIN-OpenCode-Stack`](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) |
| Pro web app | [`OpenSIN-WebApp`](https://github.com/OpenSIN-AI/OpenSIN-WebApp) |
| Marketplace frontend | [`website-my.opensin.ai`](https://github.com/OpenSIN-AI/website-my.opensin.ai) |

See [BOUNDARIES.md](./BOUNDARIES.md) for the enforceable rules. A PR that moves implementation canon **into** this repo should be rejected.

---

## 2. Runtime reality

This repo is **scripts-only**. Zero runtime dependencies. No build step. No deploy target.

```bash
# All tooling is plain Node.js (>= 20) and bash.
node --version    # must be >= 20
npm install       # currently a no-op (zero deps) — kept for future optional deps
npm run validate  # runs before any commit touching .md or templates/**
```

No `bun install`, no `bun run start`, no Docker. Earlier versions of this file were wrong about that.

---

## 3. Hard rules for agents

1. **Never** add a runtime dependency to `package.json` without a governance PR. Zero-deps is a deliberate property (supply-chain risk at the org-index layer is unacceptable).
2. **Never** duplicate implementation content from another repo. If you catch yourself pasting code or a config fragment, STOP and link to the source repo instead.
3. **Never** edit `BOUNDARIES.md`, `GOVERNANCE.md`, `PRODUCT-VISION.md`, `LICENSE`, or `.github/CODEOWNERS` without two CODEOWNERS approvers.
4. **Never** commit secrets. Scripts MUST read tokens from env vars (`GITHUB_TOKEN`, `HF_TOKEN`, `STRIPE_*`, `N8N_*`). There is a pre-commit check in [SECURITY.md](./SECURITY.md) — use it.
5. **Always** run `npm run validate` before proposing a PR that touches `*.md` or `templates/**`. This catches broken links and malformed team manifests.
6. **Always** run `bash scripts/prelaunch-sweep.sh` before declaring a launch-week PR green.

---

## 4. Where to find truth

| Question | File |
|---|---|
| Where am I? What is this org? | [README.md](./README.md) |
| I'm new, where do I start? | [START-HERE.md](./START-HERE.md) |
| What's the launch status? | [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md) + `npm run launch-status` |
| Current state vs target state | [STATE-OF-THE-UNION.md](./STATE-OF-THE-UNION.md), [PRODUCT-VISION.md](./PRODUCT-VISION.md) |
| What can go in this repo? | [BOUNDARIES.md](./BOUNDARIES.md) |
| How are decisions made? | [GOVERNANCE.md](./GOVERNANCE.md) |
| How do I contribute? | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| How do I report a vuln? | [SECURITY.md](./SECURITY.md) |
| What does script X do? | [scripts/README.md](./scripts/README.md) |
| What does schema X describe? | [schemas/README.md](./schemas/README.md) |
| Who owns repo X? | [registry/MASTER_INDEX.md](./registry/MASTER_INDEX.md) |
| Which team sells which agent? | [templates/oh-my-sin.json](./templates/oh-my-sin.json) (generated) |

---

## 5. Workflow for common agent tasks

### Adding a new team to the marketplace

1. Add / update the per-team manifest under `templates/teams/<team>.json`. Follow [schemas/team.schema.json](./schemas/team.schema.json).
2. Run `npm run validate:manifests`. Fix any errors.
3. Run `npm run build-marketplace` to regenerate `templates/oh-my-sin.json`.
4. Run `npm run validate:links`. Open a PR using the default template. Fill in Risk + Rollback.

### Fixing a broken cross-repo link

1. Run `npm run validate:links` to list the exact offenders and line numbers.
2. Fix the links. Re-run until green.
3. Never replace a real outward link with an in-repo duplicate — the whole point is linking out.

### Pre-launch gate sweep

1. `npm run prelaunch` runs everything: validate-links, validate-manifests, audit-repos, build-marketplace, launch-status, check-web, check-hf.
2. Any red gate = blocker. Do not merge launch-critical PRs on a red sweep without a written waiver referencing [GOVERNANCE.md §3.2](./GOVERNANCE.md).

### Adding a canonical repo to the org map

1. Edit [registry/MASTER_INDEX.md](./registry/MASTER_INDEX.md) generator source (`scripts/generate-master-index.js`) — not the generated file directly.
2. Run `npm run index`.
3. Run `npm run audit` to verify CODEOWNERS + repo topics are set correctly on the live repo.

---

## 6. Scope guard — a self-check before committing

Ask yourself, literally:

> "Is what I'm about to commit the **index** of something that lives elsewhere, a **rule** about how other repos relate to each other, or a **tool** that inspects the org? Or is it **the thing itself**?"

- Index / rule / inspection tool → this repo is fine.
- The thing itself → wrong repo. Open it in the owning repo instead.

If in doubt, open a [Boundary violation](./.github/ISSUE_TEMPLATE/boundary-violation.yml) issue and wait for a CODEOWNERS decision. Do not guess.

---

## 7. Contact

- Launch-week operator channel: Slack `#launch-alerts`
- Issues: [OpenSIN-overview/issues](https://github.com/OpenSIN-AI/OpenSIN-overview/issues)
- Vulns: follow [SECURITY.md](./SECURITY.md) — do **not** open a public issue.
