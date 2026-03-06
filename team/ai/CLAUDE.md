# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [Brief description: AI/ML features, LLM providers used, data sources].
- **Source code location**: [path or repo URL]
- **Tech stack**: [e.g., Python/FastAPI + LangChain, Node.js + Anthropic SDK, RAG with pgvector]

---

## Auto-Learning Instructions

> **For Claude:** When first activated in this project, silently scan the project and populate the **Project Context** section below. Do NOT modify `Agent Workflow` or `Company Security Policy` sections — they are locked.

### Scan order
1. `README.md` — project name, AI features, LLM providers
2. `package.json` / `pyproject.toml` / `requirements.txt` — AI libraries and SDKs
3. `.env.example` — API keys, model names, vector DB endpoints
4. `src/` / `app/` top-level — AI modules, pipeline names
5. `prompts/` / `system-prompts/` / `templates/` — existing prompts
6. `evals/` / `tests/` — evaluation framework
7. `docs/` — architecture docs, prompt design docs

### After scan: fill in Project Context, then tell the user what was detected and what is missing.

---

## Project Context
> Auto-populated by Claude on first activation. Correct manually if wrong.

- **Project name**: [AUTO]
- **Description**: [AUTO: 1–2 sentences]
- **Language & runtime**: [AUTO: Python 3.12 | Node.js 20 | TypeScript]
- **LLM providers**: [AUTO: Anthropic Claude | OpenAI | Gemini | Local/Ollama]
- **Primary models**: [AUTO: claude-sonnet-4-6 | gpt-4o | gemini-1.5-pro]
- **AI frameworks**: [AUTO: LangChain | LlamaIndex | Haystack | custom | none]
- **Vector database**: [AUTO: pgvector | Pinecone | Weaviate | Qdrant | Chroma | none]
- **Embedding model**: [AUTO: text-embedding-3-small | voyage-3 | nomic-embed]
- **Orchestration**: [AUTO: LangGraph | CrewAI | AutoGen | custom | none]
- **Evaluation**: [AUTO: RAGAS | DeepEval | custom evals | none]
- **Source root**: [AUTO: path]

### Build & Development Commands
```bash
# [AUTO: from README or package.json/pyproject.toml]
# install: ...
# dev: ...
# test: ...
# eval: ...
```

---

## Architecture
> Fill in after auto-learning or manually.

- **Structure**: [AUTO or manual — e.g., RAG pipeline, agent loop, chain-of-agents]
- **Key directories**: [AUTO or manual]

---

## Agent Workflow — AI Engineering Team

This team designs and builds **AI features, LLM integrations, RAG systems, prompt engineering, and AI safety guardrails**. Use the pipeline below.

### 1. Planning → `planner`
- Use before any new AI feature or significant pipeline change
- Researches LLM capabilities, evaluates provider trade-offs, defines evaluation strategy
- Output: implementation plan in `./plans/`

### 2. AI Architecture → `ai-architect`
- Triggered for system design decisions: RAG vs fine-tuning, agent loop design, eval framework selection
- Produces AI system design, data flow, ADRs, cost model
- Output: `./docs/ai-architecture-[feature].md`

### 3. Prompt Engineering → `prompt-engineer`
- Designs and iterates system prompts, few-shot examples, chain-of-thought templates
- Required before any LLM integration is implemented
- Output: `./prompts/[feature]/` directory with versioned prompt files

### 4. Implementation — pick ONE:
- **`rag-engineer`** — RAG pipeline (chunking, embedding, retrieval, reranking, generation)
- **`ml-engineer`** — LLM API integration, fine-tuning, model evaluation, AI features

### 5. AI Evaluation → `ai-evaluator`
- **Required after every implementation**
- Runs eval suite: accuracy, hallucination rate, latency, cost per call
- Decision: Ship / Iterate / Reject

### 6. Code Review → `tech-lead-reviewer`
- Reviews code quality, security (prompt injection, data leakage), cost controls
- Runs in parallel with ai-evaluator for efficiency

### 7. Debugging → `debugger` (on-demand)
- Use for hallucination analysis, latency spikes, eval regressions

### Pipeline diagram
```
[Feature] → planner → ai-architect → prompt-engineer → [rag-engineer | ml-engineer]
                                                               ↓
                                              ai-evaluator  ←→  tech-lead-reviewer (parallel)
                                                               ↓
                                                         Ship / Iterate
```

### General Rules
- **Measure before shipping**: every AI feature needs an eval suite (min 20 test cases)
- **Cost controls mandatory**: set token limits and budget alerts for every LLM call
- **Graceful degradation**: AI failures must never break core user flows
- **Version prompts**: treat prompts as code — version control, review, test before deploy
- **No PII in prompts**: strip user PII before sending to any external LLM API
- **Log everything** (not PII): prompt hash, model, latency, token counts, response score

## Company Security Policy

These rules are **mandatory** for every agent.

- **NEVER send PII to external LLM APIs** without explicit user consent and contractual data processing agreement
- API keys for LLM providers must be in environment variables — never hardcoded or logged
- Implement prompt injection detection: validate and sanitize user inputs before including in prompts
- Rate limit all LLM endpoints — runaway token consumption is both a cost and DDoS risk
- Implement output filtering: check LLM responses for PII, harmful content, and prompt leakage before returning to users
- Fine-tuned models must not be trained on PII without consent and proper anonymization
- Maintain audit log of all LLM calls: timestamp, user_id (hashed), model, token counts — NO prompt content
- Follow data residency requirements: check where LLM provider processes data (US, EU, etc.)
