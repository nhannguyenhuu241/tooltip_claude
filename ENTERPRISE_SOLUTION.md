# Enterprise AI Context Management

Giải pháp quy mô hóa việc sử dụng AI (Claude) cho team 10-100+ developers.

## Vấn Đề Cốt Lõi

### Cấp độ 1: Cá nhân (1 dev)
✅ AI viết script nhỏ, fix bug lẻ tẻ
❌ Không scale được

### Cấp độ 2: Team (10-100 devs)
❌ 100 người → 100 kiểu code style
❌ Claude không biết Store/SDK/Lib nội bộ
❌ Hallucination khi thiếu context
❌ Không đồng bộ giữa các dev

---

## Giải Pháp: 3 Trụ Cột + Auto-Doc-Sync

```
┌──────────────────────────────────────────────────┐
│  TRỤ CỘT 1: Context Management                  │
│  → Auto-Doc-Sync Hook                            │
│     ✓ Tự động cập nhật docs/CONTEXT.md          │
│     ✓ Track changes, modules, lib usage          │
│     ✓ Feed định nghĩa, không feed implementation │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  TRỤ CỘT 2: Prompt Standardization              │
│  → Prompt Library + System Instructions          │
│     ✓ Mẫu prompts cho từng tác vụ                │
│     ✓ Code convention chung                      │
│     ✓ Few-shot learning với examples             │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  TRỤ CỘT 3: Human in the Loop                   │
│  → Code Review + Auto Test                       │
│     ✓ Code reviewer agent                        │
│     ✓ Bắt buộc unit test                         │
│     ✓ /sync command check conflicts              │
└──────────────────────────────────────────────────┘
```

---

## Trụ Cột 1: Context Management

### Vấn đề: Claude không biết Lib/SDK/Store nội bộ

### Giải pháp: Auto Context Builder

```
Khi dev commit code:
  ↓
Hook tự động:
1. Scan thay đổi
2. Extract definitions (.d.ts, interfaces, types)
3. Update docs/context/
   ├── libs.md        # SDK/Lib definitions
   ├── store.md       # Store structure
   ├── api.md         # API specs
   └── examples.md    # Code examples
```

### Files Structure

```
docs/
├── CONTEXT.md              # Team activity summary
├── context/
│   ├── libs.md            # Internal SDK definitions
│   │   └── payment-sdk.md
│   │   └── auth-sdk.md
│   ├── store/             # Store structures
│   │   └── user-store.md
│   │   └── order-store.md
│   ├── api-specs/         # Swagger/OpenAPI
│   └── examples/          # Code examples (few-shot)
│       └── create-api-endpoint.md
│       └── write-store-module.md
└── modules/               # Per-module docs
```

### Example: libs.md (Auto-generated)

```markdown
# Internal SDKs & Libraries

Last updated: 2026-01-29

## Payment SDK

**Location**: `src/lib/payment-sdk`
**Latest version**: v2.3.1

### Type Definitions

\`\`\`typescript
// payment-sdk/types.ts
interface PaymentRequest {
  amount: number;
  currency: string;
  method: 'card' | 'bank_transfer' | 'wallet';
  metadata?: Record<string, any>;
}

interface PaymentResponse {
  transactionId: string;
  status: 'success' | 'pending' | 'failed';
  message?: string;
}
\`\`\`

### Core Functions

\`\`\`typescript
// payment-sdk/index.ts
export async function processPayment(
  req: PaymentRequest
): Promise<PaymentResponse>;

export async function refundPayment(
  transactionId: string,
  amount?: number
): Promise<PaymentResponse>;
\`\`\`

### Usage Example

\`\`\`typescript
import { processPayment } from '@/lib/payment-sdk';

const result = await processPayment({
  amount: 100000,
  currency: 'VND',
  method: 'card'
});
\`\`\`

### ⚠️ Important Notes

- Always validate amount > 0
- Log all transactions to audit table
- Handle errors with proper status codes
```

---

## Trụ Cột 2: Prompt Standardization

### Vấn đề: 100 người → 100 kiểu code

### Giải pháp: Prompt Library + System Instructions

#### File: `.claude/prompts/system-instructions.md`

```markdown
# System Instructions for Company XYZ

## Your Role
You are a Senior Full-stack Developer at Company XYZ, specializing in:
- Backend: Node.js, NestJS, PostgreSQL
- Frontend: React, TypeScript, Tailwind
- Architecture: Microservices

## Code Conventions (MUST FOLLOW)

### File Structure
\`\`\`
src/
├── modules/
│   └── {module-name}/
│       ├── {module}.controller.ts
│       ├── {module}.service.ts
│       ├── {module}.repository.ts
│       └── dto/
\`\`\`

### Naming Conventions
- Files: kebab-case (user-profile.service.ts)
- Classes: PascalCase (UserProfileService)
- Functions: camelCase (getUserProfile)
- Constants: UPPER_SNAKE_CASE (MAX_RETRY_COUNT)

### Error Handling
\`\`\`typescript
// Always use try-catch at Controller level
@Post()
async createUser(@Body() dto: CreateUserDto) {
  try {
    return await this.userService.create(dto);
  } catch (error) {
    throw new HttpException(
      error.message,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
\`\`\`

### Comments
- Use JSDoc for public functions
- Inline comments for complex logic only
- No obvious comments

### Dependencies
- ✅ Allowed: lodash, date-fns, zod
- ❌ Forbidden: moment, ramda

### Testing (MANDATORY)
- Every new function MUST have unit test
- Use Jest + Supertest
- Coverage minimum: 80%

## Output Format
1. Only return code, no explanations (unless asked)
2. Always include imports
3. Always include type definitions
4. Include unit test file if creating new function
```

#### Prompt Library Structure

```
.claude/prompts/
├── system-instructions.md      # Company-wide rules
├── templates/
│   ├── create-api-endpoint.md
│   ├── create-store-module.md
│   ├── write-unit-test.md
│   ├── refactor-function.md
│   └── fix-bug.md
└── examples/                   # Few-shot examples
    ├── good-api-example.md
    ├── good-store-example.md
    └── good-test-example.md
```

#### Example Template: `create-api-endpoint.md`

```markdown
# Template: Create API Endpoint

## Context Required
Before asking, provide:
1. API spec (Swagger/OpenAPI) or requirements
2. Database schema for affected tables
3. Related DTOs if any

## Prompt Template

\`\`\`
Based on company conventions in system-instructions.md:

Task: Create API endpoint for {feature}

Requirements:
- Endpoint: POST /api/{resource}
- Request body: {describe}
- Response: {describe}
- Business logic: {describe}

Database schema:
\`\`\`sql
{paste schema}
\`\`\`

Please generate:
1. Controller with error handling
2. Service with business logic
3. Repository for database access
4. DTOs (CreateDto, UpdateDto, ResponseDto)
5. Unit tests for service
6. Integration test for controller

Follow few-shot example: examples/good-api-example.md
\`\`\`

## Expected Output

Claude will generate:
- {module}.controller.ts
- {module}.service.ts
- {module}.repository.ts
- dto/{module}.dto.ts
- {module}.service.spec.ts
- {module}.controller.spec.ts
```

---

## Trụ Cột 3: Human in the Loop

### Vấn đề: AI code phải được verify

### Giải pháp: Auto Review + Mandatory Tests

#### 1. Code Reviewer Agent (Đã có)

```bash
# Sau khi Claude generate code
/review

# Agent sẽ check:
- Code style theo conventions
- Security vulnerabilities
- Performance issues
- Missing error handling
- Missing tests
```

#### 2. Mandatory Unit Test Hook

```javascript
// .claude/hooks/test-enforcer.js

// Hook chặn commit nếu thiếu test
if (isNewFunction && !hasUnitTest) {
  console.error('❌ Missing unit test for new function!');
  console.log('💡 Ask Claude to generate tests:');
  console.log('   /test write tests for {function-name}');
  process.exit(2); // Block commit
}
```

#### 3. /sync Command (Đã có)

```bash
# Trước khi code
/sync {module}

# Check:
- Ai đang làm gì?
- Có conflict không?
- Context hiện tại?
```

---

## Workflow Thực Tế: Code Feature Mới

### Scenario: Dev A viết API create order

```markdown
┌─────────────────────────────────────────────┐
│ BƯỚC 1: Check Context                      │
└─────────────────────────────────────────────┘

Dev A: /sync order

Claude reads:
- docs/modules/order.md
- docs/context/api-specs/order-api.md
- docs/context/store/order-store.md

Claude responds:
📊 Order Module Context
- Last change: 3h ago by Dev B
- Active: Dev B working on order-list
- ⚠️ Coordinate with Dev B before coding

┌─────────────────────────────────────────────┐
│ BƯỚC 2: Gather Context                     │
└─────────────────────────────────────────────┘

Dev A gathers:
1. Database schema (orders table)
2. API spec from Swagger
3. Payment SDK docs (from docs/context/libs.md)

┌─────────────────────────────────────────────┐
│ BƯỚC 3: Use Prompt Template                │
└─────────────────────────────────────────────┘

Dev A: /cook

Using template: .claude/prompts/templates/create-api-endpoint.md

Prompt:
"Based on system-instructions.md:

Task: Create API endpoint for creating order

Requirements:
- POST /api/orders
- Use Payment SDK for payment processing
- Follow order-store structure in docs/context/store/order-store.md

Database schema:
[paste schema]

API Spec:
[paste spec]

Generate: Controller, Service, Repository, DTOs, Tests"

┌─────────────────────────────────────────────┐
│ BƯỚC 4: Claude Generates Code              │
└─────────────────────────────────────────────┘

Claude generates (with full context):
✓ order.controller.ts (đúng convention)
✓ order.service.ts (dùng Payment SDK đúng)
✓ order.repository.ts
✓ dto/create-order.dto.ts
✓ order.service.spec.ts (unit test)
✓ order.controller.spec.ts (integration test)

┌─────────────────────────────────────────────┐
│ BƯỚC 5: Code Review                        │
└─────────────────────────────────────────────┘

Dev A: /review

Code-reviewer agent checks:
✓ Follow conventions
✓ No security issues
✓ Has error handling
✓ Has unit tests
✓ Uses Payment SDK correctly

┌─────────────────────────────────────────────┐
│ BƯỚC 6: Commit & Auto-Doc-Sync             │
└─────────────────────────────────────────────┘

Dev A: git commit -m "feat: create order API"

Hook auto-doc-sync triggers:
✓ Updates docs/modules/order.md
✓ Updates docs/CONTEXT.md
✓ Notifies team: "Order module updated by Dev A"

┌─────────────────────────────────────────────┐
│ BƯỚC 7: Team Sync                          │
└─────────────────────────────────────────────┘

Dev B: /sync

Claude shows:
📊 Recent Activity
- Dev A: Created order API (just now)
- Affected: order module
- New: Payment SDK integration

💡 If working on order-list, check new changes
```

---

## Trả Lời Câu Hỏi Của Sếp

### Q1: Ví dụ cái ECP thì Claude code ra sao?

**A:** Chúng ta không bảo Claude "Code cái ECP đi".

**Quy trình:**

1. **Chia nhỏ**: ECP → Modules (User, Order, Payment, Inventory...)

2. **Chuẩn bị Context**:
   ```bash
   # Upload vào docs/context/
   - Database schema (ERD)
   - API specs (Swagger)
   - Business rules (docs/requirements/)
   ```

3. **Dùng Template**:
   ```
   /cook module User
   → Template: create-api-endpoint.md
   → Context: DB schema + API spec + conventions
   → Output: Đầy đủ CRUD với tests
   ```

4. **Lặp lại** cho từng module

5. **Integration**: Dev senior ghép các modules

### Q2: Làm sao viết store, function?

**A:** Few-Shot Prompting với examples chuẩn.

**Quy trình:**

1. **Chuẩn bị Example**:
   ```markdown
   # docs/context/examples/good-store-example.md

   Store structure chuẩn:
   \`\`\`typescript
   // stores/user.store.ts
   import { create } from 'zustand';

   interface UserStore {
     user: User | null;
     setUser: (user: User) => void;
     clearUser: () => void;
   }

   export const useUserStore = create<UserStore>((set) => ({
     user: null,
     setUser: (user) => set({ user }),
     clearUser: () => set({ user: null })
   }));
   \`\`\`
   ```

2. **Prompt với Example**:
   ```
   Tham khảo good-store-example.md,
   viết Store cho module Order tương tự.

   Requirements:
   - State: orders[], selectedOrder, loading
   - Actions: fetchOrders, selectOrder, createOrder
   ```

3. **Claude generates** theo đúng pattern

### Q3: Sử dụng cái lib có sẵn?

**A:** Feed Definitions vào docs/context/libs.md

**Quy trình:**

1. **Auto-extract** (hook tự động):
   ```javascript
   // Hook scan khi có lib mới
   - Extract .d.ts files
   - Generate docs/context/libs/{lib-name}.md
   - Include: Types, Functions, Examples
   ```

2. **Dev prompt**:
   ```
   Dựa vào docs/context/libs/payment-sdk.md,
   viết function xử lý thanh toán.

   Requirements: ...
   ```

3. **Claude** dùng đúng SDK (không hallucinate)

### Q4: Dự án 100 người thì sao?

**A:** Claude Projects + Auto-Doc-Sync + Prompt Library

**Setup:**

1. **Claude Project** (nếu có Enterprise):
   ```
   Project: "Company XYZ"
   ├── Upload system-instructions.md
   ├── Upload coding-conventions.md
   ├── Upload architecture-guide.md
   ```

2. **Auto-Doc-Sync Hook**:
   - Tự động sync context mỗi commit
   - Mọi dev luôn có context fresh

3. **Prompt Library**:
   - Mọi dev dùng chung templates
   - Đảm bảo consistency

4. **/sync Command**:
   - Check trước khi code
   - Tránh conflicts

**Kết quả:**

- 100 dev dùng cùng "bộ não" (Project Knowledge)
- Context luôn fresh (Auto-Doc-Sync)
- Code style đồng nhất (Prompt Templates)
- Quality đảm bảo (Code Review + Tests)

---

## Action Plan Cho Meeting Thứ 6

### Đề xuất với Sếp:

#### Phase 1: Pilot (2 tuần)
- [ ] Setup Auto-Doc-Sync hook cho 1 team (5-10 devs)
- [ ] Tạo Prompt Library cơ bản (3-5 templates)
- [ ] Build docs/context/ structure
- [ ] Pilot /sync command

#### Phase 2: Scale (1 tháng)
- [ ] Expand to 3 teams (30 devs)
- [ ] Complete Prompt Library (10+ templates)
- [ ] Setup Claude Project (if Enterprise)
- [ ] Measure metrics (code quality, velocity)

#### Phase 3: Company-wide (2-3 tháng)
- [ ] Roll out to all teams (100+ devs)
- [ ] Continuous improvement based on feedback
- [ ] Build internal "AI Best Practices" guide

### Metrics Đo Lường

| Metric | Trước | Mục tiêu |
|--------|-------|----------|
| Code review time | 2h/PR | 30min/PR |
| Onboarding time | 2 tuần | 3 ngày |
| Code consistency | 60% | 95%+ |
| Bug rate | 15/sprint | <5/sprint |
| Test coverage | 40% | 80%+ |

---

## Tổng Kết

### Vấn đề Sếp lo ngại:
❌ 100 người code kiểu khác nhau
❌ AI không biết SDK/Store nội bộ
❌ Hallucination

### Giải pháp:
✅ **Context Management**: Auto-Doc-Sync
✅ **Standardization**: Prompt Library + System Instructions
✅ **Quality Control**: Code Review + Tests + /sync

### Kết quả:
🎯 Team 100 devs code đồng nhất như 1 người
🎯 AI biết chính xác SDK/Lib/Store nội bộ
🎯 Zero hallucination (có context đầy đủ)
🎯 Quality code + Full test coverage
