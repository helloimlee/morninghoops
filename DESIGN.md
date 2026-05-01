---
name: Morning Hoops
description: A pickup basketball league dashboard that reads like a newspaper and hits like a group chat
colors:
  accent-ember: "#EF6234"
  team-blue-dark: "#5B8DEF"
  team-blue-light: "#3B6BF5"
  team-white-dark: "#B4BCD0"
  team-white-light: "#64748B"
  stat-green: "#34D399"
  stat-gold: "#FBBF24"
  stat-red: "#F87171"
  surface-dark: "#09090B"
  surface-card-dark: "#16161A"
  surface-inset-dark: "#0D0D0F"
  text-primary-dark: "#EDEDEF"
  text-secondary-dark: "#A1A1AA"
  text-tertiary-dark: "#52525B"
  surface-light: "#F7F6F3"
  surface-card-light: "#FFFFFF"
  surface-inset-light: "#EDECEB"
  text-primary-light: "#1A1A1A"
  text-secondary-light: "#6B7280"
  text-tertiary-light: "#9CA3AF"
typography:
  display:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "clamp(36px, 5.5vw, 56px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-1px"
  headline:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.2
  title:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "'Outfit', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Outfit', sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "1.6px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "10px"
  card: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "28px"
  section: "40px"
components:
  card:
    backgroundColor: "{colors.surface-card-dark}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  badge-blue:
    backgroundColor: "rgba(91,141,239,.15)"
    textColor: "{colors.team-blue-dark}"
    rounded: "{rounded.sm}"
    padding: "3px 8px"
  badge-white:
    backgroundColor: "rgba(180,188,208,.1)"
    textColor: "{colors.team-white-dark}"
    rounded: "{rounded.sm}"
    padding: "3px 8px"
  tab-active:
    textColor: "{colors.text-primary-dark}"
  tab-inactive:
    textColor: "{colors.text-tertiary-dark}"
  theme-toggle:
    backgroundColor: "{colors.surface-card-dark}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
---

# Design System: Morning Hoops

## 1. Overview

**Creative North Star: "The Group Chat Gazette"**

Morning Hoops is a sports dashboard that operates like a small-circulation newspaper written by and for a group of fifteen adults who play pickup basketball at 4:45 AM. The design system serves two masters simultaneously: dense statistical data (win-loss records, partnership matrices, attendance tracking) and a relentless editorial voice that treats a middle school gym like Madison Square Garden. The result is a product that looks like a stats dashboard but reads like a humor column.

The visual system is intentionally restrained so the writing can be loud. Dark surfaces, tight typography, and flat tonal layering create a stage; the orange-ember accent and the Instrument Serif display face provide just enough character to feel authored rather than generated. The system rejects anything that looks like a fantasy sports app, a corporate analytics tool, or a styled spreadsheet. It also rejects anything that takes itself too seriously. If the interface could belong to ESPN, it has failed.

**Key Characteristics:**
- Dark-first: designed for phones in a dim gym at 5 AM
- Flat and tonal: depth through background tinting, never shadows
- Serif + sans pairing: editorial headlines over functional body text
- Single accent color at high saturation against near-black surfaces
- Dense but scannable: lots of data, no wasted space, every section earns its scroll
- Editorial commentary woven into every data section, not siloed

## 2. Colors

The palette is built around a near-black canvas with one high-saturation accent and a set of functional stat colors. Every neutral is cold-tinted toward zinc/slate. The accent color is warm and singular.

### Primary
- **Ember Orange** (#EF6234): The editorial voice made visible. Used for the title accent, section labels, editorial notes, commentary markers, and active tab indicators. It is the only warm color on a cold canvas, which makes it impossible to ignore. That rarity is the point.

### Secondary
- **Team Blue** (#5B8DEF dark / #3B6BF5 light): Identifies Blue team players, win counts, and Blue-associated data. Cooler and more muted than Ember Orange; it recedes where the accent advances.
- **Team Slate** (#B4BCD0 dark / #64748B light): Identifies White team players. Deliberately desaturated to avoid competing with Team Blue. In light mode, shifts to a mid-gray slate.

### Tertiary
- **Stat Green** (#34D399): Winning records, top win rates, positive partnership data. Used in progress bars and percentage labels for records above 60%.
- **Stat Gold** (#FBBF24): Mid-range records (45-59%), the 7/7 Club highlight border and labels. The "noteworthy but not dominant" tier.
- **Stat Red** (#F87171): Losing records, bottom win rates, negative partnership data, Tyler Losses Files accent. Below 45%.

### Neutral
- **Void** (#09090B): Page background in dark mode. Near-black with a faint cold tint.
- **Charcoal** (#16161A): Card surfaces in dark mode. One step up from void.
- **Obsidian** (#0D0D0F): Inset panels, table headers, footer strips. Darker than cards, creating a recessed feel without shadows.
- **Warm Linen** (#F7F6F3): Page background in light mode. Warm off-white, not sterile.
- **Paper** (#FFFFFF): Card surfaces in light mode.
- **Parchment** (#EDECEB): Inset panels in light mode.
- **Primary Text** (#EDEDEF dark / #1A1A1A light): Headlines, player names, key data.
- **Secondary Text** (#A1A1AA dark / #6B7280 light): Body copy, descriptions, commentary prose.
- **Tertiary Text** (#52525B dark / #9CA3AF light): Labels, timestamps, de-emphasized metadata.
- **Border** (rgba(255,255,255,.06) dark / rgba(0,0,0,.06) light): Dividers and card borders. Barely visible, structural only.

### Named Rules
**The Ember Rule.** Ember Orange is the only warm hue in the system. It marks editorial voice: section labels, commentary callouts, the title italic, tab indicators, and the "Debrief" tag. If Ember is used on a non-editorial element, the system is drifting. Check yourself.

**The Three-Tier Stat Rule.** Player performance is always color-coded: Green (≥60%), Gold (45-59%), Red (<45%). These three colors are functional, not decorative. They never appear outside of stat contexts.

## 3. Typography

**Display Font:** Instrument Serif (with Georgia, serif fallback)
**Body Font:** Outfit (with sans-serif fallback)

**Character:** A newspaper editor paired with a modern Swiss grotesque. Instrument Serif brings warmth, authority, and a slight irreverence through its italics (used in the title, "vs" labels, and large stat numbers). Outfit is clean, geometric, and weight-flexible (300-800), handling everything from 10px uppercase labels to 14px body text without strain. The pairing says: "We take the data seriously and the situation not at all."

### Hierarchy
- **Display** (400, clamp(36px, 5.5vw, 56px), 1.05): The page title only. "Morning *Hoops*" with the italic on the accent word. One instance per page.
- **Headline** (400, 26-30px, 1.2): Section titles ("The State of the Gym", "Every Series. Every Roaster."). Instrument Serif. One per tab view.
- **Title** (400, 18-22px, 1.2): Stat numbers in tables, ranking numerals, player names in the 7/7 Club. Instrument Serif gives numbers a sporting-page feel.
- **Body** (400-600, 12-13px, 1.5-1.65): Commentary text, player descriptions, editorial notes. Outfit. Max width 600px on descriptive paragraphs.
- **Label** (700, 9-10px, letter-spacing 1.6px, UPPERCASE): Section headers ("SEASON SUMMARY", "TOP 5 WIN RATES"), tier badges ("IRON", "REG"), club designations ("FOUNDING MEMBER"). Outfit. The workhorse of the hierarchy.

### Named Rules
**The Italic-Is-Ember Rule.** Instrument Serif italic appears exactly twice: in the page title ("*Hoops*" set in accent color) and in the "vs" separator between teams. Italic is never used for emphasis in body text. The editorial voice is carried by word choice, not typographic decoration.

## 4. Elevation

No shadows. Zero. Depth is conveyed entirely through tonal layering: three background tiers (void → card → inset) create a recessed-panel effect without any box-shadow. This is intentional and permanent.

The layering stack in dark mode: Void (#09090B) → Charcoal (#16161A, cards) → Obsidian (#0D0D0F, inset panels and table headers). In light mode: Warm Linen (#F7F6F3) → Paper (#FFFFFF) → Parchment (#EDECEB). Borders at 6% opacity provide structural separation where tonal contrast alone isn't enough.

### Named Rules
**The No-Shadow Rule.** Shadows are prohibited. If a new component "needs" a shadow, it needs a redesign. Use the tonal stack or a border. This system is flat on purpose: shadows suggest depth and importance gradients that don't exist in a group chat about pickup basketball.

## 5. Components

### Tab Navigation
Horizontal text buttons with bottom-border accent. No background change on hover. Active state: 2px bottom border in Ember Orange, text in primary color, weight 700. Inactive: transparent bottom border, tertiary text color, weight 500. Overflow-x auto for mobile. Font: Outfit 13px.

### Cards
The primary container. Gently curved edges (14px radius), card-tier background, 1px border at 6% opacity, 20px internal padding. Cards hold everything: stat tables, player profiles, editorial sections, partnership rankings. Variant: `padding: 0, overflow: hidden` for cards with internal rows that bleed to edges.

### Team Badges
Compact result indicators. 4px radius, 9px uppercase Outfit text at weight 700, letter-spacing 1px. Blue team: tinted blue background (15% opacity dark, 8% light) with blue text. White team: tinted slate background (10% opacity dark, 8% light) with slate text. "No result" variant: neutral background at 4% opacity.

### Team Dots
8px colored circles (blue #3B6BF5 or slate #94A3B8 dark / #64748B light) used inline next to player names in roster lists. 5px right margin. Flex-shrink 0 so they never collapse.

### Progress Bars
6px height, 3px radius, inset-tier background. Fill color follows the Three-Tier Stat Rule (green/gold/red). Used in win-rate tables and partnership rankings. No animation.

### Stat Numbers (Instrument Serif)
Large Instrument Serif numbers (26-48px) used for headline stats, head-to-head records, and ranking positions. Color-coded by context: accent for rankings, team colors for head-to-head, stat-tier colors for win rates. These are the visual signature of the dashboard.

### Attendance Tier Badges
Tiny classification chips (8px font, 800 weight, 1px letter-spacing, 3px radius). Background is the tier color at ~9% opacity; text is the tier color. Tiers: IRON (Ember, ≥90%), REG (Green, ≥70%), PT (Blue, ≥40%), DROP (Gold, ≥15%), 1x (Tertiary, <15%).

### Editorial Callout Cards
Cards with a tinted border and background for special sections (Florida Investigation, 7/7 Club). Border color matches the section's accent (Ember for editorial, Gold for achievements) at 20% dark / 15% light opacity. Background at 3-4% opacity. These are the system's way of saying "this section is different."

### Theme Toggle
A small button in the top-right corner. Card background, 1px border, 8px radius, 14px horizontal padding. Emoji prefix (☀️/🌙). Outfit 11px weight 600. Functional, not decorative.

## 6. Do's and Don'ts

### Do:
- **Do** use Ember Orange exclusively for editorial voice elements: labels, commentary markers, the title accent, tab indicators. Its scarcity is what makes it visible.
- **Do** maintain the three-tier tonal stack (void → card → inset) for all depth. Every new surface should fit into one of these three levels.
- **Do** pair every stat with context. A number without commentary is a missed opportunity. The writing layer is not optional.
- **Do** use Instrument Serif for display numbers, headlines, and the "vs" separator. It turns data into editorial content.
- **Do** keep editorial notes in 10px Ember italic below game rows. Tight to the data, not floating in a separate section.
- **Do** test every new element in dark mode first. Light mode is the secondary theme.
- **Do** respect mobile: content padded at 20px sides, tables use overflow-x auto, font sizes readable at arm's length.

### Don't:
- **Don't** add shadows or box-shadow to any element. The system is flat by doctrine, not by accident.
- **Don't** use Ember Orange for non-editorial elements (buttons, backgrounds, structural borders). It marks voice, not interaction.
- **Don't** make it look like a fantasy sports app. No ESPN card layouts, no player headshots in circles, no "matchup preview" widgets, no ad-shaped whitespace. (Per PRODUCT.md: "Morning Hoops is handmade and specific.")
- **Don't** make it look like a corporate SaaS dashboard. No "metrics that matter" energy, no KPI cards with sparklines, no sidebar navigation. (Per PRODUCT.md: "This is not a business tool.")
- **Don't** make it look like a styled Google Sheet. The data comes from a spreadsheet; the dashboard should feel nothing like one.
- **Don't** take the design too seriously. If a component looks like it belongs in Datadog, it doesn't belong here. (Per PRODUCT.md: "anything that treats the data as if it matters beyond this group chat.")
- **Don't** introduce new accent colors. The palette is intentionally narrow: one warm accent, two team colors, three stat tiers, and neutrals. That's the whole system.
- **Don't** use Inter, Roboto, Arial, or system-ui as display or body text. Instrument Serif + Outfit is the pairing. Period.
- **Don't** nest cards inside cards. If a layout seems to need it, flatten the hierarchy with inset panels or row separators instead.

---

## 7. Premium Editorial Redesign Specification

### 7.0 Audit Summary — What's Wrong Today

The current implementation has a single boolean breakpoint (`window.innerWidth < 640`) that controls exactly three layout switches out of ~12 section types. Everything else — typography, spacing, tables, grids — is fixed-pixel and desktop-first. The result on a 390px phone screen:

| Problem | Location | Root Cause |
|---------|----------|------------|
| Header doesn't reflow | Lines 624-631 | `display: flex` + `justifyContent: space-between` with no wrap |
| Tab bar has inconsistent touch targets | Line 634 | `gap: 2` between tabs; padding `14px 16px` is adequate height but targets crowd together |
| Section jump nav is untappable | Lines 391-403 | `padding: 4px 10px` = ~28px touch height, well under 44px minimum |
| Typography is fixed pixels | Entire file | Only the title uses `clamp()`; headlines (26-28px), body (12-13px), labels (9-10px), stat numbers (16-48px) are all static |
| Win-rate table clips | Lines 285-293 | `gridTemplateColumns: "24px 1fr 80px 1fr 60px"` — fixed 80px record + 60px percentage columns can't flex |
| Player records table clips | Lines 444-448 | `gridTemplateColumns: "100px 60px 1fr 50px"` — fixed 100px name column |
| Partnership/rival rankings don't adapt | Lines 301-334 | Fixed grid columns, no mobile variant |
| Player profile cards don't stack | Lines 462-468 | `display: flex` with horizontal layout doesn't reflow on narrow screens |
| Attendance table forces scroll | Lines 476-500 | `minWidth: 500` on `<table>` |
| Algorithm matchup stays 2-col | Lines 582-600 | `gridTemplateColumns: "1fr 1fr"` always |
| Padding is static 20px everywhere | Line 623 | `padding: "40px 20px 100px"` at all widths |
| Visual hierarchy is flat on mobile | Throughout | Stat numbers, labels, and body text have insufficient weight differentiation at small sizes |

### 7.1 Technical Foundation — CSS Custom Properties

Because the app is 100% inline styles, responsive typography via `clamp()` must live in CSS custom properties injected into `index.html`. Add this `<style>` block inside `<head>`:

```html
<style>
  :root {
    /* ── Typography Scale ── */
    --type-display:   clamp(32px, 5.5vw, 56px);
    --type-headline:  clamp(22px, 3.5vw, 30px);
    --type-title:     clamp(18px, 2.8vw, 22px);
    --type-stat-hero: clamp(36px, 6vw, 48px);
    --type-stat-lg:   clamp(22px, 3.5vw, 28px);
    --type-stat-md:   clamp(16px, 2.5vw, 20px);
    --type-body:      clamp(13px, 1.8vw, 14px);
    --type-body-sm:   clamp(11px, 1.5vw, 12px);
    --type-label:     clamp(9px, 1.2vw, 10px);
    --type-label-lg:  clamp(10px, 1.4vw, 11px);

    /* ── Spacing Scale ── */
    --space-page-x:   clamp(16px, 4vw, 20px);
    --space-page-top:  clamp(24px, 5vw, 40px);
    --space-page-bot:  clamp(60px, 10vw, 100px);
    --space-section:   clamp(28px, 5vw, 40px);
    --space-card-pad:  clamp(14px, 3vw, 20px);
    --space-card-gap:  clamp(6px, 1.5vw, 8px);
    --space-prose-max: min(600px, 100%);

    /* ── Layout ── */
    --content-max:     920px;
    --nav-height:      48px;
  }
</style>
```

These properties are consumed in inline styles via `var(--token-name)`. Example:

```jsx
// Before
<h2 style={{ fontSize: 28 }}>Section Title</h2>

// After
<h2 style={{ fontSize: 'var(--type-headline)' }}>Section Title</h2>
```

**Breakpoint strategy**: Replace the single `isMobile` boolean with a `useBreakpoint()` approach that returns `'compact' | 'regular' | 'wide'`:

```jsx
// Add to App component
const [bp, setBp] = useState(() => {
  if (typeof window === 'undefined') return 'regular';
  const w = window.innerWidth;
  return w < 480 ? 'compact' : w < 768 ? 'regular' : 'wide';
});

useEffect(() => {
  const onResize = () => {
    const w = window.innerWidth;
    setBp(w < 480 ? 'compact' : w < 768 ? 'regular' : 'wide');
  };
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);

const isCompact = bp === 'compact';  // < 480px (phones)
const isRegular = bp === 'regular';  // 480-767px (large phones, small tablets)
const isWide    = bp === 'wide';     // ≥ 768px (tablets, desktop)
```

**Why three breakpoints**: The current binary 640px cutoff puts large phones (iPhone Pro Max at 430px) in "mobile" mode with tiny text, while putting small tablets in "desktop" mode with layouts that assume 900px+. Three tiers let us optimize for the actual primary use case: phones in the group chat.

### 7.2 Mobile-First Typography Scale

Every text element moves from fixed pixels to the CSS custom property scale. The table below maps current usage → new token → computed range.

| Role | Current | New Token | Range (320→920px) | Weight | Font |
|------|---------|-----------|-------------------|--------|------|
| Page title | `clamp(36px,5.5vw,56px)` | `--type-display` | 32→56px | 400 | Instrument Serif |
| Section headline | `28px` fixed | `--type-headline` | 22→30px | 400 | Instrument Serif |
| Section title / stat label | `22px` fixed | `--type-title` | 18→22px | 400 | Instrument Serif |
| Hero stat number (H2H) | `48px` fixed | `--type-stat-hero` | 36→48px | 400 | Instrument Serif |
| Large stat number (rankings) | `26px` fixed | `--type-stat-lg` | 22→28px | 400 | Instrument Serif |
| Medium stat number (tables) | `18px` fixed | `--type-stat-md` | 16→20px | 400 | Instrument Serif |
| Body text | `13px` fixed | `--type-body` | 13→14px | 400 | Outfit |
| Small body / descriptions | `12px` fixed | `--type-body-sm` | 11→12px | 400-600 | Outfit |
| Labels (uppercase) | `10px` fixed | `--type-label` | 9→10px | 700 | Outfit |
| Large labels (section headers) | `10px` fixed | `--type-label-lg` | 10→11px | 700 | Outfit |

**Key type decisions:**
- Body text floor raised to 13px (from 12px) on mobile for readability at arm's length
- Stat numbers get a dedicated 3-tier scale (hero/lg/md) so the head-to-head "48" still dominates while table percentages don't overwhelm their rows
- Labels get a "large" variant for section headers that currently use the same 10px as tier badges

**Inline style migration examples:**

```jsx
// Section headline — before
<h2 style={{ ...S, fontSize: 28, color: t.text }}>The State of the Gym</h2>

// Section headline — after
<h2 style={{ ...S, fontSize: 'var(--type-headline)', color: t.text }}>The State of the Gym</h2>

// Head-to-head hero stat — before
<div style={{ ...S, fontSize: 48, color: t.blue, lineHeight: 1 }}>{bW}</div>

// Head-to-head hero stat — after
<div style={{ ...S, fontSize: 'var(--type-stat-hero)', color: t.blue, lineHeight: 1 }}>{bW}</div>

// Label — before (L object)
const L = { fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: t.t3, marginBottom: 14 };

// Label — after (L object)
const L = { fontSize: 'var(--type-label-lg)', fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: t.t3, marginBottom: 14 };
```

### 7.3 Improved Navigation

#### 7.3.1 Header Reflow

**Problem**: Title and theme toggle are `flex` side-by-side. On phones, the toggle crowds the title or the subtitle gets crushed.

**Solution**: Stack on compact, side-by-side on regular+.

```jsx
// Header container
<div style={{
  display: 'flex',
  flexDirection: isCompact ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: isCompact ? 'flex-start' : 'flex-start',
  gap: isCompact ? 16 : 0,
  marginBottom: 'var(--space-section)',
}}>
```

The theme toggle moves below the subtitle on compact screens. It remains `minHeight: 44` for touch.

#### 7.3.2 Tab Navigation — Pill Style

**Current**: Text buttons with 2px bottom-border active indicator. `gap: 2` makes them feel cramped. Active state is a thin ember line under the text.

**Redesign**: Switch to a **pill/capsule** pattern with a filled background on the active tab. This is more scannable on mobile because the active state is a filled shape, not a thin line that competes with the nav border.

```jsx
// Tab bar container
<nav role="tablist" style={{
  display: 'flex',
  gap: 6,
  marginBottom: 'var(--space-section)',
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  padding: '4px 0',              // breathing room for pill shape
  scrollbarWidth: 'none',        // hide scrollbar (editorial, not a spreadsheet)
}}>

// Individual tab — active
{
  background: tab === tb.id ? t.card : 'transparent',
  border: tab === tb.id ? `1px solid ${t.border}` : '1px solid transparent',
  borderRadius: 8,
  padding: '10px 16px',
  cursor: 'pointer',
  fontSize: 'var(--type-body)',
  fontWeight: tab === tb.id ? 700 : 500,
  color: tab === tb.id ? t.text : t.t3,
  fontFamily: "'Outfit',sans-serif",
  transition: 'all .15s',
  whiteSpace: 'nowrap',
  minHeight: 44,
  minWidth: 44,                  // touch target minimum
}
```

**Why pill over underline**: On a dark background at 5 AM, a filled card-colored pill against the void is more visible than a 2px ember line at the bottom of a row of text. The ember accent moves to the text color of the active pill instead. This preserves the Ember Rule — it's still marking the editorial voice (which tab is "speaking").

**Active state refinement**: The active tab gets `color: t.accent` (ember) instead of `t.text`. Inactive tabs stay `t.t3`. This makes the active tab pop against the pill background without introducing a new color.

#### 7.3.3 Section Jump Navigation (Season View)

**Current**: `padding: 4px 10px` buttons = ~28px touch height. Tiny, unlabeled, and invisible.

**Redesign**: Increase to proper touch targets with a horizontal scroll + fade hint.

```jsx
// Section jump nav
<nav style={{
  display: 'flex',
  gap: 6,
  marginBottom: 22,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 4,
  scrollbarWidth: 'none',
  maskImage: 'linear-gradient(to right, black 90%, transparent)',
  WebkitMaskImage: 'linear-gradient(to right, black 90%, transparent)',
}}>

// Individual jump button
{
  background: t.inset,
  border: `1px solid ${t.border}`,
  borderRadius: 6,
  padding: '8px 14px',           // yields ~36px height
  minHeight: 44,                 // explicit touch target
  cursor: 'pointer',
  fontSize: 'var(--type-body-sm)',
  fontWeight: 600,
  color: t.t3,
  fontFamily: "'Outfit',sans-serif",
  whiteSpace: 'nowrap',
  flexShrink: 0,
}
```

The `maskImage` creates a fade-to-transparent at the right edge, hinting that the row scrolls — a visual affordance that's editorial (a newspaper column fading off the page) rather than mechanical (a scrollbar).

### 7.4 Section Layout Patterns

Each section below gets a **compact** (< 480px), **regular** (480-767px), and **wide** (≥ 768px) specification.

#### 7.4.1 Game Rows (Month View)

**Current**: Mobile stacks day + badge on top, then blue names, "vs", white names below. Desktop uses a 5-column grid `72px 1fr 24px 1fr 76px`. Works but the mobile version is dense and lacks hierarchy.

**Redesign — compact**:
```jsx
// Game row — compact
<div style={{
  padding: '14px var(--space-card-pad)',
  borderBottom: i < len - 1 ? `1px solid ${t.border}` : 'none',
  opacity: rowOpacity,
}}>
  {/* Row 1: Day label left, Badge right */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  }}>
    <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{s.day}</div>
    <Badge ... />
  </div>
  {/* Row 2: Teams as compact inline chips */}
  <div style={{ fontSize: 'var(--type-body-sm)', lineHeight: 1.7 }}>
    <span style={{ color: t.blue, fontWeight: 600 }}>{s.blue.join(' · ')}</span>
    <span style={{ ...S, color: t.t3, fontStyle: 'italic', margin: '0 6px' }}>vs</span>
    <span style={{ color: t.white, fontWeight: 600 }}>{s.white.join(' · ')}</span>
  </div>
</div>
```

**Key change**: On compact, replace individual `<Dot>` + name pairs with a single inline string per team, separated by `·`. This cuts the height of each game row by ~40% while remaining scannable. The team color on the text replaces the dot as the team identifier. Dots return on regular+ where there's room.

**Redesign — regular/wide**: Keep the current 5-column grid but with fluid columns:
```jsx
gridTemplateColumns: 'minmax(60px, 72px) 1fr 24px 1fr minmax(60px, 80px)'
```

#### 7.4.2 Head-to-Head Overview

**Current**: `flex` with `justifyContent: space-between` for the big numbers, then a 4-col or 2-col stat grid. Works but the big numbers could be more dramatic on mobile.

**Redesign — compact**: Center the entire H2H section. Stack the numbers vertically with the progress bar between them.

```jsx
// H2H — compact layout
<div style={{ textAlign: 'center', marginBottom: 14 }}>
  <div style={{ ...S, fontSize: 'var(--type-stat-hero)', color: t.blue, lineHeight: 1 }}>{bW}</div>
  <div style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.t3, marginTop: 2, marginBottom: 12 }}>Blue Wins</div>

  {/* Progress bar centered */}
  <div style={{ height: 6, borderRadius: 3, overflow: 'hidden', display: 'flex', background: t.inset, margin: '0 auto', maxWidth: 240 }}>
    <div style={{ width: `${bW/(bW+wW)*100}%`, background: t.blue }} />
    <div style={{ width: `${wW/(bW+wW)*100}%`, background: '#94A3B8' }} />
  </div>

  <div style={{ ...S, fontSize: 'var(--type-stat-hero)', color: t.white, lineHeight: 1, marginTop: 12 }}>{wW}</div>
  <div style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.t3, marginTop: 2 }}>White Wins</div>
</div>
```

**Redesign — regular+**: Keep the current horizontal layout but with fluid stat numbers via `--type-stat-hero`.

**Stat chips** (sweeps/blowouts/comfortable/nail-biters): Always 2x2 grid on compact and regular, 4-col on wide. Current behavior is correct but the inset chips need fluid type:

```jsx
<div style={{ ...S, fontSize: 'var(--type-stat-lg)', color: m.c, lineHeight: 1 }}>{m.v}</div>
<div style={{ fontSize: 'var(--type-label)', color: t.t3, fontWeight: 600, marginTop: 3 }}>{m.l}</div>
```

#### 7.4.3 Win-Loss Record Tables

**Current**: `gridTemplateColumns: "100px 60px 1fr 50px"`. The 100px name column clips "Chadwick" at ~7 characters on a 320px screen.

**Redesign — compact**: Switch to a stacked row layout. Each player becomes a mini-card within the list:

```jsx
// Win-loss row — compact
<div style={{
  padding: '12px var(--space-card-pad)',
  borderBottom: i < len - 1 ? `1px solid ${t.border}` : 'none',
}}>
  {/* Row 1: Name left, percentage right */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  }}>
    <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</div>
    <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: barColor }}>{pct}%</div>
  </div>
  {/* Row 2: Record text + progress bar */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, minWidth: 40 }}>{d.w}-{d.l}</div>
    <div style={{ flex: 1, height: 6, background: t.inset, borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 3 }} />
    </div>
  </div>
</div>
```

**Redesign — regular+**: Keep the grid but make columns fluid:
```jsx
gridTemplateColumns: 'minmax(80px, 120px) 60px 1fr 50px'
```

#### 7.4.4 Top 5 Win Rates Table

Same problem as win-loss records. The 5-column grid `24px 1fr 80px 1fr 60px` crowds on compact.

**Redesign — compact**: Numbered stacked rows. The rank number becomes a small accent element:

```jsx
// Top 5 row — compact
<div style={{
  padding: '12px var(--space-card-pad)',
  borderBottom: i < len - 1 ? `1px solid ${t.border}` : 'none',
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent }}>{i + 1}</span>
      <span style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</span>
    </div>
    <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green }}>{pct}%</div>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
    <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, minWidth: 40 }}>{d.w}-{d.l}</div>
    <div style={{ flex: 1, height: 6, background: t.inset, borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: t.green, borderRadius: 3 }} />
    </div>
  </div>
</div>
```

**Redesign — regular+**: Original 5-column grid with fluid columns.

#### 7.4.5 Partnership & Rivalry Rankings

**Current**: Fixed grid `24px 1fr 80px 60px` for partnerships, `24px 1fr 60px` for rivals. Both clip on compact.

**Redesign — compact**: Same stacked-row pattern as win rates. Rank + pair name on row 1, record + percentage on row 2.

```jsx
// Partnership row — compact
<div style={{
  padding: '10px var(--space-card-pad)',
  borderBottom: i < len - 1 ? `1px solid ${t.border}` : 'none',
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green }}>{i + 1}</span>
      <span style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{pair.a} + {pair.b}</span>
    </div>
    <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green, flexShrink: 0 }}>{Math.round(pair.pct * 100)}%</div>
  </div>
  <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, marginTop: 2, paddingLeft: 28 }}>{pair.w}-{pair.l}</div>
</div>
```

**Redesign — regular+**: Original grid layout with fluid columns.

#### 7.4.6 Player Profile Cards

**Current**: Horizontal `flex` with record number on the left (64px min-width), name + tag + description on the right. Never stacks — on a 320px screen the description gets ~200px of width.

**Redesign — compact**: Stack vertically. Record + name + tag on one line, description below.

```jsx
// Profile card — compact
<div style={{
  ...C(),
  padding: 'var(--space-card-pad)',
}}>
  {/* Row 1: Record, Name, Tag */}
  <div style={{
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 6,
  }}>
    <div style={{
      ...S,
      fontSize: 'var(--type-title)',
      color: pct !== null ? (pct >= 60 ? t.green : pct >= 45 ? t.gold : t.red) : t.t3,
      flexShrink: 0,
    }}>{rec}</div>
    <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>
      {c.name}
      <span style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.accent, marginLeft: 6 }}>{c.tag}</span>
    </div>
  </div>
  {/* Description */}
  <div style={{
    fontSize: 'var(--type-body-sm)',
    color: t.t2,
    lineHeight: 1.55,
  }}>{c.desc}</div>
</div>
```

**Redesign — regular+**: Keep horizontal layout but with fluid type sizes. The record column uses `--type-title` instead of fixed 22px.

#### 7.4.7 Attendance Table

**Current**: A `<table>` with `minWidth: 500` and 7 columns. Forces horizontal scroll on any phone.

**Redesign — compact**: Replace the table with a **card list**. Each player becomes a compact row with the most important data visible and secondary stats collapsed or reorganized.

```jsx
// Attendance — compact (replace <table> with card rows)
<div style={{ ...C({ padding: 0, overflow: 'hidden' }) }}>
  {sorted.map(([name, d], i) => {
    const rate = Math.round(d.g / totalS * 100);
    const dec = d.w + d.l;
    const wpct = dec > 0 ? Math.round(d.w / dec * 100) : null;
    const tier = /* same tier logic */;
    return (
      <div key={name} style={{
        padding: '12px var(--space-card-pad)',
        borderBottom: i < sorted.length - 1 ? `1px solid ${t.border}` : 'none',
      }}>
        {/* Row 1: Name + tier badge, attendance rate */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{name}</span>
            <span style={{ /* tier badge styles */ }}>{tier[0]}</span>
          </div>
          <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: tier[1] }}>{rate}%</div>
        </div>
        {/* Row 2: Games, Blue/White split, W-L, Win% */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginTop: 4,
          fontSize: 'var(--type-body-sm)',
          color: t.t2,
        }}>
          <span>{d.g}/{totalS} games</span>
          <span style={{ color: t.blue }}>{d.bt}B</span>
          <span style={{ color: t.white }}>{d.wt}W</span>
          {dec > 0 && <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{d.w}-{d.l} ({wpct}%)</span>}
        </div>
      </div>
    );
  })}
</div>
```

**Redesign — regular+**: Keep the `<table>` but remove `minWidth: 500`. Use percentage-based column widths and allow the table to compress gracefully:

```jsx
<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--type-body-sm)' }}>
  {/* Column headers get minWidth on Player only */}
  <th style={{ minWidth: 80 /* not 90 */ }}>Player</th>
  {/* Other columns: no minWidth, textAlign center, natural width */}
</table>
```

#### 7.4.8 The 7/7 Club Cards

**Current**: `gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr"`. This is one of the 3 sections that already adapts. But "isMobile" triggers at 640px, meaning a 500px tablet gets a single-column stack.

**Redesign**:
- Compact (< 480px): 1 column, cards stack vertically
- Regular (480-767px): 2 columns (2 + 1 row)
- Wide (≥ 768px): 3 columns

```jsx
gridTemplateColumns: isCompact ? '1fr' : isRegular ? '1fr 1fr' : '1fr 1fr 1fr'
```

Card internal type uses fluid tokens:
```jsx
<div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 4 }}>FOUNDING MEMBER</div>
<div style={{ ...S, fontSize: 'var(--type-title)', color: t.text }}>Gabe</div>
<div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, marginTop: 4, lineHeight: 1.5 }}>Mon 3/23 · Game 1...</div>
```

#### 7.4.9 Algorithm Matchup

**Current**: Always `gridTemplateColumns: "1fr 1fr"`. On a 320px screen, each team panel is ~140px wide.

**Redesign — compact**: Stack the teams vertically. Add a "vs" divider between them.

```jsx
// Algorithm — compact
<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}}>
  <div style={{ padding: 'var(--space-card-pad)', background: t.inset, borderRadius: 10 }}>
    {/* Team A */}
  </div>
  <div style={{
    textAlign: 'center',
    ...S,
    fontSize: 'var(--type-body-sm)',
    color: t.t3,
    fontStyle: 'italic',
    padding: '4px 0',
  }}>vs</div>
  <div style={{ padding: 'var(--space-card-pad)', background: t.inset, borderRadius: 10 }}>
    {/* Team B */}
  </div>
</div>

// Algorithm — regular+
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
  {/* Same as current */}
</div>
```

### 7.5 Editorial Framing

#### 7.5.1 Section Dividers

**Current**: Sections are separated by the label (L object) + whitespace. There's no visual rhythm marker between major sections.

**Redesign**: Add a **thin rule** above each section label. The rule uses the border token (6% opacity) and is inset from the edges, evoking a newspaper column break.

```jsx
// SectionDivider — new pattern to render before each L label
const SectionDivider = () => (
  <div style={{
    borderTop: `1px solid ${t.border}`,
    margin: `var(--space-section) 0 20px`,
    paddingTop: 20,
  }} />
);
```

For **editorial callout sections** (Florida Investigation, 7/7 Club, Tyler Losses), use a double-rule variant with an ember or gold top accent:

```jsx
// EditorialDivider — before special sections
const EditorialDivider = ({ color = t.accent }) => (
  <div style={{ margin: `var(--space-section) 0 20px` }}>
    <div style={{ height: 2, background: color, width: 32, marginBottom: 8 }} />
    <div style={{ borderTop: `1px solid ${t.border}` }} />
  </div>
);
```

The **32px ember bar** above the thin rule is the newspaper "column flag" — a small horizontal mark that signals a new editorial section. It's Ember for editorial pieces (Florida Investigation, Tyler Losses) and Gold for achievement pieces (7/7 Club). This stays within the Ember Rule: the accent marks editorial voice.

#### 7.5.2 Pull-Quote / Callout Treatment

**Current**: The editorial prose block (`fontSize: 19, fontStyle: italic, Instrument Serif`) serves as the summary-view lede but has no structural distinction from surrounding content.

**Redesign**: Frame the editorial lede as a **pull-quote** with a left accent border:

```jsx
// Editorial lede / pull-quote
<div style={{
  ...S,
  fontSize: 'var(--type-title)',
  fontStyle: 'italic',
  color: t.t2,
  lineHeight: 1.7,
  marginBottom: 'var(--space-section)',
  padding: '20px 0 20px 20px',
  borderLeft: `2px solid ${t.accent}`,
  maxWidth: 'var(--space-prose-max)',
}}>
```

The 2px ember left border is the only new structural use of ember, and it's directly marking editorial voice (the summary paragraph), so it satisfies the Ember Rule. The left border evokes a magazine pull-quote or a newspaper editorial sidebar.

**Month commentary blocks** already have a card container. Add the same left-border treatment to the `Debrief` footer within each month card:

```jsx
// Debrief footer — before
<div style={{ padding: '14px 16px', background: t.inset, ... }}>

// Debrief footer — after
<div style={{
  padding: '14px 16px',
  paddingLeft: 18,
  background: t.inset,
  borderLeft: `2px solid ${t.accent}`,
  /* ... rest unchanged */
}}>
```

#### 7.5.3 Card Hierarchy

Not every section needs a card. Cards create a visual "weight" — too many cards and the page becomes a stack of boxes. The hierarchy:

| Section | Container | Rationale |
|---------|-----------|-----------|
| Headline stats / editorial lede | **Open layout** (no card) | Pull-quote treatment, breathes on the page |
| Top 5 Win Rates | **Card** (padding: 0, overflow: hidden) | Data table, needs containment |
| Best/Worst Partnerships | **Card** (padding: 0, overflow: hidden) | Data table |
| Biggest Rivalries | **Card** (padding: 0, overflow: hidden) | Data table |
| Currently Struggling | **Card** (padding: 0, overflow: hidden) | Data table |
| Florida Investigation | **Tinted card** (ember border) | Editorial callout |
| Head-to-Head | **Card** (standard) | Dashboard hero stat |
| Player Records | **Card** (padding: 0, overflow: hidden) | Data table |
| Player Profiles | **Individual cards** per player | Each is a standalone editorial unit |
| Attendance | **Card** (padding: 0, overflow: hidden) | Data table (or card list on compact) |
| Tyler Losses | **Card** (standard) | Forensic editorial |
| 7/7 Club | **Tinted card** (gold border) | Achievement editorial |
| Algorithm Matchup | **Tinted card** (green border) | Computed editorial |
| Month game list | **Card** (padding: 0, overflow: hidden) | Game log |

**Rule**: Open-layout sections (editorial ledes, stat summaries) breathe at the top of each view. Card sections contain data. Tinted cards mark "this is special." This creates a rhythm: open → card → card → open → tinted card.

#### 7.5.4 White Space Rhythm

**Current**: `marginBottom: 28` on most sections, `marginBottom: 20` on some. No consistent rhythm.

**Redesign**: Two rhythms:

1. **Section gap** (`--space-section`): Between major sections (after a card, before the next label). `clamp(28px, 5vw, 40px)`.
2. **Subsection gap** (16-20px): Between a label and its card, or between stacked cards within a section.

```jsx
// Between sections
marginBottom: 'var(--space-section)'

// Between label and its content
marginBottom: 16

// Between stacked cards (e.g., player profiles)
gap: 'var(--space-card-gap)'
```

The section divider pattern (7.5.1) creates additional breathing room: `margin: var(--space-section) 0 20px` plus `paddingTop: 20` means each new section has ~68-80px of total vertical space separating it from the previous section's content. This is generous but intentional — a newspaper uses white space between columns to prevent cognitive bleeding.

### 7.6 Responsive Spacing

| Token | Compact (320-479px) | Regular (480-767px) | Wide (768px+) | CSS Custom Property |
|-------|---------------------|---------------------|---------------|-------------------|
| Page horizontal padding | 16px | 18px | 20px | `--space-page-x` |
| Page top padding | 24px | 32px | 40px | `--space-page-top` |
| Page bottom padding | 60px | 80px | 100px | `--space-page-bot` |
| Section gap | 28px | 34px | 40px | `--space-section` |
| Card internal padding | 14px | 17px | 20px | `--space-card-pad` |
| Card gap (stacked items) | 6px | 7px | 8px | `--space-card-gap` |
| Prose max-width | 100% | 100% | 600px | `--space-prose-max` |

**Main container update:**

```jsx
// Before
<main style={{ maxWidth: 920, margin: '0 auto', padding: '40px 20px 100px' }}>

// After
<main style={{
  maxWidth: 'var(--content-max)',
  margin: '0 auto',
  padding: 'var(--space-page-top) var(--space-page-x) var(--space-page-bot)',
}}>
```

**Card padding update:**

```jsx
// Before
const C = (x = {}) => ({ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, ...x });

// After
const C = (x = {}) => ({
  background: t.card,
  border: `1px solid ${t.border}`,
  borderRadius: 14,
  padding: 'var(--space-card-pad)',
  ...x,
});
```

### 7.7 New Component Patterns

#### 7.7.1 Stat Pill

A compact display for a single stat value + label. Used in the H2H stat chips and anywhere a number needs a label below it.

```jsx
// StatPill component pattern
<div style={{
  textAlign: 'center',
  background: t.inset,
  borderRadius: 8,
  padding: isCompact ? '10px 8px' : '12px',
}}>
  <div style={{ ...S, fontSize: 'var(--type-stat-lg)', color: accentColor, lineHeight: 1 }}>{value}</div>
  <div style={{ fontSize: 'var(--type-label)', color: t.t3, fontWeight: 600, marginTop: 4 }}>{label}</div>
</div>
```

#### 7.7.2 Record Badge

Replaces the inline record display in profile cards and table rows. Wraps a W-L record with the appropriate tier color.

```jsx
// RecordBadge pattern
<span style={{
  ...S,
  fontSize: size === 'lg' ? 'var(--type-title)' : 'var(--type-stat-md)',
  color: pct >= 60 ? t.green : pct >= 45 ? t.gold : t.red,
  fontVariantNumeric: 'tabular-nums',  // aligns numbers in columns
}}>
  {wins}-{losses}
</span>
```

The `fontVariantNumeric: 'tabular-nums'` is new — it ensures numbers align in columns without needing monospace. Instrument Serif supports this.

#### 7.7.3 Section Header

Standardizes the label + headline + subtitle pattern used at the top of each view and section.

```jsx
// SectionHeader pattern
<div style={{ marginBottom: 16 }}>
  <div style={L}>{label}</div>  {/* e.g., "SEASON SUMMARY" */}
  <h2 style={{
    ...S,
    fontSize: 'var(--type-headline)',
    color: t.text,
    margin: 0,
    fontWeight: 400,
  }}>{title}</h2>  {/* e.g., "The State of the Gym" */}
  {subtitle && (
    <div style={{
      fontSize: 'var(--type-body)',
      color: t.t2,
      marginTop: 6,
      lineHeight: 1.6,
      maxWidth: 'var(--space-prose-max)',
    }}>{subtitle}</div>
  )}
</div>
```

#### 7.7.4 Editorial Callout

Formalizes the tinted-border card used for Florida Investigation, 7/7 Club, and Algorithm Matchup.

```jsx
// EditorialCallout pattern
const EditorialCallout = ({ accentColor, children }) => ({
  ...C(),
  borderColor: dark
    ? `${accentColor}33`   // 20% opacity
    : `${accentColor}26`,  // 15% opacity
  background: dark
    ? `${accentColor}0A`   // 4% opacity
    : `${accentColor}08`,  // 3% opacity
});

// Usage:
// accentColor = t.accent for editorial (Florida Investigation)
// accentColor = t.gold for achievement (7/7 Club)
// accentColor = t.green for computed (Algorithm Matchup)
// accentColor = t.red for forensic (Tyler Losses — upgrade from plain card)
```

**New**: Tyler Losses Files gets promoted from a plain card to an **editorial callout** with `accentColor = t.red`. This makes it consistent with the other special sections and signals its forensic/editorial nature.

#### 7.7.5 Team Legend

The current team dot legend is functional but could be more visible on mobile.

```jsx
// Team legend — compact: sits below tab bar
<div style={{
  display: 'flex',
  gap: 16,
  marginBottom: isCompact ? 16 : 20,
  fontSize: 'var(--type-body-sm)',
  color: t.t3,
  justifyContent: isCompact ? 'center' : 'flex-start',
}}>
  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Dot team="blue" dark={dark} /> Blue</span>
  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Dot team="white" dark={dark} /> White</span>
</div>
```

On compact, centering the legend creates a symmetry with the centered H2H section and the centered tab bar.

### 7.8 Implementation Order

This redesign can be implemented incrementally, section by section, without breaking the existing app. Recommended order:

1. **CSS custom properties** — Add the `<style>` block to `index.html`. Zero visual change until tokens are consumed.
2. **Breakpoint upgrade** — Replace `isMobile` with `bp`/`isCompact`/`isRegular`/`isWide`. Map existing `isMobile` checks to `isCompact` initially.
3. **Typography migration** — Replace fixed font sizes with `var()` tokens. Start with `L` object, `S` usage, then individual sections.
4. **Spacing migration** — Replace fixed padding/margin with `var()` tokens. Start with main container, then `C()` function, then individual sections.
5. **Header reflow** — Implement stacking on compact.
6. **Tab navigation** — Switch to pill pattern.
7. **Section jump nav** — Increase touch targets.
8. **Section dividers** — Add thin rules and editorial dividers.
9. **Game rows** — Compact layout with inline team names.
10. **Win-loss and ranking tables** — Stacked row pattern on compact.
11. **Player profiles** — Stacked layout on compact.
12. **Attendance table** — Card list on compact, fluid table on regular+.
13. **7/7 Club** — 3-tier grid.
14. **Algorithm matchup** — Stack on compact.
15. **Editorial lede** — Pull-quote treatment with left border.
16. **Tyler Losses** — Upgrade to editorial callout.

Each step is independently shippable. Steps 1-4 are foundational. Steps 5-16 are per-section and can be done in any order.

### 7.9 Contrast Verification

All text-on-surface pairs must pass WCAG AA (4.5:1 for normal text, 3:1 for large text). Current pairs and their ratios:

| Text | Surface | Hex Pair | Ratio | Status |
|------|---------|----------|-------|--------|
| Primary on Void (dark) | `#EDEDEF` on `#09090B` | — | 18.3:1 | ✅ |
| Secondary on Void (dark) | `#A1A1AA` on `#09090B` | — | 7.5:1 | ✅ |
| Tertiary on Void (dark) | `#52525B` on `#09090B` | — | 3.0:1 | ⚠️ labels only (large text exception at 700 weight) |
| Tertiary (#71717A) on Void (dark) | `#71717A` on `#09090B` | — | 4.7:1 | ✅ |
| Primary on Card (dark) | `#EDEDEF` on `#16161A` | — | 14.6:1 | ✅ |
| Ember on Void (dark) | `#EF6234` on `#09090B` | — | 4.4:1 | ⚠️ close — acceptable for labels at 700 weight, but body text in ember should use card surfaces |
| Ember on Card (dark) | `#EF6234` on `#16161A` | — | 3.6:1 | ⚠️ — acceptable for labels (700 weight, uppercase, ≥10px) per WCAG non-text guidance, but not for body |
| Stat Green on Void | `#34D399` on `#09090B` | — | 10.0:1 | ✅ |
| Stat Gold on Void | `#FBBF24` on `#09090B` | — | 10.4:1 | ✅ |
| Stat Red on Void | `#F87171` on `#09090B` | — | 5.9:1 | ✅ |
| Primary on Linen (light) | `#1A1A1A` on `#F7F6F3` | — | 14.9:1 | ✅ |
| Secondary on Linen (light) | `#6B7280` on `#F7F6F3` | — | 4.9:1 | ✅ |
| Ember on Linen (light) | `#EF6234` on `#F7F6F3` | — | 3.6:1 | ⚠️ same constraint — labels only |

**Action items for implementation**:
- Ember-colored text used for editorial notes in game rows (currently `fontSize: 10, fontWeight: 600`) is acceptable because it meets the 3:1 large/bold text threshold at weight 600+.
- The pull-quote left border (7.5.2) uses ember as a decorative element, not text, so contrast doesn't apply.
- No body text (weight 400, < 14px) should be set in ember. All current uses are labels or bold markers, which is correct.
