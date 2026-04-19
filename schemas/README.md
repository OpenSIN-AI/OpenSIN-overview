# Schemas

JSON Schemas for cross-repo data contracts in OpenSIN-AI.

## `team.schema.json`

Schema for `team.json`, the marketplace manifest that lives in every `Team-SIN-*` repo. Decided in Wave 4 — Option A (see [PRODUCT-VISION.md § Marketplace](../PRODUCT-VISION.md#marketplace--entschieden-option-a-metadata-manifeste)).

### Contract

- **One file per team.** `Team-SIN-*/team.json` is the SSOT for that team's composition, marketing copy, pricing, and required permissions.
- **Aggregated downstream.** A CI job in `Infra-SIN-OpenCode-Stack` reads all 17 team manifests and produces `oh-my-sin.json`, which the marketplace frontend at `website-my.opensin.ai/marketplace/` consumes.
- **Agents stay in `A2A-SIN-*`.** `team.json` only references agent IDs — no code is duplicated.
- **Stripe products** are created server-side and their IDs are committed back into `team.json` once the team goes live.

### Validating a team manifest

```bash
# With ajv (npm i -g ajv-cli)
ajv validate -s schemas/team.schema.json -d path/to/Team-SIN-Commerce.json --spec=draft2020

# Or in Node
node -e "
  const Ajv = require('ajv/dist/2020');
  const ajv = new Ajv({allErrors: true});
  const validate = ajv.compile(require('./schemas/team.schema.json'));
  const ok = validate(require('./templates/teams/Team-SIN-Commerce.json'));
  if (!ok) { console.error(validate.errors); process.exit(1); }
  console.log('valid');
"
```

### Reference manifests

All 17 current team manifests live in [`../templates/teams/`](../templates/teams/). The gold standard is [`Team-SIN-Commerce.json`](../templates/teams/Team-SIN-Commerce.json) — use it as the template when adding a new team.

### When to bump `$schema_version`

Only for breaking changes (renamed/removed required fields). Additive changes (new optional fields, new enum values) stay at the same `$schema_version`.

---

## `oh-my-sin.schema.json`

Schema for `templates/oh-my-sin.json`, the **aggregated** marketplace registry. Produced by [`scripts/build-oh-my-sin.js`](../scripts/build-oh-my-sin.js). Consumed by:

- `website-my.opensin.ai/marketplace/` (product catalogue render)
- `Infra-SIN-OpenCode-Stack/oh-my-sin.json` (mirror for the A2A team register — see M2 ticket)
- `OpenSIN-WebApp/chat.opensin.ai` (entitlement hydration after a purchase)

### Contract

- **Hand-editing is forbidden.** The `generator` field is a `const` — any downstream consumer that sees a different value should refuse the file.
- **Deterministic output.** Same set of team manifests → byte-identical aggregator (modulo `generated_at`). CI asserts this before committing a nightly rebuild.
- **One source-of-truth path per team.** Each aggregated entry carries `source_file` pointing back to the per-team manifest.

### Validating the aggregator

```bash
node scripts/validate-team-manifests.js   # checks each team manifest first
node scripts/build-oh-my-sin.js           # regenerates templates/oh-my-sin.json
# The pre-commit hook (or CI) would then assert the schema:
# ajv validate -s schemas/oh-my-sin.schema.json -d templates/oh-my-sin.json --spec=draft2020
```

### When to bump `$schema_version`

Bumping the aggregator `$schema_version` is a **breaking change for three live frontends** (marketplace UI, Infra-SIN-OpenCode-Stack mirror, chat.opensin.ai entitlements). Do it only in a cross-repo coordinated rollout — follow [GOVERNANCE.md § 3.2](../GOVERNANCE.md#32-governance-level-changes-the-5-case).
