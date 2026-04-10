# Automated SEO Content Pipeline

## Purpose

Generate authentic blog posts from real merged PRs using n8n on OCI VM.
Workflow ID: sq7YR8vkdPf3usnz.

## Flow

GitHub webhook → fetch PR → if merged → generate Markdown → commit to blog repo → Cloudflare Pages auto‑deploy.

## Key Points

- No external LLMs; deterministic JavaScript in n8n Function nodes.
- Humanize step replaces buzzwords; appends disclosure.
- Final step: HTTPS PUT to GitHub API to create/update file in `Delqhi/opensin-blog-content`.
- Content is base64‑encoded before sending.

## Configuration

- n8n API key in `~/.config/opencode/opencode.json`.
- GitHub token stored in n8n Credentials (name: `GitHubAPI`).
- Blog repo: `Delqhi/opensin-blog-content`.
- Domain: `blog.opensin.ai`.

## Monitoring

Check n8n executions via API: `/api/v1/executions?workflowId=sq7YR8vkdPf3usnz`.

## Troubleshooting

- Syntax errors → use `<code>` instead of backticks.
- 422 error on commit → file exists; need SHA or delete first.
- 401 errors → check token scopes and validity.

## Code Templates

For the exact Function node code, contact the maintainer (sin‑zeus). The code uses `$credentials.GitHubAPI.token` and `https.request`.

---
