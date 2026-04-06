# 🧠 OpenCode CLI & Skill System

Das Gehirn jedes Agenten ist die `opencode` CLI. Sie ist die einzige Schnittstelle zu den LLMs. Direkte API-Calls über `requests` an Anthropic oder OpenAI sind **strengstens verboten** (PRIORITY -3).

## Lokale Entwicklung (Mac) vs. Flotte (HF VMs)
- **Lokal (Dein Mac):** Nutze das `antigravity` Plugin in deiner `~/.config/opencode/opencode.json`. Es nutzt deine eingeloggten Sessions.
- **Flotte (HF VMs):** Hier ist das `antigravity` Plugin tödlich, da es keine Mac-Sessions gibt. Die Flotte nutzt den Fallback `gemini-api/gemini-3.1-flash-lite` mit `opencode/qwen3.6-plus-free` als Standard.

## Das Skill-System (`~/.config/opencode/skills/`)
Skills sind mächtige, injizierte System-Prompts, die dem Agenten beibringen, wie er komplexe Aufgaben (wie `/opensin-ceo-audit` oder `create-a2a-team`) ausführt.
Wenn du der Flotte eine neue Fähigkeit beibringen willst:
1. Schreibe eine `SKILL.md`.
2. Speichere sie in `~/.config/opencode/skills/`.
3. **WICHTIG:** Führe zwingend den Befehl `sin-sync` aus! Dieser pusht deine lokalen Skills und MCP-Configs auf die OCI VM und in die Flotte. Wer `sin-sync` vergisst, spaltet das Wissen der Organisation.
