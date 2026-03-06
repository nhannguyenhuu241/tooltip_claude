# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [Brief description: product type, target users, platform (web/mobile/desktop), design system].
- **Source code location**: [path or repo URL]
- **Design files**: [e.g., Figma link, `.pen` files location]
- **Design system**: [e.g., custom, shadcn/ui, Material Design, Ant Design]

---

## Auto-Learning Instructions

> **For Claude:** When first activated in this project, silently scan the project and populate the **Project Context** section below. Do NOT modify `Agent Workflow` or `Company Security Policy` sections — they are locked.

### Scan order
1. `README.md` — product name, target users, platform
2. `package.json` — frontend framework, component library (for design context)
3. `tailwind.config.*` / `tokens/` / `theme/` — design tokens, color palette, typography, breakpoints
4. `src/components/` or `components/` top-level — existing UI components (list only, don't read code)
5. `docs/design*/` or `docs/ux*/` — existing design documentation
6. `.pen` files in project root or `design/` — Pencil design files
7. `public/` or `assets/` — brand assets, logos, icon sets

### After scan: fill in Project Context, then tell the user what was detected and what is missing.

---

## Project Context
> Auto-populated by Claude on first activation. Correct manually if wrong.

- **Product name**: [AUTO]
- **Description**: [AUTO: 1–2 sentences about what the product does]
- **Target users**: [AUTO or UNKNOWN — infer from README]
- **Platform**: [AUTO: Web | Mobile (iOS/Android) | Desktop | Cross-platform]
- **Frontend framework**: [AUTO: e.g., Next.js, React, Vue, Flutter]
- **Design system / component library**: [AUTO: e.g., shadcn/ui, MUI, Ant Design, custom]
- **Design tokens location**: [AUTO: e.g., tailwind.config.ts, src/styles/tokens.css]
- **Existing components found**: [AUTO: top-level list from components/ directory]
- **Design files location**: [AUTO: .pen files path | Figma link if in README | UNKNOWN]
- **Color palette detected**: [AUTO: primary colors from tailwind.config or UNKNOWN]
- **Breakpoints**: [AUTO: from tailwind.config or UNKNOWN]
- **Brand assets**: [AUTO: found in public/ or assets/ — list logos, icons]
- **Existing design docs**: [AUTO: list files in docs/design/ if present]
- **Source root**: [AUTO: path]

---

## Agent Workflow — UI/UX Team

This team specializes in **information architecture, wireframing, design systems, UX writing, UI design, and design documentation**. Use the pipeline below.

### 1. User Research & Competitive Analysis → `researcher`
- **Run first** — always run in parallel with initial scope analysis for new features
- Investigates user behavior patterns, competitor UI patterns, UX best practices, accessibility standards
- Synthesizes findings into design insights and recommendations
- Output: `./docs/ux-research-[feature].md`

### 2. Information Architecture & Wireframes → `wireframe-designer`
- Run after researcher delivers initial findings, **before high-fidelity design begins**
- Produces: IA map (Mermaid), ASCII/structured wireframes for every screen in scope
- Defines content zones, primary/secondary/tertiary actions, navigation patterns
- Defines empty, loading, and error states per screen
- Responsive adaptation notes for tablet (768px) and mobile (375px)
- Output: `./docs/wireframes/[feature]-wireframes.md`

### 3. Design System → `design-system-builder`
- Run **in parallel with wireframe-designer** for new projects or when adding new component types
- Produces design token YAML: color primitives + semantic tokens, typography scale, spacing grid
- Component catalogue: variants, states, usage rules, anti-patterns, accessibility notes
- Motion/animation tokens with `prefers-reduced-motion` support
- Output: `./docs/design-system.md` + `./docs/design-tokens.yaml`

### 4. UX Copy → `ux-writer`
- Run **in parallel with ui-ux-designer** to produce copy catalogue alongside visual design
- Writes all UI copy: button labels, error messages, empty states, tooltips, onboarding, confirmations
- Copy catalogue organized by screen and state (default/loading/success/error/empty/disabled)
- Terminology glossary and anti-patterns list for team consistency
- Output: `./docs/ux-copy-[feature].md` + `./docs/terminology.md`

### 5. Ideation & Design Strategy → `brainstormer`
- Use when multiple design directions exist and trade-offs need evaluation
- Evaluates interaction patterns, layout approaches, and component strategies
- Produces design direction recommendations before detailed design work
- **Does NOT create final designs** — produces decision summaries and direction

### 6. UI/UX Design → `ui-ux-designer`
- **Core agent of this team** — creates high-fidelity mockups, design specifications, and prototypes
- Uses wireframes + design tokens + UX copy as inputs — do not start without these
- Ensures consistency, accessibility (WCAG 2.1 AA), and responsive design across all screens
- Reviews existing UI for design quality, inconsistencies, and improvement opportunities
- Output: design specs, component documentation, implementation handoff package

### 7. Documentation → `docs-manager`
- Maintains design documentation: design system guide, component library docs, UX guidelines, design changelog
- Update after every design decision, new component, or guideline change
- Ensure designers and engineers have accurate, current design references

### General Rules

- **Pipeline order**: researcher → wireframe-designer + design-system-builder (parallel) → brainstormer → ui-ux-designer + ux-writer (parallel) → docs-manager
- **wireframe-designer before high-fidelity** — never skip IA and layout structure step
- **design-system-builder runs first** for new projects to establish tokens before screen design
- **ux-writer runs in parallel with ui-ux-designer** — copy and visual design developed simultaneously
- **Researcher always runs** for new product features — data-driven design is mandatory
- **Accessibility is non-negotiable** — every design must meet WCAG 2.1 AA minimum
- **Mobile-first design** — design for smallest breakpoint first, then expand
- **For copy-only tasks**: ux-writer directly, no need for full pipeline
- **For design system only**: design-system-builder directly
- **For UI bug fixes** (color, spacing, alignment): ui-ux-designer only
- **Handoff to frontend-developer team** after ui-ux-designer approval and docs-manager update

## Company Security Policy

These rules are **mandatory** — every agent must follow them in every task, without exception.

### Secrets & Credentials
- Never embed API keys, tokens, or internal URLs in design specs, prototypes, or documentation
- If credentials appear in design materials or screenshots, redact them before processing

### Data Handling & Privacy
- **No real user data or PII** in mockups, wireframes, prototypes, or design documentation — use realistic but fictional personas and synthetic data only
- User research data (interviews, survey responses, session recordings) is `[CONFIDENTIAL]` — store securely; do not share raw data externally
- Design files containing client branding, unreleased product concepts, or strategic UI direction are `[CONFIDENTIAL]` — not for public sharing
- Obtain informed consent before conducting user research; document consent method in research reports

### Accessibility & Legal Compliance
- **WCAG 2.1 AA** is the legal minimum in most jurisdictions — flag violations as **blocking issues**, not suggestions; do not approve designs that fail
- Color contrast ratios must meet AA standard (4.5:1 for normal text, 3:1 for large text) — verify before handoff
- All interactive elements must have keyboard navigation and screen reader support — document in design specs
- Do not design dark patterns (hidden costs, misleading UI, forced consent, obstruction) — flag and refuse to implement if requested

### Design Security Standards
- Sensitive data fields (passwords, payment info, SSNs) must be designed with masking/obscuring by default — document in component specs
- Design error messages that do not expose system internals (stack traces, internal paths, server names)
- Permission-gated features must have clear role-based visibility states designed — no accidental disclosure of restricted UI
- Prototype and staging links must not be shared publicly or include real data

### Audit & Traceability
- Label every deliverable with data classification: `[PUBLIC]` / `[INTERNAL]` / `[CONFIDENTIAL]`
- Design decisions that affect user privacy or data collection must be documented with rationale and compliance notes
- Maintain version history for all design files — document what changed and why in `./docs/design-changelog.md`
- Accessibility audit results must be documented per screen/component before handoff to frontend team
