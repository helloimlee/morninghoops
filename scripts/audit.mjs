// ============================================
// COMPREHENSIVE MORNING HOOPS DATA AUDIT
// ============================================

import { SESSIONS } from '../src/data/sessions.js';
import { MONTHS } from '../src/data/months.js';
import { CORRELATIONS } from '../src/data/players.js';
import { getStats } from '../src/lib/stats.js';
import { FALLBACK_SESSIONS } from '../src/lib/fallbackData.js';
import { readFileSync } from 'fs';

const legacy = JSON.parse(readFileSync('./scripts/legacy_sessions.json', 'utf8'));

console.log("=== PART 1: RAW DATA INTEGRITY ===\n");

// 1A. Date validation and chronological order
console.log("--- 1A. Date Validation ---");
const monthOrder = { "March": 3, "April": 4, "May": 5 };
let prevDate = null;
let dateIssues = [];
SESSIONS.forEach((s, i) => {
  const parts = s.day.split(' ')[1]; // e.g. "3/2"
  const [m, d] = parts.split('/').map(Number);
  const dateNum = m * 100 + d;
  if (prevDate !== null && dateNum < prevDate) {
    dateIssues.push(`Session ${i}: ${s.day} is out of chronological order (prev was ${SESSIONS[i-1].day})`);
  }
  prevDate = dateNum;
  
  // Validate month field matches date
  const expectedMonth = m === 3 ? "March" : m === 4 ? "April" : m === 5 ? "May" : "Unknown";
  if (s.month !== expectedMonth) {
    dateIssues.push(`Session ${i} (${s.day}): month field is "${s.month}" but date suggests "${expectedMonth}"`);
  }
});
if (dateIssues.length === 0) console.log("  ✅ All dates valid and in chronological order");
else dateIssues.forEach(i => console.log("  ❌ " + i));

// 1B. Player name validation
console.log("\n--- 1B. Player Name Cross-Reference ---");
const playerNames = new Set(CORRELATIONS.map(c => c.name));
const sessionPlayers = new Set();
SESSIONS.forEach(s => {
  [...s.blue, ...s.white].forEach(n => sessionPlayers.add(n));
});

const inSessionsNotPlayers = [...sessionPlayers].filter(n => !playerNames.has(n));
const inPlayersNotSessions = [...playerNames].filter(n => !sessionPlayers.has(n));

if (inSessionsNotPlayers.length > 0) {
  console.log("  ❌ Players in sessions.js but NOT in players.js:", inSessionsNotPlayers);
} else {
  console.log("  ✅ All session players exist in players.js");
}

if (inPlayersNotSessions.length > 0) {
  console.log("  ⚠️  Players in players.js but NEVER in any session:", inPlayersNotSessions);
} else {
  console.log("  ✅ All players.js entries appear in sessions");
}

// Check for near-duplicates
console.log("\n--- 1C. Near-Duplicate Name Check ---");
const allNames = [...sessionPlayers];
let nearDupFound = false;
for (let i = 0; i < allNames.length; i++) {
  for (let j = i+1; j < allNames.length; j++) {
    if (allNames[i].toLowerCase() === allNames[j].toLowerCase() && allNames[i] !== allNames[j]) {
      console.log(`  ⚠️  Case mismatch: "${allNames[i]}" vs "${allNames[j]}"`);
      nearDupFound = true;
    }
  }
}
if (!nearDupFound) console.log("  ✅ No case-mismatched duplicates found");

// 1D. Winner/score validation
console.log("\n--- 1D. Winner/Score Validation ---");
let wsIssues = [];
SESSIONS.forEach((s, i) => {
  // Winner must be "blue", "white", or null
  if (s.winner !== "blue" && s.winner !== "white" && s.winner !== null) {
    wsIssues.push(`Session ${i} (${s.day}): invalid winner "${s.winner}"`);
  }
  
  // Score format check
  if (s.score !== null && s.score !== "W") {
    const match = s.score.match(/^(\d+)-(\d+)$/);
    if (!match) {
      wsIssues.push(`Session ${i} (${s.day}): invalid score format "${s.score}"`);
    } else {
      const [, a, b] = match;
      if (Number(a) < Number(b)) {
        wsIssues.push(`Session ${i} (${s.day}): score "${s.score}" — first number should be winner's (higher) score`);
      }
    }
  }
  
  // Winner without score or score without winner
  if (s.winner && !s.score) {
    wsIssues.push(`Session ${i} (${s.day}): has winner "${s.winner}" but no score`);
  }
  if (!s.winner && s.score) {
    wsIssues.push(`Session ${i} (${s.day}): has score "${s.score}" but no winner`);
  }
  
  // Winner set but teams empty
  if (s.winner && s.blue.length === 0 && s.white.length === 0) {
    wsIssues.push(`Session ${i} (${s.day}): has winner but both teams are empty`);
  }
});
if (wsIssues.length === 0) console.log("  ✅ All winner/score fields valid");
else wsIssues.forEach(i => console.log("  ❌ " + i));

// 1E. Duplicate players (same player on both teams)
console.log("\n--- 1E. Duplicate Player Check ---");
let dupIssues = [];
SESSIONS.forEach((s, i) => {
  const overlap = s.blue.filter(n => s.white.includes(n));
  if (overlap.length > 0) {
    dupIssues.push(`Session ${i} (${s.day}): players on BOTH teams: ${overlap.join(', ')}`);
  }
  // Check for duplicates within a single team
  const blueDups = s.blue.filter((n, idx) => s.blue.indexOf(n) !== idx);
  const whiteDups = s.white.filter((n, idx) => s.white.indexOf(n) !== idx);
  if (blueDups.length) dupIssues.push(`Session ${i} (${s.day}): duplicate on blue: ${blueDups}`);
  if (whiteDups.length) dupIssues.push(`Session ${i} (${s.day}): duplicate on white: ${whiteDups}`);
});
if (dupIssues.length === 0) console.log("  ✅ No duplicate players found");
else dupIssues.forEach(i => console.log("  ❌ " + i));

// 1F. Team size analysis
console.log("\n--- 1F. Team Size Analysis ---");
let sizeIssues = [];
SESSIONS.forEach((s, i) => {
  if (s.blue.length === 0 && s.white.length === 0) return; // no-game session
  const diff = Math.abs(s.blue.length - s.white.length);
  if (diff > 1) {
    sizeIssues.push(`Session ${i} (${s.day}): team size imbalance — Blue: ${s.blue.length}, White: ${s.white.length} (diff: ${diff})`);
  }
});
if (sizeIssues.length === 0) console.log("  ✅ All team sizes balanced (≤1 difference)");
else sizeIssues.forEach(i => console.log("  ⚠️  " + i));

// 1G. Month metadata validation
console.log("\n--- 1G. Month Metadata Validation ---");
const sessionsByMonth = {};
SESSIONS.forEach(s => {
  if (!sessionsByMonth[s.month]) sessionsByMonth[s.month] = [];
  sessionsByMonth[s.month].push(s);
});

const monthIdsFromData = Object.keys(sessionsByMonth);
const monthIdsFromMeta = MONTHS.map(m => m.label);

let monthIssues = [];
monthIdsFromData.forEach(m => {
  if (!monthIdsFromMeta.includes(m)) {
    monthIssues.push(`Month "${m}" exists in sessions but NOT in months.js`);
  }
});
monthIdsFromMeta.forEach(m => {
  if (!monthIdsFromData.includes(m)) {
    monthIssues.push(`Month "${m}" exists in months.js but NOT in sessions`);
  }
});
if (monthIssues.length === 0) console.log("  ✅ All months referenced in sessions exist in months.js");
else monthIssues.forEach(i => console.log("  ❌ " + i));

// Session count per month
Object.entries(sessionsByMonth).forEach(([month, sessions]) => {
  console.log(`  ${month}: ${sessions.length} total sessions, ${sessions.filter(s => s.winner).length} decided`);
});

// Note: MONTHS doesn't have a sessions count field, so skip that check
console.log("  ℹ️  months.js does NOT contain session count fields — no count comparison possible");

console.log("\n=== PART 2: STATS COMPUTATION VERIFICATION ===\n");

const stats = getStats(SESSIONS);

// 2A. Manual win/loss count for specific players
console.log("--- 2A. Manual Win/Loss Verification ---");
const testPlayers = ["Nathan", "Tyler", "Lee", "Mike", "Cal"];

testPlayers.forEach(name => {
  let manual = { g: 0, w: 0, l: 0, bt: 0, wt: 0, gw: 0, gl: 0 };
  
  SESSIONS.forEach(s => {
    const onBlue = s.blue.includes(name);
    const onWhite = s.white.includes(name);
    if (!onBlue && !onWhite) return;
    
    manual.g++;
    if (onBlue) manual.bt++;
    if (onWhite) manual.wt++;
    
    if (s.winner === "blue") {
      if (onBlue) manual.w++;
      else manual.l++;
    } else if (s.winner === "white") {
      if (onWhite) manual.w++;
      else manual.l++;
    }
    
    // Game-level
    if (s.winner && s.score && s.score !== "W") {
      const [winG, loseG] = s.score.split("-").map(Number);
      if (!isNaN(winG) && !isNaN(loseG)) {
        const blueWon = s.winner === "blue";
        if (onBlue) {
          manual.gw += blueWon ? winG : loseG;
          manual.gl += blueWon ? loseG : winG;
        }
        if (onWhite) {
          manual.gw += blueWon ? loseG : winG;
          manual.gl += blueWon ? winG : loseG;
        }
      }
    }
  });
  
  const computed = stats.p[name];
  const match = computed.g === manual.g && computed.w === manual.w && computed.l === manual.l 
    && computed.bt === manual.bt && computed.wt === manual.wt
    && computed.gw === manual.gw && computed.gl === manual.gl;
  
  const status = match ? "✅" : "❌";
  console.log(`  ${status} ${name}: computed(g=${computed.g} w=${computed.w} l=${computed.l} bt=${computed.bt} wt=${computed.wt} gw=${computed.gw} gl=${computed.gl}) vs manual(g=${manual.g} w=${manual.w} l=${manual.l} bt=${manual.bt} wt=${manual.wt} gw=${manual.gw} gl=${manual.gl})`);
});

// 2B. Decided sessions count
console.log("\n--- 2B. Decided Sessions Count ---");
const manualDecided = SESSIONS.filter(s => s.winner).length;
console.log(`  Computed: ${stats.decided.length}, Manual: ${manualDecided} ${stats.decided.length === manualDecided ? "✅" : "❌"}`);

// Total sessions
console.log(`  Total sessions: ${stats.totalS} vs ${SESSIONS.length} ${stats.totalS === SESSIONS.length ? "✅" : "❌"}`);

// Blue vs White wins
const blueWins = SESSIONS.filter(s => s.winner === "blue").length;
const whiteWins = SESSIONS.filter(s => s.winner === "white").length;
console.log(`  Blue wins: ${blueWins}, White wins: ${whiteWins}, Total decided: ${blueWins + whiteWins}`);

// 2C. Pair Records verification
console.log("\n--- 2C. Pair Records Verification ---");
const pairTests = [["Nathan", "Cal"], ["Lee", "Tyler"], ["Nathan", "Lee"]];

pairTests.forEach(([a, b]) => {
  let manualTW = 0, manualTL = 0;
  
  SESSIONS.forEach(s => {
    if (!s.winner) return;
    const aOnBlue = s.blue.includes(a);
    const aOnWhite = s.white.includes(a);
    const bOnBlue = s.blue.includes(b);
    const bOnWhite = s.white.includes(b);
    
    // Teammates: both on same team
    if ((aOnBlue && bOnBlue) || (aOnWhite && bOnWhite)) {
      const sameTeam = aOnBlue && bOnBlue ? "blue" : "white";
      if (s.winner === sameTeam) manualTW++;
      else manualTL++;
    }
  });
  
  const k = [a, b].sort().join("|||");
  const rec = stats.pairRecords[k];
  if (rec) {
    const match = rec.w === manualTW && rec.l === manualTL;
    console.log(`  ${match ? "✅" : "❌"} ${a}+${b} as teammates: computed(w=${rec.w} l=${rec.l}) vs manual(w=${manualTW} l=${manualTL})`);
  } else {
    console.log(`  ⚠️  ${a}+${b}: no pair record found`);
  }
});

// 2D. Check bw/ww counters
console.log("\n--- 2D. Blue-Win / White-Win Counter Logic Check ---");
const testBWWW = "Nathan";
let manualBW = 0, manualWW = 0;
SESSIONS.forEach(s => {
  if (!s.blue.includes(testBWWW) && !s.white.includes(testBWWW)) return;
  if (s.winner === "blue") manualBW++;
  if (s.winner === "white") manualWW++;
});
const compBW = stats.p[testBWWW].bw;
const compWW = stats.p[testBWWW].ww;
console.log(`  ${testBWWW}: computed(bw=${compBW} ww=${compWW}) vs manual(bw=${manualBW} ww=${manualWW}) ${compBW === manualBW && compWW === manualWW ? "✅" : "❌"}`);
console.log(`  NOTE: bw/ww count "blue/white wins while player was present" — NOT "player wins on blue/white"`);

// 2E. Edge cases
console.log("\n--- 2E. Edge Cases ---");
const undecidedOnlyCheck = [...sessionPlayers].filter(name => {
  const decided = SESSIONS.filter(s => s.winner && (s.blue.includes(name) || s.white.includes(name)));
  return decided.length === 0;
});
console.log(`  Players in only undecided sessions: ${undecidedOnlyCheck.length > 0 ? undecidedOnlyCheck.join(', ') : 'None'}`);

const singleSession = [...sessionPlayers].filter(name => {
  const count = SESSIONS.filter(s => s.blue.includes(name) || s.white.includes(name)).length;
  return count === 1;
});
console.log(`  Single-session players: ${singleSession.join(', ')}`);

const wScoreSessions = SESSIONS.filter(s => s.score === "W");
console.log(`  Sessions with score "W" (no game-level data): ${wScoreSessions.length}`);
wScoreSessions.forEach(s => console.log(`    - ${s.day}`));

// 2F. Streak computation check
console.log("\n--- 2F. Streak Computation ---");
console.log("  ⚠️  stats.js does NOT contain any streak computation logic.");

// 2G. Game-level stats for "W" sessions
console.log("\n--- 2G. Game-Level Stats for 'W' Sessions ---");
console.log("  Sessions with score='W' do NOT contribute to gw/gl game-level stats.");
const wSessionPlayers = {};
wScoreSessions.forEach(s => {
  [...s.blue, ...s.white].forEach(n => {
    if (!wSessionPlayers[n]) wSessionPlayers[n] = 0;
    wSessionPlayers[n]++;
  });
});
console.log("  Players affected:", Object.entries(wSessionPlayers).map(([n,c]) => `${n}(${c})`).join(', '));

// 2H. Undecided sessions with rosters (Thu 3/12)
console.log("\n--- 2H. Undecided Sessions WITH Rosters ---");
SESSIONS.forEach((s, i) => {
  if (!s.winner && (s.blue.length > 0 || s.white.length > 0)) {
    console.log(`  ⚠️  Session ${i} (${s.day}): has rosters (Blue: ${s.blue.length}, White: ${s.white.length}) but no winner — counts toward 'g' but NOT 'w' or 'l'`);
  }
});

console.log("\n=== PART 3: CROSS-REFERENCE VALIDATION ===\n");

// 3A. sessions.js vs fallbackData.js
console.log("--- 3A. sessions.js vs fallbackData.js ---");
let fbDiffs = [];
if (SESSIONS.length !== FALLBACK_SESSIONS.length) {
  fbDiffs.push(`Length mismatch: SESSIONS=${SESSIONS.length}, FALLBACK=${FALLBACK_SESSIONS.length}`);
}
const minLen = Math.min(SESSIONS.length, FALLBACK_SESSIONS.length);
for (let i = 0; i < minLen; i++) {
  const a = SESSIONS[i];
  const b = FALLBACK_SESSIONS[i];
  
  if (a.day !== b.day) fbDiffs.push(`[${i}] day: "${a.day}" vs "${b.day}"`);
  if (a.month !== b.month) fbDiffs.push(`[${i}] month: "${a.month}" vs "${b.month}"`);
  if (a.winner !== b.winner) fbDiffs.push(`[${i}] (${a.day}) winner: "${a.winner}" vs "${b.winner}"`);
  if (a.score !== b.score) fbDiffs.push(`[${i}] (${a.day}) score: "${a.score}" vs "${b.score}"`);
  if (JSON.stringify(a.blue) !== JSON.stringify(b.blue)) fbDiffs.push(`[${i}] (${a.day}) blue: ${JSON.stringify(a.blue)} vs ${JSON.stringify(b.blue)}`);
  if (JSON.stringify(a.white) !== JSON.stringify(b.white)) fbDiffs.push(`[${i}] (${a.day}) white: ${JSON.stringify(a.white)} vs ${JSON.stringify(b.white)}`);
  if ((a.note || "") !== (b.note || "")) fbDiffs.push(`[${i}] (${a.day}) note differs`);
}

if (fbDiffs.length === 0) {
  console.log("  ✅ sessions.js and fallbackData.js are IDENTICAL (structurally)");
} else {
  console.log(`  ❌ Found ${fbDiffs.length} differences between sessions.js and fallbackData.js:`);
  fbDiffs.forEach(d => console.log("    " + d));
}

// 3B. sessions.js vs legacy_sessions.json
console.log("\n--- 3B. sessions.js vs legacy_sessions.json ---");
let legDiffs = [];
if (SESSIONS.length !== legacy.length) {
  legDiffs.push(`Length mismatch: SESSIONS=${SESSIONS.length}, legacy=${legacy.length}`);
}
const minLen2 = Math.min(SESSIONS.length, legacy.length);
for (let i = 0; i < minLen2; i++) {
  const a = SESSIONS[i];
  const b = legacy[i];
  
  if (a.day !== b.day) legDiffs.push(`[${i}] day: "${a.day}" vs "${b.day}"`);
  if (a.month !== b.month) legDiffs.push(`[${i}] month: "${a.month}" vs "${b.month}"`);
  if (a.winner !== b.winner) legDiffs.push(`[${i}] (${a.day}) winner: "${a.winner}" vs "${b.winner}"`);
  if (a.score !== b.score) legDiffs.push(`[${i}] (${a.day}) score: "${a.score}" vs "${b.score}"`);
  if (JSON.stringify(a.blue) !== JSON.stringify(b.blue)) legDiffs.push(`[${i}] (${a.day}) blue: ${JSON.stringify(a.blue)} vs ${JSON.stringify(b.blue)}`);
  if (JSON.stringify(a.white) !== JSON.stringify(b.white)) legDiffs.push(`[${i}] (${a.day}) white: ${JSON.stringify(a.white)} vs ${JSON.stringify(b.white)}`);
  if ((a.note || "") !== (b.note || "")) legDiffs.push(`[${i}] (${a.day}) note differs`);
}

if (legDiffs.length === 0) {
  console.log("  ✅ sessions.js and legacy_sessions.json are IDENTICAL");
} else {
  console.log(`  Found ${legDiffs.length} differences between sessions.js and legacy_sessions.json:`);
  legDiffs.forEach(d => console.log("    " + d));
}

// 3C. Validation report checks
console.log("\n--- 3C. Validation Report Cross-Check ---");
console.log("  Report says: Total decided=46, Blue wins=29, White wins=17");
console.log(`  Our computation: Total decided=${blueWins+whiteWins}, Blue wins=${blueWins}, White wins=${whiteWins}`);
console.log(`  Match: ${blueWins === 29 && whiteWins === 17 ? "✅" : "❌"}`);

const reportChecks = [
  { name: "Tyler", expectedW: 17, expectedL: 9 },
  { name: "Lee", expectedW: 17, expectedL: 21 },
];
reportChecks.forEach(({ name, expectedW, expectedL }) => {
  const p = stats.p[name];
  const match = p.w === expectedW && p.l === expectedL;
  console.log(`  ${match ? "✅" : "❌"} ${name}: report(${expectedW}-${expectedL}), computed(${p.w}-${p.l})`);
});

const attendanceChecks = [
  { name: "Nathan", expected: 47 },
  { name: "Gabe", expected: 40 },
  { name: "Cal", expected: 33 },
  { name: "Wags", expected: 29 },
  { name: "Ryan", expected: 40 },
];
attendanceChecks.forEach(({ name, expected }) => {
  const p = stats.p[name];
  const match = p.g === expected;
  console.log(`  ${match ? "✅" : "❌"} ${name} attendance: report(${expected}), computed(${p.g})`);
});

const sweeps = SESSIONS.filter(s => s.score === "4-0");
console.log(`  Sweeps (4-0): report says 8, actual count: ${sweeps.length} ${sweeps.length === 8 ? "✅" : "❌"}`);

// 3D. Player bio stats vs computed
console.log("\n--- 3D. Player Bio Stats vs Computed Stats ---");
const bioChecks = [
  { name: "Nathan", bioRecord: "29-17" },
  { name: "Tyler", bioRecord: "17-9" },
  { name: "Gabe", bioRecord: "22-17" },
  { name: "Cal", bioRecord: "24-9" },
  { name: "Wags", bioRecord: "16-12" },
  { name: "Ryan", bioRecord: "19-20" },
  { name: "Jared", bioRecord: "13-18" },
  { name: "Chad", bioRecord: "12-14" },
  { name: "Kyle", bioRecord: "9-12" },
  { name: "Sean", bioRecord: "8-12" },
  { name: "Mike", bioRecord: "7-18" },
  { name: "Mitch", bioRecord: "1-4" },
  { name: "Lee", bioRecord: "17-21" },
  { name: "Cody", bioRecord: "4-7" },
];
bioChecks.forEach(({ name, bioRecord }) => {
  const p = stats.p[name];
  const computed = `${p.w}-${p.l}`;
  const match = computed === bioRecord;
  console.log(`  ${match ? "✅" : "❌"} ${name}: bio says ${bioRecord}, computed ${computed}`);
});

// Single-appearance players
console.log("\n--- 3E. One-Time Player Verification ---");
["Dane", "Phil", "Chadwick", "Tomcat (KY)", "Kyle M (KY)"].forEach(name => {
  const p = stats.p[name];
  if (p) {
    console.log(`  ${name}: g=${p.g} w=${p.w} l=${p.l} bt=${p.bt} wt=${p.wt}`);
  } else {
    console.log(`  ❌ ${name}: NOT found in stats`);
  }
});

// Tyler losses
console.log("\n--- 3F. Tyler Losses Verification ---");
const tylerLosses = [];
SESSIONS.forEach(s => {
  if (!s.winner) return;
  const onBlue = s.blue.includes("Tyler");
  const onWhite = s.white.includes("Tyler");
  if (!onBlue && !onWhite) return;
  const team = onBlue ? "blue" : "white";
  if (s.winner !== team) {
    tylerLosses.push({ day: s.day, team, teammates: (team === "blue" ? s.blue : s.white).filter(n => n !== "Tyler"), score: s.score });
  }
});
console.log(`  Tyler has ${tylerLosses.length} losses:`);
tylerLosses.forEach(l => console.log(`    ${l.day} on ${l.team} with [${l.teammates.join(', ')}] score: ${l.score}`));

// Validation report says 9 Tyler losses
console.log(`  Validation report lists 9 Tyler losses. Computed: ${tylerLosses.length} ${tylerLosses.length === 9 ? "✅" : "❌"}`);

console.log("\n=== AUDIT COMPLETE ===");
