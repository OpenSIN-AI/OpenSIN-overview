# Security Policy

> **Scope:** This document covers the [`OpenSIN-AI/OpenSIN-overview`](https://github.com/OpenSIN-AI/OpenSIN-overview) governance repo. For vulnerabilities in the runtime engine, CLI, backend, WebApp, or any other OpenSIN-AI repo, open the report against **that** repo.
>
> **Why a governance repo needs a security policy:** the scripts, schemas, and registries here feed marketplace frontends and CI pipelines across ~200 downstream repos. A compromised `team.json`, a poisoned `oh-my-sin.json`, or a tampered `MASTER_INDEX.md` can cascade into every surface that renders it. Treat this repo accordingly.

---

## 1. Supported versions

| Version                          | Supported                            |
| -------------------------------- | ------------------------------------ |
| `main` branch (HEAD)             | ✅                                   |
| Any tagged release ≤ 30 days old | ✅                                   |
| Anything older                   | ❌ — fix must be rebased onto `main` |

This repo is a rolling governance index, not a versioned library. There are no long-lived stable branches.

---

## 2. Reporting a vulnerability

**Do NOT open a public GitHub issue.**

Use one of these private channels in priority order:

1. **Preferred — [GitHub Private Vulnerability Reporting](https://github.com/OpenSIN-AI/OpenSIN-overview/security/advisories/new)**
   ([docs](https://docs.github.com/en/code-security/security-advisories/privately-reporting-a-security-vulnerability/privately-reporting-a-security-vulnerability))
   This creates a private advisory visible only to maintainers. First-class tooling, no attachments lost, full audit trail.

2. **Fallback — Email:** `security@opensin.ai`
   PGP optional (key fingerprint published in a pinned issue on this repo once available).

3. **Emergency during launch week (2026-04-19 → 2026-04-30):** ping the on-call Discord role `@launch-oncall` in the private `#security` channel. Use this only for SEV-1 (actively exploited, data loss, RCE).

Please include:

- A clear description of the issue and the repo/file/line it affects.
- Reproduction steps, or a proof-of-concept, or a pointer to the commit/PR introducing the issue.
- Your assessment of severity (SEV-1 / SEV-2 / SEV-3) using the [incident template's severity guide](./.github/ISSUE_TEMPLATE/launch-incident.yml).
- Whether you are requesting a [CVE](https://cve.mitre.org/) assignment.

---

## 3. Response SLAs

| Severity                                        | Acknowledgement | Triage | Fix or mitigation |
| ----------------------------------------------- | --------------- | ------ | ----------------- |
| **SEV-1** (active exploit / RCE / data loss)    | 4 h             | 24 h   | 48 h              |
| **SEV-2** (privilege escalation / authn bypass) | 24 h            | 72 h   | 7 d               |
| **SEV-3** (info leak / tampering / DoS)         | 72 h            | 14 d   | 30 d              |

SLAs are measured in wall-clock time during launch week (`2026-04-19` → `2026-04-30`) and in business hours (CET) outside of it.

---

## 4. Disclosure policy

We follow **coordinated disclosure**.

1. You report privately (§2).
2. We acknowledge (§3) and triage.
3. We confirm the fix in a private PR and credit you (if desired) in the release notes.
4. We publish a [GitHub Security Advisory](https://github.com/OpenSIN-AI/OpenSIN-overview/security/advisories) **after** the fix lands on `main` and downstream consumers have had a reasonable window to update.
5. **90-day maximum embargo.** If we cannot fix a SEV-1/SEV-2 within 90 days, we publish the advisory anyway and ship whatever mitigation we have — silence is not a strategy.

You are welcome to publish independently **after** the advisory is public, or earlier with written agreement.

---

## 5. What counts as a vulnerability in _this_ repo

Because this repo is a governance index, "vulnerability" has a narrower meaning than in a product repo. In-scope:

- **Registry tampering** — changes to `registry/MASTER_INDEX.md`, `registry/SCAFFOLD_AUDIT.md`, `templates/oh-my-sin.json`, `platforms/canonical-repos.json`, or any `templates/teams/*.json` that are **not** produced by the documented pipeline and go unreviewed.
- **Script RCE** — any file under `scripts/` that executes untrusted input (filename, issue body, API response) without sanitisation.
- **Workflow privilege escalation** — any GitHub Actions workflow (in `.github/workflows/` or `governance/workflows-proposed/`) that leaks secrets, runs untrusted PR code with write tokens, or bypasses `CODEOWNERS`.
- **Schema escape** — any `schemas/*.schema.json` that allows values that downstream consumers (marketplace UI, chat.opensin.ai dashboard) interpret as HTML/JS/SQL without further validation. Schemas here are the _first_ line of defence for the marketplace.
- **Typosquatting / dependency confusion** — since `package.json` is `private: true` and we run zero runtime dependencies, this is extremely unlikely — but a PR adding an npm dependency that resolves to a malicious registry package is in scope.
- **Chain of trust breaks** — anything that lets a non-CODEOWNER merge into `main` without review.

Out of scope **in this repo** (report in the canonical repo instead):

- Runtime vulnerabilities in `OpenSIN` (Python engine) → file with `OpenSIN-AI/OpenSIN`.
- Vulnerabilities in `OpenSIN-Code` (CLI), `OpenSIN-backend` (control plane), `OpenSIN-WebApp` (chat.opensin.ai), or the websites → file with that specific repo.
- Issues with individual A2A-SIN-\* agents → file with that agent repo.
- OpenCode config issues → `OpenSIN-AI/Infra-SIN-OpenCode-Stack`.
- PCPM / memory daemon → `OpenSIN-AI/Infra-SIN-Global-Brain`.

See [BOUNDARIES.md](./BOUNDARIES.md) for the full canonical-ownership map.

---

## 6. Hall of fame

We credit reporters in the release notes and in a `docs/security/hall-of-fame.md` file (created on first report). If you prefer to remain anonymous, say so in the report.

---

## 7. Dependencies and automated scanning

This repo pins zero runtime dependencies on purpose (`package.json` declares `private: true`, no `dependencies` / `devDependencies` at the time of writing). The only recurring supply-chain surface is **GitHub Actions pin updates**. Those are handled automatically by [Dependabot](.github/dependabot.yml).

If you spot an unpinned action reference, an outdated major, or a dependency that snuck into `package.json`, open a PR — that itself counts as a SEV-3 report.

---

Last reviewed: 2026-04-19.
