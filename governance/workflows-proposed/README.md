# Proposed GitHub Actions Workflows

These workflows are drafted, tested locally, and ready to install. They live here
(not in `.github/workflows/`) because the GitHub App token used by the v0 bot
lacks the `workflows` scope — it literally cannot push files into
`.github/workflows/`. A human with repo admin or `workflows` permission must do
the one-time install.

## One-step install

From the repository root:

```bash
bash governance/workflows-proposed/install.sh
git add .github/workflows/
git commit -m "chore(ci): install governance workflows"
git push
```

After push, check the **Actions** tab on GitHub — you should see 3 new workflows
appear and the first scheduled runs will fire within the hour.

## What gets installed

| File | Purpose | Trigger |
| ---- | ------- | ------- |
| `registry-autogenerate.yml` | Re-run `scripts/generate-master-index.js` with live org data, commit diff back to `main`. Prevents repo-count drift forever. | Daily cron (06:00 UTC) + manual dispatch |
| `validate-docs.yml` | Run link-validator + team-manifest-validator on every PR. Fails red if anything is broken. | Pull request into `main` |
| `launch-status.yml` | Run `scripts/launch-status.js` and publish the Go/No-Go dashboard to a tracking issue. Every 30 min during launch week. | Cron + manual dispatch |

## Prerequisites

All three workflows only need the default `GITHUB_TOKEN` — no extra secrets.

For `registry-autogenerate.yml` to see **private** repos in the OpenSIN-AI org,
add a secret `ORG_READ_TOKEN` (fine-grained PAT with `metadata: read` on the
org). Without it the workflow still runs, it just omits private repos from
the count. This is called out in the workflow's first step.

## Why not just grant v0 the `workflows` scope?

You can, but GitHub recommends the opposite: keep bot tokens minimal, and have
humans sign off on any `.github/workflows/` change. This is the reason the scope
exists as a separate permission. The install script model is the low-trust,
high-auditability way.
