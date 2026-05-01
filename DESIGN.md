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
