# Cloud Coder Agents — Deployment Status

**Stand:** 2026-04-19 (live `curl`-verifiziert)
**Organisation:** OpenSIN-AI
**Overall Status:** 🚨 **CRITICAL — 24/24 Endpoints liefern HTTP 503**
**Tage in Outage:** ≥ 3 (letzte dokumentierte 200-Response 2026-04-08, 12 Tage)
**Launch-Impact:** BLOCKER (G7 in [LAUNCH-CHECKLIST](../LAUNCH-CHECKLIST.md#0-gono-go-kriterien)).

---

## 1. Live Health Check (2026-04-19)

```bash
# Script zum Reproduzieren:
for s in a2a-sin-code-plugin a2a-sin-code-command a2a-sin-code-tool \
         a2a-sin-code-backend a2a-sin-code-fullstack a2a-sin-code-frontend; do
  for ep in health "" "a2a/v1" ".well-known/agent-card.json"; do
    curl -o /dev/null -s -w "$s /$ep %{http_code}\n" \
      --max-time 6 "https://opensin-ai-$s.hf.space/$ep"
  done
done
```

| Space | `/health` | `/` | `/a2a/v1` | `/.well-known/agent-card.json` |
|---|:---:|:---:|:---:|:---:|
| `a2a-sin-code-plugin` | 🚨 503 | 🚨 503 | 🚨 503 | 🚨 503 |
| `a2a-sin-code-command` | 🚨 503 | 🚨 503 | 🚨 503 | 🚨 503 |
| `a2a-sin-code-tool` | 🚨 503 | 🚨 503 | 🚨 503 | 🚨 503 |
| `a2a-sin-code-backend` | 🚨 503 | 🚨 503 | 🚨 503 | 🚨 503 |
| `a2a-sin-code-fullstack` | 🚨 503 | 🚨 503 | 🚨 503 | 🚨 503 |
| `a2a-sin-code-frontend` | 🚨 503 | 🚨 503 | 🚨 503 | 🚨 503 |

**Alle 24 Checks** antworten mit 503. Das bestätigt die Hypothese, dass alle 6 Spaces nach Inaktivitäts-Sleep nicht wieder hochgekommen sind.

---

## 2. Root Cause

HuggingFace Free-Tier Spaces schlafen nach 48 h Inaktivität ein. Wenn ein Space nicht sauber zurück-wacht (z. B. wegen fehlendem Secret, Docker-Build-Failure, Quota), bleibt er in einem `SLEEPING` + Docker-Startup-Loop stecken und liefert HTTP 503 an allen Routen.

Wir haben **keinen Keep-Alive** und **keinen Auto-Restart**, deswegen eskaliert ein 48 h Sleep zu 12+ Tage-Outage.

---

## 3. Fix — Immediate (Tag 1 der Launch-Checklist)

### 3.1 Manueller Restart

Owner: `OpenSIN-backend` maintainer mit gültigem `HF_TOKEN`.

```bash
# Alle 6 Spaces restart:
for space in a2a-sin-code-plugin a2a-sin-code-command a2a-sin-code-tool \
             a2a-sin-code-backend a2a-sin-code-fullstack a2a-sin-code-frontend; do
  echo "Restarting $space ..."
  curl -sS -X POST "https://huggingface.co/api/spaces/OpenSIN-AI/$space/restart" \
    -H "Authorization: Bearer $HF_TOKEN" \
    && echo "  triggered"
  sleep 2
done

# Nach ~2 Min. Health Check:
sleep 120
for space in a2a-sin-code-plugin a2a-sin-code-command a2a-sin-code-tool \
             a2a-sin-code-backend a2a-sin-code-fullstack a2a-sin-code-frontend; do
  code=$(curl -o /dev/null -s -w "%{http_code}" --max-time 10 \
    "https://opensin-ai-$space.hf.space/health")
  echo "$space -> $code"
done
```

**Akzeptanzkriterium:** 6/6 Spaces liefern `200` auf `/health`.

### 3.2 Falls Restart nicht reicht: Secret-Audit

Wenn ein Space nach Restart erneut 503 liefert, sind meistens Secrets veraltet (Rate-Limit, OpenAI-Key rotiert, etc.). Checkliste:

1. HF-Space-Settings → Secrets öffnen:
   - `GITHUB_TOKEN` (darf nicht `...classic_...` + expired sein)
   - `OPENAI_API_KEY` **oder** `OPENCODE_API_KEY` (mindestens einer muss gültig sein)
   - `HF_TOKEN` (automatisch von HF bereitgestellt, nicht manuell setzen)
2. Falls Secret expired → neues rotieren, im Stripe/Anthropic/OpenAI-Dashboard.
3. Space → Settings → "Factory rebuild" klicken (nicht nur Restart).

---

## 4. Fix — Dauerhafte Prävention

### 4.1 Keep-Alive Cron (GitHub Action in `Infra-SIN-OpenCode-Stack`)

Pfad: `.github/workflows/hf-keepalive.yml`

```yaml
name: HF Spaces Keep-Alive

on:
  schedule:
    # Alle 2 Stunden in den ersten 48 h nach Launch (T-0 bis T+2).
    # Danach kann man auf alle 12 h zurückfahren.
    - cron: '0 */2 * * *'
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        space:
          - a2a-sin-code-plugin
          - a2a-sin-code-command
          - a2a-sin-code-tool
          - a2a-sin-code-backend
          - a2a-sin-code-fullstack
          - a2a-sin-code-frontend
    steps:
      - name: Ping and restart if 503
        env:
          HF_TOKEN: ${{ secrets.HF_TOKEN }}
        run: |
          URL="https://opensin-ai-${{ matrix.space }}.hf.space/health"
          CODE=$(curl -o /dev/null -s -w "%{http_code}" --max-time 10 "$URL")
          echo "$URL -> $CODE"
          if [ "$CODE" != "200" ]; then
            echo "Restarting ${{ matrix.space }} ..."
            curl -sS -X POST \
              "https://huggingface.co/api/spaces/OpenSIN-AI/${{ matrix.space }}/restart" \
              -H "Authorization: Bearer $HF_TOKEN"
            # Second check after 90s to confirm recovery
            sleep 90
            CODE2=$(curl -o /dev/null -s -w "%{http_code}" --max-time 10 "$URL")
            echo "post-restart -> $CODE2"
            if [ "$CODE2" != "200" ]; then
              echo "::error::Space ${{ matrix.space }} still not healthy after restart"
              exit 1
            fi
          fi
```

**Owner:** `OpenSIN-backend` maintainers. Repo-Target: `Infra-SIN-OpenCode-Stack` (SSOT für OpenCode/Agent-Config).

### 4.2 Uptime-Monitoring (UptimeRobot oder BetterStack)

Externe Uptime-Monitore für alle 6 Spaces + 4 Domains (`opensin.ai`, `my.opensin.ai`, `chat.opensin.ai`, `docs.opensin.ai`). Alert-Channel: Slack `#launch-alerts` oder Discord-Webhook.

SLA-Target: 99 % (HF-Free-Tier erlaubt nicht mehr).

### 4.3 Fallback: Migration auf bezahlte HF Spaces oder Fly.io

Wenn HF-Free-Tier nach Launch zu flaky ist, Migration auf:

- HF Pro Spaces (Always-On, $9/mo/Space = $54/mo für alle 6)
- **oder** Fly.io (ca. $15/mo für alle 6 + Multi-Region)
- **oder** Railway (ähnliche Kosten)

Entscheidung trifft `OpenSIN-backend` maintainer nach Launch-Week-1.

---

## 5. Historical: Last Known Good (2026-04-08)

| Agent | Space | URL | Status am 2026-04-08 |
|---|---|---|---|
| plugin | `OpenSIN-AI/a2a-sin-code-plugin` | https://opensin-ai-a2a-sin-code-plugin.hf.space | ✅ 200 |
| command | `OpenSIN-AI/a2a-sin-code-command` | https://opensin-ai-a2a-sin-code-command.hf.space | ✅ 200 |
| tool | `OpenSIN-AI/a2a-sin-code-tool` | https://opensin-ai-a2a-sin-code-tool.hf.space | ✅ 200 |
| backend | `OpenSIN-AI/a2a-sin-code-backend` | https://opensin-ai-a2a-sin-code-backend.hf.space | ✅ 200 |
| fullstack | `OpenSIN-AI/a2a-sin-code-fullstack` | https://opensin-ai-a2a-sin-code-fullstack.hf.space | ✅ 200 |
| frontend | `OpenSIN-AI/a2a-sin-code-frontend` | https://opensin-ai-a2a-sin-code-frontend.hf.space | ✅ 200 |

Zwischen 2026-04-08 und 2026-04-19 (heute): keine gesunde Gesundheitsmessung dokumentiert. Das muss sich ändern — siehe § 4.1 + § 4.2.

---

## 6. Applied Fixes (aus der Historie)

Aus der 2026-04-08 Deployment-Welle (weiterhin gültig):

1. Dockerfile + Permissions Fix
2. Startup & Repo-Cloning mit Retry-Loops
3. FastAPI Route Ordering
4. Entrypoint Fix (`app.py` → `main.py`)
5. A2A Compatibility (`_public_base_url` helper)

Aus `OpenSIN-Code` Epic #1089 (2026-04-16, Phase 1 DONE):

- feat: port sin-claude Phase 1 epic — 14 runtime tools + plugin manifests + bun-only + 67/67 tests (`b23dd7b`)
- chore: remove stale staging stubs (`7f232a3`)
- chore: remove 30 legacy package-lock.json files (bun-only migration) (`2c0eba0`)

Phases 2–6 remain open (tracked in `OpenSIN-Code#1096` – `#1113`). **Nicht launch-kritisch.**

---

## 7. Links

- **Launch-Checklist Item:** [HF-1 in LAUNCH-CHECKLIST Tag 1](../LAUNCH-CHECKLIST.md#tag-1--t-3-mittwoch-2026-04-19--infrastruktur--datenlage)
- **State-of-the-Union Referenz:** [§ 4.1 HF Outage](../STATE-OF-THE-UNION.md#41-kritisch--hf-spaces-outage)
- **Tracking Issue:** öffnen als `OpenSIN-backend#hf-outage-2026-04` wenn noch nicht vorhanden
- **Postmortem-Template:** nach Fix als `docs/postmortems/2026-04-hf-outage.md` in `OpenSIN-backend` ablegen

---

**Letzte Aktualisierung:** 2026-04-19 — Live `curl` verifiziert 24/24 Endpunkte = 503.
**Nächste Aktualisierung:** nach manuellem Restart (HF-1 in Launch-Checklist Tag 1).
