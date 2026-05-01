import Papa from "papaparse";
import { FALLBACK_SESSIONS } from "./fallbackData";

// ═══════════════════════════════════════════════════════════
// CONFIG
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

export { BASE_URL, SHEET_TABS };

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
// ═══════════════════════════════════════════════════════════
export function parseSheet(csvText, monthLabel) {
  if (!csvText || typeof csvText !== "string") return [];

  const parsed = Papa.parse(csvText.trim(), { header: false, skipEmptyLines: false });
  const rows = parsed.data;
  if (!rows || rows.length < 2) return [];

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

  if (columns.length === 0) return [];

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

  return sessions;
}

// ═══════════════════════════════════════════════════════════
// CHRONOLOGICAL SORT HELPER
// ═══════════════════════════════════════════════════════════
function parseDayToDate(dayStr) {
  // "Mon 3/2" → sortable date
  const match = dayStr.match(/(\d{1,2})\/(\d{1,2})/);
  if (!match) return new Date(0);
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  // Assume year 2025 for sorting; only relative order matters
  return new Date(2025, month - 1, day);
}

// ═══════════════════════════════════════════════════════════
// CACHE
// ═══════════════════════════════════════════════════════════
const CACHE_KEY = "morning-hoops-sessions";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedSessions() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL) return data;
    return null;
  } catch {
    return null;
  }
}

function setCachedSessions(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // sessionStorage full or unavailable — ignore
  }
}

// ═══════════════════════════════════════════════════════════
// loadSessions() — ASYNC, SIDE EFFECTS HERE
// ═══════════════════════════════════════════════════════════
export async function loadSessions() {
  // Check cache
  const cached = getCachedSessions();
  if (cached) {
    console.log("Cache hit — returning cached sessions");
    return cached;
  }

  const warnings = [];
  const monthCounts = {};

  // Build URLs and fetch all tabs
  const fetches = SHEET_TABS.map(tab => ({
    tab,
    url: `${BASE_URL}&gid=${tab.gid}`,
  }));

  const results = await Promise.allSettled(
    fetches.map(async ({ tab, url }) => {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${tab.label}`);
      const csvText = await resp.text();
      return { tab, csvText };
    })
  );

  let allSessions = [];
  let succeeded = 0;
  let failed = 0;

  for (const result of results) {
    if (result.status === "fulfilled") {
      succeeded++;
      const { tab, csvText } = result.value;
      try {
        const sessions = parseSheet(csvText, tab.month);
        allSessions = allSessions.concat(sessions);
        for (const s of sessions) {
          monthCounts[s.month] = (monthCounts[s.month] || 0) + 1;
        }
      } catch (err) {
        warnings.push(`Parse error for ${tab.label}: ${err.message}`);
      }
    } else {
      failed++;
      const tab = fetches[results.indexOf(result)].tab;
      const reason = result.reason?.message || String(result.reason);
      console.warn(`⚠️ Failed to fetch tab "${tab.label}": ${reason}`);
      warnings.push(`Fetch failed for ${tab.label}: ${reason}`);
    }
  }

  // Sort all sessions chronologically by actual date
  allSessions.sort((a, b) => parseDayToDate(a.day) - parseDayToDate(b.day));

  // Fallback to static data when live fetch yields nothing
  if (allSessions.length === 0) {
    console.warn("⚠️ No live data fetched — falling back to FALLBACK_SESSIONS");
    return FALLBACK_SESSIONS;
  }

  // Cache
  setCachedSessions(allSessions);

  // Log structured summary
  console.log("📊 Morning Hoops Load Summary", {
    tabsAttempted: SHEET_TABS.length,
    succeeded,
    failed,
    totalSessions: allSessions.length,
    sessionsPerMonth: monthCounts,
    warnings: warnings.length > 0 ? warnings : "none",
  });

  return allSessions;
}
