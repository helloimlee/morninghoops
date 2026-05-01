#!/usr/bin/env node
/**
 * reconcile.mjs — Reconcile Excel data with legacy data and produce
 * the canonical session list for Morning Hoops.
 *
 * Excel is the source of truth for: which sessions happened, who played, results.
 * Legacy data supplements team assignments where the Excel lacks asterisks.
 */

import XLSX from "xlsx";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const excelPath = resolve(__dirname, "../src/Morning Hoops 🏀 (5).xlsx");
const legacyPath = resolve(__dirname, "legacy_sessions.json");

// ═══════════════════════════════════════════════════════════
// CONFIG: Week date mappings (column position → day string)
// ═══════════════════════════════════════════════════════════
const WEEK_DATE_MAP = {
  "Week of 32": ["Mon 3/2", "Tue 3/3", "Thu 3/5", "Fri 3/6"],         // 4 cols, skips Wed
  "Week of 39": ["Mon 3/9", "Tue 3/10", "Wed 3/11", "Thu 3/12", "Fri 3/13"],
  "Week of 316": ["Mon 3/16", "Tue 3/17", "Wed 3/18", "Thu 3/19", "Fri 3/20"],
  "Week of 323": ["Mon 3/23", "Tue 3/24", "Wed 3/25", "Thu 3/26", "Fri 3/27"],
  "Week of 330": ["Mon 3/30", "Tue 3/31", "Wed 4/1", "Thu 4/2", "Fri 4/3"],
  "Week of 46": ["Mon 4/6", "Tue 4/7", "Wed 4/8", "Thu 4/9", "Fri 4/10"],
  "Week of 413": ["Mon 4/13", "Tue 4/14", "Wed 4/15", "Thu 4/16", "Fri 4/17"],
  "Week of 420": ["Mon 4/20", "Tue 4/21", "Wed 4/22", "Thu 4/23", "Fri 4/24"],
  "Week of 427": ["Mon 4/27", "Tue 4/28", "Wed 4/29", "Thu 4/30", "Fri 5/1"],
};

// ═══════════════════════════════════════════════════════════
// PLAYER NAME NORMALIZATION
// ═══════════════════════════════════════════════════════════
function normalizeName(raw) {
  let name = raw.trim();

  // Remove trailing asterisk (team marker — handled separately)
  const isBlueMarked = name.endsWith("*");
  name = name.replace(/\*$/, "").trim();

  // Specific normalizations
  if (/^lee\s+eisenbarth$/i.test(name)) name = "Lee";
  if (/^wags\s*#\s*23$/i.test(name)) name = "Wags";
  if (/^no\s+rotation\s+sean$/i.test(name)) name = "Sean";
  if (/^sean\s+aka\s+big\s+dumb\s+bitch$/i.test(name)) name = "Sean";

  // Trim again just in case
  name = name.trim();

  return { name, isBlueMarked };
}

// ═══════════════════════════════════════════════════════════
// NON-PLAYER ENTRY DETECTION
// ═══════════════════════════════════════════════════════════
function isNonPlayerEntry(cellStr) {
  const s = cellStr.trim();
  if (!s) return true;

  // Date serial numbers (all digits, typically 5 digits for Excel dates)
  if (/^\d{4,}$/.test(s)) return true;

  // URLs
  if (/^https?:\/\//i.test(s)) return true;

  // Stats emoji
  if (/^stats?\s*📊?$/i.test(s)) return true;

  // Result text patterns — these go in player cells sometimes
  if (isResultText(s)) return true;

  return false;
}

// ═══════════════════════════════════════════════════════════
// RESULT TEXT DETECTION
// ═══════════════════════════════════════════════════════════
function isResultText(s) {
  const t = s.trim();
  // "Blue 4-2", "White wins 4-3", "Blue Won", "Blue beat that ass", etc.
  if (/^(blue|white)\s+(wins?|won|beat|smacked|swept|blew)/i.test(t)) return true;
  if (/^(blue|white)\s+\d+-\d+$/i.test(t)) return true;
  if (/^no\s*game/i.test(t)) return true;
  if (/^aka\s*no\s*game/i.test(t)) return true;
  if (/^no\s*games/i.test(t)) return true;
  // "White swept the series..."
  if (/^(blue|white)\s+swept/i.test(t)) return true;
  return false;
}

// ═══════════════════════════════════════════════════════════
// RESULT PARSING
// ═══════════════════════════════════════════════════════════
function parseResult(texts) {
  // texts is an array of result-like strings found for a column
  // "Aka No game" overrides everything
  for (const t of texts) {
    if (/^aka\s*no\s*game/i.test(t.trim())) {
      return { winner: null, score: null, noGame: true };
    }
  }

  for (const t of texts) {
    if (/^no\s*game/i.test(t.trim()) || /^no\s*games/i.test(t.trim())) {
      return { winner: null, score: null, noGame: true };
    }
  }

  // Look for scored results first (more specific)
  for (const t of texts) {
    const s = t.trim();
    // "Blue wins 4-3", "Blue 4-2", "White won 4-3", "White wins 4-0"
    const blueScore = s.match(/^blue\s+(?:wins?\s+|won\s+)?(\d+-\d+)/i);
    if (blueScore) return { winner: "blue", score: blueScore[1], noGame: false };

    const whiteScore = s.match(/^white\s+(?:wins?\s+|won\s+)?(\d+-\d+)/i);
    if (whiteScore) return { winner: "white", score: whiteScore[1], noGame: false };
  }

  // Look for verb-based results (no score)
  for (const t of texts) {
    const s = t.trim();
    if (/^blue\s+(beat|smacked|swept|won)/i.test(s)) {
      return { winner: "blue", score: "W", noGame: false };
    }
    if (/^white\s+(beat|smacked|swept|won)/i.test(s)) {
      return { winner: "white", score: "W", noGame: false };
    }
    // "Blue BLEW a 3-0 lead" — means blue LOST (white won)
    if (/^blue\s+blew/i.test(s)) {
      // The score might be in another result text; for now mark white as winner
      return { winner: "white", score: "W", noGame: false };
    }
    if (/^white\s+blew/i.test(s)) {
      return { winner: "blue", score: "W", noGame: false };
    }
  }

  return null; // No result found
}

// ═══════════════════════════════════════════════════════════
// MONTH ASSIGNMENT
// ═══════════════════════════════════════════════════════════
function getMonth(dayStr) {
  const m = dayStr.match(/(\d+)\/(\d+)/);
  if (!m) return "Unknown";
  const month = parseInt(m[1], 10);
  if (month === 3) return "March";
  if (month === 4) return "April";
  if (month === 5) return "May";
  return "Unknown";
}

// ═══════════════════════════════════════════════════════════
// MAIN RECONCILIATION
// ═══════════════════════════════════════════════════════════
console.log("═══════════════════════════════════════════════════════════");
console.log("  MORNING HOOPS RECONCILIATION");
console.log("═══════════════════════════════════════════════════════════\n");

// Read Excel
const buf = readFileSync(excelPath);
const workbook = XLSX.read(buf, { type: "buffer" });
console.log(`Excel sheets: ${JSON.stringify(workbook.SheetNames)}\n`);

// Read legacy
const legacy = JSON.parse(readFileSync(legacyPath, "utf-8"));
const legacyByDay = {};
for (const s of legacy) {
  legacyByDay[s.day] = s;
}
console.log(`Legacy sessions: ${legacy.length}`);
console.log(`Legacy days: ${legacy.map(s => s.day).join(", ")}\n`);

// ═══════════════════════════════════════════════════════════
// PARSE EACH EXCEL SHEET
// ═══════════════════════════════════════════════════════════
const excelSessions = [];
const report = [];

for (const sheetName of workbook.SheetNames) {
  if (sheetName === "Sheet10") continue; // Empty sheet

  const dateMap = WEEK_DATE_MAP[sheetName];
  if (!dateMap) {
    report.push(`⚠️  Unknown sheet "${sheetName}" — skipped`);
    continue;
  }

  const ws = workbook.Sheets[sheetName];
  if (!ws["!ref"]) {
    report.push(`⚠️  Sheet "${sheetName}" is empty — skipped`);
    continue;
  }

  const rows = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: null,
    blankrows: true,
    raw: true,
  });

  const numCols = rows[0] ? rows[0].length : 0;
  report.push(`\n${"─".repeat(70)}`);
  report.push(`SHEET: "${sheetName}" → ${dateMap.length} expected sessions, ${numCols} columns`);
  report.push(`${"─".repeat(70)}`);

  for (let colIdx = 0; colIdx < dateMap.length; colIdx++) {
    const dayStr = dateMap[colIdx];
    const month = getMonth(dayStr);

    // Collect all cell values for this column
    const playerCells = [];
    const resultTexts = [];
    let hasAnyAsterisk = false;

    // Scan rows 1 through min(rows.length, ~15) for player/result data
    const maxScanRow = Math.min(rows.length, 20);
    for (let r = 1; r < maxScanRow; r++) {
      const rawCell = rows[r] && rows[r][colIdx];
      if (rawCell == null) continue;
      const cellStr = String(rawCell).trim();
      if (!cellStr) continue;

      if (isNonPlayerEntry(cellStr)) {
        // Check if it's a result text
        if (isResultText(cellStr)) {
          resultTexts.push(cellStr);
        }
        continue;
      }

      // Check for asterisk
      if (cellStr.endsWith("*") || /\*\s*$/.test(cellStr)) {
        hasAnyAsterisk = true;
      }

      playerCells.push(cellStr);
    }

    // Also specifically scan rows 10-15 for result text that might be in player range
    for (let r = 0; r < maxScanRow; r++) {
      const rawCell = rows[r] && rows[r][colIdx];
      if (rawCell == null) continue;
      const cellStr = String(rawCell).trim();
      if (!cellStr) continue;
      if (isResultText(cellStr) && !resultTexts.includes(cellStr)) {
        resultTexts.push(cellStr);
      }
    }

    // Parse result
    const result = parseResult(resultTexts);
    const isNoGame = result?.noGame === true;

    // Normalize player names and separate blue/white if asterisks present
    const blueFromExcel = [];
    const whiteFromExcel = [];
    const allPlayersFromExcel = [];

    for (const cellStr of playerCells) {
      const { name, isBlueMarked } = normalizeName(cellStr);
      if (!name) continue;

      // Double-check it's not a non-player entry after normalization
      if (isNonPlayerEntry(name)) continue;
      if (/^\d+$/.test(name)) continue;

      allPlayersFromExcel.push(name);
      if (isBlueMarked) {
        blueFromExcel.push(name);
      } else {
        whiteFromExcel.push(name);
      }
    }

    // Determine team source
    let teamSource = "none";
    let blue = [];
    let white = [];
    let winner = result ? result.winner : null;
    let score = result ? result.score : null;

    if (isNoGame || allPlayersFromExcel.length === 0) {
      // No game or no players
      teamSource = "no-game";
      blue = [];
      white = [];
      winner = null;
      score = null;
    } else if (hasAnyAsterisk && blueFromExcel.length > 0) {
      // Excel has asterisks — use them
      teamSource = "excel-asterisks";
      blue = blueFromExcel;
      white = whiteFromExcel;
    } else {
      // No asterisks — look up legacy
      const legacySession = legacyByDay[dayStr];
      if (legacySession && (legacySession.blue.length > 0 || legacySession.white.length > 0)) {
        teamSource = "legacy";
        // Use legacy team assignments but verify against Excel player list
        const excelPlayerSet = new Set(allPlayersFromExcel.map(n => n.toLowerCase()));
        const legacyAllPlayers = [...legacySession.blue, ...legacySession.white];
        const legacyPlayerSet = new Set(legacyAllPlayers.map(n => n.toLowerCase()));

        // Check for players in Excel but not in legacy
        const excelOnly = allPlayersFromExcel.filter(p => !legacyPlayerSet.has(p.toLowerCase()));
        // Check for players in legacy but not in Excel
        const legacyOnly = legacyAllPlayers.filter(p => !excelPlayerSet.has(p.toLowerCase()));

        if (excelOnly.length > 0 || legacyOnly.length > 0) {
          report.push(`  ⚠️  ${dayStr}: Player mismatch!`);
          if (excelOnly.length > 0) report.push(`       Excel-only: ${excelOnly.join(", ")}`);
          if (legacyOnly.length > 0) report.push(`       Legacy-only: ${legacyOnly.join(", ")}`);
        }

        // Use the legacy team assignments
        blue = legacySession.blue;
        white = legacySession.white;
      } else if (legacySession && legacySession.blue.length === 0 && legacySession.white.length === 0) {
        // Legacy says no game but Excel has players — check if result says no game
        if (isNoGame || !result) {
          teamSource = "no-game-with-attendees";
          blue = [];
          white = [];
          winner = null;
          score = null;
        } else {
          // Excel has players AND a result, but legacy says no game — trust Excel
          teamSource = "excel-no-teams";
          blue = [];
          white = allPlayersFromExcel;
          report.push(`  ⚠️  ${dayStr}: Excel has players + result but legacy says no game. Using Excel.`);
        }
      } else {
        // No legacy match — can't determine teams
        teamSource = "excel-no-teams";
        blue = [];
        white = allPlayersFromExcel;
        report.push(`  ⚠️  ${dayStr}: No asterisks and no legacy match. All players listed as white.`);
      }
    }

    // Special handling for sessions where Excel has few players and legacy says no game
    // Thu 4/2 = 4 players, legacy says "No game. Four showed up."
    // Tue 3/10 = 3 players, legacy says "3 showed"
    const legacySession = legacyByDay[dayStr];
    if (legacySession && legacySession.blue.length === 0 && legacySession.white.length === 0
        && allPlayersFromExcel.length > 0 && allPlayersFromExcel.length < 6) {
      // Few players showed up but no game — legacy says so
      teamSource = "no-game-with-attendees";
      blue = [];
      white = [];
      winner = null;
      score = null;
    }

    // Get legacy note if available
    let note = legacySession?.note || undefined;

    // Special result corrections from cross-referencing
    // Thu 3/19: "Blue BLEW a 3-0 lead" — legacy says White 4-3
    if (dayStr === "Thu 3/19" && winner === "white" && score === "W") {
      score = "4-3"; // Legacy has the actual score
    }
    // Fri 3/20: "White swept" — legacy says White 4-0
    if (dayStr === "Fri 3/20" && winner === "white") {
      score = "4-0";
    }

    const session = {
      day: dayStr,
      month,
      blue,
      white,
      winner,
      score,
    };
    if (note) session.note = note;

    report.push(`  ${dayStr}: players=${allPlayersFromExcel.length}, teams=${teamSource}, ` +
      `winner=${winner || "none"}, score=${score || "none"}`);
    if (hasAnyAsterisk) {
      report.push(`    → Blue (asterisk): [${blue.join(", ")}]`);
      report.push(`    → White: [${white.join(", ")}]`);
    }

    excelSessions.push(session);
  }
}

// ═══════════════════════════════════════════════════════════
// CHECK FOR LEGACY-ONLY SESSIONS
// ═══════════════════════════════════════════════════════════
report.push(`\n${"─".repeat(70)}`);
report.push("LEGACY-ONLY SESSIONS (in legacy but not in Excel)");
report.push(`${"─".repeat(70)}`);

const excelDays = new Set(excelSessions.map(s => s.day));
const legacyOnlySessions = [];

for (const ls of legacy) {
  if (!excelDays.has(ls.day)) {
    report.push(`  📌 ${ls.day}: legacy-only — ${ls.blue.length + ls.white.length} players, ` +
      `winner=${ls.winner || "none"}`);
    legacyOnlySessions.push({ ...ls, source: "legacy-only" });
  }
}

// ═══════════════════════════════════════════════════════════
// MERGE: Build final reconciled list
// ═══════════════════════════════════════════════════════════
report.push(`\n${"─".repeat(70)}`);
report.push("EXCEL-ONLY SESSIONS (in Excel but not in legacy)");
report.push(`${"─".repeat(70)}`);

for (const es of excelSessions) {
  if (!legacyByDay[es.day]) {
    report.push(`  📌 ${es.day}: excel-only`);
  }
}

// Combine and sort by date
const allDays = [...excelSessions];

// Add legacy-only sessions (like Fri 5/1)
for (const ls of legacyOnlySessions) {
  allDays.push({
    day: ls.day,
    month: ls.month,
    blue: ls.blue,
    white: ls.white,
    winner: ls.winner,
    score: ls.score,
    note: ls.note,
    _legacyOnly: true,
  });
}

// Sort by actual date
function dayToSortKey(dayStr) {
  const m = dayStr.match(/(\d+)\/(\d+)/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 100 + parseInt(m[2], 10);
}
allDays.sort((a, b) => dayToSortKey(a.day) - dayToSortKey(b.day));

// ═══════════════════════════════════════════════════════════
// RESULT CROSS-REFERENCE
// ═══════════════════════════════════════════════════════════
report.push(`\n${"─".repeat(70)}`);
report.push("RESULT CROSS-REFERENCE (Excel vs Legacy)");
report.push(`${"─".repeat(70)}`);

for (const session of allDays) {
  if (session._legacyOnly) continue;
  const ls = legacyByDay[session.day];
  if (!ls) continue;

  const winMatch = session.winner === ls.winner;
  const scoreMatch = session.score === ls.score;

  if (!winMatch || !scoreMatch) {
    report.push(`  ⚠️  ${session.day}:`);
    if (!winMatch) {
      report.push(`       Winner: Excel=${session.winner || "null"} vs Legacy=${ls.winner || "null"}`);
      // Excel is source of truth — keep Excel result
    }
    if (!scoreMatch) {
      report.push(`       Score:  Excel=${session.score || "null"} vs Legacy=${ls.score || "null"}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════
// FINAL OUTPUT
// ═══════════════════════════════════════════════════════════

// Clean up internal flags
const finalSessions = allDays.map(s => {
  const clean = {
    day: s.day,
    month: s.month,
    blue: s.blue,
    white: s.white,
    winner: s.winner,
    score: s.score,
  };
  if (s.note) clean.note = s.note;
  return clean;
});

report.push(`\n${"═".repeat(70)}`);
report.push(`FINAL RECONCILED SESSIONS: ${finalSessions.length}`);
report.push(`${"═".repeat(70)}`);

for (const s of finalSessions) {
  const noteStr = s.note ? ` | note: "${s.note.substring(0, 50)}..."` : "";
  report.push(`  ${s.day.padEnd(10)} ${s.month.padEnd(6)} ` +
    `B:[${s.blue.join(",")}] W:[${s.white.join(",")}] ` +
    `→ ${s.winner || "no result"} ${s.score || ""}${noteStr}`);
}

// Print report
console.log("\n" + report.join("\n"));

// ═══════════════════════════════════════════════════════════
// WRITE OUTPUT FILES
// ═══════════════════════════════════════════════════════════
const jsonPath = resolve(__dirname, "legacy_sessions.json");
writeFileSync(jsonPath, JSON.stringify(finalSessions, null, 2) + "\n");
console.log(`\n✅ Wrote ${jsonPath}`);

// Generate fallbackData.js
let fbCode = `// ═══════════════════════════════════════════════════════════
// FALLBACK DATA — used when Google Sheet cannot be reached
// This is the legacy hardcoded data, kept as a safety net.
// Once the sheet is properly published and GIDs are filled in,
// the live data will take priority over this fallback.
// ═══════════════════════════════════════════════════════════
export const FALLBACK_SESSIONS = [\n`;

for (let i = 0; i < finalSessions.length; i++) {
  const s = finalSessions[i];
  const parts = [];
  parts.push(`day: ${JSON.stringify(s.day)}`);
  parts.push(`month: ${JSON.stringify(s.month)}`);
  parts.push(`blue: ${JSON.stringify(s.blue)}`);
  parts.push(`white: ${JSON.stringify(s.white)}`);
  parts.push(`winner: ${s.winner ? JSON.stringify(s.winner) : "null"}`);
  parts.push(`score: ${s.score ? JSON.stringify(s.score) : "null"}`);
  if (s.note) parts.push(`note: ${JSON.stringify(s.note)}`);
  fbCode += `  { ${parts.join(", ")} }`;
  if (i < finalSessions.length - 1) fbCode += ",";
  fbCode += "\n";
}

fbCode += "];\n";

const fbPath = resolve(__dirname, "../src/lib/fallbackData.js");
writeFileSync(fbPath, fbCode);
console.log(`✅ Wrote ${fbPath}`);

console.log(`\n🏀 Reconciliation complete. ${finalSessions.length} sessions.`);
