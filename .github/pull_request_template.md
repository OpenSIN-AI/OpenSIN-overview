<!--
  PR template for OpenSIN-AI/OpenSIN-overview
  This repo = governance index. Every change has cross-repo blast radius
  (CODEOWNERS on every path). Fill in every section. Do not delete headings.
-->

## Summary

<!-- What changed? One paragraph. -->

## Why

<!-- What problem does this solve? Link to the issue / FOLLOWUPS ticket / STATE-OF-THE-UNION finding that motivated it. -->

- Closes #
- Related:

## Kind of change

- [ ] Governance rule, boundary, or canonical-ownership change (needs §3.2 review per [GOVERNANCE.md](../GOVERNANCE.md))
- [ ] New or updated script under `scripts/`
- [ ] New or updated schema under `schemas/`
- [ ] New or updated registry / platforms / team manifest
- [ ] Documentation (root `.md` files or `docs/`)
- [ ] CI / workflow (under `.github/workflows/` or `governance/workflows-proposed/`)
- [ ] Chore (editor config, gitignore, tooling) — low risk

## Boundary check (required — see [BOUNDARIES.md](../BOUNDARIES.md))

### Surface type

- [ ] Org map / registry index
- [ ] Governance rule or boundary
- [ ] Process / CI for this repo only
- [ ] Launch-operational tooling (scripts + runbooks for the 2026-04-23 launch)
- [ ] ⚠️ Detailed implementation content (runtime / docs canon / product / control-plane) — **likely wrong repo**

### Verification

- [ ] This PR keeps OpenSIN-overview as an index and governance repo
- [ ] This PR does not duplicate runtime / docs / config / product implementation canon
- [ ] Where detailed truth exists, this PR links outward to the owning repo
- [ ] If I touched `BOUNDARIES.md`, `GOVERNANCE.md`, `PRODUCT-VISION.md`, or `CODEOWNERS`, I have two CODEOWNERS approvers (not one)

## Risk

- [ ] Low — docs-only or adds a new optional file
- [ ] Medium — changes a script or schema that downstream consumers rely on
- [ ] High — changes CODEOWNERS, BOUNDARIES, a schema in a breaking way, or the registry contract

## Rollback plan

<!-- How do we undo this if it goes wrong? "revert this PR" is acceptable ONLY for low-risk changes. -->

## Testing / evidence

- [ ] `node scripts/validate-links.js` passes locally (required for any `.md` change)
- [ ] `node scripts/validate-team-manifests.js` passes locally (required for any `templates/teams/**` change)
- [ ] `node scripts/launch-status.js` still runs (required for any `scripts/launch-status.js` change)
- [ ] `node scripts/audit-repos.js` still runs (required for any script / canonical-list change)
- [ ] Attached screenshots / command output below demonstrating the change works

<!-- Paste command output or screenshots here. -->

## Launch-week flag

- [ ] This PR should merge AFTER 2026-04-23 (non-launch-critical)
- [ ] This PR is launch-critical and MUST merge by T-1 (2026-04-22) — specify gate ID from [LAUNCH-CHECKLIST.md](../LAUNCH-CHECKLIST.md):

<!-- e.g. "Gate G7 (HF Spaces)" or "Tag 2 / DOC-2" -->

## Checklist

- [ ] I read [`CONTRIBUTING.md`](../CONTRIBUTING.md), [`BOUNDARIES.md`](../BOUNDARIES.md), and [`GOVERNANCE.md`](../GOVERNANCE.md).
- [ ] I followed the boundary rules. If unsure I opened a Boundary issue first (`.github/ISSUE_TEMPLATE/boundary-violation.yml`).
- [ ] I added / updated documentation for every new user-facing behaviour.
- [ ] I did NOT commit secrets, tokens, personal data, or customer data. Scripts read from env vars, not hardcoded values.
