# Product

## Register

product

## Users

The ~15 players in a pickup basketball league and their wives, friends, and extended group chat. Adults (roughly 25–45) who wake up at 4:45 AM to play 7-game series in a middle school gym. They open this dashboard on their phones, usually in the group chat after a session, sometimes while still in the gym. The secondary audience is partners and friends who follow along for the comedy more than the stats.

The job to be done: find out what happened, laugh about it, look up your record, roast your friends, and scroll the editorial takes. Stats are the skeleton; entertainment is the muscle.

## Product Purpose

Morning Hoops is a stats dashboard and editorial record for a pickup basketball league. It tracks win-loss records, team compositions, partnerships, rivalries, attendance, and special achievements (the 7/7 Club, sweep records, the Tyler Losses Files) across a season of 7-game series played by 1s and 2s.

Success looks like: every player checks it after every session, screenshots get shared in the group chat, and people argue about what the dashboard says about them. It's the league's newspaper, stat sheet, and comedy column in one.

## Brand Personality

**Irreverent, obsessive, affectionate.**

The voice is an insider writing for insiders. It roasts players by name, tracks absurd micro-narratives (the Florida Investigation, Chad's "distinguished twin" Chadwick, Cody's bathroom break), and treats a pickup basketball league with the forensic seriousness of a federal inquiry — while never losing the underlying warmth that this is a group of friends who genuinely enjoy each other.

The tone is: sports columnist who happens to be in the group chat. Not above making fun of anyone, but never mean. Every joke lands because it's specific and earned.

## Anti-references

- **Fantasy sports apps** (ESPN, Yahoo Fantasy, Sleeper) — too generic, too corporate, too many ads-shaped holes in the layout. Morning Hoops is handmade and specific.
- **Corporate SaaS dashboards** — Mixpanel, Amplitude, Datadog. This is not a business tool. No "metrics that matter" energy.
- **Google Sheets with styling** — the data comes from a spreadsheet, but the dashboard should feel nothing like one.
- **Anything that takes itself too seriously** — serious analytics tools, Tableau-style data viz, anything that treats the data as if it matters beyond this group chat.
- **Generic stat trackers** — GameChanger, iScore, any app that could be for any league. This should feel like it could only be for this league.

## Design Principles

1. **The writing is the product.** Every section earns attention through voice, not just data. A stat without commentary is a missed opportunity. The editorial layer is not decoration; it's the reason people scroll.

2. **Specific beats general.** Names, dates, exact scores, inside jokes. Nothing on this dashboard could apply to another league. The more particular, the better.

3. **Obsessive detail, casual delivery.** Track everything with forensic precision (7/7 shooting performances, curse suspects, attendance tiers) but present it like you're telling a story at a bar, not presenting quarterly results.

4. **Entertainment first, stats second.** Someone should be able to open this and enjoy scrolling without caring about basketball. The stats serve the narrative, not the other way around.

5. **Dark gym energy.** The primary context is a phone screen at 5 AM in a dim gymnasium, or in a group chat right after. Dark mode is the real mode. The interface should feel like it belongs to that hour.

## Accessibility & Inclusion

- WCAG AA as baseline for text contrast — particularly important since primary viewing context is phones in low-light environments (a gym at 4:45 AM)
- Dark mode is the primary theme, light mode is secondary
- Mobile-first: most users view on phones in the group chat
- No specific accommodations required beyond readable contrast and touch-friendly targets
- Reduced motion: respect `prefers-reduced-motion` for any future animations
