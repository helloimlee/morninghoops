import XLSX from "xlsx";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = resolve(__dirname, "../src/Morning Hoops 🏀 (5).xlsx");

console.log("=== Reading Excel file:", filePath, "===\n");

const buf = readFileSync(filePath);
const workbook = XLSX.read(buf, { type: "buffer" });

console.log("Sheet names:", JSON.stringify(workbook.SheetNames));
console.log("Total sheets:", workbook.SheetNames.length);
console.log("\n" + "=".repeat(80) + "\n");

// ─── RAW DATA DUMP ───
for (const sheetName of workbook.SheetNames) {
  const ws = workbook.Sheets[sheetName];
  const ref = ws["!ref"] || "(empty)";
  console.log(`\n${"─".repeat(80)}`);
  console.log(`SHEET: "${sheetName}"   |   Range: ${ref}`);
  console.log(`${"─".repeat(80)}`);

  if (!ws["!ref"]) {
    console.log("  (sheet is empty)\n");
    continue;
  }

  // Convert to array-of-arrays, keeping nulls
  const data = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: null,
    blankrows: true,
    raw: true,
  });

  const numRows = data.length;
  const numCols = data.reduce((max, row) => Math.max(max, row.length), 0);
  console.log(`Rows: ${numRows}   Cols: ${numCols}\n`);

  for (let r = 0; r < data.length; r++) {
    // Pad row to full width so every row shows same number of columns
    const row = data[r];
    while (row.length < numCols) row.push(null);
    console.log(`  Row ${String(r).padStart(2, " ")}: ${JSON.stringify(row)}`);
  }
  console.log();
}

// ─── PARSED SESSION FORMAT ───
console.log("\n" + "=".repeat(80));
console.log("PARSED SESSIONS (using sheetLoader logic)");
console.log("=".repeat(80) + "\n");

const SKIP_RE = /^(stats?|https?:\/\/|win|wins|beat|smacked|swept|blew|blue\s|white\s|no\s*game|aka\s*no\s*game|no\s*games)$/i;
const SKIP_CONTAINS_RE = /^https?:\/\//i;
const RESULT_KEYWORDS_RE = /win|wins|beat|smacked|swept|blew|no\s*game|aka\s*no\s*game|no\s*games/i;

const DAY_ABBREV_MAP = { tues: "Tue", thurs: "Thu" };
const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Month mapping from sheet name
function guessMonth(sheetName) {
  const m = sheetName.match(/(\d{1,2})\/(\d{1,2})/);
  if (!m) return sheetName;
  const month = parseInt(m[1], 10);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return months[month - 1] || sheetName;
}

function parseSheetData(rows, monthLabel) {
  if (!rows || rows.length < 2) return [];

  const headerRow = rows[0];
  const columns = [];

  for (let col = 0; col < headerRow.length; col++) {
    const rawVal = headerRow[col];
    const raw = rawVal != null ? String(rawVal).trim() : "";
    if (!raw) continue;

    let dayLabel = null;

    // Handle Excel date serial numbers
    if (typeof rawVal === "number" && rawVal > 40000) {
      // Excel date serial → JS Date
      const dateObj = new Date((rawVal - 25569) * 86400 * 1000);
      if (!isNaN(dateObj.getTime())) {
        const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        dayLabel = `${weekday} ${month}/${day}`;
      }
    }

    if (!dayLabel) {
      const dateObj = new Date(raw);
      if (!isNaN(dateObj.getTime()) && raw.length > 2) {
        const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        dayLabel = `${weekday} ${month}/${day}`;
      } else {
        let normalized = raw;
        for (const [from, to] of Object.entries(DAY_ABBREV_MAP)) {
          const re = new RegExp(`\\b${from}\\b`, "i");
          normalized = normalized.replace(re, to);
        }
        const match = normalized.match(/^(\w{3})\s+(\d{1,2}\/\d{1,2})/);
        if (match) {
          dayLabel = `${match[1]} ${match[2]}`;
        } else {
          const dateMatch = normalized.match(/(\d{1,2})\/(\d{1,2})/);
          if (dateMatch) {
            dayLabel = normalized;
          }
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

    const maxPlayerRow = Math.min(14, rows.length);
    for (let r = 1; r < maxPlayerRow; r++) {
      const cell = (rows[r] && rows[r][col] != null ? String(rows[r][col]) : "").trim();
      if (!cell) continue;
      if (SKIP_RE.test(cell)) continue;
      if (SKIP_CONTAINS_RE.test(cell)) continue;
      if (RESULT_KEYWORDS_RE.test(cell)) continue;

      if (cell.endsWith("*")) {
        const name = cell.slice(0, -1).trim();
        if (name) bluePlayers.push(name);
      } else {
        whitePlayers.push(cell);
      }
    }

    const resultSearchStart = Math.min(10, rows.length - 1);
    const resultSearchEnd = Math.min(15, rows.length);
    for (let r = resultSearchStart; r < resultSearchEnd; r++) {
      const cell = (rows[r] && rows[r][col] != null ? String(rows[r][col]) : "").trim();
      if (cell && RESULT_KEYWORDS_RE.test(cell)) {
        if (!resultText || /\d+-\d+/.test(cell)) {
          resultText = cell;
        }
      }
    }

    if (!resultText) {
      for (let r = 1; r < rows.length; r++) {
        const cell = (rows[r] && rows[r][col] != null ? String(rows[r][col]) : "").trim();
        if (cell && RESULT_KEYWORDS_RE.test(cell)) {
          if (!resultText || /\d+-\d+/.test(cell)) {
            resultText = cell;
          }
        }
      }
    }

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

  sessions.sort((a, b) => {
    const dayA = a.day.split(" ")[0];
    const dayB = b.day.split(" ")[0];
    return DAY_ORDER.indexOf(dayA) - DAY_ORDER.indexOf(dayB);
  });

  return sessions;
}

let allSessions = [];

for (const sheetName of workbook.SheetNames) {
  const ws = workbook.Sheets[sheetName];
  if (!ws["!ref"]) continue;

  const data = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: null,
    blankrows: true,
    raw: true,
  });

  const month = guessMonth(sheetName);
  const sessions = parseSheetData(data, month);

  console.log(`--- Sheet "${sheetName}" → ${sessions.length} sessions (month: ${month}) ---`);
  for (const s of sessions) {
    console.log(JSON.stringify(s));
  }
  console.log();
  allSessions = allSessions.concat(sessions);
}

console.log(`\nTOTAL PARSED SESSIONS: ${allSessions.length}`);
