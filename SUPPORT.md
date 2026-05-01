# Support

> **TL;DR:** This repo is a governance index. Most support requests belong in a **different** repo. Read the table below before opening an issue.

## 1. Route your question to the right repo

| What you need help with                                     | Correct repo                                                                                         |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Installing `opensin` (Python)                               | [OpenSIN-AI/OpenSIN](https://github.com/OpenSIN-AI/OpenSIN/issues)                                   |
| Using `opensin-code` CLI                                    | [OpenSIN-AI/OpenSIN-Code](https://github.com/OpenSIN-AI/OpenSIN-Code/issues)                         |
| `chat.opensin.ai` login / billing / dashboard               | [OpenSIN-AI/OpenSIN-WebApp](https://github.com/OpenSIN-AI/OpenSIN-WebApp/issues)                     |
| `my.opensin.ai` marketplace / checkout                      | [OpenSIN-AI/website-my.opensin.ai](https://github.com/OpenSIN-AI/website-my.opensin.ai/issues)       |
| Documentation on [docs.opensin.ai](https://docs.opensin.ai) | [OpenSIN-AI/OpenSIN-documentation](https://github.com/OpenSIN-AI/OpenSIN-documentation/issues)       |
| A specific agent (`A2A-SIN-*`) misbehaving                  | that agent's own repo                                                                                |
| PCPM / memory daemon                                        | [OpenSIN-AI/Infra-SIN-Global-Brain](https://github.com/OpenSIN-AI/Infra-SIN-Global-Brain/issues)     |
| OpenCode skills, plugins, `opencode.json`                   | [OpenSIN-AI/Infra-SIN-OpenCode-Stack](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack/issues) |
| Security vulnerability                                      | [SECURITY.md](./SECURITY.md) — **not** a public issue                                                |

## 2. When to open an issue _in this repo_

Only when your question is about **organisational topology or governance**:

- "Which repo owns concern X?" → check [`docs/CANONICAL-REPOS.md`](./docs/CANONICAL-REPOS.md) first, then open a [docs issue](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/new?template=docs-issue.yml).
- "Is repo X alive or dead?" → check [`registry/SCAFFOLD_AUDIT.md`](./registry/SCAFFOLD_AUDIT.md) first, then open a [docs issue](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/new?template=docs-issue.yml) if the audit says otherwise.
- "This repo's boundary is being violated by PR X in repo Y" → open a [boundary-violation issue](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/new?template=boundary-violation.yml).
- "A script in `scripts/` is broken" → open a [bug report](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/new?template=bug-report.yml).

## 3. Real-time help

- **Discord:** the `#general` channel for public questions, `#dev` for contributor questions. Invite link on [opensin.ai](https://opensin.ai) once launched.
- **Launch-week SEV-1/SEV-2:** follow [`.github/ISSUE_TEMPLATE/launch-incident.yml`](./.github/ISSUE_TEMPLATE/launch-incident.yml). Out of launch week, use the normal bug template.

## 4. Before you ask

1. Search existing issues, including closed ones.
2. Read the [`START-HERE.md`](./START-HERE.md) — it routes most "which repo?" questions in 60 seconds.
3. For commercial / billing questions that are NOT clearly bugs: email `support@opensin.ai`.

## 5. What we do NOT support here

- Private per-user account issues on `chat.opensin.ai` (use the in-app help widget, it opens a private ticket).
- Credential recovery (agents-oncall cannot see your password — use the app's reset flow).
- Feature requests for runtime products (open in the owning repo from §1).
