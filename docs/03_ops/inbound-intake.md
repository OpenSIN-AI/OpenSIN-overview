# Inbound Intake — Operations Guide

## Overview

The OpenSIN-overview repository uses an inbound-intake lane to normalize operational work into GitHub issues before any manual triage or repo changes begin.

## Architecture

```
[External Platform] → [Webhook/Poller] → [Normalize] → [Create GitHub Issue] → [Repo Triage]
```

## Prerequisites

- n8n running on OCI VM (`http://92.5.60.87:5678`)
- GitHub Personal Access Token with repo scope
- `inbound-intake-opensin-overview` workflow imported but inactive until explicitly enabled

## Workflow: `inbound-intake-opensin-overview`

### Trigger
Webhook POST to `http://92.5.60.87:5678/webhook/inbound-work-opensin-overview`

### Body Schema
```json
{
  "source": "github|telegram|manual|compliance",
  "type": "bug|enhancement|task|governance",
  "title": "Work item title",
  "description": "Detailed description",
  "priority": "low|medium|high|critical",
  "metadata": {}
}
```

### Steps
1. Webhook receives incoming payload
2. Normalize Work Item transforms the payload into the canonical schema
3. Create GitHub Issue opens a tracker in `OpenSIN-AI/OpenSIN-overview`
4. Repo triage maps the issue to SSOT, governance, or fleet-board follow-up

## PR Watcher

`scripts/watch-pr-feedback.sh` snapshots the open PR list for this repository and writes watcher state to `/tmp/opensin-pr-watcher`.

## File Locations

| File | Path |
|------|------|
| governance contract | `governance/repo-governance.json` |
| PR watcher contract | `governance/pr-watcher.json` |
| platform registry | `platforms/registry.json` |
| n8n workflow | `n8n-workflows/inbound-intake.json` |
| watcher script | `scripts/watch-pr-feedback.sh` |
| operations guide | `docs/03_ops/inbound-intake.md` |

## Activation

To activate this lane:

1. Import `n8n-workflows/inbound-intake.json` into n8n
2. Set the appropriate GitHub credentials in n8n
3. Register any new intake source in `platforms/registry.json`
4. Run the PR watcher on a schedule if governance monitoring is needed
