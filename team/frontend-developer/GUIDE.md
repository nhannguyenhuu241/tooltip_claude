# GUIDE — Frontend Developer Team

> Hướng dẫn chi tiết cho team Phát triển Frontend. Dành cho người mới chưa biết gì về hệ thống này.

---

## Team này làm gì?

**Frontend Developer Team** xây dựng mọi thứ người dùng nhìn thấy và tương tác: giao diện web, components, pages, state management, và E2E tests.

Team đảm bảo UI đúng theo design (từ UI/UX team), accessible (WCAG 2.1 AA), responsive (mobile-first), và được kiểm thử kỹ trước khi ship.

---

## Pipeline hoạt động

```
[Design specs từ UI/UX team hoặc yêu cầu từ user]
        |
        v
      planner                          <-- Nghiên cứu + tạo component plan
        |
        v
component-architect + state-engineer   <-- (song song) Component tree + State design
        |
        v
  micro-frontend-engineer              <-- (nếu cần) Module Federation architecture
        |
        v
  [framework-specialist]               <-- Implement theo đúng stack:
  react-specialist                         React/Next.js
  vue-specialist                           Vue 3/Nuxt 3
  angular-specialist                       Angular 17+
  svelte-specialist                        Svelte 5/SvelteKit
        |
        v
animation-engineer + pwa-specialist    <-- (song song, on-demand) Motion + PWA
        |
        v
tech-lead-reviewer + accessibility-auditor  <-- (song song) Review + A11Y audit
        |
        v
hybrid-qa-playwright                   <-- QA + E2E tests + Go/No-Go decision
        |
   debugger (on-demand)                <-- Debug rendering, state, network issues
```

**Shortcut cho UI fixes nhỏ:**
```
[framework-specialist] --> tech-lead-reviewer  (bỏ qua planner)
```

---

## Các Agents

### planner
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** Frontend Technical Planner

**Làm gì:**
- Đọc design specs/wireframes từ UI/UX team
- Nghiên cứu component patterns, thư viện, cách tiếp cận tốt nhất
- Tạo implementation plan với component hierarchy và task breakdown
- Output: plan lưu vào `./plans/[feature].md`

**Plan bao gồm:**
- Component tree (component nào chứa component nào)
- State management approach
- API integration points
- Thứ tự implement (bottom-up: atoms → molecules → organisms → pages)

**Khi nào bỏ qua:** Text changes, color/spacing fixes, minor bug fixes.

---

### engineer-agent
**Màu:** Hồng | **Model:** Sonnet | **Vai trò:** Senior Frontend Engineer

**Làm gì:**
- Implement components và pages theo design specs và plan
- TypeScript strict mode — không dùng `any`, type đầy đủ mọi props
- Bao gồm unit tests (React Testing Library)
- Handle đủ 3 states: loading, error, empty — không được bỏ sót
- Mobile-first responsive design — mọi UI mới
- Sử dụng design system tokens — không hardcode colors/spacing

**Quy tắc cứng:**
- Không dùng `innerHTML` với user data (XSS risk)
- Không store sensitive data trong localStorage không mã hóa
- Không hardcode secrets trong frontend code
- Accessible by default: ARIA labels, keyboard navigation

---

### tech-lead-reviewer
**Màu:** Tím | **Model:** Sonnet | **Vai trò:** Frontend Tech Lead

**Làm gì:**
- Review sau MỌI implementation của engineer-agent
- Kiểm tra: TypeScript correctness, accessibility, performance patterns
- Kiểm tra: alignment với design specs, component conventions
- Kiểm tra: test coverage, XSS/CSRF protection, CSP compliance
- Quyết định: **Approved** / **Needs Changes** / **Rejected**

**Không cho xem là "complete" nếu chưa có Approved.**

---

### hybrid-qa-playwright
**Màu:** Cyan | **Model:** Sonnet | **Vai trò:** QA Engineer + Playwright Specialist

**Làm gì:**
- Validate acceptance criteria từ PRD
- Viết Playwright E2E tests cho critical user flows
- Test: happy path, edge cases, error states, mobile viewports (375px/768px/1280px), accessibility
- Đưa ra **Go / No-Go** decision cho release

**E2E tests bao gồm:**
- Login/logout flows
- Core user journeys
- Form validation và error handling
- Cross-browser compatibility
- Accessibility audit (axe-core)

---

### debugger
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** Frontend Debug Specialist

**Làm gì:**
- Phân tích browser console errors, React DevTools output
- Debug state bugs, re-rendering issues, network errors
- Phân tích bundle size và performance bottlenecks

**Khi nào dùng:** On-demand — chỉ spawn khi có vấn đề cụ thể.

---

### component-architect
**Màu:** Xanh lá | **Model:** Sonnet | **Vai trò:** Frontend Component Architect

**Làm gì:**
- Tạo component tree: mối quan hệ parent-child của mọi component trong feature
- Viết TypeScript prop interfaces cho mọi component
- Xác định state ownership: state nào ở component nào, prop drilling vs shared store
- Định nghĩa composition patterns: render props, slots, compound components
- Xác định boundaries: presentational (UI only) vs container (data fetching, logic)
- Output: `./docs/component-architecture-[feature].md`

**Chạy khi nào:** Trước engineer-agent cho new component systems hoặc feature modules lớn.

**Output mẫu:**
```typescript
// Component Tree — Checkout Flow
// CheckoutPage (container — fetches cart, user)
//   ├── OrderSummary (presentational)
//   │     └── OrderItem[] (presentational)
//   ├── ShippingForm (container — manages form state)
//   │     ├── AddressInput (presentational)
//   │     └── DeliveryOptions (presentational)
//   └── PaymentSection (container — Stripe integration)
//         └── CardElement (presentational)

interface OrderSummaryProps {
  items: CartItem[];
  total: Money;
  isLoading?: boolean;
}
// State ownership: cart state in Zustand, form state in React Hook Form
```

---

### state-engineer
**Màu:** Tím | **Model:** Sonnet | **Vai trò:** Frontend State Architect

**Làm gì:**
- State inventory: list đầy đủ mọi state trong feature (server, client UI, form, URL)
- Zustand store blueprints với state shape, actions, và selectors
- React Query key hierarchy và caching strategy
- Async state machines cho complex flows (multi-step forms, upload progress, polling)
- Optimistic update patterns với rollback handling
- Cache invalidation strategy sau mutations
- Output: `./docs/state-design-[feature].md`

**Chạy khi nào:** Song song với component-architect khi feature có complex async state hoặc shared state.

**Output mẫu:**
```typescript
// State Inventory — Cart Feature
// Server State (React Query): cartItems, userProfile, productPrices
// Client UI State (Zustand): isCartOpen, selectedShippingMethod
// Form State (React Hook Form): checkoutForm
// URL State: /checkout?step=shipping

// Zustand Store Blueprint
interface CartStore {
  isOpen: boolean;
  optimisticItems: CartItem[]; // for optimistic updates
  open: () => void;
  close: () => void;
  addItem: (item: CartItem) => void; // optimistic + React Query mutation
}

// React Query Keys
const cartKeys = {
  all: ['cart'] as const,
  items: () => [...cartKeys.all, 'items'] as const,
  totals: (currency: string) => [...cartKeys.all, 'totals', currency] as const,
}
```

---

### accessibility-auditor
**Màu:** Vàng | **Model:** Sonnet | **Vai trò:** Accessibility Specialist

**Làm gì:**
- WCAG 2.1 AA audit toàn bộ UI mới: contrast ratios, keyboard navigation, focus management
- Kiểm tra ARIA roles, labels, live regions, và semantic HTML
- Tạo A11Y-XXX findings với severity (Blocking/Major/Minor) và fix cụ thể
- Keyboard flow map: Tab order, focus traps trong modals, Escape behavior
- Screen reader test scenarios (NVDA/VoiceOver narrative)
- Output: `./docs/accessibility-audit-[feature].md`

**Chạy khi nào:** Song song với tech-lead-reviewer cho mọi new screens hoặc significant UI changes.

**Findings format:**
```
A11Y-001
Severity: BLOCKING (WCAG 2.1 AA — 1.4.3 Contrast)
Element: <button class="btn-primary"> "Submit Order"
Issue: Text contrast ratio 3.2:1 (required: 4.5:1)
Current: text #FFFFFF on background #4A90E2
Fix: Change background to #1E6BC4 → ratio 5.8:1 ✓
Impact: Users with low vision cannot read button

A11Y-002
Severity: BLOCKING (WCAG 2.1 AA — 2.1.1 Keyboard)
Element: Custom dropdown <div> with onClick
Issue: Not keyboard-accessible — no focus, no Enter/Space handler
Fix: Replace with <button> or add tabIndex=0 + onKeyDown handler
```

---

---

## Framework Specialists

### react-specialist
**Màu:** Cyan | **Model:** Sonnet | **Vai trò:** React / Next.js Expert

**Làm gì:**
- Implement UI với React 18+ hooks, Next.js App Router, React Server Components
- TanStack Query v5: optimistic updates với `onMutate`/`onError`/`onSettled` + `cancelQueries`
- Zustand với middleware stack: `immer` + `persist` + `subscribeWithSelector` + `devtools`
- React Hook Form + Zod (`zodResolver`), accessible forms với `aria-describedby`
- Memoization đúng: `useMemo` chỉ cho expensive derivations, `useCallback` chỉ cho memoized children

**Khi nào dùng:** Project dùng React 18+, Next.js (bất kỳ version), Create React App, Vite + React.

**Ví dụ pattern — RSC + Suspense:**
```tsx
// app/orders/page.tsx — React Server Component
export default async function OrdersPage({ searchParams }: Props) {
  const orders = await db.order.findMany({ where: { status: searchParams.status } })
  return (
    <Suspense key={searchParams.status} fallback={<OrdersSkeleton />}>
      <OrderList initialOrders={orders} />
    </Suspense>
  )
}
```

---

### vue-specialist
**Màu:** Xanh lá | **Model:** Sonnet | **Vai trò:** Vue 3 / Nuxt 3 Expert

**Làm gì:**
- Vue 3 Composition API: `<script setup lang="ts">`, composables với `onUnmounted` cleanup
- Pinia setup store style: `defineStore()` với `ref`/`computed`/`action`, `pinia-plugin-persistedstate`
- Nuxt 3: `useFetch` với options `lazy`, `server`, `transform`, `getCachedData`
- Server API routes với `defineEventHandler`, `getValidatedQuery`, `requireUserSession`
- `readonly()` để expose state an toàn từ composables

**Khi nào dùng:** Project dùng Vue 3, Nuxt 3 (bất kỳ version).

**Ví dụ pattern — Pinia setup store:**
```typescript
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
  function addItem(product: Product) { /* ... */ }
  return { items: readonly(items), total, addItem }
}, { persist: true })
```

---

### angular-specialist
**Màu:** Đỏ | **Model:** Sonnet | **Vai trò:** Angular 17+ Expert

**Làm gì:**
- Angular 17+ standalone components với `ChangeDetectionStrategy.OnPush`
- Signals: `signal()`, `computed()`, `effect()` thay thế RxJS cho local state
- NgRx Signals Store: `signalStore`, `withState`, `withComputed`, `withMethods`, `patchState`
- Functional interceptors (`HttpInterceptorFn`) và functional guards (`CanActivateFn`)
- `takeUntilDestroyed()` để tự động unsubscribe RxJS, `@for` + `track` thay `*ngFor`

**Khi nào dùng:** Project dùng Angular 17+.

**Ví dụ pattern — Signals component:**
```typescript
@Component({ standalone: true, changeDetection: ChangeDetectionStrategy.OnPush })
export class ProductListComponent {
  private store = inject(ProductStore)
  protected products = this.store.filteredProducts  // computed signal
  protected isLoading = this.store.isLoading        // signal
  protected search = signal('')
  constructor() { effect(() => this.store.setFilter(this.search())) }
}
```

---

### svelte-specialist
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** Svelte 5 / SvelteKit Expert

**Làm gì:**
- Svelte 5 runes: `$state`, `$derived`, `$derived.by()`, `$effect`, `$props`, `$bindable`
- Reactive class pattern: `class CartStore { items = $state([]) }` — singleton export
- SvelteKit form actions với `use:enhance` cho progressive enhancement
- Snippets `{#snippet name()}{/snippet}` + `{@render name()}` — thay thế slots
- `+page.server.ts`: `load()` với Zod validation + `fail()` / `redirect()`

**Khi nào dùng:** Project dùng Svelte 5, SvelteKit.

**Lưu ý quan trọng:** Không dùng Svelte 4 syntax (`on:click`, `$:`, `export let`) trong Svelte 5.

**Ví dụ pattern — Reactive class:**
```typescript
class CartStore {
  items = $state<CartItem[]>([])
  total = $derived(this.items.reduce((s, i) => s + i.price * i.qty, 0))
  addItem(p: Product) { this.items.push({ ...p, qty: 1 }) }
}
export const cart = new CartStore()
```

---

## Architecture Specialists

### micro-frontend-engineer
**Màu:** Tím | **Model:** Sonnet | **Vai trò:** Micro-Frontend Architect

**Làm gì:**
- Thiết kế kiến trúc micro-frontend: host/remote mapping, độc lập deploy từng team
- Module Federation config (Webpack 5/Rspack/Vite): `exposes`, `remotes`, `shared` (singleton React, design system)
- `createRemoteComponent` wrapper với `lazy()` + `ErrorBoundary` + `Suspense` — shell vẫn chạy nếu remote lỗi
- Typed Event Bus (`EventMap`) cho cross-app communication
- CSS isolation: CSS Modules, Shadow DOM, hoặc prefix convention
- TypeScript declarations cho mọi remote module

**Khi nào dùng:** Nhiều team frontend độc lập, cần deploy riêng lẻ từng phần của app.

**Ví dụ — Module Federation:**
```javascript
// shell (host)
new ModuleFederationPlugin({
  remotes: { orderMfe: 'orderMfe@http://localhost:3001/remoteEntry.js' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
})

// order-mfe (remote)
new ModuleFederationPlugin({
  name: 'orderMfe', filename: 'remoteEntry.js',
  exposes: { './OrderList': './src/components/OrderList' },
})
```

---

## Enhancement Specialists

### animation-engineer
**Màu:** Hồng | **Model:** Sonnet | **Vai trò:** UI Motion Design Engineer

**Làm gì:**
- Framer Motion: variants system (`fadeInUp`, `staggerContainer`), `AnimatePresence` cho mount/unmount transitions, `layoutId` shared element transitions
- GSAP: `useGSAP()` + `gsap.matchMedia()` + `ScrollTrigger` với `pin`, `scrub`
- CSS-only: `@keyframes` shimmer skeleton, button press micro-interactions
- Lottie: `lottie-react` với segment playback control

**Quy tắc bắt buộc:**
- **Luôn** check `prefers-reduced-motion: reduce` — disable/instant transition nếu user prefer
- Chỉ animate `transform` và `opacity` — không animate `width`, `height`, `top`, `left` (gây layout thrash)
- Không dùng `will-change` trên nhiều hơn 3-4 elements

**Khi nào dùng:** Thêm page transitions, scroll animations, micro-interactions, loading skeletons.

**Ví dụ — Framer Motion modal:**
```tsx
const modal = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } },
}
// Dùng AnimatePresence + motion.div với variants={modal}
```

---

### pwa-specialist
**Màu:** Cam | **Model:** Sonnet | **Vai trò:** Progressive Web App Engineer

**Làm gì:**
- Service Worker với Workbox: `precacheAndRoute` (static assets), `NetworkFirst` (API, 5s timeout), `CacheFirst` (images, 30 days), `StaleWhileRevalidate` (fonts)
- Background Sync: `BackgroundSyncPlugin` — retry failed POST khi back online
- Push Notifications: `PushManager.subscribe()` với VAPID, `showNotification()` trong SW, `notificationclick` → `clients.openWindow()`
- Server: `web-push` library với VAPID keys, `sendNotification()` với payload JSON
- Web App Manifest: `display: "standalone"`, maskable icons, shortcuts
- Install prompt: capture `beforeinstallprompt`, show custom install button sau user gesture

**Quy tắc bắt buộc:**
- Không request notification permission khi page load — phải có user gesture
- HTTPS bắt buộc cho Service Workers và Push API
- Handle `push` event với `waitUntil()` — nếu không notification có thể không hiện

**Khi nào dùng:** App cần offline-first, push notifications, hoặc installable PWA.

---

### lead (Entry Point)
**Màu:** Hồng | **Model:** Sonnet | **Vai trò:** Team Lead / Orchestrator

Điều phối toàn team, spawn agents theo pipeline, validate output.

---

## Commands

### Gọi toàn bộ pipeline (khuyến nghị)
```
/lead
```

### Core pipeline
```
/planner                -- Tạo component implementation plan
/component-architect    -- Component tree + TypeScript interfaces + state ownership
/state-engineer         -- State inventory + Zustand/React Query design + async state machines
/tech-lead-reviewer     -- Review code (bắt buộc sau mọi implementation)
/accessibility-auditor  -- WCAG 2.1 AA audit + A11Y findings (chạy song song với reviewer)
/hybrid-qa-playwright   -- QA + Playwright E2E tests + Go/No-Go decision
/debugger               -- Debug rendering, state, network issues
```

### Framework Specialists (thay thế engineer-agent theo stack)
```
/react-specialist       -- React 18+, Next.js App Router, RSC, TanStack Query, Zustand
/vue-specialist         -- Vue 3, Nuxt 3, Pinia, useFetch/useAsyncData
/angular-specialist     -- Angular 17+, Signals, NgRx Signals Store, functional interceptors
/svelte-specialist      -- Svelte 5 runes, SvelteKit form actions, snippets
/engineer-agent         -- Framework-agnostic tasks (config, utils, build tools)
```

### Architecture Specialists
```
/micro-frontend-engineer -- Module Federation, cross-app communication, CSS isolation
```

### Enhancement Specialists (on-demand)
```
/animation-engineer     -- Framer Motion, GSAP ScrollTrigger, CSS animations, Lottie
/pwa-specialist         -- Service Workers, Workbox, Push Notifications, Web App Manifest
```

### Code — Implement tuần tự theo plan
```
/code
```
Dùng sau khi đã có plan. Implement từng component/phase theo thứ tự.

**Thứ tự tốt nhất cho frontend:**
```
1. Design tokens & theme
2. Base/Atom components (Button, Input, Icon)
3. Molecule components (Form, Card, Modal)
4. Organism components (Header, Sidebar, DataTable)
5. Page layouts
6. Feature pages kết nối API
```

### Code Parallel — Implement nhiều components song song
```
/code:parallel
```
Frontend rất phù hợp cho parallel vì nhiều components hoàn toàn độc lập nhau.

**Khi nào dùng Code Parallel:**
- Implement nhiều pages cùng lúc (chúng share components nhưng trang thì độc lập)
- Build nhiều unrelated features song song
- Viết E2E tests cho nhiều flows khác nhau

**Ví dụ thực tế:**
```
Plan có 4 pages độc lập:
- Dashboard page
- User Profile page
- Settings page
- Reports page

→ /code:parallel spawn 4 engineer-agents cùng lúc
→ Nhanh hơn 4x so với làm tuần tự
```

**Lưu ý quan trọng:**
- Atom/Molecule components phải làm TRƯỚC rồi mới parallel pages
- Shared state stores (Zustand) phải define interface TRƯỚC khi parallel
- API client phải có trước khi feature pages chạy parallel

---

## Ví dụ prompts thực tế

**Trang mới từ design:**
```
/lead

Implement trang Dashboard theo design specs tại ./docs/designs/dashboard.md
Tech stack: Next.js 14, TypeScript, Tailwind, Zustand, React Query
API endpoints: /api/stats, /api/recent-orders (xem ./docs/api-spec.md)
```

**Fix UI bug:**
```
/engineer-agent

Fix: Button trên mobile (375px) bị overflow ra ngoài container.
File: src/components/ui/Button.tsx
Sau đó /tech-lead-reviewer review.
```

**Nhiều trang song song:**
```
/lead

Implement 3 trang theo plan ./plans/admin-pages.md:
- /admin/users (UserListPage)
- /admin/products (ProductListPage)
- /admin/orders (OrderListPage)
Chạy parallel, các trang độc lập nhau, dùng shared DataTable component đã có.
```

**Debug render issue:**
```
/debugger

Component UserCard re-render 12 lần mỗi khi type vào search box.
File: src/components/UserCard.tsx
Console log: [paste output]
```

**E2E Testing:**
```
/hybrid-qa-playwright

Viết Playwright E2E tests cho checkout flow:
1. Add product to cart
2. Fill shipping info
3. Payment (dùng Stripe test card)
4. Order confirmation
Test ở: 375px, 768px, 1280px
```

---

## Output artifacts

| File | Agent | Mô tả |
|------|-------|-------|
| `./plans/[feature].md` | planner | Component plan |
| `./docs/component-architecture-[feature].md` | component-architect | Component tree + TypeScript interfaces |
| `./docs/state-design-[feature].md` | state-engineer | State inventory + Zustand/React Query design |
| `./docs/micro-frontend-design.md` | micro-frontend-engineer | MFE architecture map + Module Federation config |
| `./docs/event-bus-catalogue.md` | micro-frontend-engineer | Typed event catalogue |
| `./docs/animation-guide.md` | animation-engineer | Animation variants + GSAP plugins |
| `./docs/pwa-guide.md` | pwa-specialist | SW config + Push setup + Manifest |
| `./docs/accessibility-audit-[feature].md` | accessibility-auditor | A11Y findings |
| `src/components/...` | framework-specialist | Components + pages |
| `src/lib/animations.ts` | animation-engineer | Framer Motion variants system |
| `public/manifest.json` | pwa-specialist | Web App Manifest |
| `service-worker.ts` | pwa-specialist | Workbox Service Worker |
| `*.test.tsx` | framework-specialist | Unit tests |
| `tests/e2e/...` | hybrid-qa-playwright | Playwright E2E tests |

---

## Breakpoints bắt buộc test

| Breakpoint | Thiết bị |
|-----------|---------|
| 375px | iPhone SE, mobile nhỏ nhất |
| 768px | Tablet |
| 1280px | Desktop |

---

## Security checklist (bắt buộc)

- Không `innerHTML` với unsanitized data
- Không secrets trong frontend code
- CSRF protection trên state-mutating requests
- CSP headers configured
- Không PII trong localStorage không mã hóa
- WCAG 2.1 AA — accessibility là luật, không phải gợi ý
