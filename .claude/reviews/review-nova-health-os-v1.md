# Code Review: Nova Health OS — Family Health OS PWA

**Reviewed**: 2026-06-09
**Branch**: `mobile` (uncommitted changes under `apps/family-health-os/`)
**Decision**: REQUEST CHANGES

## Summary
Solid foundation for a 9-screen PWA with good component architecture, clean TypeScript, and proper animation patterns. Two HIGH-severity issues (broken icon path, unstable React keys) should be fixed before merge. Several MEDIUM polish items around PWA completeness and interaction boundaries.

---

## Findings

### HIGH

#### H1 — Broken Apple touch icon path
**File**: `app/layout.tsx:14`  
**Issue**: `icons: { apple: "/icon-192.png" }` references a `.png` file, but `public/` only contains `icon-192.svg`. This will 404 on iOS devices when the app is added to home screen.

**Fix**:
```tsx
icons: {
  apple: "/icon-192.svg",
},
```

---

#### H2 — Array index used as React key for chat messages
**File**: `components/screens/AiCopilot.tsx:96`  
**Issue**: `messages.map((msg, i) => <motion.div key={i} … />)`. Messages are appended to the array, so index keys are mostly stable, but any future feature that deletes/inserts messages will cause React reconciliation bugs and lost animation state.

**Fix**: Use a stable key derived from message content or add an `id` field to the message type:
```tsx
// Add id field to message type
{messages.map((msg) => (
  <motion.div key={msg.id} … />
))}
```

---

### MEDIUM

#### M1 — Service worker caches too few assets for offline use
**File**: `public/sw.js:2-6`  
**Issue**: `STATIC_ASSETS` only caches `/`, `/index.html`, and `/manifest.json`. CSS chunks, JS bundles, and fonts from `_next/static/` are not cached, so the app will break offline after the first page load.

**Fix**: Implement a cache-first strategy for `_next/static/` assets and cache the rendered HTML/CSS/JS on install:
```js
const CACHE_NAME = "nova-health-os-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["/", "/manifest.json", "/icon-192.svg", "/icon-512.svg"])
    )
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first for static assets
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
      )
    );
    return;
  }

  // Network-first for everything else with emergency fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
```

---

#### M2 — Global document click listener for triple-tap
**File**: `hooks/useTripleTap.ts:28`  
**Issue**: Attaches `click` listener to `document`, which means every click anywhere on the page (including buttons, inputs, links) counts toward the triple-tap trigger. This could accidentally trigger emergency mode during normal interactions.

**Fix**: Scope the listener to a specific container ref, or add a debounce/confirmation:
```tsx
// Accept a ref instead of attaching globally
export function useTripleTap(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  timeout = 500
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // ... attach to el instead of document
  }, [ref, callback, timeout]);
}
```

---

#### M3 — Inline store access in JSX
**File**: `components/shell/AppShell.tsx:144`  
**Issue**: `onClick={() => useFamilyStore.getState().toggleEmergencyMode(false)}` works but creates a new arrow function on every render and accesses the store imperatively inside JSX. Use the store's action hook pattern instead.

**Fix**:
```tsx
const { toggleEmergencyMode } = useFamilyStore();
// …
<button onClick={() => toggleEmergencyMode(false)}>Tap and hold to exit</button>
```

---

#### M4 — `dangerouslySetInnerHTML` for service worker registration
**File**: `app/layout.tsx:35-45`  
**Issue**: While the script content is hardcoded and safe, using `dangerouslySetInnerHTML` in a Next.js layout is unnecessary. Next.js 15 provides the `<Script>` component or `beforeInteractive` strategy for this.

**Fix**: Move service worker registration to a client component or use a dedicated script file:
```tsx
// app/layout.tsx — remove the inline script entirely
// app/sw-register.tsx (client component)
"use client";
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);
  return null;
}
```

---

### LOW

#### L1 — Missing JSDoc / component documentation
**Files**: All `components/design-system/*.tsx`, `components/screens/*.tsx`  
**Issue**: No JSDoc comments on exported components. Makes IDE autocomplete and Storybook-style documentation harder.

**Fix**: Add minimal JSDoc to public components:
```tsx
/**
 * Glass panel with backdrop-filter blur. Three variants: default, strong, heavy.
 */
export function GlassPanel({ … }) { … }
```

---

#### L2 — Mock AI responses should be labeled as placeholder
**File**: `components/screens/AiCopilot.tsx:15-20`  
**Issue**: `mockResponses` object is hardcoded demo data. No indication this is a placeholder for a real LLM integration.

**Fix**: Add a `TODO` comment or rename the object:
```ts
// TODO: Replace with real LLM API integration
const MOCK_RESPONSES: Record<string, string> = { … };
```

---

#### L3 — `AmbientGlow` uses runtime CSS variable resolution that may fail
**File**: `components/design-system/AmbientGlow.tsx:30`  
**Issue**: The component accepts a `color` prop with a runtime string, but the Tailwind classes rely on CSS custom properties. If the color doesn't resolve, the glow is invisible.

**Fix**: Accept a Tailwind class name instead of a raw color string, or validate the prop type.

---

#### L4 — Status bar time is hardcoded
**File**: `components/shell/AppShell.tsx:37`  
**Issue**: `<span>9:41</span>` is static. For realism, it should show the current time.

**Fix**: Use a small client hook:
```tsx
const [time, setTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
useEffect(() => {
  const id = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 60000);
  return () => clearInterval(id);
}, []);
```

---

## Validation Results

| Check | Result |
|---|---|
| Type check | ✅ Pass |
| Lint | ✅ Pass |
| Build | ✅ Pass |
| Tests | ⏭️ Skipped (no test suite configured) |

---

## Files Reviewed

| File | Type | Notes |
|---|---|---|
| `app/page.tsx` | Modified | Clean routing logic |
| `app/layout.tsx` | Modified | PWA metadata, sw registration |
| `store/useFamilyStore.ts` | Added | Good TypeScript interfaces |
| `components/shell/AppShell.tsx` | Added | Core shell, emergency overlay |
| `components/shell/BottomNav.tsx` | Added | Navigation with Framer Motion |
| `components/screens/FamilyDashboard.tsx` | Added | Main dashboard screen |
| `components/screens/AiCopilot.tsx` | Added | Mock chat interface |
| `components/screens/HealthTimeline.tsx` | Added | Timeline list |
| `components/screens/MedicationCenter.tsx` | Added | Med tracking with progress |
| `components/screens/VaccinationTracker.tsx` | Added | Vax sticker grid |
| `components/screens/SymptomJournal.tsx` | Added | Journal with mood selector |
| `components/screens/DoctorVisitPrep.tsx` | Added | Checklist with progress |
| `components/screens/ExpenseTracker.tsx` | Added | Expense list + breakdown |
| `components/screens/EmergencyMode.tsx` | Added | Emergency profile screen |
| `components/screens/Onboarding.tsx` | Added | 4-slide onboarding flow |
| `components/modals/FolderDetailModal.tsx` | Added | Bottom sheet modal |
| `hooks/useTripleTap.ts` | Added | Global triple-tap hook |
| `data/familyData.ts` | Added | Mock data for 5 family members |
| `public/sw.js` | Added | Service worker (minimal) |
| `public/manifest.json` | Added | PWA manifest |
| `lib/utils.ts` | Added | `cn()` utility |

---

## Decision

**REQUEST CHANGES**

Required before merge:
1. Fix broken Apple touch icon path (`H1`)
2. Use stable React keys in chat messages (`H2`)

Recommended before merge:
3. Improve service worker caching for offline support (`M1`)
4. Scope triple-tap listener to a container ref (`M2`)
5. Extract store action from inline JSX (`M3`)
