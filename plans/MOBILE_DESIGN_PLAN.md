# Mobile-Responsive Design Improvement Plan

**Project:** Morning Hoops Basketball Stats Dashboard  
**Current Score:** 8/10 mobile readiness  
**Target Score:** 9.5/10  
**Files in scope:** `index.html`, `morning_hoops.jsx`  
**Design system:** `DESIGN.md` (Ember Orange #EF6234 accent, Instrument Serif + Outfit, dark-first)

---

## Tier 1 — Foundation (Must-Have for Mobile Polish)

These changes fix real user-experience gaps on mobile devices. They are invisible when done right and painful when absent.

---

### 1.1 Convert `clamp()` values from `px` to `rem`

**What:** Replace all `px` floor/ceiling values in CSS custom properties with `rem` equivalents (base 16px = 1rem) so typography and spacing scale with the user's browser font-size preference.

**Where:** [`index.html`](index.html:9) — lines 9–38, the `:root` custom properties block.

**How:** Divide every `px` value by 16 to get `rem`. The `vw` middle value stays unitless-relative and needs no change.

```css
:root {
  /* ── Typography Scale (rem-based) ── */
  --type-display:       clamp(2rem, 5.5vw, 3.5rem);       /* was 32px / 56px */
  --type-headline:      clamp(1.375rem, 3.5vw, 1.875rem);  /* was 22px / 30px */
  --type-title:         clamp(1.125rem, 2.8vw, 1.375rem);  /* was 18px / 22px */
  --type-stat-hero:     clamp(2.25rem, 6vw, 3rem);         /* was 36px / 48px */
  --type-stat-lg:       clamp(1.375rem, 3.5vw, 1.75rem);   /* was 22px / 28px */
  --type-stat-md:       clamp(1rem, 2.5vw, 1.25rem);       /* was 16px / 20px */
  --type-body:          clamp(0.8125rem, 1.8vw, 0.875rem);  /* was 13px / 14px */
  --type-body-sm:       clamp(0.6875rem, 1.5vw, 0.75rem);   /* was 11px / 12px */
  --type-label:         clamp(0.5625rem, 1.2vw, 0.625rem);  /* was 9px / 10px */
  --type-label-lg:      clamp(0.625rem, 1.4vw, 0.6875rem);  /* was 10px / 11px */

  /* ── Line Height & Max Width ── */
  --type-body-lh:       1.6;
  --type-body-max-w:    min(37.5rem, 100%);    /* was 600px */

  /* ── Spacing Scale (rem-based) ── */
  --space-page-x:       clamp(1rem, 4vw, 1.25rem);         /* was 16px / 20px */
  --space-page-top:     clamp(1.5rem, 5vw, 2.5rem);        /* was 24px / 40px */
  --space-page-bot:     clamp(3.75rem, 10vw, 6.25rem);     /* was 60px / 100px */
  --space-section-gap:  clamp(1.75rem, 5vw, 2.5rem);       /* was 28px / 40px */
  --space-card-padding: clamp(0.875rem, 3vw, 1.25rem);     /* was 14px / 20px */
  --space-card-gap:     clamp(0.375rem, 1.5vw, 0.5rem);    /* was 6px / 8px */
  --space-prose-max:    min(37.5rem, 100%);    /* was 600px */

  /* ── Layout ── */
  --content-max:        57.5rem;    /* was 920px */
  --nav-height:         3rem;       /* was 48px */
}
```

**Why:** Users who set their browser to 120% or 150% font size (common for accessibility) currently get no benefit — `px` values ignore that preference. `rem` respects it. This is a WCAG 1.4.4 (Resize Text) requirement.

**Risk:** **Low.** Pure value swap. The computed sizes at default 16px base are identical. The only visual change occurs for users who have customized their browser font size, which is the intended behavior.

**Gotcha:** The `vw` middle value in `clamp()` is inherently viewport-relative and does not need conversion. Only floor and ceiling change.

---

### 1.2 Add `<meta name="theme-color">`

**What:** Add a `theme-color` meta tag so the mobile browser chrome (status bar, URL bar) matches the app's dark surface color. Add a second tag for light mode via `media` attribute.

**Where:** [`index.html`](index.html:4) — inside `<head>`, after the viewport meta tag (line 5).

**How:** Insert two meta tags:

```html
<meta name="theme-color" content="#09090B" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#F7F6F3" media="(prefers-color-scheme: light)" />
```

**Why:** Without this, Safari and Chrome on iOS/Android show a white or default-colored browser chrome that clashes with the dark UI. The mismatch breaks the immersive feel — the app looks like it's floating inside someone else's frame.

**Risk:** **Low.** Static HTML addition. No JS interaction needed.

**Gotcha:** The app has a manual dark/light toggle that can override `prefers-color-scheme`. The meta tags cover the initial load state. For runtime toggling, add JS in [`morning_hoops.jsx`](morning_hoops.jsx:240) inside the existing `useEffect` for theme persistence:

```jsx
// Inside the useEffect that saves theme to localStorage (line 239-241)
useEffect(() => {
  localStorage.setItem("morning-hoops-theme", dark ? "dark" : "light");
  // Update theme-color meta tag to match current theme
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute("content", dark ? "#09090B" : "#F7F6F3");
}, [dark]);
```

If using the dual-meta approach with `media` attributes, target the one without a media attribute or use `document.querySelectorAll` and update both. Alternatively, use a single meta tag without `media` and control it entirely via JS.

---

### 1.3 Add safe-area-inset handling for notched phones

**What:** Add `padding` that respects `env(safe-area-inset-*)` so content doesn't hide behind the notch, Dynamic Island, or bottom home indicator on iPhone X+ and similar devices.

**Where:**
- [`index.html`](index.html:5) — update viewport meta tag
- [`index.html`](index.html:9) — add safe-area CSS custom properties
- [`morning_hoops.jsx`](morning_hoops.jsx:977) — main container padding
- [`morning_hoops.jsx`](morning_hoops.jsx:987) — sticky tab bar

**How:**

**Step 1** — Enable safe area insets by adding `viewport-fit=cover` to the viewport meta:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

**Step 2** — Update CSS custom properties in [`index.html`](index.html:9) to incorporate safe area insets:

```css
:root {
  /* ── Safe Area Aware Spacing ── */
  --safe-top:    env(safe-area-inset-top, 0px);
  --safe-right:  env(safe-area-inset-right, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left:   env(safe-area-inset-left, 0px);
}
```

**Step 3** — Apply to main container in [`morning_hoops.jsx`](morning_hoops.jsx:977):

```jsx
// Line 977 — main container
<main style={{
  maxWidth: 'var(--content-max)',
  margin: '0 auto',
  padding: 'var(--space-page-top) var(--space-page-x) var(--space-page-bot)',
  paddingLeft: 'max(var(--space-page-x), var(--safe-left))',
  paddingRight: 'max(var(--space-page-x), var(--safe-right))',
  paddingBottom: 'max(var(--space-page-bot), var(--safe-bottom))',
}}>
```

**Step 4** — Apply to sticky tab bar in [`morning_hoops.jsx`](morning_hoops.jsx:987):

```jsx
// Line 987 — sticky nav
paddingTop: 'var(--safe-top)',
```

**Why:** On iPhone X and later (and several Android devices), the notch and home indicator overlap content. Without `viewport-fit=cover` + safe area insets, either the OS adds ugly padding or content gets clipped behind hardware elements.

**Risk:** **Low.** `env()` with fallback `0px` is a no-op on devices without notches. `max()` ensures spacing never shrinks below the design minimum.

**Gotcha:** `viewport-fit=cover` changes the viewport to include the notch area, which means the app *must* handle insets or content will be hidden. The `env()` fallbacks prevent this.

---

### 1.4 Add `overscroll-behavior` to prevent accidental pull-to-refresh

**What:** Set `overscroll-behavior-y: contain` on the root container to prevent the browser's pull-to-refresh gesture from triggering when the user scrolls to the top of the page.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:975) — the root `<div>` wrapper.

**How:** Add to the root container's inline style:

```jsx
// Line 975 — root div
<div style={{
  background: t.bg,
  color: t.text,
  fontFamily: "'Outfit',sans-serif",
  minHeight: "100vh",
  transition: "background .3s,color .3s",
  overscrollBehaviorY: "contain",  // ← NEW
}}>
```

**Why:** On Android Chrome and some iOS browsers, scrolling past the top triggers a pull-to-refresh that reloads the page. This is destructive for a single-page app — the user loses their scroll position and current tab state. `overscroll-behavior-y: contain` keeps scroll contained to the element.

**Risk:** **Low.** No visual change. Only prevents the browser's default overscroll effect. Users can still pull-to-refresh via the browser's refresh button.

---

### 1.5 Add `scroll-margin-top` to section targets

**What:** Add `scroll-margin-top` to every element with an `id` that the section jump nav scrolls to, so the sticky tab bar doesn't overlap the target section header.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:675) — all elements with `id` attributes used as scroll targets:
- `id="season-overview"` (line 675)
- `id="season-h2h"` (line 679)
- `id="season-records"` (line 722)
- `id="season-profiles"` (line 757)
- `id="season-attendance"` (line 792)
- `id="season-tyler"` (line 860)
- `id="season-club"` (line 885)
- `id="season-algorithm"` (line 939)

**How:** Create a shared scroll-margin style constant and apply it to each section target:

```jsx
// Add near the L/S/C constants (around line 268)
const scrollTarget = { scrollMarginTop: 'calc(var(--nav-height) + 1.5rem)' };
// nav-height (3rem) + 1.5rem breathing room = 4.5rem total offset
```

Apply to each section:

```jsx
// Example: line 675
<div id="season-overview" style={{ ...scrollTarget, ...S, fontSize: 'var(--type-title)', ... }}>

// Example: line 679
<div id="season-h2h" style={{ ...scrollTarget, ...L }}>Head to Head</div>

// Example: line 722
<div id="season-records" style={{ ...scrollTarget, ...L }}>Player Win-Loss Records</div>
```

**Why:** Currently, tapping "Head to Head" in the jump nav scrolls the `#season-h2h` element to the top of the viewport — directly behind the sticky tab bar. The section label is invisible. The user thinks the scroll failed. `scroll-margin-top` offsets the scroll destination so the label appears below the sticky nav.

**Risk:** **Low.** CSS-only fix. No layout shift.

**Gotcha:** The sticky nav has `top: 0` and its height is `--nav-height` (3rem/48px). The `1.5rem` extra is breathing room so the section label doesn't kiss the nav's bottom edge. If the nav height changes, the scroll margin must update.

---

### 1.6 Add font preconnect and preload hints

**What:** Add `<link rel="preconnect">` for Google Fonts domains and `<link rel="preload">` for the primary font files to eliminate the font-loading render delay.

**Where:** [`index.html`](index.html:4) — inside `<head>`, before the Google Fonts `<link>` tag (line 7).

**How:**

```html
<!-- Font preconnect — place BEFORE the Google Fonts stylesheet link -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

The existing Google Fonts link at line 7:
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
```

stays as-is. The `preconnect` hints tell the browser to establish the DNS + TLS connection to `fonts.gstatic.com` (where the actual font files live) *before* it discovers the font URLs in the CSS. This shaves 100–300ms off font loading on mobile networks.

**Why:** Without preconnect, the browser follows a serial chain: download HTML → discover stylesheet link → download CSS → discover font URLs → connect to font CDN → download fonts. The preconnect allows the CDN connection to happen in parallel with CSS parsing.

**Risk:** **Low.** Two extra `<link>` tags. No visual change. Pure performance gain.

**Gotcha:** `crossorigin` is required on the `fonts.gstatic.com` preconnect because font files are loaded as CORS requests. Omitting it creates a duplicate connection.

---

### 1.7 Replace hardcoded `90px` game note indent

**What:** Replace the hardcoded `90px` left padding on game note lines (wide layout) with a value relative to the grid column structure.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:353) — line 353, the game note in wide layout.

**How:**

```jsx
// Before (line 353)
<div style={{ padding: "0 16px 10px 90px", ... }}>{s.note}</div>

// After — use the first column width (72px) + gap (6px) + left padding (16px) ≈ calc
<div style={{ padding: "0 1rem 0.625rem calc(4.5rem + var(--space-card-padding))", ... }}>{s.note}</div>
```

Breakdown: `4.5rem` = 72px grid column at default base, `var(--space-card-padding)` aligns with the card's internal padding. This makes the indent respond to font-size scaling.

**Why:** The `90px` indent is designed to align the note text with the team names column in the 5-column grid. But as a fixed `px` value, it doesn't scale with `rem` or respond to different viewport sizes. On compact/regular this line isn't reached (different render paths), but on wide layouts with browser zoom it misaligns.

**Risk:** **Low.** Only affects wide layout game notes. Visual alignment is approximate by design (the note is decorative, not tabular).

---

## Tier 2 — Interaction Quality (MetaLab-Level Polish)

These changes make the app *feel* like a crafted product. They're the difference between "this works on mobile" and "this was designed for mobile."

---

### 2.1 Active/pressed states on interactive elements

**What:** Add `transform: scale(0.97)` and a subtle opacity shift on `:active` for all tappable elements: tab buttons, section jump buttons, theme toggle.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:976) — the existing injected `<style>` tag (line 976).

**How:** Expand the existing `dangerouslySetInnerHTML` style block:

```jsx
// Line 976 — replace the existing <style> tag
<style dangerouslySetInnerHTML={{ __html: `
  @media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
  button:active{transform:scale(0.97);opacity:0.85}
  button{transition:transform 0.12s cubic-bezier(0.22,1,0.36,1),opacity 0.12s ease}
  [role="tab"]:active{transform:scale(0.96)}
  *::-webkit-scrollbar{display:none}
` }} />
```

**Why:** Without a pressed state, tapping a button feels like poking glass. The 3% scale-down at 120ms with an ease-out curve creates a physical "compression" that signals responsiveness. The timing is fast enough to not delay navigation (under the 150ms threshold) but present enough to feel intentional.

**Risk:** **Low.** CSS-only. Falls back to no transform on browsers that don't support it. The `prefers-reduced-motion` rule disables it for users who've opted out of animations.

**Gotcha:** `scale(0.97)` on the tab bar's sticky container could cause a repaint flicker. Target only `button` elements, not the `<nav>` container.

---

### 2.2 Touch feedback on cards (subtle press state)

**What:** Add a very subtle darkening effect when a user touches/long-presses a card element (even though cards aren't interactive, the feedback signals that the content is "alive").

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:976) — the injected `<style>` tag.

**How:** This is a deliberate *non-implementation*. Cards in this app are not interactive — they don't link anywhere, they don't expand, they don't have click handlers. Adding press states to non-interactive elements violates the MetaLab principle: "The best UI is invisible — it just works." Press feedback on a non-interactive element creates a broken affordance.

**Decision:** Skip card press states. Reserve `transform: scale` for elements with `onClick` handlers only.

---

### 2.3 Smooth scroll-to-section with proper offset

**What:** Replace the current `scrollIntoView` call with a version that accounts for the sticky tab bar height.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:670) — the section jump button `onClick` handler.

**How:** Since we're adding `scroll-margin-top` in Tier 1.5, the native `scrollIntoView` will automatically respect it. No JS change needed — `scroll-margin-top` is the correct solution.

However, verify that `behavior: "smooth"` is respected. Add a fallback for browsers that don't support smooth scrolling:

```jsx
// Line 670 — onClick handler (already correct, just verify)
onClick={() => {
  const el = document.getElementById(s.id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}}
```

The `scroll-margin-top` from Tier 1.5 handles the offset. No additional JS math required.

**Why:** The current `scrollIntoView({ behavior: "smooth", block: "start" })` is correct in intent but the target scrolls behind the sticky nav because `scroll-margin-top` is missing. Tier 1.5 fixes the root cause; this item confirms the JS side needs no change.

**Risk:** **None.** Verification-only.

---

### 2.4 Horizontal scroll snap on tab bar

**What:** Add CSS `scroll-snap-type` to the tab bar so tabs snap to alignment points when the user flicks through them on mobile.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:987) — the tab `<nav>` element.

**How:** Add scroll-snap properties to the tab bar container and children:

```jsx
// Line 987 — tab nav container, add these properties:
scrollSnapType: "x mandatory",

// Line 988 — each tab button, add:
scrollSnapAlign: "center",
```

Full tab nav update:

```jsx
<nav role="tablist" style={{
  display: "flex",
  gap: 6,
  marginBottom: 'var(--space-section-gap)',
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  padding: 4,
  background: t.inset,
  borderRadius: 999,
  scrollbarWidth: "none",
  position: "sticky",
  top: 0,
  zIndex: 10,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  scrollSnapType: "x mandatory",      // ← NEW
}}>
```

Each tab button:

```jsx
{
  // ...existing styles...
  scrollSnapAlign: "center",  // ← NEW
}
```

**Why:** Without scroll snap, a horizontal flick stops at arbitrary positions — a tab might be half-visible at the edge. Snap-to-center ensures the active tab is always fully visible and centered in the viewport, which improves scannability and reduces mis-taps.

**Risk:** **Low.** CSS-only enhancement. Unsupported browsers simply get the current free-scroll behavior.

**Gotcha:** `scroll-snap-type: x mandatory` can feel "grabby" if tabs are very wide. With the current tab widths (60–90px each), `mandatory` is appropriate. If tabs were wider, `proximity` would be safer.

---

### 2.5 Auto-scroll active tab into view on tab change

**What:** When a tab is selected, programmatically scroll the tab bar to center the active tab.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:988) — the tab button `onClick` handler.

**How:** Add a ref to the tab bar and scroll the active button into view:

```jsx
// Add a ref for the tab bar (near line 225, with other state)
import { useState, useMemo, useEffect, useRef } from "react";
// ...
const tabBarRef = useRef(null);

// Update the tab button onClick (line 988):
onClick={() => {
  setTab(tb.id);
  // Auto-scroll the tab bar to show the active tab
  setTimeout(() => {
    const activeBtn = tabBarRef.current?.querySelector('[aria-selected="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, 0);
}}

// Add ref to the nav element:
<nav ref={tabBarRef} role="tablist" style={{ ... }}>
```

**Why:** On compact screens, the tab bar scrolls horizontally and later tabs (April, May) may be off-screen. When a user selects a tab programmatically (or it's set via deep link), the tab bar should scroll to show the selected tab. This prevents the "where did my selection go?" confusion.

**Risk:** **Low.** The `setTimeout(0)` ensures the DOM has updated `aria-selected` before querying. `scrollIntoView` with `inline: "center"` works well with scroll-snap.

---

## Tier 3 — Accessibility Hardening

These changes ensure the app is usable by everyone, including screen reader users and keyboard navigators. They're invisible to sighted mouse/touch users but critical for inclusive design.

---

### 3.1 Custom `:focus-visible` ring styles

**What:** Replace browser-default focus outlines with a custom `:focus-visible` ring that matches the Ember Orange accent. Only show on keyboard navigation (not on click/tap).

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:976) — the injected `<style>` tag.

**How:** Add to the `dangerouslySetInnerHTML` style block:

```css
:focus-visible {
  outline: 2px solid #EF6234;
  outline-offset: 2px;
  border-radius: 4px;
}
:focus:not(:focus-visible) {
  outline: none;
}
```

Full updated style tag:

```jsx
<style dangerouslySetInnerHTML={{ __html: `
  @media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
  button:active{transform:scale(0.97);opacity:0.85}
  button{transition:transform 0.12s cubic-bezier(0.22,1,0.36,1),opacity 0.12s ease}
  [role="tab"]:active{transform:scale(0.96)}
  *::-webkit-scrollbar{display:none}
  :focus-visible{outline:2px solid #EF6234;outline-offset:2px;border-radius:4px}
  :focus:not(:focus-visible){outline:none}
` }} />
```

**Why:** The default blue focus ring clashes with the dark UI and the Ember Orange accent system. A 2px Ember ring at 2px offset is visible against both the void (#09090B) and card (#16161A) surfaces while staying on-brand. `:focus-visible` only shows on keyboard navigation, so tap users don't see focus rings flashing on every button press.

**Risk:** **Low.** The `:focus:not(:focus-visible)` fallback removes outlines only when `:focus-visible` is supported. Older browsers that don't support `:focus-visible` keep the default outline. Progressive enhancement.

**Gotcha:** `border-radius: 4px` on the outline may not perfectly match the pill-shaped tab buttons (borderRadius: 999). Consider using `border-radius: inherit` for a tighter match, but note browser support is limited for `outline-radius`. The 4px default is acceptable.

---

### 3.2 Progress bar ARIA attributes

**What:** Add `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label` to every progress bar in the app.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx) — all progress bar instances:
- H2H bar (lines 685–688, 699–702)
- Win rate bars in Top 5 (lines 494–496, 506)
- Win-loss record bars (lines 737–739, 748)
- Partnership bars (none currently — text-only)
- Bottom records bars (lines 611–613, 622)

**How:** Each progress bar is currently a pair of nested `<div>`s. Add ARIA attributes to the outer container:

```jsx
// Example: Top 5 win rate bar (line 494)
// Before:
<div style={{ flex: 1, height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }}>
  <div style={{ height: "100%", width: `${pct}%`, background: t.green, borderRadius: 3 }} />
</div>

// After:
<div
  role="progressbar"
  aria-valuenow={pct}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`${name} win rate: ${pct}%`}
  style={{ flex: 1, height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }}
>
  <div style={{ height: "100%", width: `${pct}%`, background: t.green, borderRadius: 3 }} />
</div>
```

For the H2H team split bar, use a different pattern since it shows two values:

```jsx
// H2H bar (line 685 / 699)
<div
  role="img"
  aria-label={`Blue ${bW} wins, White ${wW} wins. Blue leads ${Math.round(bW/(bW+wW)*100)}% to ${Math.round(wW/(bW+wW)*100)}%`}
  style={{ height: 6, borderRadius: 3, overflow: "hidden", display: "flex", background: t.inset, ... }}
>
  <div style={{ width: `${bW / (bW + wW) * 100}%`, background: t.blue }} />
  <div style={{ width: `${wW / (bW + wW) * 100}%`, background: "#94A3B8" }} />
</div>
```

**Why:** Screen readers currently see the progress bars as empty `<div>`s with no semantic meaning. A VoiceOver user navigating the win-rate table hears "Tyler — 75%" but gets no indication that there's a visual bar showing that ratio. `role="progressbar"` makes the bar a first-class UI element that announces its value.

**Risk:** **Low.** ARIA attributes are invisible to sighted users. No layout or visual change.

**Gotcha:** For the H2H split bar that shows two teams, `role="progressbar"` isn't semantically correct (it's not a single-value progress indicator). Use `role="img"` with a descriptive `aria-label` instead.

---

### 3.3 Section jump button `aria-label`s

**What:** Add `aria-label` attributes to section jump navigation buttons so screen readers announce the destination, not just the visible text.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:670) — the section jump `<button>` elements inside the season nav.

**How:**

```jsx
// Line 670 — section jump buttons
{[
  { label: "Overview", id: "season-overview" },
  { label: "Head to Head", id: "season-h2h" },
  { label: "Records", id: "season-records" },
  { label: "Profiles", id: "season-profiles" },
  { label: "Attendance", id: "season-attendance" },
  { label: "Tyler Losses", id: "season-tyler" },
  { label: "7/7 Club", id: "season-club" },
  { label: "Algorithm", id: "season-algorithm" },
].map((s, i) => (
  <button
    key={i}
    onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
    aria-label={`Jump to ${s.label} section`}   // ← NEW
    style={{ ... }}
  >
    {s.label}
  </button>
))}
```

**Why:** While the visible text ("Overview", "Head to Head") is reasonably descriptive, screen readers benefit from explicit navigation context. "Jump to Head to Head section" is more informative than just "Head to Head" as a button label — it tells the user what the button *does*, not just what it *says*.

**Risk:** **Low.** ARIA attributes only. No visual change.

---

### 3.4 Color dot text alternatives (screen reader only)

**What:** Add visually hidden text inside the `Dot` component so screen readers announce the team color instead of seeing an empty `<span>`.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:220) — the `Dot` component.

**How:**

```jsx
// Line 220 — Dot component
function Dot({ team, dark }) {
  return (
    <span style={{
      display: "inline-block",
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: team === "blue" ? "#3B6BF5" : (dark ? "#94A3B8" : "#64748B"),
      marginRight: 5,
      flexShrink: 0,
    }}>
      <span style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        border: 0,
      }}>
        {team === "blue" ? "Blue team" : "White team"}
      </span>
    </span>
  );
}
```

Also add `position: "relative"` to the outer span so the absolutely-positioned child is contained:

```jsx
<span style={{
  display: "inline-block",
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: team === "blue" ? "#3B6BF5" : (dark ? "#94A3B8" : "#64748B"),
  marginRight: 5,
  flexShrink: 0,
  position: "relative",   // ← NEW: contain the sr-only child
}}>
```

**Why:** The dots are the only indicator of which team a player is on in the game rows (regular/wide layout). A screen reader user currently hears "Nathan" but not "Blue team — Nathan." The visually hidden text bridges this gap. This addresses WCAG 1.4.1 (Use of Color) — information conveyed by color alone must have a text alternative.

**Risk:** **Low.** The visually hidden text is invisible to sighted users (1x1px clipped). The `position: relative` on the parent adds no visual change since the element has explicit dimensions.

**Gotcha:** In the compact layout, dots are replaced with colored team text (`s.blue.join(' · ')` with `color: t.blue`). That layout also relies on color alone — but the team labels "Blue" and "White" are visible in the team legend below the tab bar (line 991–993), and the blue/white text is adjacent, providing context. Still, the compact layout's colored names should eventually get explicit team labels, but this is lower priority since the layout is inherently more readable.

---

### 3.5 Tab keyboard arrow navigation

**What:** Add keyboard arrow-key navigation to the tab bar so users can move between tabs with `←`/`→` arrow keys, per the WAI-ARIA Tabs pattern.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:988) — the tab buttons.

**How:** Add `onKeyDown` handler to each tab button:

```jsx
// Add near the tabs constant (line 275):
const handleTabKeyDown = (e, idx) => {
  let newIdx = idx;
  if (e.key === "ArrowRight") {
    newIdx = (idx + 1) % tabs.length;
    e.preventDefault();
  } else if (e.key === "ArrowLeft") {
    newIdx = (idx - 1 + tabs.length) % tabs.length;
    e.preventDefault();
  } else if (e.key === "Home") {
    newIdx = 0;
    e.preventDefault();
  } else if (e.key === "End") {
    newIdx = tabs.length - 1;
    e.preventDefault();
  } else {
    return;
  }
  setTab(tabs[newIdx].id);
  // Focus the new tab button
  const tabList = e.currentTarget.parentElement;
  const buttons = tabList?.querySelectorAll('[role="tab"]');
  if (buttons?.[newIdx]) buttons[newIdx].focus();
};

// Line 988 — each tab button, add:
onKeyDown={(e) => handleTabKeyDown(e, i)}
tabIndex={tab === tb.id ? 0 : -1}   // Only active tab is in tab order
```

Update the tab button map to include index:

```jsx
{tabs.map((tb, i) => (
  <button
    key={tb.id}
    role="tab"
    aria-selected={tab === tb.id}
    tabIndex={tab === tb.id ? 0 : -1}
    onClick={() => setTab(tb.id)}
    onKeyDown={(e) => handleTabKeyDown(e, i)}
    style={{ ... }}
  >
    {tb.label}
  </button>
))}
```

**Why:** The WAI-ARIA Tabs pattern requires that only the active tab is in the `Tab` key order (`tabIndex={0}`), and inactive tabs are removed (`tabIndex={-1}`). Users navigate between tabs using arrow keys. This is the expected keyboard behavior for tab interfaces — without it, a keyboard user must press `Tab` through every tab button to reach the content panel.

**Risk:** **Medium.** This changes the tab key behavior — pressing `Tab` on the active tab now moves focus to the tab panel content (or the next focusable element), not the next tab button. This is correct per ARIA spec but might surprise keyboard users who expect `Tab` to move between tabs.

**Gotcha:** The `tabIndex={-1}` on inactive tabs means they're not focusable via `Tab` key but can still be focused programmatically (which the arrow key handler does). Ensure `focus()` is called after the state update.

---

## Tier 4 — Micro-Polish (The Last 2%)

These changes are the invisible craftsmanship that separates a good app from an excellent one. Each is individually small; together they create the "this just feels right" sensation.

---

### 4.1 Viewport-height handling: `100dvh` vs `100vh`

**What:** Replace `minHeight: "100vh"` with `100dvh` (dynamic viewport height) on the root container, with `100vh` as fallback for older browsers.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:975) — the root `<div>` wrapper.

**How:**

```jsx
// Line 975 — root div
// CSS custom properties can't be set inline for dvh fallback,
// so use the injected <style> tag approach:

// Option A: Use CSS variable in index.html
// In index.html :root block:
// --app-height: 100dvh;

// Option B: Inline with fallback via JS
<div style={{
  background: t.bg,
  color: t.text,
  fontFamily: "'Outfit',sans-serif",
  minHeight: "100dvh",             // ← Changed from "100vh"
  transition: "background .3s,color .3s",
  overscrollBehaviorY: "contain",
}}>
```

If browser support for `100dvh` is a concern, add a CSS fallback in [`index.html`](index.html:9):

```css
:root {
  --app-min-height: 100vh;   /* fallback */
  --app-min-height: 100dvh;  /* override where supported */
}
```

Then in the JSX:

```jsx
minHeight: "var(--app-min-height)",
```

**Why:** On mobile Safari and Chrome, `100vh` includes the area behind the URL bar, which means the page is taller than the visible viewport. The bottom of the page hides behind the browser chrome. `100dvh` (dynamic viewport height) accounts for the actual visible area, including the URL bar's show/hide state. This prevents the footer from being partially hidden on initial load.

**Risk:** **Low.** `100dvh` is supported in Safari 15.4+, Chrome 108+, Firefox 101+. The CSS custom property fallback pattern handles older browsers gracefully.

---

### 4.2 `font-display: optional` consideration for Instrument Serif

**What:** Evaluate whether to change Instrument Serif's `font-display` from `swap` to `optional` to prevent layout shift on slow connections.

**Where:** [`index.html`](index.html:7) — the Google Fonts URL.

**How:** Change `display=swap` to `display=optional` in the Google Fonts URL:

```html
<!-- Current -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />

<!-- Option: split display strategy per font -->
<!-- Outfit (body): swap — must load, layout depends on it -->
<!-- Instrument Serif (display): optional — nice to have, Georgia fallback is acceptable -->
```

Google Fonts doesn't support per-font `display` in a single URL. Split into two requests:

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=optional" rel="stylesheet" />
```

**Decision: Keep `display=swap` for both.** Rationale:

- Instrument Serif is the visual identity of the app. The Georgia fallback is acceptable structurally but looks noticeably different (wider x-height, different letterforms). The "newspaper editorial" feel depends on Instrument Serif.
- `display=optional` means if the font doesn't load within ~100ms, it never loads for that page view. On a slow 3G connection at 4:45 AM in a gym, this is a real risk.
- `display=swap` causes a brief FOUT (Flash of Unstyled Text) but guarantees the intended typography appears. For an editorial-voice app, correct typography > no layout shift.
- The preconnect hints from Tier 1.6 mitigate the swap delay significantly.

**Why:** This item exists to document the *deliberate choice* to keep `swap`. The decision should be revisited if font-loading latency becomes a user complaint.

**Risk:** **N/A.** No change implemented.

---

### 4.3 Loading state skeleton for font swap

**What:** Add a CSS rule that hides the body text during the ~200ms font swap period, replacing it with a subtle pulse animation on the background, to avoid the jarring FOUT.

**Where:** [`index.html`](index.html:8) — add a `<style>` rule that uses the `document.fonts` API.

**How:** Use the Font Loading API to add a class when fonts are loaded:

```html
<!-- In index.html, add to the <style> block -->
<style>
  /* Hide text until fonts load (prevents FOUT) */
  .fonts-loading body {
    visibility: hidden;
  }
  html {
    background: #09090B; /* Match dark mode default to prevent white flash */
  }
</style>
<script>
  // Mark loading state
  document.documentElement.classList.add('fonts-loading');
  // Remove when fonts are ready (or after 1s timeout)
  Promise.race([
    document.fonts.ready,
    new Promise(r => setTimeout(r, 1000))
  ]).then(() => {
    document.documentElement.classList.remove('fonts-loading');
  });
</script>
```

**Decision: Skip this implementation.** Rationale:

- Hiding the entire body creates a worse experience than FOUT on slow connections. Users see a blank screen instead of content in a fallback font.
- The preconnect hints from Tier 1.6 reduce the font swap window to ~50–100ms on typical connections, which is imperceptible.
- The dark background (`#09090B`) on `<html>` is worth adding to prevent the white flash on initial load, even without the font-loading class.

**Simplified implementation — just prevent white flash:**

```html
<!-- Add to index.html <style> block -->
html {
  background: #09090B;
}
@media (prefers-color-scheme: light) {
  html {
    background: #F7F6F3;
  }
}
```

**Why:** The `html` background color prevents the white flash during the ~16ms before React hydrates and applies the `t.bg` color to the root div. This is a common paint-flash prevention technique.

**Risk:** **Low.** Single CSS rule. No JS complexity.

---

### 4.4 Haptic-scale micro-interaction on stat cards

**What:** Add a very subtle `transform: scale(1.02)` on hover for the summary stat boxes (Blue Wins, White Wins, Sweeps, Avg/Session) to create a "lift" sensation.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx:976) — the injected `<style>` tag.

**How:** Since these are inline-styled `<div>`s without a class, we need a data attribute or a CSS selector strategy. Add a `data-stat` attribute to stat boxes and target them:

```jsx
// Line 470 — stat boxes
<div key={i} data-stat style={{ ... }}>
```

In the injected `<style>`:

```css
[data-stat]{transition:transform 0.2s cubic-bezier(0.22,1,0.36,1)}
@media(hover:hover){[data-stat]:hover{transform:scale(1.02)}}
```

The `@media(hover:hover)` guard ensures this only applies on devices with a true hover capability (mouse/trackpad), not on touch devices where "hover" is simulated and creates sticky states.

**Why:** A 2% scale increase on hover creates a subtle "card lift" that makes the stat grid feel interactive and three-dimensional — without violating the no-shadow rule. The effect is fast (200ms), minimal (2%), and guarded behind `hover:hover` so it never triggers on mobile.

**Risk:** **Low.** CSS-only, hover-guarded. No mobile impact.

**Gotcha:** Don't apply this to cards that contain long text (editorial sections, profiles) — the scale would be jarring on large surfaces. Limit to small stat pill elements only.

---

### 4.5 Scroll-based fade-in for editorial callout sections

**What:** Add a subtle fade-in-from-below animation on editorial callout sections (Florida Investigation, Tyler Losses, 7/7 Club, Algorithm Matchup) as they scroll into view.

**Where:** [`morning_hoops.jsx`](morning_hoops.jsx) — the editorial callout sections.

**How:** Use Intersection Observer with a simple CSS animation:

```jsx
// Add a custom hook (near top of file, after imports)
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = 1;
      return;
    }
    el.style.opacity = 0;
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = 1;
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}
```

Apply to editorial callout sections:

```jsx
// Florida Investigation (line 591)
const floridaRef = useFadeIn();
<div ref={floridaRef} style={{ ...C(), ... }}>

// Tyler Losses (line 861)
const tylerRef = useFadeIn();
<div ref={tylerRef} style={{ ...C(), ... }}>

// 7/7 Club (line 886)
const clubRef = useFadeIn();
<div ref={clubRef} style={{ ...C(), ... }}>

// Algorithm Matchup (line 940)
const algoRef = useFadeIn();
<div ref={algoRef} style={{ ...C(), ... }}>
```

**Decision: Defer this implementation.** Rationale:

- The app currently has zero scroll-triggered animations. Introducing them only on editorial sections creates an inconsistency — why do these cards animate but data tables don't?
- The MetaLab principle "Restraint over ornamentation" argues against adding animation for its own sake.
- The `prefers-reduced-motion` guard is necessary but adds complexity.
- If implemented later, apply to *all* card-level sections or none. Don't cherry-pick.

**If implemented, follow these rules:**
- 500ms duration, ease timing
- 12px vertical translate (subtle, not dramatic)
- Only trigger once (disconnect observer after animation)
- Respect `prefers-reduced-motion`
- Apply uniformly to all major sections, not just editorial callouts

**Risk:** **Medium.** Scroll-triggered animations can cause jank on low-end phones if not implemented with `transform` (GPU-composited) and `will-change`. The `translateY` + `opacity` combo is safe because both are composited properties.

---

## Implementation Summary

### Priority Order (recommended execution sequence)

| #   | Item | Tier | File | Risk |
|-----|------|------|------|------|
| 1   | `rem` conversion for `clamp()` values | T1 | `index.html` | Low |
| 2   | `<meta name="theme-color">` | T1 | `index.html` + `morning_hoops.jsx` | Low |
| 3   | Font preconnect/preload hints | T1 | `index.html` | Low |
| 4   | HTML background color flash prevention | T4 | `index.html` | Low |
| 5   | Safe-area-inset handling | T1 | `index.html` + `morning_hoops.jsx` | Low |
| 6   | `overscroll-behavior` | T1 | `morning_hoops.jsx` | Low |
| 7   | `scroll-margin-top` on section targets | T1 | `morning_hoops.jsx` | Low |
| 8   | Replace hardcoded 90px indent | T1 | `morning_hoops.jsx` | Low |
| 9   | `:focus-visible` ring styles | T3 | `morning_hoops.jsx` | Low |
| 10  | Active/pressed states on buttons | T2 | `morning_hoops.jsx` | Low |
| 11  | Scroll snap on tab bar | T2 | `morning_hoops.jsx` | Low |
| 12  | Auto-scroll active tab into view | T2 | `morning_hoops.jsx` | Low |
| 13  | Progress bar ARIA | T3 | `morning_hoops.jsx` | Low |
| 14  | Section jump `aria-label`s | T3 | `morning_hoops.jsx` | Low |
| 15  | Color dot text alternatives | T3 | `morning_hoops.jsx` | Low |
| 16  | Tab keyboard arrow navigation | T3 | `morning_hoops.jsx` | Medium |
| 17  | `100dvh` viewport height | T4 | `morning_hoops.jsx` + `index.html` | Low |
| 18  | Stat card hover micro-interaction | T4 | `morning_hoops.jsx` | Low |

### Items deliberately deferred

| Item | Reason |
|------|--------|
| `font-display: optional` for Instrument Serif | Editorial identity depends on the font loading; `swap` + preconnect is the better tradeoff |
| Loading state skeleton for font swap | Preconnect hints reduce the window enough; hiding content is worse than FOUT |
| Card touch feedback | Cards are not interactive; press states on non-interactive elements create broken affordances |
| Scroll-based fade-in animations | Restraint over ornamentation; inconsistent with the rest of the app |

### Files modified

| File | Changes |
|------|---------|
| [`index.html`](index.html) | `rem` conversion, theme-color meta, viewport-fit, safe-area vars, preconnect hints, html background, dvh fallback |
| [`morning_hoops.jsx`](morning_hoops.jsx) | overscroll-behavior, scroll-margin-top, focus-visible styles, active states, scroll-snap, tab a11y, progress bar ARIA, dot SR text, section aria-labels, 90px indent fix, theme-color JS update, tab auto-scroll, dvh, stat hover, useRef import |

### MetaLab Principles Applied

| Principle | How it's applied |
|-----------|-----------------|
| Every pixel is intentional | `rem` conversion ensures typography scales intentionally with user preferences, not arbitrarily |
| Interactions should feel physical | `scale(0.97)` active states, `scroll-snap` on tabs, auto-scroll centering |
| Mobile is the primary experience | Safe area insets, overscroll containment, scroll-margin-top, dvh viewport |
| Restraint over ornamentation | Deferred scroll animations, no card press states, no skeleton loading |
| The best UI is invisible | `:focus-visible` only on keyboard, `@media(hover:hover)` guard on stat hover |
| Transitions: fast but crafted | 120ms active states (under 150ms threshold), 200ms hover transitions |
