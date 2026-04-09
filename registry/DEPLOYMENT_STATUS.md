# Cloud Coder Agents – Deployment Status

**Zeitpunkt:** 2026-04-08 05:55 UTC  
**Organisation:** OpenSIN-AI  
**Token-Besitzer:** delqhi ([REDACTED])  
**Status:** ✅ DEPLOYED & HEALTHY

## Deployed Spaces

| Agent | Space | Status | URL | Health | A2A API | Agent Card |
|-------|-------|--------|-----|--------|---------|------------|
| plugin | OpenSIN-AI/a2a-sin-code-plugin | RUNNING | https://opensin-ai-a2a-sin-code-plugin.hf.space | ✅ 200 | ✅ 200 | ✅ 200 |
| command | OpenSIN-AI/a2a-sin-code-command | RUNNING | https://opensin-ai-a2a-sin-code-command.hf.space | ✅ 200 | ✅ 200 | ✅ 200 |
| tool | OpenSIN-AI/a2a-sin-code-tool | RUNNING | https://opensin-ai-a2a-sin-code-tool.hf.space | ✅ 200 | ✅ 200 | ✅ 200 |
| backend | OpenSIN-AI/a2a-sin-code-backend | RUNNING | https://opensin-ai-a2a-sin-code-backend.hf.space | ✅ 200 | ✅ 200 | ✅ 200 |
| fullstack | OpenSIN-AI/a2a-sin-code-fullstack | RUNNING | https://opensin-ai-a2a-sin-code-fullstack.hf.space | ✅ 200 | ✅ 200 | ✅ 200 |
| frontend | OpenSIN-AI/a2a-sin-code-frontend | RUNNING | https://opensin-ai-a2a-sin-code-frontend.hf.space | ✅ 200 | ✅ 200 | ✅ 200 |

## Secrets Configuration

- ✅ **GITHUB_TOKEN** set for all Spaces (required for cloning OpenSIN-Code repo)
- ⚠️ **OPENAI_API_KEY** (or OPENCODE_API_KEY) may need to be set for LLM calls via OCI proxy
- **HF_TOKEN** automatically available to Spaces

## Applied Fixes (Timeline)

1. **Dockerfile & Permissions**
   - Added `chmod +x /app/start.sh` to fix runtime permission denied
   - Simplified base image, added retry loops for opencode .deb download
   - Excluded unnecessary files via `.dockerignore`

2. **Startup & Repo Cloning**
   - `start.sh` now clones `OpenSIN-Code` automatically using GITHUB_TOKEN if not present
   - Creates opencode config with OCI proxy fallback
   - Exits with clear error if GITHUB_TOKEN missing

3. **FastAPI Route Ordering**
   - Moved `app.mount("/", ...)` after all route definitions to avoid 404 on API endpoints
   - Added `/ui` mount point for Gradio UI (Gradio UI accessible at `/ui`)
   - Root `/` returns service info JSON

4. **Entrypoint Fix**
   - Renamed `app.py` to `main.py` to avoid package shadowing (`app` package vs `app.py`)
   - Updated uvicorn command to `uvicorn main:app`

5. **A2A Compatibility**
   - Added missing `_public_base_url` helper for agent card generation
   - All A2A endpoints (`/a2a/v1`, `/.well-known/*`) validated and working

## Verification

✅ All 6 agents pass health and agent-card checks  
✅ A2A JSON‑RPC endpoint accepts tasks and returns `taskId`  
✅ Gradio UI accessible at `/ui` (redirects to UI)  
✅ Build watcher confirmed stable `RUNNING` state  

**Verification command:**  
`python3 verify_deployment.py --org OpenSIN-AI` → 6/6 healthy

## Fleet Registry Updates

- `OpenSIN-overview/registry/MASTER_INDEX.md` entries already present (lines 60-65)
- URLs automatically resolve via OpenSIN‑AI subdomain
- All agent repos listed with correct types

## Next Steps

1. **LLM API Key**: If LLM calls fail, set `OPENAI_API_KEY` (or `OPENCODE_API_KEY`) in each Space to authenticate to the OCI proxy.
2. **Task Dispatch**: Use `sin-cloud-code-team dispatch <type> <issue>` to send tasks to agents.
3. **Monitor Activity**: Check Space logs in HF UI; watch for commits on `feat/issue-*` branches.
4. **n8n Integration**: PR events should automatically trigger n8n workflows on OCI VM.

---
**Deployment completed:** 2026-04-08 05:55 UTC  
**Fleet status:** All 6 agents operational and ready to work.
