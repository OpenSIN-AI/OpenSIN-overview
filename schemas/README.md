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
