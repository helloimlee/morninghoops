export function getStats(sessions) {
  const p = {};
  const decided = sessions.filter(s => s.winner);
  const uniquePlayers = new Set();
  const teammates = {};
  const opponents = {};
  const pairRecords = {};
  const playerLosses = {};
  const playerWins = {};

  sessions.forEach(s => {
    const process = (arr, team) => arr.forEach(n => {
      uniquePlayers.add(n);
      if (!p[n]) p[n] = { g: 0, w: 0, l: 0, bt: 0, wt: 0, gw: 0, gl: 0 };
      p[n].g++; p[n][team === "blue" ? "bt" : "wt"]++;
      if (s.winner === "blue") { if (team === "blue") p[n].w++; else p[n].l++; }
      else if (s.winner === "white") { if (team === "white") p[n].w++; else p[n].l++; }
    });
    process(s.blue, "blue"); process(s.white, "white");

    // Parse individual game wins/losses from score (e.g. "4-2")
    if (s.winner && s.score && s.score !== "W") {
      const [winGames, loseGames] = s.score.split("-").map(Number);
      if (!isNaN(winGames) && !isNaN(loseGames)) {
        const blueWon = s.winner === "blue";
        s.blue.forEach(n => {
          p[n].gw += blueWon ? winGames : loseGames;
          p[n].gl += blueWon ? loseGames : winGames;
        });
        s.white.forEach(n => {
          p[n].gw += blueWon ? loseGames : winGames;
          p[n].gl += blueWon ? winGames : loseGames;
        });
      }
    }

    const addPair = (obj, a, b) => { const k = [a,b].sort().join("|||"); obj[k] = (obj[k]||0) + 1; };
    const addPairRec = (a, b, won) => {
      const k = [a,b].sort().join("|||");
      if (!pairRecords[k]) pairRecords[k] = { w: 0, l: 0 };
      if (won) pairRecords[k].w++; else pairRecords[k].l++;
    };
    s.blue.forEach((a,i) => s.blue.forEach((b,j) => { if (i<j) { addPair(teammates,a,b); if (s.winner) addPairRec(a, b, s.winner === "blue"); } }));
    s.white.forEach((a,i) => s.white.forEach((b,j) => { if (i<j) { addPair(teammates,a,b); if (s.winner) addPairRec(a, b, s.winner === "white"); } }));
    s.blue.forEach(a => s.white.forEach(b => addPair(opponents,a,b)));

    if (s.winner) {
      const blueWon = s.winner === "blue";
      s.blue.forEach(n => {
        const entry = { day: s.day, teammates: s.blue.filter(x => x !== n), opponents: s.white, score: s.score };
        if (blueWon) { if (!playerWins[n]) playerWins[n] = []; playerWins[n].push(entry); }
        else { if (!playerLosses[n]) playerLosses[n] = []; playerLosses[n].push(entry); }
      });
      s.white.forEach(n => {
        const entry = { day: s.day, teammates: s.white.filter(x => x !== n), opponents: s.blue, score: s.score };
        if (!blueWon) { if (!playerWins[n]) playerWins[n] = []; playerWins[n].push(entry); }
        else { if (!playerLosses[n]) playerLosses[n] = []; playerLosses[n].push(entry); }
      });
    }
  });

  const playedSessions = sessions.filter(s => s.blue.length || s.white.length);
  const avgPerSession = playedSessions.length > 0 ? (playedSessions.reduce((a,s) => a + s.blue.length + s.white.length, 0) / playedSessions.length).toFixed(1) : "0";

  const topRivals = Object.entries(opponents).sort((a,b) => b[1]-a[1]).slice(0,5).map(([k,v]) => ({ pair: k.split("|||"), count: v }));
  const topTeammates = Object.entries(teammates).sort((a,b) => b[1]-a[1]).slice(0,5).map(([k,v]) => ({ pair: k.split("|||"), count: v }));

  const teammateReports = {};
  uniquePlayers.forEach(name => {
    const entries = Object.entries(pairRecords)
      .filter(([k]) => k.split("|||").includes(name))
      .map(([k, v]) => {
        const partner = k.split("|||").find(x => x !== name);
        const total = v.w + v.l;
        return { partner, w: v.w, l: v.l, total, pct: total > 0 ? v.w / total : 0 };
      })
      .filter(e => e.total >= 3);
    
    if (entries.length === 0) {
      teammateReports[name] = { best: null, worst: null, all: [] };
    } else {
      const best = [...entries].sort((a,b) => b.pct - a.pct || b.total - a.total)[0];
      const worst = [...entries].sort((a,b) => a.pct - b.pct || b.total - a.total)[0];
      teammateReports[name] = { best, worst, all: entries };
    }
  });

  // Top matchups: best-performing teammate pairs (min 3 series)
  const bestPairs = Object.entries(pairRecords)
    .filter(([, v]) => v.w + v.l >= 3)
    .map(([k, v]) => {
      const [a, b] = k.split("|||");
      const total = v.w + v.l;
      return { a, b, w: v.w, l: v.l, total, pct: v.w / total };
    })
    .sort((x, y) => y.pct - x.pct || y.total - x.total)
    .slice(0, 6);

  const worstPairs = Object.entries(pairRecords)
    .filter(([, v]) => v.w + v.l >= 3)
    .map(([k, v]) => {
      const [a, b] = k.split("|||");
      const total = v.w + v.l;
      return { a, b, w: v.w, l: v.l, total, pct: v.w / total };
    })
    .sort((x, y) => x.pct - y.pct || y.total - x.total)
    .slice(0, 6);

  return { p, totalS: sessions.length, uniqueCount: uniquePlayers.size, avgPerSession, topRivals, topTeammates, decided, pairRecords, playerLosses, playerWins, teammateReport: teammateReports, bestPairs, worstPairs };
}

export function groupSessionsByWeek(sessions) {
  const weeks = [];
  let current = null;
  sessions.forEach((s, i) => {
    const parts = s.day.split(' ');
    const dow = parts[0];
    const date = parts[1];
    if (i === 0 || dow === 'Mon') {
      if (current) weeks.push(current);
      current = { weekNum: weeks.length + 1, sessions: [], startDate: date, endDate: date, blueWins: 0, whiteWins: 0 };
    }
    current.sessions.push(s);
    current.endDate = date;
    if (s.winner === 'blue') current.blueWins++;
    if (s.winner === 'white') current.whiteWins++;
  });
  if (current) weeks.push(current);
  return weeks;
}

export function uniquePlayersCount(players) { return Object.keys(players).length; }
