# 🏷️ The OpenSIN Naming Convention (Strict)

To prevent architectural chaos, every repository in the OpenSIN-AI organization **MUST** follow this strict naming schema:

`[Type]-SIN-[Name]`

### Valid Types:
- `Team-SIN-*` (Orchestrators, Hubs, Managers. E.g., `Team-SIN-Legal`)
- `A2A-SIN-*` (Worker Agents that execute tasks. E.g., `A2A-SIN-ClaimWriter`)
- `MCP-SIN-*` (Model Context Protocol Servers / Tools. E.g., `MCP-SIN-Browser`)
- `CLI-SIN-*` (Command Line Interfaces / Terminals. E.g., `CLI-SIN-Code`)
- `Template-SIN-*` (Blueprints for the forge scripts)

### Forbidden Names:
- Repos starting with `OpenSIN-*` (except legacy/core repos like `OpenSIN-backend` or `OpenSIN-Code` which are grandfathered in). 
- Repos with lowercase letters in the prefix (e.g., `a2a-sin-`).
