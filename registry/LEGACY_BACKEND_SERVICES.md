# 🏛️ Legacy Backend Services & Rooms (Technical Debt)

Im Repository `OpenSIN-backend` existiert eine massive, monolithische Verzeichnisstruktur, die aus der Zeit **vor** der Hub & Spoke A2A-Architektur stammt.

### The "Room" Concept (Deprecated)
Ordner wie `room-30-scira-ai-search`, `room-22-forum-bot`, `room-02-vault-api` sind veraltete Konzepte. 
**Migration Path:** Diese "Räume" müssen in spezialisierte `A2A-SIN-*` Worker umgeschrieben und den zuständigen `Team-SIN-*` Orchestratoren unterstellt werden.

### The "Services" Concept (Deprecated)
Ordner wie `services/authd`, `services/provider-github`, `services/mcp-gateway`, `services/opencode-cli-proxy`.
**Migration Path:** Monolithische Services werden aufgelöst. API-Provider (`provider-x`, `provider-discord`) werden zu dedizierten OpenCode-Plugins oder autonomen `A2A-SIN-Team-Messaging` Workern.

> ⚠️ **MANDAT:** Neue Features dürfen **nicht** mehr als monolithische Services in `OpenSIN-backend/services/` gebaut werden. Baue stattdessen einen A2A-Agenten!
