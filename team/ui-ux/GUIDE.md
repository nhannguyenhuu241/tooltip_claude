# GUIDE — UI/UX Team

> Hướng dẫn chi tiết cho team Thiết kế UI/UX. Dành cho người mới chưa biết gì về hệ thống này.

---

## Team này làm gì?

**UI/UX Team** chịu trách nhiệm về toàn bộ trải nghiệm người dùng: từ nghiên cứu hành vi người dùng, thiết kế wireframes, mockups, design system, cho đến documentation handoff cho frontend team.

**Nguyên tắc số 1:** Không bao giờ tạo high-fidelity designs trước khi có user research và strategy rõ ràng.

---

## Pipeline hoạt động

```
[Yêu cầu thiết kế / feature mới]
        |
        v
  researcher              <-- UX research + competitive analysis (luôn chạy đầu tiên)
        |
        v
  wireframe-designer      <-- IA map + ASCII wireframes + content zones
        |---> design-system-builder (song song: tokens + component catalogue)
        |
        v
   brainstormer           <-- Đánh giá các hướng thiết kế, trade-offs
        |
        v
  ui-ux-designer          <-- Tạo high-fidelity mockups, design specs
        |---> ux-writer (song song: copy catalogue per screen/state)
        |
        v
  docs-manager            <-- Lưu design documentation, update design system guide
```

**Shortcut:**
- **UI bug fix** (color/spacing/alignment): `ui-ux-designer` trực tiếp
- **Copy only**: `ux-writer` trực tiếp — không cần full pipeline
- **Design system only**: `design-system-builder` trực tiếp
- **New feature**: full pipeline từ `researcher`

---

## Các Agents

### product-manager
**Màu:** Xanh dương | **Model:** Sonnet | **Vai trò:** Product Context Provider

**Làm gì (trong UI/UX context):**
- Hiểu yêu cầu tính năng và translate sang design context
- Cung cấp user personas, acceptance criteria, scope boundaries
- Xác định priority features và user journeys cần design
- **Không** design bất kỳ UI nào — chỉ cung cấp context cho designers

**Chạy đầu tiên** cho mọi tính năng mới hoặc redesign lớn.

---

### researcher
**Màu:** Cyan | **Model:** Sonnet | **Vai trò:** UX Researcher

**Làm gì:**
- Nghiên cứu user behavior patterns và mental models
- Competitor UI analysis: screenshot + phân tích patterns họ dùng
- UX best practices và accessibility standards research
- Tổng hợp findings thành design insights và recommendations
- Hỗ trợ ui-ux-designer với data-driven decisions

**Chạy song song với product-manager** cho mọi tính năng mới.

**Output bao gồm:**
- Competitor UI analysis (screenshots, patterns, strengths/weaknesses)
- User behavior insights
- Recommended patterns và component approaches
- Accessibility considerations

---

### brainstormer
**Màu:** Tím | **Model:** Sonnet | **Vai trò:** Design Strategist

**Làm gì:**
- Đánh giá nhiều hướng thiết kế khi có trade-offs
- So sánh: layout approaches, interaction patterns, component strategies
- Đưa ra design direction recommendations kèm reasoning
- **Không tạo final designs** — chỉ decision summaries và direction

**Khi nào dùng:** Khi có nhiều cách tiếp cận khả thi và cần evaluate trade-offs trước khi đầu tư vào high-fidelity.

**Ví dụ output:**
```
Option A: Tab-based navigation
  Pros: Familiar pattern, easy discoverability
  Cons: Limited to ~5 items, poor for deep hierarchies

Option B: Sidebar navigation
  Pros: Scalable, works for 20+ items
  Cons: Takes screen real estate, hidden on mobile

Recommendation: Sidebar (collapsible) — phù hợp với 15 menu items
dự kiến và user base là desktop-first business users.
```

---

### ui-ux-designer
**Màu:** Hồng | **Model:** Sonnet | **Vai trò:** Core Designer

**Đây là agent chính của team.**

**Làm gì:**
- Tạo wireframes, mockups, design specifications
- Xây dựng và maintain design system components, tokens, documentation
- Đảm bảo consistency, accessibility (WCAG 2.1 AA), responsive design
- Review existing UI cho design quality và inconsistencies
- Design handoff: specs cho frontend team với đầy đủ thông tin implement

**Output bao gồm:**
- Wireframes (low-fidelity layout)
- Mockups (high-fidelity với colors, typography, real content)
- Component specifications (states, variants, props)
- Accessibility notes (ARIA, keyboard nav, contrast ratios)
- Responsive breakpoint specs (375px / 768px / 1280px)
- Interaction & animation specs (nếu cần)

**Quy tắc cứng:**
- WCAG 2.1 AA bắt buộc — color contrast ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- Không dùng real PII trong mockups — chỉ dùng personas và synthetic data
- Design system first — reuse components trước khi tạo mới
- Document mọi component mới trong design system guide
- Cấm dark patterns (hidden costs, misleading CTAs, forced consent)

---

### docs-manager
**Màu:** Xanh dương | **Model:** Sonnet | **Vai trò:** Design Documentation Manager

**Làm gì:**
- Maintain design system documentation: component library, tokens, UX guidelines
- Update sau mỗi design decision hoặc component mới
- Đảm bảo designers và engineers có reference chính xác, cập nhật
- Lưu accessibility audit results per screen/component

---

### wireframe-designer
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** Information Architect & Wireframe Specialist

**Làm gì:**
- Tạo Information Architecture map (Mermaid): menu structure, page hierarchy, navigation taxonomy
- ASCII wireframes cho mọi screen trong scope với content zones được labeled
- Xác định primary/secondary/tertiary actions per screen
- Định nghĩa empty state, loading state, error state per screen
- Navigation patterns: breadcrumbs, tabs, sidebar, progressive disclosure
- Responsive adaptation notes (768px tablet, 375px mobile)
- Output: `./docs/wireframes/[feature]-wireframes.md`

**Chạy TRƯỚC high-fidelity design** — sau researcher, trước ui-ux-designer.

**Output mẫu:**
```
Screen: Order List (/orders) — Desktop 1280px
┌─────────────────────────────────────────────────────────┐
│ [SIDEBAR NAV]   │  Orders                    [+ New]    │
│  Dashboard      │  ─────────────────────────────────    │
│  ► Orders       │  [Search...............] [Filter ▼]   │
│  Products       │  [Status: All ▼] [Date: Month ▼]      │
│  Settings       │  ─────────────────────────────────    │
│                 │  □  #  Customer    Status   Amount    │
│                 │  □  1  Alice Co.   Shipped  $1,200    │
│                 │  □  2  Bob Ltd.    Pending  $450      │
│                 │  ─────────────────────────────────    │
│                 │  [< Prev]  Page 1 of 12  [Next >]     │
└─────────────────────────────────────────────────────────┘
Content zones: A=Sidebar nav | B=Page title+CTA | C=Search+filters | D=Table | E=Pagination
Empty state: "No orders found. [Create your first order →]"
Loading state: Skeleton rows (3 rows, table shape)
Error state: "Failed to load orders. [Retry]"
```

---

### design-system-builder
**Màu:** Xanh lá | **Model:** Sonnet | **Vai trò:** Design System Specialist

**Làm gì:**
- Color token system: primitive palette → semantic tokens → component tokens (YAML)
- Typography scale: font families, sizes, weights, line heights, semantic roles
- Spacing scale (4px base grid): 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- Component catalogue: variants, states (default/hover/focus/active/disabled/loading), usage rules, anti-patterns, accessibility
- Motion/animation tokens: duration (instant/fast/normal/slow) + easing curves
- Token naming convention: `{category}-{variant}-{state}`
- Output: `./docs/design-system.md` + `./docs/design-tokens.yaml`

**Chạy song song với wireframe-designer** cho new projects, hoặc on-demand khi cần new components.

**Token mẫu:**
```yaml
semantic:
  color:
    brand:
      primary: "#2563EB"          # blue-600
      primary-hover: "#1D4ED8"    # blue-700
    text:
      default: "#111827"          # gray-900
      muted: "#6B7280"            # gray-500
      disabled: "#9CA3AF"         # gray-400
      error: "#DC2626"            # red-600
    feedback:
      error-bg: "#FEF2F2"
      success: "#16A34A"
      success-bg: "#F0FDF4"

Component: Button
  Variants: primary | secondary | ghost | danger | link
  Sizes: sm (h-8) | md (h-10) | lg (h-12)
  States: default | hover | focus-visible | active | disabled | loading
  Rule: Max 1 primary button per view — use secondary for additional actions
```

---

### ux-writer
**Màu:** Vàng | **Model:** Sonnet | **Vai trò:** UX Copy Specialist

**Làm gì:**
- Copy catalogue per screen: headings, labels, placeholders, hint text, button labels
- ALL states per element: default/loading/success/error/empty/disabled
- Error messages: actionable ("Enter a valid email address") không blaming ("Invalid input")
- Terminology glossary: official names cho features, entities, actions — dùng nhất quán
- Copy anti-patterns: danh sách phrases cần tránh và tại sao
- Output: `./docs/ux-copy-[feature].md` + `./docs/terminology.md`

**Chạy song song với ui-ux-designer** — copy và visual design phát triển đồng thời.

**Output mẫu:**
```
Screen: Login
─────────────────────────────────────
Element: Submit button
Recommended: "Sign in"
Loading state: "Signing in..."
Reason: Action verb, consistent với heading

Errors:
  email empty:       "Enter your email address"
  email invalid:     "Enter a valid email address (e.g. you@company.com)"
  wrong credentials: "Incorrect email or password. Check your details and try again."
  account locked:    "Account temporarily locked after multiple failed attempts.
                      Try again in 15 minutes or reset your password."
  server error:      "Something went wrong on our end. Try again in a moment."

Terminology:
  Use "Sign in" (not "Login", "Log in")
  Use "Account" (not "Profile", "User")
  Use "Order" (not "Transaction", "Purchase")
```

---

### lead (Entry Point)
**Màu:** Cyan | **Model:** Sonnet | **Vai trò:** Team Lead / Orchestrator

Điều phối toàn team, spawn agents theo pipeline, validate output.

---

## Commands

### Gọi toàn bộ pipeline (khuyến nghị)
```
/lead
```

### Gọi agent cụ thể
```
/researcher              -- UX research + competitor analysis (chạy đầu tiên, song song)
/wireframe-designer      -- IA map + ASCII wireframes + content zones + responsive notes
/design-system-builder   -- Design tokens YAML + component catalogue + motion tokens
/ux-writer               -- Copy catalogue per screen/state + terminology glossary
/brainstormer            -- Đánh giá design directions và trade-offs
/ui-ux-designer          -- Tạo high-fidelity mockups, design specs, component documentation
/docs-manager            -- Cập nhật design documentation
```

### Code — Thực hiện design tasks tuần tự
```
/code
```
Trong UI/UX context, `/code` được dùng để thực hiện design pipeline tuần tự:
1. Research → 2. Brainstorm → 3. Design → 4. Document

Dùng khi có một flow cần thiết kế từ đầu đến cuối.

### Code Parallel — Research và Design song song
```
/code:parallel
```
UI/UX team hưởng lợi lớn từ parallel khi nghiên cứu nhiều aspects cùng lúc.

**Ví dụ dùng Code Parallel:**

**Scenario 1: Research đa chiều**
```
Thiết kế trang Dashboard cần:
- Researcher A: Analyze 5 competitor dashboards
- Researcher B: Research data visualization best practices
- Researcher C: Accessibility requirements cho dashboard widgets
- Product-manager: Draft user journeys cho dashboard

→ /code:parallel spawn tất cả song song
→ brainstormer nhận kết quả từ tất cả → đề xuất direction
→ ui-ux-designer bắt đầu design
```

**Scenario 2: Design nhiều screens độc lập**
```
Cần design 4 screens của admin panel:
- User Management screen
- Product Catalog screen
- Orders screen
- Analytics screen

→ /code:parallel spawn 4 ui-ux-designer tasks
→ Mỗi screen có specs riêng, share design tokens chung
→ Nhanh hơn 4x
```

**Khi KHÔNG dùng Code Parallel:**
- Screen B dùng components từ Screen A chưa được design
- Design system tokens chưa được define
- Brainstorming direction chưa xong

---

## Ví dụ prompts thực tế

**Thiết kế feature mới hoàn chỉnh:**
```
/lead

Thiết kế tính năng User Notifications cho web app (Next.js, desktop-first).
User story: Người dùng muốn thấy real-time notifications về trạng thái đơn hàng.
Context: B2B SaaS, users là admin và staff, không phải end-consumers.
Design system hiện tại: shadcn/ui + custom tokens.
```

**Fix UI bug:**
```
/ui-ux-designer

Màu nền của Alert component (#FF6B6B) không đạt contrast ratio với chữ trắng.
Tìm màu thay thế đạt WCAG AA (contrast ≥ 4.5:1) và consistent với design system.
Output: Updated color token + usage guide.
```

**Research competitor trước khi design:**
```
/researcher

Analyze UX patterns của 5 HR management tools:
- BambooHR, Workday, Rippling, Gusto, Deel
Focus: onboarding flow, navigation structure, dashboard layout.
Output: Design insights report với screenshots và recommendations.
```

**Nhiều screens song song:**
```
/lead

Design admin panel với 5 screens độc lập. Design system tokens đã có tại ./docs/design-tokens.md
Chạy parallel:
1. User Management screen
2. Billing & Invoices screen
3. System Settings screen
4. API Keys Management screen
5. Audit Logs screen
```

**Accessibility audit:**
```
/ui-ux-designer

Audit toàn bộ checkout flow (5 screens) cho WCAG 2.1 AA compliance.
Screenshots tại ./docs/designs/checkout/
Report: violations theo severity (Critical/High/Medium) + fix recommendations.
```

---

## Output artifacts

| File | Mô tả |
|------|-------|
| `./docs/designs/[feature]/` | Wireframes và mockup specs |
| `./docs/design-system.md` | Component library documentation |
| `./docs/design-tokens.md` | Colors, typography, spacing tokens |
| `./docs/ux-guidelines.md` | UX patterns và interaction guidelines |
| `./docs/accessibility-audit-[screen].md` | WCAG audit results |
| `./docs/design-changelog.md` | Lịch sử thay đổi design |
| `./docs/handoff-[feature].md` | Handoff specs cho frontend team |

---

## Checklist Handoff cho Frontend Team

Trước khi bàn giao cho frontend team, ui-ux-designer PHẢI cung cấp:

```
[ ] Mockups ở cả 3 breakpoints: 375px / 768px / 1280px
[ ] Tất cả states: default, hover, focus, active, disabled, loading, empty, error
[ ] Color tokens (không hardcode hex — dùng token names)
[ ] Typography specs: font-size, font-weight, line-height, color
[ ] Spacing specs (dùng 4px grid system)
[ ] Interaction specs: transitions, animations (duration + easing)
[ ] ARIA labels cho mọi interactive element
[ ] Keyboard navigation flow
[ ] Color contrast ratios đã verified
[ ] Accessibility notes per component
```

---

## WCAG 2.1 AA — Quy tắc bắt buộc

| Yêu cầu | Threshold |
|---------|----------|
| Contrast chữ thường | ≥ 4.5:1 |
| Contrast chữ lớn (18px+) | ≥ 3:1 |
| Focus indicator | Phải visible |
| Keyboard navigation | Phải hoạt động hoàn toàn |
| Screen reader | Tất cả content phải accessible |
| Motion | Phải có `prefers-reduced-motion` option |

**WCAG violations là blocking issues — không phải suggestions.**

---

## Security & Privacy bắt buộc

- Không real PII trong mockups — dùng personas: "Alice Johnson, 34, Marketing Manager"
- User research data → `[CONFIDENTIAL]` — lưu securely
- Design files với client branding → `[CONFIDENTIAL]` — không public sharing
- Prototype links không được share publicly
- Cấm dark patterns: không hidden costs, không misleading CTAs, không forced consent
