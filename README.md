# Morning Hoops

A dashboard for a group of grown adults who wake up before the sun to play 7-game basketball series in a middle school gym. Built with React + Vite, powered by a Google Sheet that serves as the league's official record.

## Quick Start

```bash
npm install
npm run dev
```

## Architecture

- **`morning_hoops.jsx`** — Main React component: stats engine, UI, all tabs
- **`src/lib/sheetLoader.js`** — Fetches and parses the published Google Sheet (CSV)
- **`src/lib/useSessions.js`** — React hook wrapping the loader with loading/error state
- **`scripts/legacy_sessions.json`** — Hardcoded legacy snapshot of all sessions (for validation)
- **`scripts/validate.mjs`** — Validation script comparing legacy data against the live sheet

## Updating the Data

### The Asterisk Convention

Player names in the Google Sheet use a trailing asterisk to indicate Blue team membership:

- `Gabe*` = Blue team
- `Gabe` = White team

The trailing asterisk is the **only** team indicator — cell background colors in the spreadsheet are NOT used by the parser.

### Adding a New Week's Tab

1. Create a new tab in the Google Sheet
2. **Row 1:** date headers (e.g., `5/4/2026`, `5/5/2026`)
3. **Rows 2+:** player names under each date. Add `*` suffix for Blue players
4. **Rows 11–15:** result text (e.g., `"Blue wins 4-3"`, `"White wins 4-0"`, `"No game"`)
5. **Publish the tab to web:** File → Share → Publish to web → select the tab → CSV format

### Finding a Tab's GID

1. Open the tab in Google Sheets (editing view)
2. Look at the browser URL: `...#gid=1234567890`
3. Copy the number after `#gid=`

### Adding an Entry to SHEET_TABS

Open `src/lib/sheetLoader.js` and add a new entry to the `SHEET_TABS` array:

```js
{ gid: "1234567890", label: "Week of 5/4", month: "May" },
```

- **`gid`** — the tab's GID from the URL (see above)
- **`label`** — human-readable week label (used for logging/debugging)
- **`month`** — month name string used to group sessions in the dashboard

### Result Text Formats

The parser recognizes these patterns in rows 11–15:

| Pattern | Example | Parsed As |
|---------|---------|-----------|
| Standard with score | `"Blue wins 4-3"` / `"White wins 4-1"` | winner + score |
| Informal verb | `"Blue beat that ass"` / `"Blue smacked"` / `"Blue swept"` | winner parsed, score defaults to `"W"` |
| No game | `"No game"` / `"Aka no game"` | no game recorded |
| Missing | (players listed but no result text found) | `"No result recorded"` |

### Cache

Sessions are cached in `sessionStorage` with a 5-minute TTL to avoid redundant fetches.

**To bypass the cache:**

- Open browser DevTools → Application → Session Storage → delete `morning-hoops-sessions`
- Or run in the console:
  ```js
  sessionStorage.removeItem('morning-hoops-sessions');
  ```

### Re-running Validation

The validation script compares the hardcoded legacy data (`scripts/legacy_sessions.json`) against live data from the Google Sheet:

```bash
node scripts/validate.mjs
```

This produces `scripts/validation_report.md` with:

- Per-session comparison (roster, winner, score)
- Aggregate stats comparison table
- Flagged data points (known edge cases)
- Tyler losses file with curse suspects
- 7/7 Club verification
- Suspected sheet errors and parser warnings

If the `SHEET_TABS` GIDs are still placeholder values, the script runs in legacy-only mode and computes all aggregate stats from the hardcoded snapshot as a baseline reference.
