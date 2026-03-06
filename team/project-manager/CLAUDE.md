# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [Brief description of the project, organization, and business context].
- **Source code location**: [path or repo URL]
- **Project documentation**: `./docs/` directory

---

## Auto-Learning Instructions

> **For Claude:** When first activated in this project, silently scan the project and populate the **Project Context** section below. Do NOT modify `Agent Workflow` or `Company Security Policy` sections — they are locked.

### Scan order
1. `README.md` — project name, purpose, team context
2. `docs/` — existing PRDs, plans, roadmaps, changelogs, ADRs (read file names only, not full content)
3. `CONTRIBUTING.md` / `DEVELOPMENT.md` — team size hints, workflow methodology
4. `.github/` — issue templates, PR templates, CI/CD config (infer team practices)
5. `package.json` / any manifest — tech stack overview (for PM context only)

### After scan: fill in Project Context, then tell the user what was detected and what is missing.

---

## Project Context
> Auto-populated by Claude on first activation. Correct manually if wrong.

- **Project name**: [AUTO]
- **Description**: [AUTO: 1–2 sentences about what the project does and for whom]
- **Organization / team**: [AUTO or UNKNOWN]
- **Project type**: [AUTO: e.g., SaaS product, internal tool, mobile app, API platform]
- **Tech stack summary**: [AUTO: high-level only, e.g., "Next.js + NestJS + PostgreSQL"]
- **Development methodology**: [AUTO: e.g., Scrum, Kanban, ad-hoc — inferred from .github/ or docs/]
- **Existing documentation found**: [AUTO: list files in docs/ by name]
- **Current phase**: [UNKNOWN — fill in manually: e.g., MVP, beta, growth, maintenance]
- **Team composition**: [UNKNOWN — fill in manually: e.g., 2 BE, 1 FE, 1 PM]
- **Stakeholders**: [UNKNOWN — fill in manually]
- **Source root**: [AUTO: path]
- **Documentation root**: [AUTO: e.g., ./docs/]

---

## Agent Workflow — Project Manager Team

This team specializes in **scope definition, risk management, sprint planning, and project delivery oversight**. Use the pipeline below.

### 1. Scope Definition & WBS → `scope-manager`
- **Starting point for all new initiatives or significant change requests**
- Produces Work Breakdown Structure (WBS): epics → stories → tasks, with MoSCoW priority
- Scope statement: in-scope/out-of-scope boundaries, success criteria, dependencies
- Change request assessment (CR-XXX): impact on timeline, cost, and scope for proposed changes
- Output: `./docs/wbs-[project].md` + `./docs/scope-statement-[project].md`

### 2. Risk Assessment → `risk-analyst`
- Run after scope is defined — **before sprint planning begins**
- Identifies risks across Technical, Resource, Delivery, External, and Compliance categories
- Scores each risk: Probability × Impact (1–25) → Critical / High / Medium / Low
- RISK-XXX findings with mitigation plan, contingency, owner, and review date
- Output: `./docs/risk-register-[project].md`

### 3. Sprint Planning → `sprint-planner`
- Run after scope + risk register are ready
- Capacity model (team composition, adjusted velocity at 70-80%)
- Sprint schedule with sprint goals, story assignments, point totals, and dependency ordering
- Critical path analysis and milestone schedule with Go/No-Go owners
- Output: `./docs/sprint-plan-[project].md`

### 4. Research & Intelligence → `researcher`
- Use for competitive analysis, technology evaluation, market sizing, domain research
- **Run in parallel** with any pipeline step needing external data or domain knowledge
- Synthesizes multi-source findings into actionable intelligence for scope and planning

### 5. Documentation Management → `docs-manager`
- Maintains `./docs/` directory: roadmap, changelog, WBS archives, sprint history, risk register updates
- Update after every milestone, major decision, or plan revision
- Ensure docs are accurate, versioned, and cross-referenced

### General Rules

- **Full pipeline order**: scope-manager → risk-analyst → sprint-planner → docs-manager
- **researcher runs in parallel** with any step needing external data or competitive context
- **Do not skip scope-manager** for new initiatives — every project needs a defined WBS
- **Do not skip risk-analyst** before sprint planning — unassessed risks break schedules
- **For change requests**: scope-manager (CR-XXX impact) → risk-analyst (new/updated risks) → sprint-planner (schedule update)
- **For status reviews**: sprint-planner directly — update velocity, flag blocked stories, adjust schedule
- **All deliverables must be documented** — docs-manager runs after every major output
- **Sprint plans must be reviewed** by the relevant engineering team lead before sprint kickoff

## Company Security Policy

These rules are **mandatory** — every agent must follow them in every task, without exception.

### Secrets & Credentials
- Never include API keys, system credentials, or internal service tokens in project plans, status reports, or deliverables
- If sensitive credentials appear in source materials, redact them before processing (`[REDACTED]`)

### Data Classification & Confidentiality
- Label every deliverable with its data classification: `[PUBLIC]` / `[INTERNAL]` / `[CONFIDENTIAL]` / `[RESTRICTED]`
- Default classification for project documents: **`[CONFIDENTIAL]`** unless explicitly marked otherwise
- **`[CONFIDENTIAL]`** information includes: project timelines, budgets, team structures, client names, vendor contracts, roadmaps, risk registers
- Do not include confidential project data in public repositories, public channels, or external communications without explicit authorization
- External stakeholder communications (client updates, vendor proposals) must be reviewed and approved by authorized personnel before sending

### Destructive Operations
- Require explicit user confirmation before recommending cancellation of contracts, decommissioning of systems, or significant budget reallocations
- Flag decisions that are irreversible (contract termination, team restructuring, product sunset) — stop and confirm scope with user
- Never act on behalf of the user in external systems (send emails, post to issue trackers, update CRMs) without explicit instruction

### Risk & Compliance
- Flag any project risk that involves legal, regulatory, or data compliance implications (GDPR, PDPA, labor law, IP ownership) — escalate to appropriate authority
- Document all risk items in the risk register with: likelihood, impact, mitigation strategy, and owner
- Procurement and vendor decisions above defined thresholds require documented approval chain — do not proceed without authorization

### Audit & Traceability
- Every deliverable must include: author (agent name), creation date, version number, and approval status
- Document all scope changes, budget changes, and timeline changes with rationale and approver
- Maintain `./docs/project-changelog.md` — update after every significant plan revision
- Use standardized document naming: `prd-[feature]-v[N].md`, `plan-[phase]-[date].md`, `risk-register-[project].md`
