# AGENTS.md

This repository is part of the OpenSIN-AI ecosystem.

## Development Guidelines
- Use `opencode` CLI for all LLM interactions
- Follow the Global Brain PCPM integration
- All changes must be committed via pull requests
- Run tests before pushing

## Quick Start
```bash
git clone https://github.com/OpenSIN-AI/$(basename "$PWD")
cd $(basename "$PWD")
bun install
bun run start
```

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Boundary Guidance for Agents

When modifying this repo:

- Prefer organizational mapping and governance clarification.
- Do not let this repo become a duplicate implementation source of truth.
- Link to owning repos for runtime, docs, config, product, and control-plane details.
- Narrow any SSOT claim to organizational mapping unless a stricter scope is explicitly documented.
