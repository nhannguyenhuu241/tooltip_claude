# GUIDE — AI Engineering Team

> Hướng dẫn cho team AI Engineering. Dành cho người mới chưa biết gì về hệ thống này.

---

## Team này làm gì?

**AI Engineering Team** thiết kế và triển khai các tính năng AI: tích hợp LLM (Claude, OpenAI, Gemini), hệ thống RAG (Retrieval-Augmented Generation), prompt engineering, AI agent, và đánh giá chất lượng AI (eval). Team đảm bảo AI features chính xác, an toàn, và cost-efficient.

---

## Pipeline hoạt động

```
[Yêu cầu AI feature]
        |
        v
     planner               <-- Chọn approach (zero-shot/RAG/fine-tuning), model selection, cost model
        |
        v
   ai-architect            <-- System design: RAG pipeline, agent loop, observability, cost controls
        |
        v
  prompt-engineer          <-- Thiết kế system prompt, few-shot examples, output schema
        |
        v
  [Implementation]         <-- Chọn theo loại feature:
  rag-engineer                 RAG pipeline (chunking, embedding, vector DB, reranking)
  ml-engineer                  LLM integration, AI agent, structured extraction
        |
    ai-evaluator ←→ tech-lead-reviewer  (chạy song song)
        |
    Ship / Iterate
```

**Nguyên tắc vàng:** Không feature AI nào được ship nếu chưa pass eval suite.

---

## Các Agents

### lead
**Vai trò:** Team orchestrator — điều phối pipeline AI
**Enforce:** Eval gate (minimum 20 test cases, accuracy ≥80%)

### planner
**Vai trò:** AI Technical Planner
**Làm gì:** Chọn approach, model, tính cost model, thiết kế eval strategy

### ai-architect
**Vai trò:** AI Systems Architect
**Làm gì:** RAG architecture, agent loop design, multi-model routing, observability stack

### prompt-engineer
**Vai trò:** Prompt Engineering Specialist
**Làm gì:** System prompts, few-shot examples, output schemas, prompt versioning
**Output:** `./prompts/[feature]/` (versioned prompt files)

### rag-engineer
**Vai trò:** RAG Pipeline Engineer
**Khi nào dùng:** Feature cần AI trả lời dựa trên documents/knowledge base
**Chuyên sâu:** Chunking, embedding, vector search, hybrid search, reranking, pgvector

### ml-engineer
**Vai trò:** LLM Integration Engineer
**Khi nào dùng:** LLM API integration, structured extraction, AI automation, agent
**Chuyên sâu:** Anthropic/OpenAI SDK, tool use, retry logic, semantic caching

### ai-evaluator
**Vai trò:** AI Quality Gate (bắt buộc)
**Làm gì:** Chạy eval suite — accuracy, hallucination rate, latency, cost per call
**Quyết định:** Ship / Iterate / Reject

### tech-lead-reviewer
**Vai trò:** AI Code Reviewer
**Kiểm tra:** PII trong prompts, prompt injection protection, cost controls, observability

### debugger
**Vai trò:** AI Bug Specialist (on-demand)
**Khi nào dùng:** Hallucination, eval regression, latency spike, cost anomaly

---

## Commands

```
/lead              -- Bắt đầu pipeline AI đầy đủ (khuyến nghị)
/planner           -- Lên plan AI feature
/ai-architect      -- Thiết kế AI system
/prompt-engineer   -- Thiết kế prompts
/rag-engineer      -- Build RAG pipeline
/ml-engineer       -- Integrate LLM API
/ai-evaluator      -- Chạy eval suite
/tech-lead-reviewer -- Review AI code
/debugger          -- Debug AI issues
```

---

## Ví dụ prompts

**Feature AI mới:**
```
/lead
Implement AI chatbot trả lời câu hỏi về sản phẩm dựa trên product catalog PDF.
Model: Claude Sonnet. RAG-based. Latency target: <2s P95.
```

**Tối ưu prompt:**
```
/prompt-engineer
Tối ưu system prompt cho tính năng phân loại intent của user messages.
Prompt hiện tại tại: ./prompts/intent-classifier/system-prompt-v1.md
Vấn đề: accuracy 65% trên "cancel order" intent.
```

**Debug hallucination:**
```
/debugger
AI đang đưa ra thông tin giá sai cho sản phẩm X.
Prompt version: v3. Model: claude-sonnet-4-6.
Failing test cases tại: ./evals/results/2026-03-06-failures.json
```

---

## Lưu ý bắt buộc

- **Không PII trong prompts** — strip user data trước khi gửi LLM external
- **Token limits trên mọi call** — ngăn cost overrun
- **Version mọi prompt** — treat prompts như code
- **Eval trước khi ship** — không có exception
- **Log usage, không log content** — timestamp, model, tokens, latency. Không log prompt text có PII
