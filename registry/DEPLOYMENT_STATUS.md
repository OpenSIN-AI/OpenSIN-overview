# Cloud Coder Agents – Deployment Status

**Zeitpunkt:** 2026-04-16 12:00 UTC  
**Organisation:** OpenSIN-AI  
**Status:** 🚨 CRITICAL - ALL 6 SPACES DOWN (503)

## OUTAGE REPORT (Issue #10)

**Verified:** 2026-04-16 ~08:30 UTC  
**Root Cause:** HF Free tier spaces auto-sleep after inactivity (48h idle)  
**Impact:** 6 A2A agents completely unreachable, task dispatch impossible

## Current Health Check Results

| Agent    | Space | /health | / | /a2a/v1 | /.well-known/agent-card.json |
|----------|-------|---------|---|---------|------------------------------|
| plugin   | a2a-sin-code-plugin   | ❌ 503 | ❌ 503 | ❌ 503 | ❌ 503 |
| command  | a2a-sin-code-command  | ❌ 503 | ❌ 503 | ❌ 503 | ❌ 503 |
| tool     | a2a-sin-code-tool     | ❌ 503 | ❌ 503 | ❌ 503 | ❌ 503 |
| backend  | a2a-sin-code-backend  | ❌ 503 | ❌ 503 | ❌ 503 | ❌ 503 |
| fullstack| a2a-sin-code-fullstack| ❌ 503 | ❌ 503 | ❌ 503 | ❌ 503 |
| frontend | a2a-sin-code-frontend | ❌ 503 | ❌ 503 | ❌ 503 | ❌ 503 |

**ALL endpoints return 503 (Service Unavailable)**

## Recovery Plan

### Immediate Action Required (needs HF_TOKEN owner)

Restart all 6 Spaces via HF API:

```bash
for space in a2a-sin-code-plugin a2a-sin-code-command a2a-sin-code-tool a2a-sin-code-backend a2a-sin-code-fullstack a2a-sin-code-frontend; do
  curl -X POST "https://huggingface.co/api/spaces/OpenSIN-AI/$space/restart" \
    -H "Authorization: Bearer $HF_TOKEN"
done
```

### Alternative: Restart via HF UI

1. Go to each Space: https://huggingface.co/spaces/OpenSIN-AI/<space-name>
2. Click "Settings" → "Restart Space"

## Prevention: Keep-Alive Setup (TODO)

To prevent future sleep, set up a keep-alive cron:

```bash
# Add to crontab - restart each space every 12 hours
0 */12 * * * curl -X POST "https://huggingface.co/api/spaces/OpenSIN-AI/a2a-sin-code-plugin/restart" -H "Authorization: Bearer $HF_TOKEN"
```

## Historical: Last Known Good State (2026-04-08)

| Agent | Space | Status | URL |
|-------|-------|--------|-----|
| plugin | OpenSIN-AI/a2a-sin-code-plugin | RUNNING | https://opensin-ai-a2a-sin-code-plugin.hf.space |
| command | OpenSIN-AI/a2a-sin-code-command | RUNNING | https://opensin-ai-a2a-sin-code-command.hf.space |
| tool | OpenSIN-AI/a2a-sin-code-tool | RUNNING | https://opensin-ai-a2a-sin-code-tool.hf.space |
| backend | OpenSIN-AI/a2a-sin-code-backend | RUNNING | https://opensin-ai-a2a-sin-code-backend.hf.space |
| fullstack | OpenSIN-AI/a2a-sin-code-fullstack | RUNNING | https://opensin-ai-a2a-sin-code-fullstack.hf.space |
| frontend | OpenSIN-AI/a2a-sin-code-frontend | RUNNING | https://opensin-ai-a2a-sin-code-frontend.hf.space |

## Secrets Configuration (from last deployment)

- ✅ **GITHUB_TOKEN** set for all Spaces
- ⚠️ **OPENAI_API_KEY** (or OPENCODE_API_KEY) may need refresh
- **HF_TOKEN** automatically available to Spaces

## Applied Fixes (from 2026-04-08 deployment)

1. Dockerfile & Permissions fix
2. Startup & Repo Cloning with retry loops
3. FastAPI Route Ordering
4. Entrypoint Fix (app.py → main.py)
5. A2A Compatibility (_public_base_url helper)

---

**Last Updated:** 2026-04-16 12:00 UTC  
**Fleet Status:** 🚨 ALL 6 AGENTS DOWN - REQUIRES MANUAL RESTART  
**Next Update:** After spaces are restarted and verified healthy
