# 🚢 Deployment & CI/CD (The VM Split)

Unsere Infrastruktur ist asymmetrisch aufgebaut, um maximale Skalierbarkeit bei minimalen Kosten zu garantieren. Jeder Agent und Entwickler muss diese Verteilung kennen:

## 1. Die OCI VM (Oracle Cloud) - Das Schwergewicht
- **Ressourcen:** 24 GB RAM, 200 GB Storage, ARM64 (A1.Flex).
- **Aufgabe:** Hier laufen unsere stabilen, unzerstörbaren Core-Dienste, die 24/7 Uptime benötigen.
- **Hosted Services:** `n8n` (Routing/Inbound), `Supabase` (Globale DB), `GitLab LogCenter` Daemon.
- **Regel:** Keine temporären Worker-Agenten auf der OCI! Die Ressourcen sind für das Nervensystem reserviert.

## 2. Hugging Face Spaces (HF VMs) - Die Worker-Flotte
- **Ressourcen:** Kostenlose Docker-Spaces (16 GB RAM).
- **Aufgabe:** Hier hosten wir unsere 69+ `A2A-SIN-*` Worker Agenten.
- **Das 48h-Sleep-Problem:** Kostenlose HF Spaces gehen nach 48 Stunden Inaktivität schlafen und löschen alle temporären lokalen Daten.
- **Der OpenSIN Backup-Trick (PFLICHT!):** Jeder Agent auf HF **muss** einen *Keep-Alive-Ping* implementieren. Zusätzlich müssen alle essenziellen Session-Daten (z.B. `.wwebjs_auth` für WhatsApp) zwingend und permanent in ein privates **Hugging Face Dataset** gesichert werden. Beim Neustart der VM zieht sich der Agent seinen State aus dem Dataset zurück.

## 3. Deployment Flow (`sin-fleet-sync`)
Updates an Agenten werden niemals manuell auf den VMs durchgeführt.
1. Änderung im `Template-SIN-Agent` oder `Template-SIN-Team`.
2. Ausführung von `scripts/fleet-sync.sh`.
3. Auto-PR in allen Repositories.
4. Nach dem Merge triggert GitHub Actions den Re-Build des HF Spaces.
