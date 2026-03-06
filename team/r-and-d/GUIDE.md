# GUIDE — R&D Team

> Hướng dẫn cho team R&D (Research & Development). Dành cho người mới chưa biết gì về hệ thống này.

---

## Team này làm gì?

**R&D Team** nghiên cứu, đánh giá công nghệ, xây dựng proof-of-concept, và sản xuất innovation reports cho lãnh đạo engineering và product. Team giúp công ty đưa ra quyết định "nên dùng X không?" dựa trên dữ liệu thực, không phải cảm tính.

---

## Nguyên tắc quan trọng

- **Hypothesis-driven**: Mọi experiment phải có hypothesis rõ ràng trước khi bắt đầu
- **Time-boxed**: PoC tối đa 2 ngày, evaluation tối đa 3 ngày — không kéo dài
- **Document failures**: Kết quả âm cũng là dữ liệu quý giá
- **Reproducible**: Clone repo → 1 lệnh → chạy được
- **Actionable**: Output cuối cùng phải là recommendation rõ ràng: ADOPT / WATCH / REJECT

---

## Pipeline hoạt động

```
[Câu hỏi nghiên cứu]
        |
        v
    researcher            <-- Literature review, competitive analysis, landscape mapping
        |
        v
  tech-evaluator          <-- Benchmark, scoring matrix, recommendation
        |
        v
   poc-engineer           <-- Build prototype để validate hypothesis (max 2 ngày)
        |
        v
experiment-analyst        <-- Phân tích kết quả, statistical validity, verdict
        |
        v
  docs-manager            <-- Tổng hợp thành Innovation Brief + update shared docs
```

**Shortcut nếu chỉ cần thông tin:**
```
researcher → docs-manager
```

**Shortcut nếu chỉ cần so sánh options:**
```
tech-evaluator → docs-manager
```

---

## Các Agents

### lead
**Vai trò:** R&D orchestrator
**Làm gì:** Clarify research question, spawn agents, time-box experiments, synthesize findings

### researcher
**Vai trò:** Technical Research Specialist
**Làm gì:** Literature review, competitive analysis, benchmark data gathering
**Output:** `./docs/research-[topic].md`

### tech-evaluator
**Vai trò:** Technology Evaluation Specialist
**Làm gì:** Benchmark competing solutions, scoring matrix, evidence-based recommendation
**Output:** `./docs/eval-[technology].md`

### poc-engineer
**Vai trò:** Proof of Concept Engineer
**Làm gì:** Minimal working prototype để validate hypothesis — không phải production code
**Giới hạn:** 2 ngày maximum
**Output:** `./experiments/[name]/` (runnable code + README + findings)

### experiment-analyst
**Vai trò:** Experiment Analysis Specialist
**Làm gì:** Phân tích kết quả PoC, statistical significance, verdict: Proceed / Iterate / Abandon
**Output:** `./results/[experiment]-analysis.md`

### docs-manager
**Vai trò:** R&D Documentation Manager
**Làm gì:** Tổng hợp tất cả thành Innovation Brief, update research index, share với other teams
**Output:** `./docs/innovation-brief-[topic].md`

---

## Commands

```
/lead              -- Bắt đầu research cycle đầy đủ
/researcher        -- Research một topic cụ thể
/tech-evaluator    -- So sánh và đánh giá technologies
/poc-engineer      -- Build prototype để test hypothesis
/experiment-analyst -- Phân tích kết quả experiment
/docs-manager      -- Tổng hợp thành innovation brief
```

---

## Ví dụ prompts

**Research question:**
```
/lead
Câu hỏi: Chúng ta có nên dùng pgvector thay vì Pinecone cho vector storage không?
Context: App có 5M vectors, 1000 queries/day, budget tối đa $200/tháng.
```

**Technology evaluation:**
```
/tech-evaluator
So sánh: Bun vs Node.js vs Deno cho backend API service của chúng ta.
Criteria quan trọng: performance, ecosystem maturity, TypeScript support, team learning curve.
```

**PoC:**
```
/poc-engineer
Hypothesis: WebAssembly có thể xử lý image resize client-side nhanh hơn server-side với ảnh <2MB.
Time-box: 1.5 ngày. Build PoC đo tốc độ xử lý so sánh hai approach.
```

---

## Output artifacts

| File | Mô tả |
|------|-------|
| `./docs/research-[topic].md` | Research report từ researcher |
| `./docs/eval-[tech].md` | Technology evaluation từ tech-evaluator |
| `./experiments/[name]/` | PoC code + README từ poc-engineer |
| `./results/[name]-analysis.md` | Experiment analysis từ experiment-analyst |
| `./docs/innovation-brief-[topic].md` | Tổng hợp final từ docs-manager |

---

## Shared Knowledge

Sau mỗi research cycle, docs-manager publish summary vào `../shared/docs/` để các team khác (backend, frontend, etc.) có thể tham khảo decisions.
