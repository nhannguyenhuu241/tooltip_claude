# How Agent Teams Work

> This document explains the mechanics of Agent Teams: how agents communicate, how memory is shared, and how a feature flows from start to finish.

---

## 1. Architecture Overview

Each team consists of a **Lead** and multiple **Specialists**. The Lead is the sole orchestrator — it does not do the work itself, but assigns tasks to the right specialists, monitors progress, and consolidates results.

```
User
 └── Task(lead)
       ├── TaskCreate → planner
       ├── TaskCreate → specialist-A   (parallel)
       ├── TaskCreate → specialist-B   (parallel)
       └── TaskCreate → reviewer       (after A, B complete)
```

Specialists **do not communicate directly** with each other. All information flows through the Lead or via files on disk.

---

## 2. Agent Communication

### 2.1 Lead → Specialist: creating a task

```
Lead calls: TaskCreate({
  agent: "android-specialist",
  description: "Implement biometric login.
                Architecture: see docs/architecture-biometric.md
                Threat model: see docs/security/threat-model-auth.md"
})
```

The Lead embeds all necessary context directly in the task description — the specialist does not need to search for it.

### 2.2 Specialist → Lead: reporting results

```
Specialist calls: SendMessage({
  type: "task_result",
  content: "Done. Files: src/auth/BiometricLogin.kt, src/auth/BiometricViewModel.kt"
})
```

The Lead reads the result and decides the next step in the pipeline.

### 2.3 Task lifecycle

```
Lead                          Specialist
 |                                 |
 |-- TaskCreate(specialist) ------>|
 |                                 | (TaskUpdate: in_progress)
 |                                 | ... working ...
 |                                 | (TaskUpdate: completed)
 |<-- SendMessage(result) ---------|
 |
 | (Lead uses this result as input for the next task)
```

---

## 3. Memory — 4 Layers

### How memory actually works

`memory: project` in each agent's frontmatter does **not** mean "share with the team." It only defines the storage scope: memory lives in `.claude/agent-memory/` inside the project rather than the global `~/.claude/`.

Each agent automatically reads only **its own MEMORY.md** — it does not read other agents' MEMORY.md files.

---

### Layer 1: Private Memory (one file per agent)

Each agent has its own `MEMORY.md`, which it reads and writes itself. Used to remember conventions, patterns, and lessons learned across sessions.

```
.claude/
└── agent-memory/
    ├── lead/
    │   └── MEMORY.md          ← Lead remembers: past decisions, open issues
    ├── android-specialist/
    │   └── MEMORY.md          ← Remembers: project uses Hilt, StateFlow, Kotlin 2.0
    ├── mobile-tester/
    │   └── MEMORY.md          ← Remembers: current test coverage, flaky tests
    └── ...
```

**Write to memory when:**
- Discovering a new project convention
- Making an important architecture decision
- Encountering a bug pattern and its fix
- Learning something that will be needed in a future session

**Do NOT write when:**
- Context is session-specific (what the current task is doing)
- Information already exists in the project's CLAUDE.md
- Information has not been verified

---

### Layer 1.5: Shared Team Memory (TEAM-MEMORY.md)

The single shared file that all agents read:

```
.claude/agent-memory/
├── TEAM-MEMORY.md         ← ALL agents read; Lead writes
├── lead/
│   └── MEMORY.md          ← Lead only (private)
├── nodejs-specialist/
│   └── MEMORY.md          ← Specialist only (private)
└── ...
```

**TEAM-MEMORY.md contains:**
- Architecture decisions (Clean Arch, Microservices, Event-Driven...)
- Confirmed tech stack (framework, ORM, test tools...)
- Naming conventions, folder structure
- Known constraints and gotchas
- Cross-agent coordination decisions

**Lead writes to TEAM-MEMORY.md after:**
- Choosing an architecture
- Confirming the tech stack
- Making any decision that affects multiple agents

**Lead passes context to specialists** by embedding TEAM-MEMORY.md content in the task description — the specialist gets context immediately without needing to read the file itself.

---

### Layer 2: Shared Files (cross-agent, via disk)

Agents share information by writing and reading files. This is the most common way to pass output from one agent to another.

```
threat-modeler
    └── writes: docs/security/threat-model-auth.md

security-auditor
    └── reads: docs/security/threat-model-auth.md  ← knows what to audit

pen-tester
    └── reads: docs/security/audit-auth.md         ← knows what to test
```

Standard output patterns per team:

| Team | Agent writes | Agent reads |
|------|-------------|-------------|
| Mobile | planner → `plans/feature.md` | mobile-architect, specialist |
| Mobile | mobile-architect → `docs/architecture-X.md` | specialist |
| AI | prompt-engineer → `prompts/feature/` | ml-engineer, ai-evaluator |
| Security | threat-modeler → `docs/security/threat-model-X.md` | security-auditor |
| Security | security-auditor → `docs/security/audit-X.md` | pen-tester |

---

### Layer 3: Task Description (real-time, inline context)

The Lead passes context directly inside the task content. Used for short, critical, time-sensitive information.

```
TaskCreate({
  agent: "mobile-tester",
  description: """
    Test biometric login feature.

    Files to test:
    - src/auth/BiometricLogin.kt
    - src/auth/BiometricViewModel.kt

    Edge cases from tech-lead-reviewer:
    - Test fallback when device has no biometric hardware
    - Test when user cancels mid-flow

    Acceptance criteria:
    - Unit test coverage >= 80%
    - Detox E2E: happy path + 2 error cases
  """
})
```

---

## 4. Full Flow: "Add biometric login to Android"

```
User: "Add biometric login to Android app"
          |
          v
     LEAD receives request
     Reads CLAUDE.md → identifies React Native project with android-specialist
          |
          |-- [1] TaskCreate(planner) ---------------------------->
          |         Researches Android Biometric API
          |         Writes: plans/biometric-login.md
          |<-- SendMessage("plans/biometric-login.md ready") -----
          |
          |-- [2] TaskCreate(mobile-architect) ------------------>
          |         Reads: plans/biometric-login.md
          |         Designs component model, data flow
          |         Writes: docs/architecture-biometric.md
          |<-- SendMessage("architecture ready") ----------------
          |
          |-- [3a] TaskCreate(android-specialist) ----> (parallel)
          |-- [3b] TaskCreate(threat-modeler) -------> (parallel)
          |
          |         android-specialist:
          |           Reads: plans/ + docs/architecture-biometric.md
          |           Implements: BiometricLogin.kt, BiometricViewModel.kt
          |<-- SendMessage("implementation done") --------------
          |
          |         threat-modeler:
          |           Analyzes: spoofing, bypass, replay attacks
          |           Writes: docs/security/threat-model-biometric.md
          |<-- SendMessage("threat model ready") ---------------
          |
          |-- [4a] TaskCreate(tech-lead-reviewer) --> (parallel)
          |-- [4b] TaskCreate(security-auditor) ----> (parallel)
          |
          |         tech-lead-reviewer:
          |           Reviews code quality, platform idioms, performance
          |<-- SendMessage("approved with 2 minor comments") ---
          |
          |         security-auditor:
          |           Reads: threat-model + new code
          |           Checks: keystore usage, biometric prompt config
          |<-- SendMessage("VULN-001: Medium — ...") ----------
          |
          |-- [5] TaskCreate(android-specialist) -- fix VULN-001
          |<-- SendMessage("fixed") -------------------------
          |
          |-- [6] TaskCreate(mobile-tester) ------------------>
          |         Unit tests + Detox E2E
          |<-- SendMessage("GO — all tests pass") -----------
          |
          v
     LEAD consolidates: feature ready, no Critical/High findings open
     Reports to User: "Biometric login complete. GO for release."
```

---

## 5. Parallel vs Sequential

The Lead decides which tasks run in parallel and which must wait.

```
SEQUENTIAL (B needs A's output):
  A ──────────────► B ──────────────► C
  [planning]        [implement]       [test]

PARALLEL (no dependency):
  A ──────────────►
  B ──────────────►  (run simultaneously; Lead waits for both)
  C ──────────────►

MIXED (most common in practice):
  planner ──► architect ──► specialist ──►┐
                                          ├──► lead merges ──► tester
  threat-modeler ──► security-auditor ────┘
```

Rule of thumb:
- **Sequential**: when B needs to read a file produced by A
- **Parallel**: when A and B work on separate concerns and don't need each other's output

---

## 6. Operating Rules

### Lead must:
- Always check `TaskList` before creating new tasks (avoid duplicates)
- Pass sufficient context in task descriptions (file paths, decisions, constraints)
- Block release if any Critical/High finding remains unresolved
- Consolidate all agent outputs before reporting to the user

### Specialists must:
- Claim task immediately: `TaskUpdate(status: "in_progress")`
- Write output to the correct path per team convention
- Report results via `SendMessage` with full details (file paths, decisions, blockers)
- Update `MEMORY.md` when discovering an important new pattern

### All agents must:
- Read their own `MEMORY.md` before starting
- Read `TEAM-MEMORY.md` for shared team context
- Never hardcode config — read from CLAUDE.md and .env
- Respond to `shutdown_request` with `SendMessage(type: "shutdown_response")`

---

## 7. File Structure on Disk

```
project/
├── CLAUDE.md                         ← Auto-learning + workflow rules (read on init)
├── .claude/
│   ├── settings.json                 ← Enables CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
│   │                                    + auto-approve permissions
│   ├── agents/
│   │   ├── lead.md                   ← Lead system prompt
│   │   ├── planner.md
│   │   ├── android-specialist.md
│   │   └── ...
│   └── agent-memory/
│       ├── TEAM-MEMORY.md            ← Shared: architecture, conventions, stack
│       ├── lead/
│       │   └── MEMORY.md             ← Lead private memory
│       ├── android-specialist/
│       │   └── MEMORY.md
│       └── ...
├── plans/
│   └── biometric-login.md            ← Output of planner
├── docs/
│   ├── architecture-biometric.md     ← Output of mobile-architect
│   └── security/
│       ├── threat-model-biometric.md ← Output of threat-modeler
│       └── audit-biometric.md        ← Output of security-auditor
└── src/                              ← Output of specialists
```

---

## 8. Is Lead Actually Necessary?

The honest answer: **not required**.

Your Claude Code session (the main chat window) already has everything Lead uses: `Task()`, `TaskCreate()`, `TaskList()`, `TaskGet()`, `SendMessage()`. You can orchestrate the pipeline yourself without a Lead agent.

### What Lead adds

| | Without Lead | With Lead |
|--|--------------|-----------|
| Orchestration | Main session handles it | Dedicated agent |
| Memory | Not preserved across sessions | Lead has its own MEMORY.md |
| Context window | Everything in one session | Isolated — main session stays clean |
| Pipeline logic | Lives in CLAUDE.md | Lives in `lead.md` — focused, tunable |
| How to invoke | Claude reads CLAUDE.md and acts | `@lead implement X` |

### Skip Lead when

```
Simple task, 1-2 agents:
  "Review this code" → call @security-auditor directly

You want manual pipeline control:
  Orchestrate each step yourself — Lead just adds overhead

Small team, simple workflow:
  CLAUDE.md is enough for the main session to follow
```

### Lead is valuable when

```
Complex pipeline with many parallel agents:
  → Lead holds state, keeps main session lightweight

Decisions need to persist across sessions:
  → Lead MEMORY.md stores: "sprint fixing VULN-001, waiting on android-specialist"

Conditional pipeline logic:
  → Lead knows: if security-auditor finds Critical → stop, do not run tester
```

**Bottom line**: Lead is a convention, not a requirement. For complex teams — Lead is worth it. For simple tasks — call the specialist directly.

---

## 9. One-Command Automation

### Can the team run to completion from a single instruction?

**Yes — with two conditions met:**

**Condition 1 — Tool permissions auto-approved** (set in `settings.json`):

```json
{
  "permissions": {
    "allow": ["Read(*)", "Write(*)", "Edit(*)", "Bash(*)", "WebSearch(*)", "WebFetch(*)"]
  }
}
```

Without this, Claude Code pauses the pipeline at every file write or bash command to ask for approval.

**Condition 2 — Task is unambiguous:**

```
Vague:  "audit security"
Clear:  "OWASP Top 10 audit for src/auth/, output report to docs/security/,
         staging URL: http://staging:3000"
```

### What this looks like in practice

```
User: "@lead audit the authentication module"
        ↓
Lead → threat-modeler → security-auditor → pen-tester → compliance-engineer
                                                              ↓
                                              docs/security/audit-auth-2026.md
        ↓
Lead: "Done. 3 findings: 1 High, 2 Medium. Report at docs/security/"
```

### Realistic success rate by complexity

| Task | Likelihood of completing in one shot |
|------|--------------------------------------|
| Security audit of one module | Very high |
| Implement one small feature | Very high |
| Full feature (plan → code → test) | Likely, 1-2 checkpoints |
| Greenfield project from scratch | Needs 2-3 milestone confirmations |

---

## 10. Deploy a Team to a New Project

```bash
# From the team definitions directory
./setup-team.sh mobile /path/to/my-project

# The script will:
# 1. Copy agents/*.md to project/.claude/agents/
# 2. Copy settings.json (enables agent teams + auto-approve permissions)
# 3. Create agent-memory/ stubs including TEAM-MEMORY.md
# 4. Copy CLAUDE.md template
# 5. Replace {TEAM_MEMORY} placeholder with the actual path on this machine
```

Then open the project and talk to Lead:
```
claude
> @lead implement biometric login
```

---

## 11. Team Models

### Backend Developer Team

**Specialty**: API design, microservices, event-driven systems, security, performance

**Agents:**
| Agent | Role |
|-------|------|
| `lead` | Orchestrates pipeline, selects architecture model |
| `planner` | Creates implementation plan, spawns researcher sub-agents |
| `solution-architect` | Component model, ADRs, NFR targets |
| `api-designer` | OpenAPI 3.0 spec, versioning, rate limit policy |
| `engineer-agent` | Language-agnostic implementation (config, scripts) |
| `nodejs-specialist` | NestJS, TypeScript, BullMQ, Prisma, Jest |
| `python-specialist` | FastAPI, SQLAlchemy async, Pydantic v2, Celery |
| `php-specialist` | Laravel, Symfony, PHP 8 enums, Pest |
| `dotnet-specialist` | ASP.NET Core, MediatR CQRS, EF Core |
| `java-specialist` | Spring Boot, Spring Security, virtual threads |
| `go-specialist` | Gin/Fiber, goroutines, errgroup, sqlx |
| `clean-architect` | Clean/Hexagonal layers, DDD aggregates, ports |
| `microservices-engineer` | Service decomposition, saga, circuit breaker |
| `event-driven-engineer` | CQRS, Event Sourcing, outbox, Kafka topology |
| `tech-lead-reviewer` | Code quality, security patterns, architecture alignment |
| `security-auditor` | OWASP Top 10, secrets scan, CVE audit |
| `performance-engineer` | EXPLAIN ANALYZE, N+1 detection, caching |
| `tester` | Test suite, coverage, edge cases |
| `debugger` | Logs, traces, query plans, root cause |

**Pipeline:**
```
planner → [clean-architect | microservices-engineer | event-driven-engineer]
        → api-designer
        → [nodejs | python | php | dotnet | java | go specialist]
        → tech-lead-reviewer ←→ security-auditor     (parallel)
        → performance-engineer                        (high-traffic endpoints)
        → tester

Shortcut (bug fix):
[language-specialist] → tech-lead-reviewer
```

---

### Frontend Developer Team

**Specialty**: UI components, state management, accessibility, E2E testing

**Agents:**
| Agent | Role |
|-------|------|
| `lead` | Orchestrates, consumes design specs from ui-ux team |
| `planner` | Implementation plan, component hierarchy |
| `component-architect` | Component tree, prop interfaces, composition patterns |
| `state-engineer` | Zustand stores, React Query keys, async state machines |
| `micro-frontend-engineer` | Module Federation, event bus, CSS isolation |
| `react-specialist` | React 18, Next.js App Router, RSC, TanStack Query |
| `vue-specialist` | Vue 3 `<script setup>`, Pinia, Nuxt 3 |
| `angular-specialist` | Standalone components, Signals, NgRx, functional guards |
| `svelte-specialist` | Svelte 5 runes, SvelteKit form actions, Snippets |
| `animation-engineer` | Framer Motion, GSAP, prefers-reduced-motion |
| `pwa-specialist` | Workbox, Background Sync, Web Push, App Manifest |
| `tech-lead-reviewer` | TypeScript correctness, a11y, performance patterns |
| `accessibility-auditor` | WCAG 2.1 AA, keyboard nav, ARIA, axe-core |
| `hybrid-qa-playwright` | Playwright E2E, acceptance criteria, Go/No-Go |
| `debugger` | Rendering issues, state bugs, bundle analysis |

**Pipeline:**
```
planner → component-architect ←→ state-engineer         (parallel)
        → [micro-frontend-engineer]                      (if multi-team Module Federation)
        → [react | vue | angular | svelte specialist]
        → animation-engineer ←→ pwa-specialist           (on-demand, parallel)
        → tech-lead-reviewer ←→ accessibility-auditor    (parallel)
        → hybrid-qa-playwright

Shortcut (UI fix):
[framework-specialist] → tech-lead-reviewer
```

---

### Database Team

**Specialty**: Schema design, migrations, query optimization, data integrity

**Agents:**
| Agent | Role |
|-------|------|
| `lead` | Orchestrates, enforces zero-downtime migration rules |
| `legacy-system-analyst` | Maps existing schema, technical debt, migration risk |
| `schema-designer` | Normalized schema, constraints, FK, index strategy, ERD |
| `query-optimizer` | EXPLAIN ANALYZE, N+1, missing indexes, QUERY-XXX findings |
| `migration-engineer` | Up/down scripts, zero-downtime patterns, batch operations |
| `engineer-agent` | ORM models, stored procedures, seed data |
| `tester` | Migration rollback, constraint violations, FK integrity |
| `debugger` | Lock contention, replication lag, pool exhaustion |

**Pipeline:**
```
legacy-system-analyst → schema-designer ←→ query-optimizer  (parallel)
                      → migration-engineer
                      → engineer-agent                       (ORM models, stored procs, seed)
                      → tester

Shortcut (query optimization only):
query-optimizer → engineer-agent → tester
```

---

### UI/UX Team

**Specialty**: IA, wireframes, design system, UX copy, high-fidelity mockups

**Agents:**
| Agent | Role |
|-------|------|
| `lead` | Orchestrates, hands off to frontend-developer team |
| `researcher` | User behavior, competitor UI, UX best practices |
| `wireframe-designer` | IA map, wireframes, responsive notes, error/empty states |
| `design-system-builder` | Design tokens, color/type/spacing, component catalogue |
| `brainstormer` | Design direction trade-offs, interaction pattern evaluation |
| `ui-ux-designer` | High-fidelity mockups, design specs, implementation handoff |
| `ux-writer` | Button labels, error messages, empty states, terminology glossary |
| `docs-manager` | Design changelog, component library docs |

**Pipeline:**
```
researcher → wireframe-designer ←→ design-system-builder   (parallel)
           → brainstormer                                   (when design direction is unclear)
           → ui-ux-designer ←→ ux-writer                   (parallel)
           → docs-manager

Shortcut (copy only):     ux-writer
Shortcut (design system): design-system-builder
Shortcut (UI bug fix):    ui-ux-designer → docs-manager

→ Handoff to frontend-developer team
```

---

### Business Analyst Team

**Specialty**: Requirements, system analysis, process modeling, technical specification

**Agents:**
| Agent | Role |
|-------|------|
| `lead` (boss-agent) | Orchestrates, enforces pipeline order |
| `requirements-analyst` | TR-XXX requirements, MoSCoW, NFRs, constraints |
| `legacy-system-analyst` | Maps existing system, gap analysis (skip for greenfield) |
| `process-analyst` | Mermaid flowcharts, state machines, all paths (happy + error) |
| `data-analyst` | Data dictionary, logical ERD, sensitivity classification |
| `integration-analyst` | API contracts, webhook mapping, SLA requirements |
| `use-case-modeler` | Use cases, Given/When/Then acceptance criteria |
| `spec-writer` | FRS document, traceability matrix (runs last) |
| `tech-researcher` | External APIs, industry standards (runs in parallel) |
| `docs-manager` | Syncs `./docs/` after every deliverable |

**Pipeline:**
```
requirements-analyst → [legacy-system-analyst]    (existing system only; skip for greenfield)
                     → process-analyst
                        ←→ data-analyst            (parallel)
                        ←→ integration-analyst     (parallel)
                     → use-case-modeler
                     → spec-writer                 (LAST — consolidates all outputs)
                     → docs-manager

tech-researcher runs in parallel with any step needing external data
```

---

### Project Manager Team

**Specialty**: Scope, risk, sprint planning, delivery oversight

**Agents:**
| Agent | Role |
|-------|------|
| `lead` (boss-agent) | Orchestrates, enforces delivery gates |
| `scope-manager` | WBS, epics→stories→tasks, MoSCoW, CR-XXX change requests |
| `risk-analyst` | RISK-XXX: Probability×Impact, mitigation, contingency |
| `sprint-planner` | Capacity model, sprint schedule, critical path, milestones |
| `researcher` | Competitive analysis, domain research (runs in parallel) |
| `docs-manager` | Roadmap, changelog, sprint history, risk register |

**Pipeline:**
```
scope-manager → risk-analyst → sprint-planner → docs-manager

researcher runs in parallel with any step needing external data or competitive context

Change request flow:
scope-manager (CR-XXX impact) → risk-analyst (new risks) → sprint-planner (reschedule)

Status review shortcut:
sprint-planner  (update velocity, flag blocked stories)
```

---

### Mobile Team

**Specialty**: React Native, Flutter, iOS, Android, app store delivery

**Agents:**
| Agent | Role |
|-------|------|
| `lead` | Orchestrates, selects platform specialist |
| `planner` | Mobile feature planning, platform constraints |
| `mobile-architect` | Navigation, state, offline strategy, ADRs |
| `react-native-specialist` | RN 0.74+, Expo, FlashList, Reanimated 3 |
| `flutter-specialist` | Flutter 3.22+, Dart 3, GoRouter, Riverpod 2 |
| `ios-specialist` | Swift 5.10+, SwiftUI, @MainActor, async/await |
| `android-specialist` | Kotlin 2.0, Jetpack Compose, Hilt, StateFlow |
| `tech-lead-reviewer` | Platform idioms, performance, memory, security |
| `mobile-tester` | Unit + E2E (Detox/Maestro), device matrix |
| `debugger` | Crash, ANR, memory leak, CI failure |
| `app-store-publisher` | EAS/Fastlane, signing, store submission, OTA |

**Pipeline:**
```
planner → mobile-architect → [react-native | flutter | ios | android specialist]
                           → tech-lead-reviewer
                           → mobile-tester

On-demand (any time):
  debugger            → crash / ANR / memory leak
  app-store-publisher → store submission / OTA update

Shortcut (bug fix):
[platform-specialist] → tech-lead-reviewer
```

---

### AI Team

**Specialty**: LLM integration, RAG, prompt engineering, AI evaluation

**Agents:**
| Agent | Role |
|-------|------|
| `lead` | Orchestrates, enforces eval gate (min 20 cases, ≥80% accuracy) |
| `planner` | Model selection, cost model, eval strategy |
| `ai-architect` | RAG vs fine-tuning, agent loop design, multi-model routing |
| `prompt-engineer` | System prompts, few-shot, ICL format, versioning in `./prompts/` |
| `rag-engineer` | Chunking (512 tokens), embedding, pgvector, hybrid search |
| `ml-engineer` | Anthropic SDK, tool use, retry, semantic cache, sanitization |
| `ai-evaluator` | RAGAS, LLM-as-judge, latency, cost → Ship / Iterate / Reject |
| `tech-lead-reviewer` | PII in prompts, prompt injection, cost controls |
| `debugger` | Hallucination, retrieval failure, prompt regression, cost spike |

**Pipeline:**
```
planner → ai-architect → prompt-engineer → [rag-engineer | ml-engineer]
                                         → ai-evaluator ←→ tech-lead-reviewer  (parallel)
                                                        → Ship / Iterate / Reject

On-demand: debugger → hallucination / latency spike / cost anomaly
```

---

### R&D Team

**Specialty**: Literature review, technology evaluation, PoC, experiment analysis

**Agents:**
| Agent | Role |
|-------|------|
| `lead` | Orchestrates, enforces time-boxing (PoC max 2 days) |
| `researcher` | Literature review, competitive analysis, source quality tiers |
| `tech-evaluator` | Scoring matrix (weight×score), ADOPT / WATCH / REJECT |
| `poc-engineer` | Hypothesis-first, minimal prototype, day-1 checkpoint |
| `experiment-analyst` | t-test, p-value, effect size, conclusion vs hypothesis |
| `docs-manager` | Innovation brief, research index, handoff to product |

**Pipeline:**
```
[Research question] → researcher ─────────────────────────────────►
                         ↑── parallel sub-agents per sub-topic ───↑
                                    → tech-evaluator
                                    → poc-engineer     (max 2 days — if stuck, pivot or kill)
                                    → experiment-analyst
                                    → docs-manager     (innovation brief → handoff to product)
```

---

### Security Team

**Specialty**: STRIDE threat modeling, OWASP audit, pen testing, compliance, incident response

**Agents:**
| Agent | Role |
|-------|------|
| `lead` | Orchestrates, enforces severity escalation (Critical = block release) |
| `threat-modeler` | STRIDE analysis, trust boundary map, attack surface |
| `security-auditor` | OWASP Top 10, secrets scan, VULN-XXX findings |
| `pen-tester` | Auth bypass, IDOR, injection, business logic (staging only) |
| `compliance-engineer` | GDPR, PDPA, PCI-DSS, SOC 2 gap assessment |
| `devsecops-engineer` | GitHub Actions: Gitleaks, CodeQL, Semgrep, Trivy, ZAP |
| `incident-responder` | P0/P1/P2 triage, containment, forensics, post-mortem |

**Pipeline:**
```
[New feature] → threat-modeler
                      ↓
[After implementation] → security-auditor ←→ pen-tester        (parallel, high-risk)
                                          → compliance-engineer (regulated features)
                                          → devsecops-engineer  (CI/CD integration)

[Security incident] → incident-responder  (IMMEDIATE — do not wait for pipeline)
```

**Severity escalation:**
| Severity | Action |
|----------|--------|
| Critical | Block release + notify immediately |
| High | Block release + fix this sprint |
| Medium | Fix within 30 days |
| Low | Next maintenance window |
