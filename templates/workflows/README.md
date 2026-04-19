# Ready-to-copy GitHub Actions workflows

These workflows are **templates**. They live in this governance repo as the
authoritative source of truth, and individual repos copy them into their own
`.github/workflows/` directory to adopt them.

We don't use a monorepo runner for these — each repo owns its own CI. The
templates here guarantee that every consumer starts from the same version.

## Available templates

### `hf-keep-alive.yml`

**Purpose:** Prevent HuggingFace Spaces from going cold (503). This solves
launch blocker **HF-1** ([LAUNCH-CHECKLIST.md § Tag 1](../../LAUNCH-CHECKLIST.md)).

**Adopt it:**

```bash
# Inside the target repo (e.g. Infra-SIN-OpenCode-Stack)
mkdir -p .github/workflows
curl -o .github/workflows/hf-keep-alive.yml \
  https://raw.githubusercontent.com/OpenSIN-AI/OpenSIN-overview/main/templates/workflows/hf-keep-alive.yml
```

**Configure it:**

1. Add `HUGGINGFACE_TOKEN` to the repo's Actions secrets
   (`Settings → Secrets and variables → Actions → New repository secret`).
   Scope: `write` on the 6 target Spaces.
2. The workflow pings all 6 Spaces every 10 minutes. If a Space returns
   non-2xx, it POSTs `/api/spaces/<owner>/<name>/restart` to the HF API.
3. Watch the Actions tab on the first run. Expected: 24/24 endpoints → 2xx
   within 3–5 minutes of the first restart.

**Why live here and not in the target repo:** Once multiple infra repos need
the same keep-alive logic, we update this one file and tell everyone to re-pull.
Same approach as Renovate's `config:base`.

---

## Adding a new template

1. Write the workflow so it is fully self-contained (no external composite
   actions unless pinned to a SHA).
2. Top of the file: comment block explaining purpose, required secrets,
   required env vars, expected schedule.
3. Bottom of the file: exit-code semantics (0 = no action needed, 1 = we
   triggered a remediation, 2 = remediation failed).
4. Add an entry here in this README with copy-paste adopt instructions.
5. Open a PR. Governance review by `@OpenSIN-AI/core`.
