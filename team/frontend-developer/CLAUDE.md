# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [Brief description: frontend framework, component library, state management, API base URL].
- **Source code location**: [path or repo URL]
- **Tech stack**: [e.g., React 18 / Next.js 14, TypeScript, Tailwind CSS, Zustand, React Query]

---

## Auto-Learning Instructions

> **For Claude:** When first activated in this project, silently scan the project and populate the **Project Context** section below. Do NOT modify `Agent Workflow` or `Company Security Policy` sections — they are locked.

### Scan order
1. `README.md` — project name, description, platform target
2. `package.json` — framework, component library, state management, test framework
3. `tailwind.config.*` / `theme/` — design tokens, color palette, breakpoints
4. `tsconfig.json` — TypeScript strictness
5. `.env.example` / `next.config.*` / `vite.config.*` — API base URL, env vars
6. `src/components/` or `components/` top-level — existing component structure
7. `src/stores/` / `src/hooks/` — state management patterns in use
8. `playwright.config.*` / `cypress.config.*` — E2E test setup

### After scan: fill in Project Context, then tell the user what was detected and what is missing.

---

## Project Context
> Auto-populated by Claude on first activation. Correct manually if wrong.

- **Project name**: [AUTO]
- **Description**: [AUTO: 1–2 sentences]
- **Framework**: [AUTO: e.g., Next.js 14 App Router, React 18 + Vite, Vue 3, Svelte]
- **Language**: [AUTO: TypeScript | JavaScript]
- **Styling**: [AUTO: e.g., Tailwind CSS, CSS Modules, styled-components]
- **Component library**: [AUTO: e.g., shadcn/ui, MUI, Ant Design, custom]
- **State management**: [AUTO: e.g., Zustand, Redux Toolkit, Jotai, Context API]
- **Server state / data fetching**: [AUTO: e.g., React Query, SWR, RTK Query]
- **API base URL**: [AUTO: from .env.example or config]
- **Design system / tokens location**: [AUTO: e.g., tailwind.config.ts, src/styles/tokens]
- **Routing**: [AUTO: e.g., Next.js App Router, React Router v6]
- **Component structure**: [AUTO: atomic design | feature-based | page-based]
- **E2E test framework**: [AUTO: Playwright | Cypress | none detected]
- **Unit test framework**: [AUTO: Vitest | Jest | none detected]
- **Source root**: [AUTO: path]

### Build & Development Commands
```bash
# [AUTO: from README or package.json scripts]
# install: ...
# dev: ...
# build: ...
# test: ...
# e2e: ...
# lint: ...
```

---

## Architecture
> Fill in after auto-learning or manually.

- **Component structure**: [AUTO or manual]
- **Key directories**: [AUTO or manual]
- **Design system**: [AUTO or manual]
- **API layer**: [AUTO or manual]

---

# Dev server
# [e.g., npm run dev]

# Run tests
# [e.g., npm test / npx vitest]

# Run E2E tests (Playwright)
# [e.g., npx playwright test]

# Lint & format
# [e.g., npm run lint / npm run format]

# Build
# [e.g., npm run build]

# Type check
# [e.g., npx tsc --noEmit]
```

## Architecture

### [Describe your frontend architecture here]
- **Component structure**: [e.g., atomic design / feature-based]
- **State management**: [e.g., Zustand stores, React Query for server state]
- **Routing**: [e.g., Next.js App Router, React Router v6]
- **Design system**: [e.g., shadcn/ui, custom component library]
- **API layer**: [e.g., React Query + axios client at `src/lib/api.ts`]

## Agent Workflow — Frontend Developer Team

This team specializes in **UI implementation, component architecture, state management, accessibility, and frontend quality**. Use the pipeline below.

### 1. Planning → `planner`
- Use before starting any significant feature, page, or component system
- Creates phased implementation plans, researches component patterns and libraries
- Output: implementation plan in `./plans/` with component hierarchy and task breakdown

### 2. Component Architecture → `component-architect`
- Run for new component systems, feature modules, or significant UI restructuring
- Produces: component tree, TypeScript prop interfaces, state ownership map, composition patterns
- Defines which components are presentational vs. container, reuse boundaries, and slot patterns
- Output: `./docs/component-architecture-[feature].md`
- **Run before `engineer-agent`** so implementation follows the defined structure

### 3. State Design → `state-engineer`
- Run when the feature involves complex client state, async data, or shared state across components
- Produces: state inventory, Zustand store blueprints, React Query key hierarchy, async state machines
- Defines optimistic update patterns and cache invalidation strategy
- Output: `./docs/state-design-[feature].md`
- **Run in parallel with component-architect** when both are needed

### 4. Micro-Frontend Architecture → `micro-frontend-engineer`
- Run when splitting frontend into independently deployable units (multiple teams, Module Federation)
- Produces: Architecture map (host/remote mapping), Module Federation config, CSS isolation strategy
- Designs typed event bus for cross-app communication, shared dependency strategy
- **Run after state-engineer / component-architect, before framework specialist**
- Output: `./docs/micro-frontend-design.md`, `./docs/event-bus-catalogue.md`

### 5. Framework Implementation — select based on project stack
Route implementation to the correct specialist. These specialists **replace `engineer-agent`** for framework-specific work.

- **React / Next.js** → `react-specialist`
  - React 18+ hooks, Next.js App Router RSC, TanStack Query v5 optimistic updates, Zustand middleware stacking, React Hook Form + Zod
- **Vue 3 / Nuxt 3** → `vue-specialist`
  - `<script setup>` composables, Pinia setup stores, Nuxt 3 `useFetch`/`useAsyncData`, server API routes
- **Angular 17+** → `angular-specialist`
  - Standalone components, Signals (`signal()`, `computed()`, `effect()`), NgRx Signals Store, functional interceptors/guards, `takeUntilDestroyed()`
- **Svelte 5 / SvelteKit** → `svelte-specialist`
  - Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`), reactive class pattern, SvelteKit form actions with `use:enhance`, Snippets
- **Framework-agnostic** (config, utils, build tools) → `engineer-agent`

### 6. Enhancement Specialists (on-demand, run parallel after framework specialist)

- **`animation-engineer`** — Framer Motion variants/AnimatePresence/layoutId, GSAP ScrollTrigger, CSS keyframes, Lottie. **Always** respects `prefers-reduced-motion`. Only animates `transform` + `opacity`.
- **`pwa-specialist`** — Workbox caching strategies (CacheFirst/NetworkFirst/StaleWhileRevalidate), Background Sync, Push Notifications (VAPID + Web Push), Web App Manifest, install prompt UX

### 7. Code Review → `tech-lead-reviewer`
- **Required after every engineer-agent implementation**
- Reviews TypeScript correctness, accessibility, performance patterns, test coverage
- Checks alignment with design specs and existing component conventions
- **Do not consider implementation complete without tech-lead approval**

### 8. Accessibility Audit → `accessibility-auditor`
- Run **in parallel with tech-lead-reviewer** for all new screens or significant UI changes
- WCAG 2.1 AA compliance: contrast ratios, keyboard navigation, focus management, ARIA roles
- Outputs A11Y-XXX findings with severity (Blocking/Major/Minor) and specific fix instructions
- Includes screen reader test scenarios and automated axe-core check results
- Output: `./docs/accessibility-audit-[feature].md`

### 9. QA & E2E Testing → `hybrid-qa-playwright`
- Run after tech-lead-reviewer approves and accessibility findings are resolved
- Validates acceptance criteria, writes Playwright E2E tests for critical user flows
- Tests: happy path, edge cases, error states, mobile viewports, accessibility
- Issues Go/No-Go decision for release readiness

### 10. Debugging → `debugger`
- Use for investigating rendering issues, state bugs, network errors, or build failures
- Analyzes browser console errors, React DevTools, network requests, bundle analysis

### General Rules

- **Pipeline order**: planner → component-architect + state-engineer (parallel) → [micro-frontend-engineer if needed] → [framework-specialist] → [animation-engineer + pwa-specialist parallel if needed] → tech-lead-reviewer + accessibility-auditor (parallel) → hybrid-qa-playwright
- **Design input**: consume design specs/wireframes from `ui-ux` team before starting engineer-agent
- **component-architect** required for new component systems; skip for minor fixes
- **state-engineer** required when feature has complex async or shared state
- **micro-frontend-engineer** required when building multi-team frontend with Module Federation
- **Framework specialists replace `engineer-agent`** for all framework-specific implementation
- **animation-engineer** on-demand for motion design; **pwa-specialist** on-demand for offline/push features
- **accessibility-auditor** runs in parallel with tech-lead-reviewer — both outputs required before QA
- **For minor UI fixes** (text, color, spacing): [framework-specialist] → tech-lead-reviewer only
- **For new pages**: planner first, request design specs from ui-ux team if not provided
- **Never ship without mobile testing** — test at 375px, 768px, 1280px breakpoints
- **Run Playwright tests before every release**

## Company Security Policy

These rules are **mandatory** — every agent must follow them in every task, without exception.

### Secrets & Credentials
- **Never embed** API keys, tokens, or secrets in frontend source code, environment configs committed to git, or build artifacts
- Use build-time environment variables (`VITE_`, `NEXT_PUBLIC_`) only for non-secret public config; all secrets belong server-side
- If a secret is found in frontend code, **flag immediately** and move to backend proxy — rotate the credential
- Never log sensitive user data to the browser console

### Data Handling & Privacy
- **PII** must not be stored in `localStorage`, `sessionStorage`, or cookies without encryption and explicit user consent
- No real user data in test fixtures, Storybook stories, or component examples — use synthetic/fake data only
- Implement consent-aware analytics: do not fire tracking events until user consent is confirmed
- User sessions must expire; implement token refresh and logout mechanisms

### Code Security Standards
- **XSS prevention**: never use `innerHTML`, `dangerouslySetInnerHTML`, or `eval()` with unsanitized user input; use DOM APIs or sanitization libraries
- **CSRF protection**: all state-mutating requests must include CSRF tokens or use `SameSite` cookie policy
- **Content Security Policy (CSP)**: configure CSP headers for all new pages — no `unsafe-inline` without documented justification
- **Dependency security**: audit `node_modules` for known CVEs before release; no abandoned packages without security review
- **Open redirect prevention**: validate all redirect targets against an allowlist
- Follow **OWASP Top 10 for Web** — tech-lead-reviewer must check client-side injection, broken access control, and insecure design

### Destructive Operations
- Require explicit user confirmation for any action that permanently deletes user data from the UI
- Never expose admin or destructive operations to unauthorized roles — enforce role-based UI visibility
- Never force-push to `main`/`master` or shared branches

### Accessibility & Compliance
- **WCAG 2.1 AA** is the legal minimum — flag violations as blocking issues, not suggestions
- All forms must have labels, error messages, and keyboard navigation — no exceptions
- Use conventional commits: `feat:`, `fix:`, `style:`, `security:`, `a11y:` — every change must be traceable
- Document breaking changes to public-facing UI in `./docs/changelog.md` before release
