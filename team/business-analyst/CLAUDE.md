# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [Brief description of the project, business domain, and purpose].
- **Source code location**: [path or repo URL]

---

## Auto-Learning Instructions

> **For Claude:** When first activated in this project, execute the following steps BEFORE doing any user task. Do NOT ask for permission — just do it silently and update this file.

### Step 1 — Scan the project
Read the following in order (skip if not found):
1. `README.md` or `README.rst` — project description, purpose, tech stack
2. `package.json` / `pyproject.toml` / `pom.xml` / `go.mod` / `composer.json` — language, framework, dependencies
3. `docker-compose.yml` / `Dockerfile` — services, databases, infrastructure
4. `.env.example` / `config/` — environment variables, integrations in use
5. `docs/` or `wiki/` — existing documentation
6. Source directories (e.g., `src/`, `app/`, `lib/`) — top-level structure only, do not deep-read

### Step 2 — Fill in Project Context below
After scanning, replace all `[AUTO: ...]` placeholders in the **Project Context** section with real values discovered from the scan. If a value cannot be determined, leave it as `[UNKNOWN]`.

### Step 3 — Adapt agent context
Based on what you discovered:
- Update the `Project Context` section (see below)
- Do NOT modify the `Agent Workflow` section — it is locked
- Do NOT modify the `Company Security Policy` section — it is locked
- Agents will automatically inherit the project context you fill in below

### Step 4 — Confirm readiness
After auto-learning completes, briefly tell the user:
- Project name and tech stack detected
- Existing modules/services found
- Any gaps or missing context the user should fill in manually

---

## Project Context
> This section is auto-populated by Claude on first activation. Update manually if incorrect.

- **Project name**: [AUTO: read from README or package.json]
- **Description**: [AUTO: 1–2 sentence summary of what the project does]
- **Source code location**: [AUTO: detected root path]
- **Language & framework**: [AUTO: e.g., Node.js/NestJS, Python/FastAPI, PHP/Laravel]
- **Database(s)**: [AUTO: e.g., PostgreSQL 15, Redis, MongoDB]
- **External integrations detected**: [AUTO: list any third-party APIs/services found in config or code]
- **Existing modules/services**: [AUTO: list top-level modules/services found in source structure]
- **Test framework**: [AUTO: e.g., Jest, Pytest, PHPUnit]
- **Documentation location**: [AUTO: e.g., ./docs/, ./wiki/]
- **Key config files**: [AUTO: list .env.example, docker-compose.yml, etc. found]
- **Special constraints noted**: [AUTO: any compliance, licensing, or architectural notes from README]

### Build & Development Commands
```bash
# [AUTO: fill in from README or package.json scripts]
# install: ...
# dev server: ...
# run tests: ...
# build: ...
```

---

## Agent Workflow — Business Analyst Team

This team specializes in **technology-focused requirements analysis, system analysis, process modeling, and technical specification**. It does NOT handle business strategy, revenue metrics, or product marketing. Use the pipeline below.

### 1. Requirements Elicitation → `requirements-analyst`
- **ALWAYS the first step** — converts vague inputs into structured Technical Requirements (TR-XXX)
- Defines: functional requirements, NFRs (performance/security/availability), constraints, MoSCoW priority
- Identifies actors, system boundaries (in-scope/out-of-scope), and data sensitivity
- Output: TR-XXX JSON + requirements summary

### 2. System Analysis → `system-analyst`
- **Run when task involves an existing codebase** — skip for greenfield projects
- Reads source code, configs, migrations, docs — never modifies anything
- Maps architecture, modules, dependencies, data models, technical debt
- Identifies gaps between current state and required state
- Output: System Intelligence Report saved to `./docs/system-analysis-[date].md`

### 3. Process Modeling → `process-analyst`
- Models technical workflows, state machines, and multi-system interactions
- Uses Mermaid diagrams: flowcharts, state diagrams, sequence diagrams
- Documents EVERY path: happy path + all error paths + timeout + cancellation
- Output: Process flow documents saved to `./docs/processes/`

### 4. Data Requirements → `data-analyst`
- Defines all data entities, attributes, relationships, and data flows
- Produces data dictionary, ERD (logical), and data validation rules
- Classifies every entity by sensitivity: `[PUBLIC]` / `[INTERNAL]` / `[CONFIDENTIAL]` / `[RESTRICTED]`
- Output: Data specification saved to `./docs/data/`

### 5. Integration Analysis → `integration-analyst`
- Maps all integration points: outbound APIs, inbound webhooks, internal service calls
- Defines data contracts, auth requirements, error handling, and SLA requirements
- Output: Integration catalogue saved to `./docs/integrations/`

### 6. Use Case Modeling → `use-case-modeler`
- Defines all use cases with actors, preconditions, main/alternative/exception flows
- Writes Given/When/Then acceptance criteria testable by QA
- Output: Use case catalogue saved to `./docs/use-cases/`

### 7. Specification Writing → `spec-writer`
- **LAST analysis step** — consolidates ALL prior outputs into a single FRS document
- Resolves conflicts between source documents, flags gaps and open questions
- Builds traceability matrix linking every requirement to its source
- Output: `./docs/specs/FRS-[feature]-v1.0.md`

### 8. Technical Research → `tech-researcher`
- Runs **in parallel** with any step requiring external technical knowledge
- Evaluates third-party APIs, industry standards, technical feasibility
- All findings are sourced and cited
- Output: `./docs/research/[topic]-research.md`

### 9. Documentation → `docs-manager`
- Runs after every deliverable is produced
- Maintains and synchronizes `./docs/` directory
- Output: updated documentation index

### General Rules

- **Pipeline order**: requirements-analyst → [system-analyst?] → [process + data + integration in parallel] → use-case-modeler → spec-writer → docs-manager
- **tech-researcher runs in parallel** with any step needing external technical data
- **system-analyst only when existing system involved** — not for greenfield
- **spec-writer runs last** — cannot run before all analysis agents complete
- **No business strategy** — this team analyzes technical requirements only; no revenue KPIs, no marketing scope

## Company Security Policy

These rules are **mandatory** — every agent must follow them in every task, without exception.

### Secrets & Credentials
- Never include API keys, passwords, tokens, or connection strings in any document or output
- If sensitive credentials appear in source materials, redact them before processing (`[REDACTED]`)
- Never log, print, or output secrets — even in debug or example snippets

### Data Handling & Privacy
- **PII (personal data)** must not appear in requirements docs, PRDs, or analysis reports — use personas and anonymized examples only
- Label every deliverable with its data classification: `[PUBLIC]` / `[INTERNAL]` / `[CONFIDENTIAL]` / `[RESTRICTED]`
- Client names, financials, strategies, and user data are `[CONFIDENTIAL]` by default — do not include in external-facing outputs
- Do not copy or reference production data in documentation; use representative synthetic examples

### Destructive Operations
- Require explicit user confirmation before recommending deletion of systems, data, or services
- Flag any recommendation that involves irreversible business decisions (sunset a product, decommission a system) — stop and confirm scope with the user

### Information Security
- Internal documents (PRDs, system analyses, research reports) must not be shared to public channels, public repos, or external parties without explicit authorization
- Do not use external AI tools, APIs, or third-party services to process confidential company data
- Flag potential legal or compliance risks (GDPR, PDPA, IP ownership) — do not proceed without user acknowledgment

### Audit & Traceability
- Every deliverable must include: author (agent name), date, version, and approval status
- Document all key decisions with rationale — no undocumented scope changes
- Maintain a change log in `./docs/changelog.md` for all significant document revisions

