# 🛠 Tech Stack & Tools

Als Quereinsteiger musst du unser Werkzeug-Arsenal verstehen. Wir nutzen keine überladenen Frameworks, sondern maximale Effizienz.

## Die Foundation
1. **Das Gehirn (OpenCode CLI):** Jeder A2A-Agent nutzt die `opencode` CLI als sein primäres LLM-Interface. Auf Mac läuft das `antigravity` Plugin, auf den Cloud-VMs nutzen die Agenten direkt `gemini-api` als Fallback mit `opencode/qwen3.6-plus-free` als Standard-Modell.
2. **Das Nervensystem (n8n):** Monolithische Backends sind tot. Wir nutzen `n8n` auf unserer OCI VM als unzerstörbaren Router. Jede externe Plattform (GitHub, Telegram, Upwork) wirft ihre Payloads (Webhooks) in n8n. n8n normalisiert diese zu einem `work_item` und schickt sie an den PR-Watcher.
3. **Das Gedächtnis (Supabase):** Jeder A2A-Agent hat seine eigene Datenbank-Tabelle in unserer zentralen Supabase-Instanz. Keine lokalen SQLite-Files auf flüchtigen VMs!
4. **Die Telemetrie (GitLab LogCenter):** Lokale Logs sind verboten. Alles (Logs, Videos, Screenshots) wandert via `gitlab_logcenter.py` in unsere dedizierten GitLab-Repos, die unendlich Speicherplatz bieten.
