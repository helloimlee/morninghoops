// scripts/validate.mjs
// Usage: node scripts/validate.mjs

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ═══════════════════════════════════════════════════════════
// CONFIG — replicated from src/lib/sheetLoader.js
// ═══════════════════════════════════════════════════════════
const BASE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6NgRXIFkjnr6WNM8kmBNK2leMimLhlUKzstQSdgGV1EZqyGe1AsPwI0ORx4JSRxQZYjxl3iHLrt3D/pub?output=csv";

const SHEET_TABS = [
  { gid: "PASTE_GID_HERE", label: "Week of 3/2",  month: "March" },
  { gid: "PASTE_GID_HERE", label: "Week of 3/9",  month: "March" },
  { gid: "PASTE_GID_HERE", label: "Week of 3/16", month: "March" },
  { gid: "PASTE_GID_HERE", label: "Week of 3/23", month: "March" },
  { gid: "PASTE_GID_HERE", label: "Week of 3/30", month: "March" },
  { gid: "PASTE_GID_HERE", label: "Week of 4/6",  month: "April" },
  { gid: "PASTE_GID_HERE", label: "Week of 4/13", month: "April" },
  { gid: "PASTE_GID_HERE", label: "Week of 4/20", month: "April" },
  { gid: "PASTE_GID_HERE", label: "Week of 4/27", month: "April" },
];

// ═══════════════════════════════════════════════════════════
// DAY-NAME ABBREVIATION NORMALIZATION
// ═══════════════════════════════════════════════════════════
const DAY_ABBREV_MAP = {
  tues: "Tue",
  thurs: "Thu",
};

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ═══════════════════════════════════════════════════════════
// SKIP KEYWORDS — cells matching these are not player names
// ═══════════════════════════════════════════════════════════
const SKIP_RE = /^(stats?|https?:\/\/|win|wins|beat|smacked|swept|blew|blue\s|white\s|no\s*game|aka\s*no\s*game|no\s*games)$/i;
const SKIP_CONTAINS_RE = /^https?:\/\//i;
const RESULT_KEYWORDS_RE = /win|wins|beat|smacked|swept|blew|no\s*game|aka\s*no\s*game|no\s*games/i;

// ═══════════════════════════════════════════════════════════
// parseSheet(csvText, monthLabel) — PURE FUNCTION
// Replicated exactly from src/lib/sheetLoader.js
// ═══════════════════════════════════════════════════════════
function parseSheet(csvText, monthLabel) {
  if (!csvText || typeof csvText !== "string") return { sessions: [], warnings: [] };

  const parsed = Papa.parse(csvText.trim(), { header: false, skipEmptyLines: false });
  const rows = parsed.data;
  if (!rows || rows.length < 2) return { sessions: [], warnings: [] };

  const headerRow = rows[0];
  const warnings = [];

  // Parse date headers from row 1 (each column is a day)
  const columns = [];
  for (let col = 0; col < headerRow.length; col++) {
    const raw = (headerRow[col] || "").trim();
    if (!raw) continue;

    let dayLabel = null;

    // Try native Date parsing first
    const dateObj = new Date(raw);
    if (!isNaN(dateObj.getTime()) && raw.length > 2) {
      const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      dayLabel = `${weekday} ${month}/${day}`;
    } else {
      // Fall back to string parsing: normalize abbreviations
      let normalized = raw;
      for (const [from, to] of Object.entries(DAY_ABBREV_MAP)) {
        const re = new RegExp(`\\b${from}\\b`, "i");
        normalized = normalized.replace(re, to);
      }
      // Check if it looks like "DayName M/D" already
      const match = normalized.match(/^(\w{3})\s+(\d{1,2}\/\d{1,2})/);
      if (match) {
        dayLabel = `${match[1]} ${match[2]}`;
      } else {
        // Last resort: try if it's just a date-like string
        const dateMatch = normalized.match(/(\d{1,2})\/(\d{1,2})/);
        if (dateMatch) {
          dayLabel = normalized;
        }
      }
    }

    if (dayLabel) {
      columns.push({ col, dayLabel });
    }
  }

  if (columns.length === 0) return { sessions: [], warnings: [] };

  const sessions = [];

  for (const { col, dayLabel } of columns) {
    const bluePlayers = [];
    const whitePlayers = [];
    let resultText = null;

    // Walk rows 2-14 (indices 1-13) collecting player names
    const maxPlayerRow = Math.min(14, rows.length);
    for (let r = 1; r < maxPlayerRow; r++) {
      const cell = (rows[r] && rows[r][col] || "").trim();
      if (!cell) continue;
      if (SKIP_RE.test(cell)) continue;
      if (SKIP_CONTAINS_RE.test(cell)) continue;
      if (RESULT_KEYWORDS_RE.test(cell)) continue;

      // Check for trailing asterisk → Blue team
      if (cell.endsWith("*")) {
        const name = cell.slice(0, -1).trim();
        if (name) bluePlayers.push(name);
      } else {
        whitePlayers.push(cell);
      }
    }

    // Find result row by searching rows 11-15 (indices 10-14) for keywords
    const resultSearchStart = Math.min(10, rows.length - 1);
    const resultSearchEnd = Math.min(15, rows.length);
    for (let r = resultSearchStart; r < resultSearchEnd; r++) {
      const cell = (rows[r] && rows[r][col] || "").trim();
      if (cell && RESULT_KEYWORDS_RE.test(cell)) {
        // Take most specific match (prefer one with score)
        if (!resultText || /\d+-\d+/.test(cell)) {
          resultText = cell;
        }
      }
    }

    // Also check all rows for result if not found (defensive)
    if (!resultText) {
      for (let r = 1; r < rows.length; r++) {
        const cell = (rows[r] && rows[r][col] || "").trim();
        if (cell && RESULT_KEYWORDS_RE.test(cell)) {
          if (!resultText || /\d+-\d+/.test(cell)) {
            resultText = cell;
          }
        }
      }
    }

    // Warn if column has unasterisked names but zero asterisked and a "Blue wins" result
    if (bluePlayers.length === 0 && whitePlayers.length > 0 && resultText && /blue\s+wins?/i.test(resultText)) {
      warnings.push(`[${dayLabel}] No asterisked (Blue) players found but result says "Blue wins". Treating all as White, Blue empty.`);
    }

    // Parse result
    let winner = null;
    let score = null;
    let note = undefined;

    if (resultText) {
      const blueScoreMatch = resultText.match(/blue\s+wins?\s+(\d+-\d+)/i);
      const whiteScoreMatch = resultText.match(/white\s+wins?\s+(\d+-\d+)/i);
      const blueVerbMatch = resultText.match(/blue\s+(beat|smacked|swept|blew)/i);
      const whiteVerbMatch = resultText.match(/white\s+(beat|smacked|swept|blew)/i);
      const noGameMatch = resultText.match(/no\s*game|aka\s*no\s*game|no\s*games/i);

      if (blueScoreMatch) {
        winner = "blue";
        score = blueScoreMatch[1];
      } else if (whiteScoreMatch) {
        winner = "white";
        score = whiteScoreMatch[1];
      } else if (blueVerbMatch) {
        winner = "blue";
        score = "W";
      } else if (whiteVerbMatch) {
        winner = "white";
        score = "W";
      } else if (noGameMatch) {
        winner = null;
        score = null;
        note = "No game";
      }
    }

    // Determine if this is a no-game day or missing result
    const hasPlayers = bluePlayers.length > 0 || whitePlayers.length > 0;
    if (!hasPlayers && !winner) {
      note = "No game";
    } else if (hasPlayers && !winner && !note) {
      note = "No result recorded";
    }

    sessions.push({
      day: dayLabel,
      month: monthLabel,
      blue: bluePlayers,
      white: whitePlayers,
      winner,
      score,
      note,
    });
  }

  // Sort chronologically (Monday first within the week)
  sessions.sort((a, b) => {
    const dayA = a.day.split(" ")[0];
    const dayB = b.day.split(" ")[0];
    const idxA = DAY_ORDER.indexOf(dayA);
    const idxB = DAY_ORDER.indexOf(dayB);
    if (idxA !== idxB) return idxA - idxB;
    return 0;
  });

  return { sessions, warnings };
}

// ═══════════════════════════════════════════════════════════
// CHRONOLOGICAL SORT HELPER
// ═══════════════════════════════════════════════════════════
function parseDayToDate(dayStr) {
  const match = dayStr.match(/(\d{1,2})\/(\d{1,2})/);
  if (!match) return new Date(0);
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  return new Date(2025, month - 1, day);
}

// ═══════════════════════════════════════════════════════════
// STATS ENGINE — replicated from morning_hoops.jsx getStats()
// ═══════════════════════════════════════════════════════════
function getStats(sessions) {
  const p = {};
  const decided = sessions.filter(s => s.winner);
  const uniquePlayers = new Set();
  const playerLosses = {};
  const playerWins = {};

  sessions.forEach(s => {
    const process = (arr, team) => arr.forEach(n => {
      uniquePlayers.add(n);
      if (!p[n]) p[n] = { g: 0, w: 0, l: 0, bt: 0, wt: 0, bw: 0, ww: 0 };
      p[n].g++; p[n][team === "blue" ? "bt" : "wt"]++;
      if (s.winner === "blue") { p[n].bw++; if (team === "blue") p[n].w++; else p[n].l++; }
      else if (s.winner === "white") { p[n].ww++; if (team === "white") p[n].w++; else p[n].l++; }
    });
    process(s.blue, "blue"); process(s.white, "white");

    if (s.winner) {
      const blueWon = s.winner === "blue";
      s.blue.forEach(n => {
        const entry = { day: s.day, team: "blue", teammates: s.blue.filter(x => x !== n), opponents: s.white, score: s.score };
        if (blueWon) { if (!playerWins[n]) playerWins[n] = []; playerWins[n].push(entry); }
        else { if (!playerLosses[n]) playerLosses[n] = []; playerLosses[n].push(entry); }
      });
      s.white.forEach(n => {
        const entry = { day: s.day, team: "white", teammates: s.white.filter(x => x !== n), opponents: s.blue, score: s.score };
        if (!blueWon) { if (!playerWins[n]) playerWins[n] = []; playerWins[n].push(entry); }
        else { if (!playerLosses[n]) playerLosses[n] = []; playerLosses[n].push(entry); }
      });
    }
  });

  const blueWins = decided.filter(s => s.winner === "blue").length;
  const whiteWins = decided.filter(s => s.winner === "white").length;
  const sweeps = decided.filter(s => s.score === "4-0").length;

  return { p, decided, uniquePlayers, blueWins, whiteWins, sweeps, playerLosses, playerWins };
}

// ═══════════════════════════════════════════════════════════
// COMPARISON HELPERS
// ═══════════════════════════════════════════════════════════
function sortedRoster(arr) {
  return [...arr].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
}

function rostersMatch(a, b) {
  const sa = sortedRoster(a);
  const sb = sortedRoster(b);
  if (sa.length !== sb.length) return false;
  return sa.every((name, i) => name.toLowerCase() === sb[i].toLowerCase());
}

function rosterDiff(legacy, live) {
  const lSet = new Set(legacy.map(n => n.toLowerCase()));
  const sSet = new Set(live.map(n => n.toLowerCase()));
  const onlyLegacy = legacy.filter(n => !sSet.has(n.toLowerCase()));
  const onlyLive = live.filter(n => !lSet.has(n.toLowerCase()));
  return { onlyLegacy, onlyLive };
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
async function main() {
  const timestamp = new Date().toISOString();
  const parserWarnings = [];

  // 1. Read legacy data
  const legacyPath = join(__dirname, "legacy_sessions.json");
  let legacySessions;
  try {
    legacySessions = JSON.parse(readFileSync(legacyPath, "utf-8"));
  } catch (err) {
    console.error("❌ Could not read legacy_sessions.json:", err.message);
    process.exit(1);
  }
  console.log(`📦 Loaded ${legacySessions.length} legacy sessions`);

  // 2. Check if GIDs are real
  const gidsPlaceholder = SHEET_TABS.every(t => t.gid === "PASTE_GID_HERE");

  // 3. Fetch live data (if GIDs are real)
  let liveSessions = [];
  let fetchFailed = false;
  let fetchError = "";

  if (gidsPlaceholder) {
    fetchFailed = true;
    fetchError = "SHEET_TABS gids are still placeholder values (\"PASTE_GID_HERE\"). Fill them in with real gids from your Google Sheet.";
    console.warn("⚠️  " + fetchError);
  } else {
    console.log("🌐 Fetching live data from Google Sheets...");
    let succeeded = 0;
    let failed = 0;

    for (const tab of SHEET_TABS) {
      const url = `${BASE_URL}&gid=${tab.gid}`;
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${tab.label}`);
        const csvText = await resp.text();
        const { sessions, warnings } = parseSheet(csvText, tab.month);
        liveSessions = liveSessions.concat(sessions);
        warnings.forEach(w => parserWarnings.push(w));
        succeeded++;
      } catch (err) {
        failed++;
        const reason = err.message || String(err);
        console.warn(`  ⚠️ Failed tab "${tab.label}": ${reason}`);
        parserWarnings.push(`Fetch failed for ${tab.label}: ${reason}`);
      }
    }

    // Sort chronologically
    liveSessions.sort((a, b) => parseDayToDate(a.day) - parseDayToDate(b.day));

    console.log(`  ✅ Fetched ${succeeded} tabs, ${failed} failed, ${liveSessions.length} sessions total`);

    if (liveSessions.length === 0 && failed > 0) {
      fetchFailed = true;
      fetchError = `All ${failed} tab fetches failed. Check your GIDs and that tabs are published to web.`;
    }
  }

  // 4. Compute stats
  const legacyStats = getStats(legacySessions);
  const liveStats = liveSessions.length > 0 ? getStats(liveSessions) : null;

  // 5. Build comparison report
  const lines = [];
  const ln = (s = "") => lines.push(s);

  ln("# Morning Hoops: Validation Report");
  ln();
  ln(`Generated: ${timestamp}`);
  ln();

  if (fetchFailed) {
    ln("> ⚠️ **Could not fetch live data** — " + fetchError);
    ln("> Running comparison against legacy data only. Aggregate stats below are computed from the hardcoded legacy snapshot.");
    ln();
  }

  // ── Summary ──
  ln("## Summary");
  ln();

  if (!fetchFailed && liveSessions.length > 0) {
    // Build maps
    const legacyMap = new Map();
    legacySessions.forEach(s => legacyMap.set(s.day, s));
    const liveMap = new Map();
    liveSessions.forEach(s => liveMap.set(s.day, s));

    const allDays = new Set([...legacyMap.keys(), ...liveMap.keys()]);
    let matched = 0;
    let discrepancies = 0;
    const legacyOnly = [];
    const liveOnly = [];
    const matchDetails = [];
    const mismatchDetails = [];

    for (const day of allDays) {
      const leg = legacyMap.get(day);
      const liv = liveMap.get(day);

      if (leg && !liv) {
        legacyOnly.push(day);
        continue;
      }
      if (!leg && liv) {
        liveOnly.push(day);
        continue;
      }

      matched++;

      // Compare
      const blueMatch = rostersMatch(leg.blue, liv.blue);
      const whiteMatch = rostersMatch(leg.white, liv.white);
      const winnerMatch = leg.winner === liv.winner;
      const scoreMatch = leg.score === liv.score;
      const allMatch = blueMatch && whiteMatch && winnerMatch && scoreMatch;

      if (allMatch) {
        matchDetails.push(day);
      } else {
        discrepancies++;
        mismatchDetails.push({ day, leg, liv, blueMatch, whiteMatch, winnerMatch, scoreMatch });
      }
    }

    ln(`- Legacy sessions: ${legacySessions.length}`);
    ln(`- Live sessions: ${liveSessions.length}`);
    ln(`- Sessions matched by date: ${matched}`);
    ln(`- Sessions with discrepancies: ${discrepancies}`);
    ln(`- Legacy-only sessions (no live match): ${legacyOnly.length}`);
    ln(`- Live-only sessions (no legacy match): ${liveOnly.length}`);
    ln();

    // ── Discrepancies ──
    ln("## Discrepancies Found");
    ln();

    if (mismatchDetails.length === 0 && legacyOnly.length === 0 && liveOnly.length === 0) {
      ln("🎉 No discrepancies found! Legacy and live data match perfectly.");
      ln();
    }

    for (const m of mismatchDetails) {
      ln(`### ${m.day} ⚠️ MISMATCH`);
      ln();

      // Blue roster
      ln("**Blue roster:**");
      ln(`- Hardcoded: ${sortedRoster(m.leg.blue).join(", ") || "(empty)"}`);
      ln(`- Sheet: ${sortedRoster(m.liv.blue).join(", ") || "(empty)"}`);
      if (m.blueMatch) {
        ln("- Status: ✓ MATCH");
      } else {
        const diff = rosterDiff(m.leg.blue, m.liv.blue);
        const parts = [];
        if (diff.onlyLegacy.length) parts.push(`legacy-only: ${diff.onlyLegacy.join(", ")}`);
        if (diff.onlyLive.length) parts.push(`sheet-only: ${diff.onlyLive.join(", ")}`);
        ln(`- Status: ✗ DIFFER (${parts.join("; ")})`);
      }
      ln();

      // White roster
      ln("**White roster:**");
      ln(`- Hardcoded: ${sortedRoster(m.leg.white).join(", ") || "(empty)"}`);
      ln(`- Sheet: ${sortedRoster(m.liv.white).join(", ") || "(empty)"}`);
      if (m.whiteMatch) {
        ln("- Status: ✓ MATCH");
      } else {
        const diff = rosterDiff(m.leg.white, m.liv.white);
        const parts = [];
        if (diff.onlyLegacy.length) parts.push(`legacy-only: ${diff.onlyLegacy.join(", ")}`);
        if (diff.onlyLive.length) parts.push(`sheet-only: ${diff.onlyLive.join(", ")}`);
        ln(`- Status: ✗ DIFFER (${parts.join("; ")})`);
      }
      ln();

      // Winner
      ln("**Winner:**");
      ln(`- Hardcoded: ${m.leg.winner || "none"} (${m.leg.score || "no score"})`);
      ln(`- Sheet: ${m.liv.winner || "none"} (${m.liv.score || "no score"})`);
      ln(`- Status: ${m.winnerMatch && m.scoreMatch ? "✓ MATCH" : "✗ DIFFER"}`);
      ln();
      ln("---");
      ln();
    }

    // Matching sessions
    for (const day of matchDetails) {
      ln(`### ${day} ✓ MATCH`);
      ln();
      ln("---");
      ln();
    }

    // Legacy-only
    if (legacyOnly.length > 0) {
      ln("### Legacy-Only Sessions (no live match)");
      ln();
      for (const day of legacyOnly) {
        ln(`- **${day}** — present in legacy data but not found in live sheet`);
      }
      ln();
    }

    // Live-only
    if (liveOnly.length > 0) {
      ln("### Live-Only Sessions (no legacy match)");
      ln();
      for (const day of liveOnly) {
        ln(`- **${day}** — present in live sheet but not in legacy data`);
      }
      ln();
    }
  } else {
    // No live data — legacy-only summary
    ln(`- Legacy sessions: ${legacySessions.length}`);
    ln(`- Live sessions: 0 (fetch unavailable)`);
    ln(`- Comparison: N/A`);
    ln();
  }

  // ── Flagged Data Points ──
  ln("## Flagged Data Points");
  ln();
  ln("Check these specific sessions that were previously flagged:");
  ln();

  const flaggedChecks = [
    {
      day: "Mon 3/30",
      desc: "Tyler's first-ever loss. Was Tyler on White, Blue won 4-3?",
    },
    {
      day: "Wed 4/1",
      desc: "4v4 series. Blue: Chad/Gabe/Tyler/Lee. White: Nathan/Kyle/Sean/Cal. Blue won 4-0?",
    },
    {
      day: "Thu 4/9",
      desc: "Cody-on-toilet sweep. Was the score White 4-0? Who was on each team?",
    },
    {
      day: "Fri 4/10",
      desc: "Was there a Blue 4-0 sweep with Tyler+Lee+Cal on Blue?",
    },
    {
      day: "Tue 4/14",
      desc: "Did Chadwick debut? What was the result?",
    },
    {
      day: "Mon 4/20",
      desc: "Did White stack Tyler and win 4-1?",
    },
    {
      day: "Tue 4/21",
      desc: 'Was this the "White wins 4-0 / Aka no game" contradiction?',
    },
    {
      day: "Wed 4/29",
      desc: 'Was there a 4-0 White sweep? Was there a "Sean aka big dumb b——" entry?',
    },
    {
      day: "Fri 5/1",
      desc: "Lee's 7/7 game in pivotal game 5. Confirm score (Blue 4-3) and rosters.",
    },
  ];

  const liveMap = new Map();
  liveSessions.forEach(s => liveMap.set(s.day, s));
  const legacyMap = new Map();
  legacySessions.forEach(s => legacyMap.set(s.day, s));

  for (const flag of flaggedChecks) {
    const liv = liveMap.get(flag.day);
    const leg = legacyMap.get(flag.day);
    ln(`- **${flag.day}:** ${flag.desc}`);
    if (liv) {
      const blueStr = liv.blue.length > 0 ? liv.blue.join(", ") : "(none)";
      const whiteStr = liv.white.length > 0 ? liv.white.join(", ") : "(none)";
      const resultStr = liv.winner ? `${liv.winner} ${liv.score || "W"}` : (liv.note || "no result");
      ln(`  - Sheet says: Blue=[${blueStr}] White=[${whiteStr}] Result=${resultStr}`);
    } else if (fetchFailed) {
      const legStr = leg
        ? `Legacy says: Blue=[${leg.blue.join(", ") || "(none)"}] White=[${leg.white.join(", ") || "(none)"}] Result=${leg.winner ? `${leg.winner} ${leg.score || "W"}` : (leg.note || "no result")}`
        : "Not found in legacy data";
      ln(`  - Sheet says: (live data unavailable) ${legStr}`);
    } else {
      ln("  - Sheet says: (session not found in live data)");
    }
    ln();
  }

  // ── Aggregate Stats Comparison ──
  ln("## Aggregate Stats Comparison");
  ln();

  const statLabel = (name) => {
    const d = legacyStats.p[name];
    return d ? `${d.w}-${d.l}` : "N/A";
  };
  const liveStatLabel = (name) => {
    if (!liveStats) return "N/A";
    const d = liveStats.p[name];
    return d ? `${d.w}-${d.l}` : "N/A";
  };
  const attendanceLabel = (name, stats) => {
    const d = stats.p[name];
    return d ? String(d.g) : "0";
  };

  const check = (a, b) => a === b ? "✓" : "✗";

  const legDecided = legacyStats.decided.length;
  const livDecided = liveStats ? liveStats.decided.length : "N/A";
  const legBlue = legacyStats.blueWins;
  const livBlue = liveStats ? liveStats.blueWins : "N/A";
  const legWhite = legacyStats.whiteWins;
  const livWhite = liveStats ? liveStats.whiteWins : "N/A";
  const legSweeps = legacyStats.sweeps;
  const livSweeps = liveStats ? liveStats.sweeps : "N/A";

  const tylerLegacy = statLabel("Tyler");
  const tylerLive = liveStatLabel("Tyler");
  const leeLegacy = statLabel("Lee");
  const leeLive = liveStatLabel("Lee");

  const trackNames = ["Nathan", "Gabe", "Cal", "Wags", "Ryan"];

  ln("| Stat | Hardcoded | Live | Match? |");
  ln("|------|-----------|------|--------|");
  ln(`| Total decided series | ${legDecided} | ${livDecided} | ${liveStats ? check(String(legDecided), String(livDecided)) : "—"} |`);
  ln(`| Blue wins | ${legBlue} | ${livBlue} | ${liveStats ? check(String(legBlue), String(livBlue)) : "—"} |`);
  ln(`| White wins | ${legWhite} | ${livWhite} | ${liveStats ? check(String(legWhite), String(livWhite)) : "—"} |`);
  ln(`| Sweeps (4-0) | ${legSweeps} | ${livSweeps} | ${liveStats ? check(String(legSweeps), String(livSweeps)) : "—"} |`);
  ln(`| Tyler W-L | ${tylerLegacy} | ${tylerLive} | ${liveStats ? check(tylerLegacy, tylerLive) : "—"} |`);
  ln(`| Lee W-L | ${leeLegacy} | ${leeLive} | ${liveStats ? check(leeLegacy, leeLive) : "—"} |`);
  for (const name of trackNames) {
    const legAtt = attendanceLabel(name, legacyStats);
    const livAtt = liveStats ? attendanceLabel(name, liveStats) : "N/A";
    ln(`| ${name} attendance | ${legAtt} | ${livAtt} | ${liveStats ? check(legAtt, livAtt) : "—"} |`);
  }
  ln();

  // ── 7/7 Club Verification ──
  ln("## 7/7 Club Verification");
  ln();

  const clubEntries = [
    { name: "Gabe", day: "Mon 3/23", detail: "Game 1 — three threes and a layup, scoring all 7 points" },
    { name: "Tyler", day: "Fri 3/27", detail: "Game 2 — scored all 7 in game 2 of a 4-0 sweep" },
    { name: "Lee", day: "Fri 5/1", detail: "Pivotal game 5 — three from beyond the arc and a layup, 7/7 from the field" },
  ];

  for (const entry of clubEntries) {
    const liv = liveMap.get(entry.day);
    const leg = legacyMap.get(entry.day);
    const source = liv || leg;
    if (source) {
      const team = source.blue.map(n => n.toLowerCase()).includes(entry.name.toLowerCase()) ? "Blue" : "White";
      const result = source.winner ? `${source.winner} ${source.score || "W"}` : (source.note || "no result");
      ln(`- **${entry.name} ${entry.day}:** ${entry.detail}`);
      ln(`  - ${liv ? "Live" : "Legacy"}: ${entry.name} on ${team}, result: ${result}`);
    } else {
      ln(`- **${entry.name} ${entry.day}:** ${entry.detail}`);
      ln(`  - Session not found in data`);
    }
  }
  ln();

  // ── Tyler Losses Files ──
  ln("## Tyler Losses Files");
  ln();
  ln("Every Tyler loss with Curse Suspects (teammates when Tyler lost):");
  ln();

  const tylerLosses = legacyStats.playerLosses["Tyler"] || [];
  if (tylerLosses.length === 0) {
    ln("Tyler has no recorded losses. The legend holds.");
  } else {
    ln("| Date | Team | Teammates | Score |");
    ln("|------|------|-----------|-------|");
    for (const loss of tylerLosses) {
      ln(`| ${loss.day} | ${loss.team} | ${loss.teammates.join(", ")} | ${loss.score || "?"} |`);
    }
    ln();

    // Curse suspects: teammates present in ALL Tyler losses
    const allLossTeammates = tylerLosses.flatMap(l => l.teammates);
    const freq = {};
    allLossTeammates.forEach(n => freq[n] = (freq[n] || 0) + 1);
    const cursed = Object.entries(freq).filter(([, v]) => v === tylerLosses.length).map(([k]) => k);
    if (cursed.length > 0) {
      ln(`**Curse Suspects:** ${cursed.join(", ")} — present on Tyler's team for every single one of his ${tylerLosses.length} losses.`);
      ln();
    }
  }

  // ── Suspected Sheet Errors ──
  ln("## Suspected Sheet Errors — Please Review Manually");
  ln();

  // Check for common issues
  const suspectedErrors = [];

  // Check for name variations in legacy data
  const allNames = new Set();
  legacySessions.forEach(s => {
    s.blue.forEach(n => allNames.add(n));
    s.white.forEach(n => allNames.add(n));
  });
  if (liveSessions.length > 0) {
    liveSessions.forEach(s => {
      s.blue.forEach(n => allNames.add(n));
      s.white.forEach(n => allNames.add(n));
    });
  }

  // Check for near-duplicate names (case differences, etc.)
  const nameList = [...allNames];
  for (let i = 0; i < nameList.length; i++) {
    for (let j = i + 1; j < nameList.length; j++) {
      const a = nameList[i];
      const b = nameList[j];
      if (a.toLowerCase() === b.toLowerCase() && a !== b) {
        suspectedErrors.push(`Name case mismatch: "${a}" vs "${b}"`);
      }
      // Check Levenshtein distance 1 for misspellings
      if (a.length > 3 && b.length > 3 && Math.abs(a.length - b.length) <= 1) {
        let diffs = 0;
        const maxLen = Math.max(a.length, b.length);
        for (let k = 0; k < maxLen; k++) {
          if ((a[k] || "").toLowerCase() !== (b[k] || "").toLowerCase()) diffs++;
        }
        if (diffs === 1 && a.toLowerCase() !== b.toLowerCase()) {
          suspectedErrors.push(`Possible misspelling: "${a}" vs "${b}"`);
        }
      }
    }
  }

  // Check for "Chadwick" vs "Chad" (known intentional)
  if (allNames.has("Chadwick") && allNames.has("Chad")) {
    suspectedErrors.push('Note: "Chadwick" and "Chad" both appear — confirmed intentional per legacy notes (Chadwick = Chad\'s "distinguished twin")');
  }

  // Check live data for names with residual asterisks or weird chars
  if (liveSessions.length > 0) {
    liveSessions.forEach(s => {
      [...s.blue, ...s.white].forEach(n => {
        if (n.includes("*")) {
          suspectedErrors.push(`[${s.day}] Name contains residual asterisk: "${n}"`);
        }
        if (/[#@!$%^&()_+=\[\]{}|\\<>?]/.test(n)) {
          suspectedErrors.push(`[${s.day}] Name contains unusual character: "${n}"`);
        }
        if (/\d/.test(n) && !/\(KY\)/i.test(n)) {
          suspectedErrors.push(`[${s.day}] Name contains digit: "${n}" — possible annotation leak`);
        }
      });
    });
  }

  if (suspectedErrors.length === 0) {
    ln("No suspected errors found in the data.");
  } else {
    for (const err of suspectedErrors) {
      ln(`- ${err}`);
    }
  }
  ln();

  // ── Parser Warnings ──
  ln("## Parser Warnings");
  ln();

  if (parserWarnings.length === 0) {
    ln("No warnings emitted during parsing.");
  } else {
    for (const w of parserWarnings) {
      ln(`- ${w}`);
    }
  }
  ln();

  // Write the report
  const reportPath = join(__dirname, "validation_report.md");
  const report = lines.join("\n");
  writeFileSync(reportPath, report, "utf-8");
  console.log(`\n📝 Report written to ${reportPath}`);
  console.log(`   Legacy sessions: ${legacySessions.length}`);
  console.log(`   Live sessions: ${liveSessions.length}`);
  if (!fetchFailed && liveSessions.length > 0) {
    const legMap = new Map();
    legacySessions.forEach(s => legMap.set(s.day, s));
    const livMap = new Map();
    liveSessions.forEach(s => livMap.set(s.day, s));
    const allD = new Set([...legMap.keys(), ...livMap.keys()]);
    let disc = 0;
    for (const day of allD) {
      const a = legMap.get(day);
      const b = livMap.get(day);
      if (a && b) {
        if (!rostersMatch(a.blue, b.blue) || !rostersMatch(a.white, b.white) || a.winner !== b.winner || a.score !== b.score) {
          disc++;
        }
      }
    }
    console.log(`   Discrepancies: ${disc}`);
  }
}

main().catch(err => {
  console.error("❌ Validation script failed:", err);
  process.exit(1);
});
