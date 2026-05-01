# Contributing to OpenSIN-overview

> **This repo is the org map and governance index** — not the place for runtime code, product UI, or detailed docs content. Before contributing here, read [BOUNDARIES.md](./BOUNDARIES.md) and [GOVERNANCE.md](./GOVERNANCE.md). If your change belongs in another repo, we will tell you and close the PR with a redirect.

Welcome. We keep this short because the repo is small. The discipline lives in the rules.

---

## 1. Before you write a line of anything

Answer these three questions. If you cannot, open a [Boundary issue](./.github/ISSUE_TEMPLATE/boundary-violation.yml) first and wait for triage.

1. **Is this an organizational map or governance concern, or is it detailed canonical implementation content?**
2. **Which repo already owns the source of truth for what I want to change?**
3. **Should this repo summarize and link, or should the change happen in the owning repo instead?**

### Put it in `OpenSIN-overview` if:

- It clarifies repo roles, ownership boundaries, or canonical responsibilities.
- It indexes teams, agents, MCPs, websites, templates, or registries.
- It helps people find the correct canonical repo.
- It adds or refines a community-health file (CoC, Security, Support, Governance).
- It adds or refines a cross-repo contribution template (PR template, issue template).
- It adds or refines validation, schema, or launch tooling that keeps this repo's claims honest.

### Do **not** put it in `OpenSIN-overview` if:

- It is the detailed docs canon → `OpenSIN-documentation`.
- It is runtime implementation truth → `OpenSIN` / `OpenSIN-Code`.
- It is product or control-plane implementation truth → `OpenSIN-WebApp` / `website-*` / `OpenSIN-backend`.
- It is canonical OpenCode config content → `Infra-SIN-OpenCode-Stack`.
- It is operational secrets, internal IPs, SSH credentials, or runner shared secrets → `Infra-SIN-Dev-Setup` (private).
- It is team-specific `team.json` _content_ → the team's own repo.

---

## 2. Local setup

```bash
git clone https://github.com/OpenSIN-AI/OpenSIN-overview
cd OpenSIN-overview
nvm use          # respects .nvmrc (Node ≥ 20)
npm install      # 0 runtime deps, dev-only tools
```

No application code runs here. Everything is docs + JSON manifests + small validation scripts.

---

## 3. Validate before you push

This repo has a single-command preflight that gates what CI will re-run. Run it **locally** first:

```bash
npm run prelaunch:offline
```

It chains:

| Step | What                                                                           | Script                                |
| ---- | ------------------------------------------------------------------------------ | ------------------------------------- |
| 1    | Markdown link validity (relative paths only)                                   | `scripts/validate-links.js`           |
| 2    | Every `templates/teams/*.json` matches the schema                              | `scripts/validate-team-manifests.js`  |
| 3    | Registry auto-audit re-runs and matches committed `registry/SCAFFOLD_AUDIT.md` | `scripts/audit-repos.js`              |
| 4    | `templates/oh-my-sin.json` re-builds byte-identical                            | `scripts/build-oh-my-sin.js` + `diff` |
| 5    | `scripts/launch-status.js` runs without error                                  | `scripts/launch-status.js`            |

If you changed anything with a launch-critical surface (HF Spaces, web surfaces), also run `npm run prelaunch` (full, includes network probes).

**A red preflight is a blocked PR.** We will not review until it is green locally.

---

## 4. Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/). Required.

| Type        | Use for                                                            |
| ----------- | ------------------------------------------------------------------ |
| `feat:`     | New content, new manifest, new schema, new script                  |
| `fix:`      | Broken link, stale data, wrong count, broken script                |
| `docs:`     | Clarification or rewording of existing docs                        |
| `chore:`    | Tooling, CI config, dependency, lint                               |
| `refactor:` | Internal restructure without user-visible change                   |
| `security:` | Anything touching `SECURITY.md`, secret redaction, or key rotation |

Scope is optional but appreciated: `feat(schema): add oh-my-sin.json schema`.

### Git signing

All commits landing on `main` must be GPG- or SSH-signed. GitHub must show the ✓ Verified badge. If your machine is not set up yet, follow `Infra-SIN-Dev-Setup/docs/git-signing.md`.

---

## 5. PR flow

1. Branch from `main`. Name: `<author>/<area>/<short-slug>` — e.g. `ali/boundaries/add-rule-7`.
2. Keep the PR scoped. One concern per PR. If it is touching 3 canon-locked files, split it.
3. Fill in the [PR template](./.github/pull_request_template.md) completely. Empty boxes = incomplete.
4. Request review: CODEOWNERS auto-assign. During launch-week, also tag the CTO.
5. Respond to review comments within 24 h or comment why you cannot.
6. Merge: squash-and-merge only. The first line of the squash body becomes `main` history.

### Required review rules

| File path                                                                                             | Minimum reviewers                                  | Canon-lock            |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------- |
| `BOUNDARIES.md`, `GOVERNANCE.md`, `PRODUCT-VISION.md`, `LAUNCH-CHECKLIST.md`, `STATE-OF-THE-UNION.md` | 1 maintainer **from a different team than author** | yes — GOVERNANCE §3.2 |
| `schemas/*.schema.json`                                                                               | 1 maintainer + 1 consumer of the schema            | yes                   |
| `templates/oh-my-sin.json`                                                                            | **forbidden — generator-only**                     | yes                   |
| `templates/teams/*.json`                                                                              | 1 maintainer                                       | no                    |
| everything else                                                                                       | 1 maintainer                                       | no                    |

Launch-week (T-4 → T+7) adds CTO sign-off on any canon-locked file.

---

## 6. Security

If you find a leaked secret, credential, internal IP, or SSH user in this repo, **do not open a public issue**. Follow [SECURITY.md § Reporting a Vulnerability](./SECURITY.md#reporting-a-vulnerability). The triage SLA is 4 hours during launch-week.

If you are about to commit anything that looks like a secret: stop. Move it to `Infra-SIN-Dev-Setup` (private). Reference it from here only by its env-var name.

---

## 7. Conduct

All contributors agree to the [Code of Conduct](./CODE_OF_CONDUCT.md). If you experience or witness unacceptable behavior, follow the reporting steps in that document.

---

## 8. Recognition

Contributions are recognized in the repo's `git log`, in launch-day announcements on `blog.opensin.ai`, and — for sustained contribution — by invitation to the maintainer team. We do not tolerate hidden influence; all decisions are made in PRs or in governance discussions visible to every maintainer.
