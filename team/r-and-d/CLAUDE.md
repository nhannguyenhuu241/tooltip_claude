# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [Brief description: research area, technology domain, exploration goals].
- **Research context**: [What is being explored / prototyped]
- **Output type**: [PoC code | Research report | Technical spec | Benchmark results]

---

## Auto-Learning Instructions

> **For Claude:** When first activated, silently scan the project and populate **Project Context**. Do NOT modify `Agent Workflow` sections — they are locked.

### Scan order
1. `README.md` — research goals, hypothesis, current status
2. `docs/` — existing research notes, literature reviews
3. `experiments/` / `poc/` / `prototypes/` — active experiments
4. `results/` / `benchmarks/` — completed experiment results
5. `requirements.txt` / `package.json` — tools and libraries in use

### After scan: fill in Project Context and summarize what research threads are active.

---

## Project Context
> Auto-populated by Claude on first activation.

- **Research area**: [AUTO]
- **Current hypothesis**: [AUTO]
- **Active experiments**: [AUTO: list from experiments/]
- **Tools in use**: [AUTO]
- **Key findings so far**: [AUTO: from docs/ and results/]

---

## Agent Workflow — R&D Team

This team conducts **technical research, builds proofs of concept, evaluates technologies, and produces innovation reports** for engineering leadership. Use the pipeline below.

### 1. Research → `researcher`
- Literature review, competitive analysis, technology landscape mapping
- Spawns parallel research on multiple sub-topics
- Output: `./docs/research-[topic].md`

### 2. Technology Evaluation → `tech-evaluator`
- Benchmarks competing approaches, measures trade-offs with hard data
- Produces evaluation matrices, benchmark results, recommendation
- Output: `./docs/eval-[technology].md`

### 3. PoC Implementation → `poc-engineer`
- Builds minimal working prototype to validate hypothesis
- Focus: feasibility, not production quality
- Output: `./experiments/[name]/` with README + runnable code

### 4. Experiment Analysis → `experiment-analyst`
- Analyzes PoC results, statistical validity, effect sizes
- Interprets findings against original hypothesis
- Output: `./results/[experiment]-analysis.md`

### 5. Innovation Report → `docs-manager`
- Synthesizes research + PoC + analysis into actionable innovation brief
- Includes: findings, recommendations, risks, next steps
- Output: `./docs/innovation-brief-[topic].md` + update `./shared/docs/`

### Pipeline diagram
```
[Research question] → researcher → tech-evaluator → poc-engineer → experiment-analyst → docs-manager
                           ↑_______parallel research sub-agents_______↑
```

### General Rules
- **Hypothesis-driven**: every experiment must have a clear hypothesis before starting
- **Reproducible**: all PoC experiments must be runnable from a fresh clone
- **Time-boxed**: PoC time limit = 2 days. If not working, pivot or kill
- **Document failures**: negative results are as valuable as positive ones
- **Handoff to product**: innovations must produce a clear recommendation (adopt / watch / reject)

## Research Ethics Policy

- Do not use proprietary data from other companies without authorization
- Cite all external research, papers, and code sources
- Do not file patent claims on ideas derived from published academic work without legal review
- If research involves user data, obtain explicit data governance approval first
