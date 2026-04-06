# 🕸️ N8N Inbound Pipeline (Das Nervensystem)

Monolithische API-Backends sind ein Relikt der Vergangenheit. Unser Routing basiert zu 100% auf `n8n`.

## Der Inbound-Flow
1. **Trigger:** Ein Ereignis passiert in der Außenwelt (z.B. ein Freelancer.com Job wird gepostet, eine Telegram-Nachricht kommt rein, ein GitHub Issue wird erstellt).
2. **Webhook/Poller:** `n8n` fängt diesen rohen Payload auf der OCI VM ab.
3. **Normalization (CRITICAL):** Kein Agent darf rohe Payloads verarbeiten! `n8n` muss den Payload zwingend in unser standardisiertes `work_item.schema.json` transformieren.
4. **Handoff:** `n8n` leitet das standardisierte `work_item` an den zuständigen `Team-SIN-*` Orchestrator (via A2A RPC) oder an den `PR-Watcher` weiter.

Wenn du eine neue Plattform (z.B. Upwork) anbinden willst, schreibst du keinen Python-Poller im Agenten. Du erstellst einen n8n-Workflow im Verzeichnis `n8n-workflows/` des Teams.
