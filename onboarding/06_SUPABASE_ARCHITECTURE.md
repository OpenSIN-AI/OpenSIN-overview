# 🗄️ Supabase Architecture (The Global Memory)

**STRIKTE REGEL (PRIORITY -2):** 
Kein Agent, kein Script und kein Tool darf lokale SQLite, JSON-Datenbanken oder MongoDB Dateien für persistente Geschäftsdaten verwenden! Lokaler Storage auf HF VMs ist flüchtig.

## Die A2A-SIN-Supabase Instanz
Wir betreiben eine zentrale, massiv skalierte Supabase-Datenbank auf unserer OCI VM (200 GB Storage). Diese Instanz ist das einzige und absolute Langzeitgedächtnis der gesamten OpenSIN-AI Flotte.

### Mandantenfähigkeit (Multi-Tenancy)
1. **Ein Agent = Ein Schema/Table:** Jeder `A2A-SIN-*` Worker und jeder `Team-SIN-*` Manager bekommt in Supabase seinen eigenen, isolierten Namespace bzw. dedizierte Tabellen.
2. **A2A Token Pool:** Die Token für OpenAI, Gemini und Claude liegen verschlüsselt in Supabase. Die `Token Factory` (auf einer separaten E2.Micro VM) füllt diesen Pool auf, und die Agenten konsumieren ihn.
3. **Task State & Ledger:** Alle delegierten Tasks zwischen Team Managern und Workern werden hier als State-Machine persistiert.

Wenn du als Coder ein neues Feature baust, das Daten speichern muss, schreibe eine Migration für die zentrale Supabase. Lokale `.db` Dateien führen zum sofortigen Rauswurf des PRs.
