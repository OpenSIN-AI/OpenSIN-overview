# OpenSIN-overview Boundaries

## Role

`OpenSIN-overview` is the **organizational map, governance index, and community-health surface** for OpenSIN-AI.

Short version:

- **This repo = org map, registry index, governance overview, community-health surface (CoC / Security / Support / Governance)**
- **Not this repo = canonical runtime, canonical docs body, canonical config source, or product/control-plane implementation**

---

## Canonical Ownership

| Concern | Canonical Repo |
|---|---|
| Org map, registry index, cross-repo governance overview | `OpenSIN-overview` (this repo) |
| Community-health files (CoC, Security policy, Support, Governance) | `OpenSIN-overview` |
| Org-wide contribution rules, PR/issue templates | `OpenSIN-overview` |
| Launch-week command center + Launch Checklist | `OpenSIN-overview` |
| Team manifest schema + reference manifests (`templates/teams/*.json`) | `OpenSIN-overview` |
| Aggregated marketplace catalog (`templates/oh-my-sin.json`) build input | `OpenSIN-overview` (output is published by `Infra-SIN-OpenCode-Stack`) |
| Runtime core / engine | `OpenSIN` |
| Autonomous CLI + SDK | `OpenSIN-Code` |
| Official documentation body | `OpenSIN-documentation` |
| Developer portal body | `website-developers.opensin.ai` |
| OpenCode config / skills / plugins | `OpenSIN-AI/Infra-SIN-OpenCode-Stack` |
| Persistent agent memory (PCPM v4) | `OpenSIN-AI/Infra-SIN-Global-Brain` |
| Product web app | `OpenSIN-AI/OpenSIN-WebApp` |
| A2A fleet control plane | `OpenSIN-AI/OpenSIN-backend` |
| Paid marketing + marketplace + Stripe Checkout | `OpenSIN-AI/website-my.opensin.ai` |
| Open-source marketing | `OpenSIN-AI/website-opensin.ai` |
| CI runtime secrets + ops runbooks | `OpenSIN-AI/Infra-SIN-Dev-Setup` (private) |

---

## This repo MUST own

- High-level repo-role mapping
- Organizational registries and indexes (`registry/MASTER_INDEX.md`, `platforms/registry.json`)
- Cross-repo governance links (`GOVERNANCE.md`, `governance/`)
- Role boundaries and ownership summaries (this file)
- Discovery docs for teams, agents, MCPs, websites, templates (`START-HERE.md`, `README.md`)
- Community-health files: `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `GOVERNANCE.md`
- Contribution flow: `CONTRIBUTING.md`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/*`
- Launch-week Go/No-Go: `LAUNCH-CHECKLIST.md`, `STATE-OF-THE-UNION.md`
- Product context: `PRODUCT-VISION.md`, `WORKFORCE.md`
- Meta-tooling hygiene: `package.json`, `.editorconfig`, `.nvmrc`, `.gitattributes`, `.github/dependabot.yml`
- Validation scripts that keep this repo's claims honest (`scripts/validate-*`, `scripts/audit-*`, `scripts/build-oh-my-sin.js`, `scripts/prelaunch-sweep.sh`)
- JSON schemas for the manifests this repo curates (`schemas/*.schema.json`)

## This repo MUST NOT own

- Runtime engine semantics
- Detailed official docs canon (that is `OpenSIN-documentation`)
- Canonical OpenCode config files (that is `Infra-SIN-OpenCode-Stack`)
- Product implementation truth (that is `OpenSIN-WebApp`, `website-*`)
- Control-plane implementation truth (that is `OpenSIN-backend`)
- Persistent-memory backend truth (that is `Infra-SIN-Global-Brain`)
- CI runtime secrets, internal IPs, OCI VM hostnames, systemd unit contents, SSH users (that is `Infra-SIN-Dev-Setup`, private)
- `team.json` *content* of any individual team (each team repo owns its own manifest; this repo only mirrors them under `templates/teams/` as a read-through SSOT for the aggregator)

---

## Hard rules

### 1. Index, do not absorb
This repo may point to canonical repos and summarize them, but must not absorb their detailed source-of-truth content. A summary exceeding ~30 lines is a red flag — link instead.

### 2. Governance map, not implementation owner
This repo may state who owns a concern. It must not become the repo that implements every concern.

### 3. SSOT scope must stay narrow
If this repo uses "single source of truth," that truth is limited to **organizational mapping, governance, community-health surfaces, and the team-manifest schema** unless a narrower scope is explicitly named.

### 4. Link to canon
When runtime, docs, config, product, or control-plane details are needed, this repo should link outward to the owning repo instead of duplicating the detail.

### 5. No live secrets, no internal addresses
Never commit API keys, tokens, SSH usernames, private hostnames, or internal IP addresses to this public repo. CI credentials, OCI VM IPs, runner shared secrets, and n8n API keys live in `Infra-SIN-Dev-Setup` (private). Every doc that references internal infra must use the public DNS alias and point readers to `Infra-SIN-Dev-Setup` for the real values. Violation = P0 incident, rotate immediately via [SECURITY.md](./SECURITY.md).

### 6. Preserve determinism
Any generated artifact in this repo (`registry/MASTER_INDEX.md`, `registry/SCAFFOLD_AUDIT.md`, `templates/oh-my-sin.json`) must be rebuildable byte-identically from its inputs. Hand-editing generated files is forbidden; change the generator or the inputs instead.

### 7. The Canon-Lock
`BOUNDARIES.md`, `GOVERNANCE.md`, `PRODUCT-VISION.md`, `LAUNCH-CHECKLIST.md`, `STATE-OF-THE-UNION.md`, and `schemas/*` are canon-locked. Changing them requires a GOVERNANCE §3.2 PR with at least one maintainer approval from a different team than the author. Launch-week (T-4 → T+7) requires CTO sign-off.

---

## Applying the rules to a new change

Before opening a PR touching this repo, answer in order:

1. **Does this change organizational mapping, governance, community-health, or a manifest schema?** If not → it probably belongs in another repo. Stop.
2. **Does this change break Rule 5 (secrets) or Rule 6 (determinism)?** If yes → STOP, fix first.
3. **Does this change touch a canon-locked file (Rule 7)?** If yes → mark the PR `canon-lock` and follow GOVERNANCE §3.2.
4. **Is the change > 30 lines of content that duplicates another repo?** If yes → replace with a link.

If you are unsure, open a Boundary-Violation issue (`.github/ISSUE_TEMPLATE/boundary-violation.yml`) **before** writing code.

---

## Relationship to `governance/BOUNDARY-ROLE-RULES.md`

`governance/BOUNDARY-ROLE-RULES.md` is the one-line operator reference. This file is the full contract. If they disagree, **this file wins** and `governance/BOUNDARY-ROLE-RULES.md` must be updated in the same PR.
