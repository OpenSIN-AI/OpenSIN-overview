# 🦅 OpenSIN-AI Agent: Feature Specification & Competitive Analysis

> **Version:** 1.0 | **Date:** 2026-04-09 | **Status:** DRAFT
> **Goal:** OpenSIN-AI Agent must match or surpass OpenClaw, Google Gemini Agent, and Claude Code

---

## 1. Executive Summary

OpenSIN-AI Agent is the autonomous AI agent system at the core of the OpenSIN ecosystem. Unlike competitors, it combines **open-source self-hosting**, **24/7 autonomous operation**, **multi-model intelligence**, **multi-channel messaging**, and **A2A fleet orchestration** into a single unified platform.

### Competitive Position

| Feature                  | OpenSIN-AI                                        | OpenClaw                                 | Gemini Agent                 | Claude Code                  |
| ------------------------ | ------------------------------------------------- | ---------------------------------------- | ---------------------------- | ---------------------------- |
| Open Source              | ✅                                                | ✅                                       | ❌                           | ❌                           |
| Self-Hosted              | ✅                                                | ✅                                       | ❌                           | ❌                           |
| 24/7 Autonomous          | ✅ (Heartbeat + Cron)                             | ✅ (Heartbeat + Cron)                    | ❌ (Prompt-only)             | ✅ (/loop, up to 3 days)     |
| Multi-Model              | ✅ (Antigravity + OCI)                            | ✅ (Claude/GPT/Gemini/Llama)             | ❌ (Gemini only)             | ❌ (Claude only)             |
| Multi-Channel Messaging  | ✅ (19 agents: TG/WA/Discord/Signal/iMessage/...) | ✅ (TG/WA/Discord/Slack/Signal/iMessage) | ❌                           | ✅ (TG/Discord Channels)     |
| Subagent Spawning        | ✅ (A2A Fleet + opencode)                         | ✅ (Subagent Progress)                   | ❌                           | ✅ (Task tool, 3 types)      |
| External Harness Control | ✅ (opencode CLI + A2A)                           | ✅ (ACP: Claude Code/Codex/Gemini CLI)   | ❌                           | ❌                           |
| Persistent Memory        | ✅ (MCP-SIN-memory + Supabase)                    | ✅ (Memory Wiki + SOUL.md)               | ❌                           | ✅ (CLAUDE.md + auto-memory) |
| Agent SDK                | ✅ (`opensin_sdk` in `OpenSIN`)                   | ❌                                       | ❌                           | ✅ (Python/TypeScript)       |
| Webhook Triggers         | ✅ (n8n + A2A webhooks)                           | ✅ (Built-in webhook server)             | ❌                           | ❌                           |
| Voice Interaction        | ✅ (Siri + Apple agents)                          | ✅ (Voice Wake + Talk Mode)              | ✅ (Gemini Live)             | ❌                           |
| Google Workspace         | ✅ (A2A-SIN-Google-Apps)                          | ✅ (Google Workspace plugin)             | ✅ (Native deep integration) | ❌                           |
| Browser Automation       | ✅ (skylight-cli-mcp)                         | ✅ (Computer Use)                        | ✅ (Gemini native)           | ✅ (Computer Use)            |
| Session Branching        | 🔲 (TODO)                                         | ✅ (Branch + Compaction)                 | ❌                           | ❌                           |
| Canvas/A2UI              | 🔲 (TODO)                                         | ✅ (A2UI interactive HTML)               | ❌                           | ❌                           |
| Plugin Approval Hooks    | 🔲 (TODO)                                         | ✅ (requireApproval)                     | ❌                           | ❌                           |

**Legend:** ✅ Implemented | 🔲 Planned/TODO | ❌ Not available

---

## 2. Feature Specification

### Phase 1: Core Agent Loop (P0 — Foundation)

#### 2.1 Autonomous Agent Loop (`OpenSIN-Code`)

- **What:** A persistent agent loop that runs 24/7, processes tasks from queues, and executes them autonomously
- **Competitor Parity:** OpenClaw Heartbeat, Claude Code /loop, Gemini Scheduled Actions
- **Implementation:**
  - Heartbeat system: Periodic agent turn (configurable interval, default 30 min)
  - Task queue: Supabase-backed task queue with priority levels
  - Cron scheduler: Native cron-like scheduling for recurring tasks (daily summaries, weekly reports)
  - Graceful shutdown: Checkpoint state on SIGTERM, resume on restart
  - Timeout management: Max execution time per task, auto-escalation on timeout
- **Target Repo:** `OpenSIN-Code` (Rust Engine + SDK) — note: `opensin-ai-cli` is rationalization-pending, see [FOLLOWUPS.md § R1](./FOLLOWUPS.md#r1-opensin-ai-cli--opensin-code)

#### 2.2 Multi-Model Router

- **What:** Intelligent model routing with failover chains, cost optimization, and task-based model selection
- **Competitor Parity:** OpenClaw multi-model support
- **Implementation:**
  - Model registry: Configurable model catalog with capabilities, costs, latency profiles
  - Routing strategies: Cost-first, Speed-first, Quality-first, Task-type-based
  - Failover chains: Primary → Secondary → Tertiary model fallback
  - Token budget: Per-task and per-session token budgets with alerts
  - Currently supported: `openai/gpt-5.4` (primary), `google/antigravity-*`, `nvidia-nim/qwen-3.5-*`
- **Target Repo:** `OpenSIN-Code` (Rust Engine)

#### 2.3 Persistent Memory System

- **What:** Structured persistent memory with wiki, journals, and cross-session recall
- **Competitor Parity:** OpenClaw Memory Wiki + SOUL.md, Claude Code CLAUDE.md
- **Implementation:**
  - `MCP-SIN-memory`: Already exists — extend with wiki-style structured storage
  - AGENTS.md / SOUL.md: Dynamic system prompt composition from multiple files
  - Daily journals: Automatic daily log of agent activities and decisions
  - Cross-session recall: Query past sessions via `session_search` and `session_read`
  - User profile: USER.md with preferences, context, and accumulated knowledge
- **Target Repo:** `MCP-SIN-memory` + `OpenSIN-Code`

### Phase 2: Multi-Channel & Messaging (P0 — Reach)

#### 2.4 Multi-Channel Messaging Hub

- **What:** Unified messaging interface across 19+ platforms via A2A-SIN agents
- **Competitor Parity:** OpenClaw multi-channel, Claude Code Channels
- **Implementation:**
  - Already have 19 A2A messaging agents (WhatsApp, Telegram, Discord, Signal, iMessage, etc.)
  - Need: Unified messaging API in `OpenSIN-backend` that routes to correct A2A agent
  - Need: Message queue with priority, dedup, and delivery confirmation
  - Need: Cross-platform message threading (continue conversation across channels)
- **Target Repo:** `OpenSIN-backend` + individual `A2A-SIN-*` agents

#### 2.5 Channel-Based Remote Control

- **What:** Control running agent sessions from Telegram, Discord, WhatsApp
- **Competitor Parity:** Claude Code Channels, OpenClaw chat integration
- **Implementation:**
  - Message a running session via Telegram/Discord
  - Receive status updates, approval requests, and results via chat
  - Approve/reject autonomous actions from phone
  - Session management commands: `/status`, `/pause`, `/resume`, `/stop`
- **Target Repo:** `CLI-SIN-TelegramBot` + `OpenSIN-backend`

### Phase 3: Subagent Orchestration (P1 — Scale)

#### 2.6 Subagent Spawning & Progress Tracking

- **What:** Spawn parallel subagents for concurrent task execution with real-time progress reporting
- **Competitor Parity:** OpenClaw subagent_progress, Claude Code Task tool
- **Implementation:**
  - Already have: `call_omo_agent` with explore/librarian/oracle/hephaestus/metis/momus
  - Need: Generic subagent spawning API (not limited to predefined types)
  - Need: Progress tracking with real-time updates
  - Need: Result aggregation from multiple subagents
  - Need: Context isolation between subagents
- **Target Repo:** `OpenSIN-Code` + `OpenSIN-backend`

#### 2.7 External Harness Control (ACP)

- **What:** Control external coding harnesses (Claude Code, Codex, Gemini CLI, Cursor) from OpenSIN chat
- **Competitor Parity:** OpenClaw ACP Agents
- **Implementation:**
  - Spawn and control `opencode` CLI sessions from A2A chat
  - Thread-bound sessions with run/attach modes
  - Real-time output streaming from harness to chat
  - Session persistence and reconnection
- **Target Repo:** `OpenSIN-Code` + `opencode-subagent-delegation`

### Phase 4: Safety & Governance (P1 — Trust)

#### 2.8 Plugin Approval Hooks

- **What:** Safety gates that require human approval before autonomous operations
- **Competitor Parity:** OpenClaw requireApproval
- **Implementation:**
  - Approval levels: Auto-approve (low risk), Notify (medium risk), Require-approval (high risk)
  - Risk classification: Based on action type, target scope, and data sensitivity
  - Approval channels: Telegram, Discord, WebApp push notification
  - Timeout behavior: Auto-reject after configurable timeout
  - Audit log: Full audit trail of all approval decisions
- **Target Repo:** `OpenSIN-Code` + `OpenSIN-backend`

#### 2.9 Session Branching & Compaction

- **What:** Branch and restore sessions, compact long sessions for context efficiency
- **Competitor Parity:** OpenClaw session management
- **Implementation:**
  - Session branching: Fork a session at any point, explore different paths
  - Session compaction: Summarize and compress long sessions
  - Session restore: Return to any previous checkpoint
  - Checkpoint format: JSON with full context, decisions, and state
- **Target Repo:** `OpenSIN-Code`

### Phase 5: Advanced Features (P2 — Differentiation)

#### 2.10 Canvas / A2UI Interactive Workspace

- **What:** Interactive HTML workspace for visual task execution and collaboration
- **Competitor Parity:** OpenClaw A2UI / Canvas
- **Implementation:**
  - Real-time HTML/React rendering in chat
  - Interactive forms, tables, charts for data visualization
  - Collaborative editing with multiple users
  - Export to PDF/DOCX/Sheets
- **Target Repo:** `OpenSIN-WebApp`

#### 2.11 Voice Interaction

- **What:** Voice wake word, talk mode, and voice-to-task pipeline
- **Competitor Parity:** OpenClaw Voice Wake + Talk Mode, Gemini Live
- **Implementation:**
  - Siri integration via A2A-SIN-Apple-Shortcuts (already exists)
  - Voice wake: "Hey OpenSIN" trigger
  - Talk mode: Continuous voice conversation
  - Speech-to-text: Whisper API or local model
  - Text-to-speech: Response narration
- **Target Repo:** `OpenSIN-Code` + `A2A-SIN-Apple-Shortcuts`

#### 2.12 Google Workspace Deep Integration

- **What:** Native deep integration with Gmail, Drive, Calendar, Docs, Sheets, Slides
- **Competitor Parity:** Gemini Agent Workspace integration
- **Implementation:**
  - Already have: `A2A-SIN-Google-Apps` with Google Docs/Sheets/Drive
  - Need: Gmail integration (send, read, search, draft, label)
  - Need: Calendar integration (create, modify, find slots, schedule)
  - Need: Slides integration (create, edit, present)
  - Need: Cross-app workflows (e.g., "Summarize email → Create doc → Schedule meeting")
- **Target Repo:** `A2A-SIN-Google-Apps` + new `A2A-SIN-Google-Mail`

---

## 3. Implementation Roadmap

### Sprint 1 (Week 1-2): Foundation

- [ ] Implement heartbeat system in `OpenSIN-Code`
- [ ] Extend multi-model router with failover chains
- [ ] Create unified messaging API in `OpenSIN-backend`
- [ ] Extend `MCP-SIN-memory` with wiki-style storage

### Sprint 2 (Week 3-4): Reach & Control

- [ ] Implement Channel-Based Remote Control (Telegram first)
- [ ] Build generic subagent spawning API
- [ ] Create progress tracking system for subagents
- [ ] Implement approval hooks framework

### Sprint 3 (Week 5-6): Orchestration

- [ ] Implement external harness control (opencode CLI)
- [ ] Build session branching & compaction
- [ ] Create ACP-style harness management
- [ ] Implement audit logging system

### Sprint 4 (Week 7-8): Differentiation

- [ ] Build Canvas/A2UI interactive workspace
- [ ] Implement voice interaction pipeline
- [ ] Extend Google Workspace integration (Gmail, Calendar, Slides)
- [ ] Cross-app workflow automation

---

## 4. Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    OpenSIN-AI Agent                           │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐ │
│  │ Agent Loop  │  │ Model Router│  │ Memory System         │ │
│  │ (Heartbeat) │  │ (Failover)  │  │ (Wiki + Journals)     │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬──────────┘ │
│         │                │                     │            │
│  ┌──────┴────────────────┴─────────────────────┴──────────┐ │
│  │              OpenSIN-Code (SDK + Rust Engine)           │ │
│  └──────────────────────┬─────────────────────────────────┘ │
│                         │                                    │
│  ┌──────────────────────┴─────────────────────────────────┐ │
│  │              OpenSIN-backend (Control Plane)             │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ │ │
│  │  │ Messaging│ │ Subagent │ │ Approval │ │  Session   │ │ │
│  │  │   Hub    │ │Spawner   │ │  Hooks   │ │ Branching  │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────┘ │ │
│  └──────────────────────┬─────────────────────────────────┘ │
│                         │                                    │
│  ┌──────────────────────┴─────────────────────────────────┐ │
│  │              A2A Agent Fleet (92+ Workers)               │ │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │ │
│  │  │ TG │ │ WA │ │ DC │ │ SG │ │ iM │ │ Go │ │ ... │    │ │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘    │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Key Differentiators vs. Competitors

| Differentiator                 | Description                                                                      |
| ------------------------------ | -------------------------------------------------------------------------------- |
| **A2A Fleet Architecture**     | 92+ specialized agents, each with its own CLI/MCP/A2A endpoint — not a monolith  |
| **n8n Foundation**             | Indestructible routing backbone on free OCI VM — no vendor lock-in               |
| **Open + Self-Hosted**         | Full control over data, models, and infrastructure                               |
| **Multi-Model Freedom**        | Route to ANY model (OpenAI, Google, Anthropic, local) without vendor restriction |
| **Cross-Platform Messaging**   | 19+ messaging platforms via dedicated A2A agents — not just Slack/Discord        |
| **Google Workspace**           | Deep integration via A2A-SIN-Google-Apps, not just API calls                     |
| **Apple Ecosystem**            | Native macOS/iOS automation via 12 A2A-Apple agents — no competitor has this     |
| **Subagent Fleet**             | Entire fleet can collaborate, not just 2-3 subagents                             |
| **Webhook + Cron + Heartbeat** | Triple trigger system for maximum automation coverage                            |
| **Supabase Persistence**       | Enterprise-grade DB on free tier — all agent state persisted centrally           |

---

_This document is the Source of Truth for OpenSIN-AI Agent feature development. Last updated: 2026-04-09_
