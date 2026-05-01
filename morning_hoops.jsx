import { useState, useMemo, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
// SOURCE OF TRUTH: Morning_Hoops____3_.xlsx (verified cell colors)
// 7-game series, played by 1s and 2s
// Blue codes: FF4A86E8, FF3C78D8, FF0000FF, FF3D85C6, FF6D9EEB
// ═══════════════════════════════════════════════════════════
const SESSIONS = [
  // MARCH
  { day: "Mon 3/2",  month: "March", blue: ["Nathan","Ryan","Cal","Lee"], white: ["Chad","Wags","Sean","Gabe"], winner: "white", score: "4-3" },
  { day: "Tue 3/3",  month: "March", blue: ["Nathan","Wags","Cody","Ryan","Lee"], white: ["Chad","Sean","Gabe","Kyle","Jared"], winner: "blue", score: "W", note: "Blue opened the league. No mercy, no memories." },
  { day: "Thu 3/5",  month: "March", blue: ["Nathan","Jared","Sean","Ryan"], white: ["Wags","Mike","Gabe","Lee"], winner: "blue", score: "W", note: "Blue again. The pattern was forming before anyone noticed." },
  { day: "Fri 3/6",  month: "March", blue: ["Nathan","Mike","Gabe","Cal","Lee"], white: ["Chad","Wags","Sean","Tyler","Ryan"], winner: "white", score: "4-3" },
  { day: "Mon 3/9",  month: "March", blue: ["Nathan","Wags","Sean","Lee"], white: ["Jared","Cody","Gabe","Kyle"], winner: "blue", score: "W" },
  { day: "Tue 3/10", month: "March", blue: [], white: [], winner: null, score: null, note: "3 showed (Sean, Lee, Wags). That's a carpool, not a game." },
  { day: "Wed 3/11", month: "March", blue: ["Nathan","Jared","Chad","Lee"], white: ["Gabe","Wags","Sean","Cal"], winner: "white", score: "4-2" },
  { day: "Thu 3/12", month: "March", blue: ["Nathan","Gabe","Wags","Ryan"], white: ["Chad","Sean","Lee","Tyler"], winner: null, score: null, note: "No result recorded. Lost to history." },
  { day: "Fri 3/13", month: "March", blue: ["Nathan","Gabe","Tyler","Kyle","Lee"], white: ["Jared","Chad","Wags","Sean","Ryan"], winner: "blue", score: "4-2" },
  { day: "Mon 3/16", month: "March", blue: ["Kyle","Ryan","Wags","Gabe"], white: ["Nathan","Lee","Sean","Jared"], winner: "blue", score: "4-3" },
  { day: "Tue 3/17", month: "March", blue: ["Nathan","Gabe","Wags","Cal"], white: ["Sean","Cody","Ryan","Phil"], winner: "blue", score: "4-2", note: "Phil debuted. Phil lost. Phil never returned." },
  { day: "Wed 3/18", month: "March", blue: ["Tomcat (KY)","Ryan","Gabe","Kyle M (KY)","Sean"], white: ["Nathan","Cal","Lee","Jared","Tyler"], winner: "white", score: "4-1", note: "Kentucky visitors. Cal on White = cheat code." },
  { day: "Thu 3/19", month: "March", blue: ["Nathan","Wags","Lee","Cody"], white: ["Gabe","Sean","Mike","Ryan"], winner: "white", score: "4-3", note: "Blue was up 3-0. Then lost four straight. A genuine crime scene." },
  { day: "Fri 3/20", month: "March", blue: ["Lee","Jared","Sean","Mike"], white: ["Nathan","Kyle","Ryan","Tyler"], winner: "white", score: "4-0", note: "First sweep in Morning Hoops history. Blue got 1 back in the in-season tourney, which 'really matters.'" },
  { day: "Mon 3/23", month: "March", blue: ["Nathan","Jared","Gabe","Cal"], white: ["Kyle","Ryan","Lee","Chad"], winner: "blue", score: "4-3", note: "Gabe went 7/7 in game 1: three 3s and a layup. Every point." },
  { day: "Tue 3/24", month: "March", blue: ["Chad","Ryan","Gabe","Jared"], white: ["Nathan","Lee","Wags","Cody"], winner: "blue", score: "4-1" },
  { day: "Wed 3/25", month: "March", blue: ["Ryan","Lee","Tyler","Gabe"], white: ["Nathan","Jared","Kyle","Cal"], winner: "blue", score: "4-1", note: "Lee finally won. Tyler returns and extends to 5-0." },
  { day: "Thu 3/26", month: "March", blue: [], white: [], winner: null, score: null, note: "No game. Mike's birthday. The gym got the day off. Mike did not get a win." },
  { day: "Fri 3/27", month: "March", blue: ["Kyle","Mitch","Chad","Mike"], white: ["Nathan","Ryan","Lee","Tyler"], winner: "white", score: "4-0", note: "Second sweep in history. Tyler 7/7 in game 2. Mitch debuted and got baptized 0-4. Mike got swept the day after his birthday." },
  { day: "Mon 3/30", month: "March", blue: ["Nathan","Lee","Gabe","Cal"], white: ["Tyler","Kyle","Chad","Mike"], winner: "blue", score: "4-3", note: "TYLER'S FIRST LOSS. EVER. Pour one out for the perfect record." },
  { day: "Tue 3/31", month: "March", blue: [], white: [], winner: null, score: null, note: "No game." },

  // APRIL
  { day: "Wed 4/1",  month: "April", blue: ["Chad","Gabe","Tyler","Lee"], white: ["Nathan","Kyle","Sean","Cal"], winner: "blue", score: "4-0", note: "Blue sweeps. Tyler rebounds from his first-ever loss. Sean returns and immediately loses." },
  { day: "Thu 4/2",  month: "April", blue: [], white: [], winner: null, score: null, note: "No game. Four showed up. That's a brunch reservation." },
  { day: "Fri 4/3",  month: "April", blue: ["Nathan","Tyler","Lee","Cal","Jared"], white: ["Chad","Gabe","Kyle","Sean","Mike"], winner: "blue", score: "4-2", note: "Blue sweeps the week 3-0. Jared returns and wins." },
  { day: "Mon 4/6",  month: "April", blue: ["Nathan","Gabe","Lee","Ryan"], white: ["Kyle","Wags","Cal","Jared"], winner: "blue", score: "4-1", note: "Blue opens the week. Lee starts the week with a W." },
  { day: "Tue 4/7",  month: "April", blue: ["Gabe","Tyler","Ryan","Cal"], white: ["Nathan","Wags","Lee","Chad"], winner: "blue", score: "4-1", note: "Gabe and Cal start the week 2-0." },
  { day: "Wed 4/8",  month: "April", blue: ["Nathan","Wags","Gabe","Jared","Cal"], white: ["Tyler","Lee","Ryan","Chad","Mike"], winner: "blue", score: "4-1", note: "Blue threepeats. Tyler loses on White. Lee back below .500." },
  { day: "Thu 4/9",  month: "April", blue: ["Wags","Gabe","Lee","Cody"], white: ["Nathan","Jared","Ryan","Cal"], winner: "white", score: "4-0", note: "Third sweep in history. Cody was on the toilet for the tip of game one. Post-sweep, Lee-for-Cal trade. Cal hit six straight threes like the gym personally insulted his mother." },
  { day: "Fri 4/10", month: "April", blue: ["Nathan","Kyle","Tyler","Lee","Cal"], white: ["Gabe","Mike","Wags","Ryan","Jared"], winner: "blue", score: "4-0", note: "Fourth sweep of the season — Blue's first. Tyler, Lee, and Cal all on the same team — absurd." },
  { day: "Mon 4/13", month: "April", blue: [], white: [], winner: null, score: null, note: "No games. The calendar took a day off." },
  { day: "Tue 4/14", month: "April", blue: ["Gabe","Wags","Tyler","Cal"], white: ["Nathan","Ryan","Chadwick","Sean"], winner: "blue", score: "4-1", note: "'No rotation Sean' returned. Chadwick debuted — Chad's distinguished twin who plays only when the mood is right." },
  { day: "Wed 4/15", month: "April", blue: ["Chad","Mike","Ryan","Gabe"], white: ["Nathan","Jared","Wags","Cal"], winner: "white", score: "4-0", note: "Fifth sweep in history. Cal on the wrong end. The Flamethrower needed a cold glass of water." },
  { day: "Thu 4/16", month: "April", blue: ["Nathan","Gabe","Cody","Cal"], white: ["Ryan","Wags","Jared","Sean"], winner: "blue", score: "4-2" },
  { day: "Fri 4/17", month: "April", blue: ["Jared","Chad","Mike","Tyler","Cal"], white: ["Nathan","Kyle","Ryan","Wags","Mitch"], winner: "blue", score: "4-2", note: "Mitch returns. Mitch loses. The Welcome-to-the-League playlist is on repeat." },
  { day: "Mon 4/20", month: "April", blue: ["Nathan","Gabe","Jared","Cal","Wags"], white: ["Chad","Kyle","Tyler","Mike","Ryan"], winner: "white", score: "4-1", note: "White stacks Tyler and wins. Simple, really." },
  { day: "Tue 4/21", month: "April", blue: [], white: [], winner: null, score: null, note: "Aka no game. Don't ask why the spreadsheet says 'White wins 4-0' next to 'no game.' This league's record-keeping is, on its best day, jazz." },
  { day: "Wed 4/22", month: "April", blue: ["Nathan","Gabe","Cal","Ryan"], white: ["Sean","Lee","Mike","Jared"], winner: "blue", score: "4-2", note: "Lee returns from vacation. Lee immediately loses. Florida was probably worth it." },
  { day: "Thu 4/23", month: "April", blue: ["Cody","Gabe","Mitch","Ryan"], white: ["Nathan","Chad","Lee","Cal"], winner: "white", score: "4-3", note: "Mitch's third career series. Still looking for his first W. Cody back in action with no bathroom-related incidents reported, which we are forced to assume counts as growth." },
  { day: "Fri 4/24", month: "April", blue: ["Chad","Kyle","Tyler","Mitch","Ryan"], white: ["Nathan","Mike","Jared","Cal","Lee"], winner: "blue", score: "4-3", note: "Tyler back on Blue. Tyler back to winning. The man's algorithm is simple: show up, put on blue, collect dub." },

  // Week of 4/27 → 5/1
  { day: "Mon 4/27", month: "April", blue: ["Nathan","Lee","Mike","Cal"], white: ["Kyle","Gabe","Ryan","Wags"], winner: "blue", score: "4-3", note: "Cal and Lee on the same team again. Maybe they really are the same person. Inconclusive but suspicious." },
  { day: "Tue 4/28", month: "April", blue: [], white: [], winner: null, score: null, note: "No game. The gym sleeps." },
  { day: "Wed 4/29", month: "April", blue: ["Lee","Mike","Jared","Tyler","Ryan"], white: ["Nathan","Chad","Cody","Sean","Gabe","Cal"], winner: "white", score: "4-0", note: "Seventh sweep in history. The spreadsheet refers to one participant as 'Sean aka big dumb b——,' which is the kind of editorial decision that earns this league its accreditation." },
  { day: "Thu 4/30", month: "April", blue: [], white: [], winner: null, score: null, note: "No game. Allegedly only Nathan and Lee showed up, which is two humans short of basketball and one human short of a meaningful conversation." },
  { day: "Fri 5/1", month: "May", blue: ["Nathan","Lee","Chad","Ryan"], white: ["Mike","Tyler","Dane","Cal"], winner: "blue", score: "4-3", note: "Dane debuted. Lee went 7/7 in game 5 — 3 from beyond the arc and a layup — scoring every point for the winning Blue squad. Blue took the series 4-3. Lee joins the season's exclusive 7/7 Club alongside Gabe (Mon 3/23) and Tyler (Fri 3/27)." },
];

// Group sessions by month
const MONTHS = [
  {
    id: "march", label: "March", short: "Mar",
    name: "The Origin Era",
    commentary: "The month it all began. 21 sessions. Blue and White punched each other in the face across three weeks. Kentucky sent scouts. Phil debuted and vanished like a vapor. Tyler went 5-0 and seemed immortal. Lee went on a losing streak so long the dashboard briefly became a grief counselor. Sean predicted 'team black' from his couch, a jersey color that does not exist, for a league he was not participating in.",
    insight: "March closed with Blue up one and Tyler up infinity. Nathan was Blue in 13 of his 16 appearances because Nathan is the structural beam of this operation. Gabe went 7/7 in game one of Mon 3/23 (three threes and a layup, ones and twos) and played like a man who had a score to settle with gravity.",
  },
  {
    id: "april", label: "April", short: "Apr",
    name: "The Plot Thickens",
    commentary: "April is when the season got weird. Tyler lost for the first time. Lee climbed to .500 then promptly fell back below it. Cal went on a six-three heater after a post-sweep Lee-for-Cal trade. Cody conducted basketball's most famous bathroom break. Chadwick debuted as Chad's 'distinguished twin.' Lee took a full week off for vacation, came back on Wednesday the 22nd, and lost his first series back. It is unclear who spends more time in Florida — Lee or Cal. It is also unclear whether either of them has a real job, since both seem to operate on 'schedule is when I feel like it' time. The gym remains open. The dashboard remains awake. The jokes continue to write themselves.",
    insight: "April delivered seven sweeps total. A Tuesday 4/21 'series' that the spreadsheet labels as both 'White wins 4-0' AND 'No game' simultaneously, which is the kind of contradiction that survives audit only because nobody at this gym has the energy to question it. A Wednesday 4/29 sweep where the official roster included a player listed as 'Sean aka big dumb b——,' suggesting tensions are at peak-creative. Cal kept showing up. Tyler kept winning. Lee kept oscillating between vacation and basketball, with mixed results in both venues.",
  },
  {
    id: "may", label: "May", short: "May",
    name: "The 7/7 Club Gets a New Member",
    commentary: "Dane debuted on White and immediately got thrown into a game-7 series. Lee went 7/7 in game 5 — three threes and a layup — every Blue point. The 7/7 Club has a new member. May is young and already unhinged.",
    insight: "Lee's 7/7 game is the headline, but Dane's debut adds fresh blood to a league that needed it. Nathan stayed structural. Tyler stayed elite. The real question: can anyone in this gym sustain greatness for more than one game? History suggests no.",
  },
];

const CORRELATIONS = [
  { name: "Nathan", tag: "Structural Beam", desc: "The most-played human in this league by a country mile. Nathan has been on the court for nearly every series ever recorded, often on Blue, always doing what Nathan does, which the spreadsheet describes as 'showing up.' If Morning Hoops were a building, Nathan would be the load-bearing wall everyone takes for granted until they realize he's the only reason the roof is still up." },
  { name: "Tyler", tag: "Still Elite, Fully Human", desc: "Started 6-0 lifetime. Has since lost a few and is no longer perfect, but still owns the best sustained win rate in the group. He scored all 7 in game 2 of Friday 3/27 going 7/7 from the field. He's now a charter member of the 7/7 Club and the only player whose absence from a session immediately becomes the explanation for why his team lost." },
  { name: "Gabe", tag: "Quietly Dominant", desc: "The workhorse. Plays almost every day, wins more than he loses. Back on Monday 3/23 he went 7/7 in game one (three threes and a layup, ones and twos), founding the 7/7 Club without realizing it. Gabe just keeps quietly winning basketball games at 4:45 in the morning like a machine with knee pads and an unimpeachable jumper." },
  { name: "Cal", tag: "Flamethrower / Jet Setter", desc: "On Thursday 4/9 Cal hit six consecutive threes in the post-sweep tournament run like the gym had personally wronged him. On Wednesday 4/15 he got swept 0-4. Cal is a meteorological event: you can't predict him, you can only evacuate. He also spends a suspicious amount of time in Florida. The investigation continues." },
  { name: "Wags", tag: "Solid Citizen", desc: "Plays a lot. Wins a respectable amount. Doesn't make headlines. Has a #23 inexplicably appended to his name in the spreadsheet, which we choose to believe is a Jordan tribute and not a uniform number, because there are no uniforms. Wags is the dictionary definition of 'reliable contributor,' which sports media calls a compliment but humans call boring. We mean it as a compliment." },
  { name: "Ryan", tag: "Always There", desc: "Ryan plays. Ryan plays a lot. Ryan plays nearly as much as Nathan and Gabe but somehow gets less screentime in the group chat, which is a crime. Ryan once subbed in for an absent teammate at 4:45 AM, which puts him in a category of 'human beings willing to get out of bed for someone else's basketball commitment' that has approximately three members." },
  { name: "Jared", tag: "Streak Engine", desc: "Jared is wildly streaky. He once had back-to-back wins which the dashboard described as 'a spiritual awakening,' then immediately lost the next one. His career trajectory looks like a heart monitor. He shows up, he tries hard, and the universe decides what happens next." },
  { name: "Chad", tag: "The Disappearer", desc: "Chad once vanished for an entire week of games (Week 3) and reappeared with no explanation, no apology, just vibes. Has a 'distinguished twin' named Chadwick who debuted on 4/14, and the two have never been seen in the same building. This is suspicious." },
  { name: "Kyle", tag: "Ghost Mode", desc: "Started 5-0. Then lost a run of series. Has been appearing sporadically ever since, which is statistically his strongest play. When you're in a slump, sometimes the best strategy is simply not showing up. See also: Sean." },
  { name: "Sean", tag: "Team Black Analyst", desc: "Predicted 'team black' from his couch in a league with blue and white jerseys, then returned to the court and kept losing. The Wednesday 4/29 spreadsheet refers to him as 'Sean aka big dumb b——,' which is the kind of in-group nickname you only earn by being deeply, lovingly insufferable. We mean it as a compliment." },
  { name: "Mike", tag: "Birthday Boy", desc: "Got the day off Thursday 3/26 for his birthday. Came back Friday and got swept 0-4. The eternal Morning Hoops question is whether his defense was a philosophical concept or an actual practice, and after two months of data the answer is 'philosophical, leaning theoretical.'" },
  { name: "Mitch", tag: "Welcome to the League", desc: "Debuted Friday 3/27 on Blue and got swept 4-0. Returned Friday 4/17 and lost. Played Thursday 4/23 and lost. Played Friday 4/24 and won, finally, technically getting his first W. His Morning Hoops experience is now graded 'incomplete' but trending toward 'survivable.'" },
  { name: "Cody", tag: "Bathroom Break", desc: "On Thursday 4/9 Cody missed the tip of game one because he was, to put it delicately, conducting important gastrointestinal business in the facilities. Blue opened the series down a body and got swept 0-4. The forensic asterisk will follow him until he retires or the plumbing is investigated, whichever comes first." },
  { name: "Chadwick", tag: "Chad's Distinguished Twin", desc: "Debuted Tuesday 4/14. Is supposedly Chad's twin. Nobody has ever seen Chad and Chadwick in the same room. The Witness Protection Program is one possibility. A long con is another. Currently cataloged as 'unsolved.'" },
  { name: "Dane", tag: "Newcomer", desc: "Debuted Friday 5/1 on Blue and won. A 1.000 lifetime win rate, which is technically tied with rookie-Tyler before the wheels came off. We'll see how this ages. Dane: enjoy the view from the top while it lasts." },
  { name: "Lee", tag: "7/7 Club", desc: "Spent the early season as the league's most reliable losing streak — a weather system with a jump shot. Then went 7/7 on Fri 5/1: three threes and a layup, every Blue point in a pivotal Game 5. One perfect game in a sea of open-layup misses." },
];

// ═══════════════════════════════════════════════════════════
// STATS ENGINE
// ═══════════════════════════════════════════════════════════
function getStats(sessions) {
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
      if (!p[n]) p[n] = { g: 0, w: 0, l: 0, bt: 0, wt: 0, bw: 0, ww: 0 };
      p[n].g++; p[n][team === "blue" ? "bt" : "wt"]++;
      if (s.winner === "blue") { p[n].bw++; if (team === "blue") p[n].w++; else p[n].l++; }
      else if (s.winner === "white") { p[n].ww++; if (team === "white") p[n].w++; else p[n].l++; }
    });
    process(s.blue, "blue"); process(s.white, "white");

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

  const teammateReport = (name) => {
    const entries = Object.entries(pairRecords)
      .filter(([k]) => k.split("|||").includes(name))
      .map(([k, v]) => {
        const partner = k.split("|||").find(x => x !== name);
        const total = v.w + v.l;
        return { partner, w: v.w, l: v.l, total, pct: total > 0 ? v.w / total : 0 };
      })
      .filter(e => e.total >= 3);
    if (entries.length === 0) return { best: null, worst: null, all: [] };
    const best = [...entries].sort((a,b) => b.pct - a.pct || b.total - a.total)[0];
    const worst = [...entries].sort((a,b) => a.pct - b.pct || b.total - a.total)[0];
    return { best, worst, all: entries };
  };

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

  return { p, totalS: sessions.length, uniqueCount: uniquePlayers.size, avgPerSession, topRivals, topTeammates, decided, pairRecords, playerLosses, playerWins, teammateReport, bestPairs, worstPairs };
}

function groupSessionsByWeek(sessions) {
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

function Badge({ winner, score, dark }) {
  if (!winner) return <span style={{ fontSize: 'var(--type-label)', fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)", color: dark ? "#71717A" : "#6B7280" }}>No result</span>;
  const b = winner === "blue";
  return <span style={{ fontSize: 'var(--type-label)', fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: b ? (dark ? "rgba(91,141,239,.15)" : "rgba(59,107,245,.08)") : (dark ? "rgba(180,188,208,.1)" : "rgba(100,116,139,.08)"), color: b ? (dark ? "#5B8DEF" : "#3B6BF5") : (dark ? "#B4BCD0" : "#64748B") }}>{b ? "Blue" : "White"} {score || "W"}</span>;
}

function Dot({ team, dark }) {
  return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: team === "blue" ? "#3B6BF5" : (dark ? "#94A3B8" : "#64748B"), marginRight: 5, flexShrink: 0 }} />;
}

export default function App() {
  const [tab, setTab] = useState("summary");
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("morning-hoops-theme");
    if (stored) return stored === "dark";
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return false;
    return true;
  });
  const [layout, setLayout] = useState(() => {
    if (typeof window === "undefined") return "wide";
    const w = window.innerWidth;
    return w < 480 ? "compact" : w < 768 ? "regular" : "wide";
  });

  useEffect(() => {
    localStorage.setItem("morning-hoops-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setLayout(w < 480 ? "compact" : w < 768 ? "regular" : "wide");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isCompact = layout === "compact";
  const isWide = layout === "wide";
  const isMobile = layout !== "wide";

  const stats = useMemo(() => getStats(SESSIONS), []);
  const { p: players, totalS, uniqueCount, avgPerSession, topRivals, topTeammates, playerLosses, teammateReport, bestPairs, worstPairs } = stats;

  const t = {
    bg: dark ? "#09090B" : "#F7F6F3", card: dark ? "#16161A" : "#FFFFFF", inset: dark ? "#0D0D0F" : "#EDECEB",
    border: dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)", text: dark ? "#EDEDEF" : "#1A1A1A",
    t2: dark ? "#A1A1AA" : "#6B7280", t3: dark ? "#71717A" : "#6B7280",
    accent: "#EF6234", blue: dark ? "#5B8DEF" : "#3B6BF5", white: dark ? "#B4BCD0" : "#64748B",
    green: "#34D399", gold: "#FBBF24", red: "#F87171",
  };

  const C = (x = {}) => ({ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 'var(--space-card-padding)', ...x });
  const L = { fontSize: 'var(--type-label-lg)', fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: t.t3, marginBottom: 14 };
  const S = { fontFamily: "'Instrument Serif',serif" };

  const SectionDivider = () => (
    <div style={{ borderTop: `1px solid ${t.border}`, margin: 'var(--space-section-gap) 0 20px', paddingTop: 20 }} />
  );

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "season", label: "Season" },
    ...MONTHS.map(m => ({ id: m.id, label: m.label })),
  ];

  const renderGame = (s, i, len) => {
    const noGame = s.blue.length === 0 && s.white.length === 0;
    const rowOpacity = !s.winner && !noGame ? 0.5 : noGame ? 0.35 : 1;

    // Compact: condensed inline format with · separator
    if (isCompact) {
      return (
        <div key={i}>
          <div style={{ padding: '10px var(--space-card-padding)', borderBottom: i < len - 1 ? `1px solid ${t.border}` : "none", opacity: rowOpacity }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: noGame ? 0 : 6 }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{s.day}</div>
              {!noGame && <Badge winner={s.winner} score={s.score} dark={dark} />}
            </div>
            {noGame ? (
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic", marginTop: 4 }}>{s.note || "No game"}</div>
            ) : (
              <div style={{ fontSize: 'var(--type-body-sm)', lineHeight: 1.7 }}>
                <span style={{ color: t.blue, fontWeight: 600 }}>{s.blue.join(' \u00b7 ')}</span>
                <span style={{ ...S, color: t.t3, fontStyle: "italic", margin: "0 6px" }}>vs</span>
                <span style={{ color: t.white, fontWeight: 600 }}>{s.white.join(' \u00b7 ')}</span>
              </div>
            )}
          </div>
          {s.note && !noGame && (
            <div style={{ padding: '0 var(--space-card-padding) 8px', borderLeft: `2px solid ${t.accent}`, marginLeft: 'var(--space-card-padding)', fontSize: 'var(--type-label)', color: t.accent, fontWeight: 600, fontStyle: "italic", letterSpacing: '0.025em' }}>{s.note}</div>
          )}
        </div>
      );
    }

    // Regular: stacked with dots, tighter spacing
    if (!isWide) {
      return (
        <div key={i}>
          <div style={{ padding: "12px 16px", borderBottom: i < len - 1 ? `1px solid ${t.border}` : "none", opacity: rowOpacity }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: noGame ? 0 : 6 }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--type-body-sm)' }}>{s.day}</div>
              {!noGame && <Badge winner={s.winner} score={s.score} dark={dark} />}
            </div>
            {noGame ? (
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic", marginTop: 4 }}>{s.note || "No game"}</div>
            ) : (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 8px", lineHeight: 1.6 }}>
                  {s.blue.map((p, j) => <span key={j} style={{ display: "inline-flex", alignItems: "center" }}><Dot team="blue" dark={dark} /><span style={{ fontWeight: 500, fontSize: 'var(--type-body-sm)' }}>{p}</span></span>)}
                </div>
                <div style={{ ...S, fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic", padding: "2px 0" }}>vs</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 8px", lineHeight: 1.6 }}>
                  {s.white.map((p, j) => <span key={j} style={{ display: "inline-flex", alignItems: "center" }}><Dot team="white" dark={dark} /><span style={{ fontWeight: 500, fontSize: 'var(--type-body-sm)' }}>{p}</span></span>)}
                </div>
              </>
            )}
          </div>
          {s.note && !noGame && <div style={{ padding: "0 16px 10px 16px", fontSize: 'var(--type-label)', color: t.accent, fontWeight: 600, fontStyle: "italic", letterSpacing: '0.025em' }}>{s.note}</div>}
        </div>
      );
    }

    // Wide: 5-column grid with fluid columns
    return (
      <div key={i}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(60px,72px) 1fr 24px 1fr minmax(60px,80px)", alignItems: "center", padding: "12px 16px", borderBottom: i < len - 1 ? `1px solid ${t.border}` : "none", gap: 6, opacity: rowOpacity }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--type-body-sm)' }}>{s.day}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 8px", lineHeight: 1.6 }}>
            {noGame ? <span style={{ fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic" }}>{s.note || "No game"}</span> : s.blue.map((p, j) => <span key={j} style={{ display: "inline-flex", alignItems: "center" }}><Dot team="blue" dark={dark} /><span style={{ fontWeight: 500, fontSize: 'var(--type-body-sm)' }}>{p}</span></span>)}
          </div>
          <div style={{ textAlign: "center", ...S, fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic" }}>{noGame ? "" : "vs"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 8px", lineHeight: 1.6 }}>
            {!noGame && s.white.map((p, j) => <span key={j} style={{ display: "inline-flex", alignItems: "center" }}><Dot team="white" dark={dark} /><span style={{ fontWeight: 500, fontSize: 'var(--type-body-sm)' }}>{p}</span></span>)}
          </div>
          <div style={{ textAlign: "right" }}>{!noGame && <Badge winner={s.winner} score={s.score} dark={dark} />}</div>
        </div>
        {s.note && !noGame && <div style={{ padding: "0 16px 10px 90px", fontSize: 'var(--type-label)', color: t.accent, fontWeight: 600, fontStyle: "italic", letterSpacing: '0.025em' }}>{s.note}</div>}
      </div>
    );
  };

  const renderWeekHeader = (week) => {
    const decided = week.blueWins + week.whiteWins;
    const tallyParts = [];
    if (week.blueWins > 0) tallyParts.push({ label: `Blue ${week.blueWins}`, color: t.blue });
    if (week.whiteWins > 0) tallyParts.push({ label: `White ${week.whiteWins}`, color: t.white });

    return (
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isCompact ? '8px var(--space-card-padding)' : "8px 16px",
        background: t.inset,
        borderTop: `1px solid ${t.border}`,
        borderBottom: `1px solid ${t.border}`,
        gap: 8,
      }}>
        <div style={{
          fontSize: 'var(--type-label)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: "uppercase",
          color: t.t3,
          whiteSpace: "nowrap",
        }}>
          Week {week.weekNum} · {week.startDate}–{week.endDate}
        </div>
        {decided > 0 && (
          <div style={{
            display: "flex",
            gap: 8,
            fontSize: 'var(--type-label)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            flexShrink: 0,
          }}>
            {tallyParts.map((tp, j) => (
              <span key={j} style={{ color: tp.color }}>{tp.label}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMonth = (m) => {
    const monthSessions = SESSIONS.filter(s => s.month === m.label);
    const monthDecided = monthSessions.filter(s => s.winner);
    const monthBW = monthDecided.filter(s => s.winner === "blue").length;
    const monthWW = monthDecided.filter(s => s.winner === "white").length;
    const weeks = groupSessionsByWeek(monthSessions);

    // Flatten weeks into a renderable list with week headers
    let globalIdx = 0;
    const totalGames = monthSessions.length;

    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={L}>{m.label} Recap</div>
          <h2 style={{ ...S, fontSize: 'var(--type-headline)', color: t.text, margin: 0, fontWeight: 400 }}>{m.name}</h2>
          <div style={{ fontSize: 'var(--type-body-sm)', fontWeight: 600, color: t.t3, marginTop: 4 }}>Blue {monthBW} – White {monthWW} · {monthDecided.length} decided series</div>
        </div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section-gap)' }}>
          <div style={{ padding: "16px", borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.65 }}>{m.commentary}</div>
          {weeks.map((week, wIdx) => (
            <div key={wIdx}>
              {renderWeekHeader(week)}
              {week.sessions.map((s) => {
                const idx = globalIdx++;
                return renderGame(s, idx, totalGames);
              })}
            </div>
          ))}
          <div style={{ padding: "14px 16px", paddingLeft: 18, background: t.inset, borderLeft: `2px solid ${t.accent}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.65, borderTop: `1px solid ${t.border}` }}><span style={{ color: t.accent, fontWeight: 700 }}>Debrief: </span>{m.insight}</div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    const decided = SESSIONS.filter(s => s.winner);
    const bW = decided.filter(s => s.winner === "blue").length;
    const wW = decided.filter(s => s.winner === "white").length;
    const sweeps = decided.filter(s => s.score === "4-0").length;
    const winSorted = Object.entries(players).filter(([, d]) => d.w + d.l >= 3).sort((a, b) => (b[1].w / (b[1].w + b[1].l)) - (a[1].w / (a[1].w + a[1].l)));
    const topWinners = winSorted.slice(0, 5);
    const bottomWinners = [...winSorted].reverse().slice(0, 3);

    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={L}>Season Summary</div>
          <h2 style={{ ...S, fontSize: 'var(--type-headline)', color: t.text, margin: 0, fontWeight: 400 }}>The State of the Gym</h2>
          <div style={{ fontSize: 'var(--type-body)', color: t.t2, marginTop: 6, lineHeight: 1.6, maxWidth: 'var(--space-prose-max)' }}>
            {decided.length} decided 7-game series. {uniquePlayers(players)} players. Blue leads {bW}–{wW}. Tyler is mortal but still elite. Gabe and Nathan are the structural beams holding this gym together. Cal is a flamethrower who occasionally vanishes to Florida. Ryan has quietly become the most reliable player nobody talks about. The 7/7 Club has a third member. Anyway, here's the summary.
          </div>
        </div>

        {/* HEADLINE STATS — editorial pull-quote */}
        <div style={{ ...S, fontSize: 'var(--type-title)', fontStyle: "italic", color: t.t2, lineHeight: 1.7, marginBottom: 'var(--space-section-gap)', padding: "20px 0 20px 20px", borderLeft: `2px solid ${t.accent}`, maxWidth: 'var(--space-prose-max)' }}>
          <span style={{ color: t.accent }}>{decided.length}</span> series decided. Blue leads <span style={{ color: t.accent }}>{bW}–{wW}</span> in the overall, with <span style={{ color: t.accent }}>{sweeps}</span> sweeps and <span style={{ color: t.accent }}>{uniquePlayers(players)}</span> players who{"'"}ve touched the court, averaging <span style={{ color: t.accent }}>{avgPerSession}</span> per session.
        </div>

        {/* SUMMARY STAT BOXES — compact: 2-col, regular: 3-col, wide: 4-col */}
        <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr 1fr" : isWide ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", gap: 8, marginBottom: 'var(--space-section-gap)' }}>
          {[
            { v: String(bW), l: "Blue Wins", c: t.blue },
            { v: String(wW), l: "White Wins", c: t.white },
            { v: String(sweeps), l: "Sweeps", c: t.accent },
            { v: avgPerSession, l: "Avg/Session", c: t.green },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: "center", background: t.inset, borderRadius: 8, padding: isCompact ? '10px 8px' : 12 }}>
              <div style={{ ...S, fontSize: 'var(--type-stat-lg)', color: m.c, lineHeight: 1 }}>{m.v}</div>
              <div style={{ fontSize: 'var(--type-label)', color: t.t3, fontWeight: 600, marginTop: 3 }}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* TOP 5 WIN RATES */}
        <div style={L}>Top 5 Win Rates (min 3 series)</div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section-gap)' }}>
          {topWinners.map(([name, d], i) => {
            const dec = d.w + d.l; const pct = Math.round(d.w / dec * 100);
            if (isCompact) {
              return (
                <div key={name} style={{ padding: '12px var(--space-card-padding)', borderBottom: i < topWinners.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent }}>{i + 1}</span>
                      <span style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</span>
                    </div>
                    <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green, flexShrink: 0 }}>{pct}%</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, minWidth: 40 }}>{d.w}-{d.l}</div>
                    <div style={{ flex: 1, height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: t.green, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "24px 1fr 80px 1fr 60px", alignItems: "center", padding: "12px 16px", borderBottom: i < topWinners.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent }}>{i + 1}</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</div>
                <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600 }}>{d.w}-{d.l}</div>
                <div style={{ height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: t.green, borderRadius: 3 }} /></div>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green, textAlign: "right" }}>{pct}%</div>
              </div>
            );
          })}
        </div>

        {/* TOP PARTNERSHIPS */}
        <SectionDivider />
        <div style={L}>Best Partnerships (min 3 series together)</div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section-gap)' }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.5 }}>The pairs that win together. If you want to engineer a W, put these two on the same team and get out of their way.</div>
          {bestPairs.map((pair, i) => isCompact ? (
            <div key={i} style={{ padding: '10px var(--space-card-padding)', borderBottom: i < bestPairs.length - 1 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green }}>{i + 1}</span>
                  <span style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{pair.a} + {pair.b}</span>
                </div>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green, flexShrink: 0 }}>{Math.round(pair.pct * 100)}%</div>
              </div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, marginTop: 2, paddingLeft: 28 }}>{pair.w}-{pair.l}</div>
            </div>
          ) : (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr 80px 60px", alignItems: "center", padding: "10px 16px", borderBottom: i < bestPairs.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
              <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green }}>{i + 1}</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{pair.a} + {pair.b}</div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600 }}>{pair.w}-{pair.l}</div>
              <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green, textAlign: "right" }}>{Math.round(pair.pct * 100)}%</div>
            </div>
          ))}
        </div>

        {/* WORST PARTNERSHIPS */}
        <div style={L}>Worst Partnerships (min 3 series together)</div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section-gap)' }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.5 }}>The pairs that lose together. Separate them at the door. For their sake, for the gym{"'"}s sake, for the integrity of the spreadsheet.</div>
          {worstPairs.map((pair, i) => isCompact ? (
            <div key={i} style={{ padding: '10px var(--space-card-padding)', borderBottom: i < worstPairs.length - 1 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.red }}>{i + 1}</span>
                  <span style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{pair.a} + {pair.b}</span>
                </div>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.red, flexShrink: 0 }}>{Math.round(pair.pct * 100)}%</div>
              </div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, marginTop: 2, paddingLeft: 28 }}>{pair.w}-{pair.l}</div>
            </div>
          ) : (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr 80px 60px", alignItems: "center", padding: "10px 16px", borderBottom: i < worstPairs.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
              <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.red }}>{i + 1}</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{pair.a} + {pair.b}</div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600 }}>{pair.w}-{pair.l}</div>
              <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.red, textAlign: "right" }}>{Math.round(pair.pct * 100)}%</div>
            </div>
          ))}
        </div>

        {/* BIGGEST RIVALRIES */}
        <SectionDivider />
        <div style={L}>Biggest Rivalries (opposite teams most often)</div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section-gap)' }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.5 }}>The guys who seem to always be trying to beat each other, either by design or by the cruel hand of the jersey assignment fairy.</div>
          {topRivals.map((r, i) => isCompact ? (
            <div key={i} style={{ padding: '10px var(--space-card-padding)', borderBottom: i < topRivals.length - 1 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent }}>{i + 1}</span>
                  <span style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{r.pair[0]} vs {r.pair[1]}</span>
                </div>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent, flexShrink: 0 }}>{r.count}x</div>
              </div>
            </div>
          ) : (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr 60px", alignItems: "center", padding: "10px 16px", borderBottom: i < topRivals.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
              <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent }}>{i + 1}</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{r.pair[0]} vs {r.pair[1]}</div>
              <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent, textAlign: "right" }}>{r.count}x</div>
            </div>
          ))}
        </div>

        {/* THE FLORIDA INVESTIGATION */}
        <SectionDivider />
        <div style={L}>The Florida Investigation</div>
        <div style={{ ...C(), marginBottom: 'var(--space-section-gap)', borderColor: dark ? "rgba(239,98,52,.2)" : "rgba(239,98,52,.15)", background: dark ? "rgba(239,98,52,.03)" : "rgba(239,98,52,.02)" }}>
          <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.65 }}>
            <strong style={{ color: t.accent }}>An open case.</strong> Two members of this gym are alleged to spend a suspicious amount of time in Florida. Neither has produced clear evidence of a traditional 9-to-5. The dashboard is forced to consider three possibilities: (1) two extremely flexible freelancers, (2) the same person operating a long con, or (3) Florida is where Morning Hoops players go to recover from being Morning Hoops players. Evidence is inconclusive. Investigation ongoing. The good news for the league is that whichever of them is in town tends to win, and whichever is in Florida tends to be missed. So functionally Florida might just be where this league sends people for emotional regulation.
          </div>
        </div>

        {/* BOTTOM RECORDS */}
        <div style={L}>Currently Struggling (bottom 3 win rates)</div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section-gap)' }}>
          {bottomWinners.map(([name, d], i) => {
            const dec = d.w + d.l; const pct = Math.round(d.w / dec * 100);
            if (isCompact) {
              return (
                <div key={name} style={{ padding: '12px var(--space-card-padding)', borderBottom: i < bottomWinners.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</span>
                    <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.red, flexShrink: 0 }}>{pct}%</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, minWidth: 40 }}>{d.w}-{d.l}</div>
                    <div style={{ flex: 1, height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: t.red, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr 60px", alignItems: "center", padding: "12px 16px", borderBottom: i < bottomWinners.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</div>
                <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600 }}>{d.w}-{d.l}</div>
                <div style={{ height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: t.red, borderRadius: 3 }} /></div>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.red, textAlign: "right" }}>{pct}%</div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 'var(--type-body-sm)', color: t.t3, textAlign: "center", lineHeight: 1.6 }}>
          If this summary isn't enough to ruin someone's morning, the <strong style={{ color: t.accent }}>Season tab</strong> has the full dossier. Month-by-month breakdowns live on the <strong style={{ color: t.accent }}>March</strong>, <strong style={{ color: t.accent }}>April</strong>, and <strong style={{ color: t.accent }}>May</strong> tabs.
        </div>
      </div>
    );
  };

  const renderSeason = () => {
    const decided = SESSIONS.filter(s => s.winner);
    const bW = decided.filter(s => s.winner === "blue").length;
    const wW = decided.filter(s => s.winner === "white").length;
    const sorted = Object.entries(players).sort((a, b) => b[1].g - a[1].g);
    const winSorted = Object.entries(players).filter(([, d]) => d.w + d.l >= 3).sort((a, b) => (b[1].w / (b[1].w + b[1].l)) - (a[1].w / (a[1].w + a[1].l)));

    const sweeps = decided.filter(s => s.score === "4-0").length;
    const blowouts = decided.filter(s => s.score === "4-1").length;
    const comfortable = decided.filter(s => s.score === "4-2").length;
    const nailbiters = decided.filter(s => s.score === "4-3").length;

    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={L}>Full Season</div>
          <h2 style={{ ...S, fontSize: 'var(--type-headline)', color: t.text, margin: 0, fontWeight: 400 }}>Every Series. Every Roaster.</h2>
          <div style={{ fontSize: 'var(--type-body)', color: t.t2, marginTop: 6, lineHeight: 1.6, maxWidth: 'var(--space-prose-max)' }}>
            {decided.length} decided 7-game series. {uniquePlayers(players)} players. Played by 1s and 2s. {bW > wW ? `Blue leads ${bW}–${wW}` : bW < wW ? `White leads ${wW}–${bW}` : `Tied ${bW}–${wW}`}. Every number below is real. The commentary, unfortunately, is also real.
          </div>
        </div>

        {/* SECTION JUMP NAV */}
        <nav style={{ display: "flex", gap: 6, marginBottom: 22, overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 4, scrollbarWidth: "none", maskImage: "linear-gradient(to right, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, black 90%, transparent)" }}>
          {[
            { label: "Overview", id: "season-overview" },
            { label: "Head to Head", id: "season-h2h" },
            { label: "Records", id: "season-records" },
            { label: "Profiles", id: "season-profiles" },
            { label: "Attendance", id: "season-attendance" },
            { label: "Tyler Losses", id: "season-tyler" },
            { label: "7/7 Club", id: "season-club" },
            { label: "Algorithm", id: "season-algorithm" },
          ].map((s, i) => (
            <button key={i} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })} style={{ background: t.inset, border: `1px solid ${t.border}`, padding: "8px 14px", cursor: "pointer", fontSize: 'var(--type-body-sm)', fontWeight: 600, color: t.t3, fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap", borderRadius: 6, minHeight: 44, flexShrink: 0 }}>{s.label}</button>
          ))}
        </nav>

        {/* HEADLINE STATS — editorial pull-quote */}
        <div id="season-overview" style={{ ...S, fontSize: 'var(--type-title)', fontStyle: "italic", color: t.t2, lineHeight: 1.7, marginBottom: 'var(--space-section-gap)', padding: "20px 0 20px 20px", borderLeft: `2px solid ${t.accent}`, maxWidth: 'var(--space-prose-max)' }}>
          <span style={{ color: t.accent }}>{decided.length}</span> decided series across the full season. Blue <span style={{ color: t.accent }}>{bW}</span>, White <span style={{ color: t.accent }}>{wW}</span>. <span style={{ color: t.accent }}>{uniquePlayers(players)}</span> players have stepped on the court, averaging <span style={{ color: t.accent }}>{avgPerSession}</span> per session. The spreadsheet is the source of truth. The dashboard is just the messenger.
        </div>

        <div id="season-h2h" style={L}>Head to Head</div>
        <div style={{ ...C(), marginBottom: 'var(--space-section-gap)' }}>
          {isCompact ? (
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ ...S, fontSize: 'var(--type-stat-hero)', color: t.blue, lineHeight: 1 }}>{bW}</div>
              <div style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.t3, marginTop: 2, marginBottom: 12 }}>Blue Wins</div>
              <div style={{ height: 6, borderRadius: 3, overflow: "hidden", display: "flex", background: t.inset, margin: "0 auto", maxWidth: 240 }}>
                <div style={{ width: `${bW / (bW + wW) * 100}%`, background: t.blue }} />
                <div style={{ width: `${wW / (bW + wW) * 100}%`, background: "#94A3B8" }} />
              </div>
              <div style={{ ...S, fontSize: 'var(--type-stat-hero)', color: t.white, lineHeight: 1, marginTop: 12 }}>{wW}</div>
              <div style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.t3, marginTop: 2 }}>White Wins</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
                <div><div style={{ ...S, fontSize: 'var(--type-stat-hero)', color: t.blue, lineHeight: 1 }}>{bW}</div><div style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.t3, marginTop: 2 }}>Blue Wins</div></div>
                <div style={{ ...S, fontSize: 'var(--type-body)', color: t.t3, fontStyle: "italic", alignSelf: "center" }}>vs</div>
                <div style={{ textAlign: "right" }}><div style={{ ...S, fontSize: 'var(--type-stat-hero)', color: t.white, lineHeight: 1 }}>{wW}</div><div style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.t3, marginTop: 2 }}>White Wins</div></div>
              </div>
              <div style={{ height: 6, borderRadius: 3, overflow: "hidden", display: "flex", background: t.inset }}>
                <div style={{ width: `${bW / (bW + wW) * 100}%`, background: t.blue }} />
                <div style={{ width: `${wW / (bW + wW) * 100}%`, background: "#94A3B8" }} />
              </div>
            </>
          )}
          <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr 1fr" : isWide ? "1fr 1fr 1fr 1fr" : "1fr 1fr", gap: 8, marginTop: 18 }}>
            {[
              { v: String(sweeps), l: "Sweeps (4-0)", c: t.accent },
              { v: String(blowouts), l: "Blowouts (4-1)", c: t.green },
              { v: String(comfortable), l: "Comfortable (4-2)", c: t.gold },
              { v: String(nailbiters), l: "Nail-biters (4-3)", c: t.red },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: "center", background: t.inset, borderRadius: 8, padding: isCompact ? '10px 8px' : 12 }}>
                <div style={{ ...S, fontSize: 'var(--type-stat-lg)', color: m.c, lineHeight: 1 }}>{m.v}</div>
                <div style={{ fontSize: 'var(--type-label)', color: t.t3, fontWeight: 600, marginTop: 3 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WIN-LOSS RECORDS */}
        <SectionDivider />
        <div id="season-records" style={L}>Player Win-Loss Records</div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section-gap)' }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.5 }}>Series record. Minimum 3 decided series, because judging someone on two games is tempting but statistically irresponsible.</div>
          {winSorted.map(([name, d], i) => {
            const dec = d.w + d.l; const pct = Math.round(d.w / dec * 100);
            const barColor = pct >= 60 ? t.green : pct >= 45 ? t.gold : t.red;
            if (isCompact) {
              return (
                <div key={name} style={{ padding: '12px var(--space-card-padding)', borderBottom: i < winSorted.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</div>
                    <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: barColor }}>{pct}%</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, minWidth: 40 }}>{d.w}-{d.l}</div>
                    <div style={{ flex: 1, height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "minmax(80px,120px) 60px 1fr 50px", alignItems: "center", padding: "10px 16px", borderBottom: i < winSorted.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{name}</div>
                <div style={{ fontSize: 'var(--type-body)', color: t.t2, fontWeight: 600 }}>{d.w}-{d.l}</div>
                <div style={{ height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 3 }} /></div>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: barColor, textAlign: "right" }}>{pct}%</div>
              </div>
            );
          })}
        </div>

        {/* PLAYER PROFILES */}
        <SectionDivider />
        <div id="season-profiles" style={L}>Player Profiles</div>
        <div style={{ display: "grid", gap: 'var(--space-card-gap)', marginBottom: 'var(--space-section-gap)' }}>
          {CORRELATIONS.map((c, i) => {
            const d = players[c.name];
            const dec = d ? d.w + d.l : 0;
            const rec = dec > 0 ? `${d.w}-${d.l}` : "\u2014";
            const pct = dec > 0 ? Math.round(d.w / dec * 100) : null;
            if (isCompact) {
              return (
                <div key={i} style={{ ...C() }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                    <div style={{ ...S, fontSize: 'var(--type-title)', color: pct !== null ? (pct >= 60 ? t.green : pct >= 45 ? t.gold : t.red) : t.t3, flexShrink: 0 }}>{rec}</div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>
                      {c.name}
                      <span style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.accent, marginLeft: 6 }}>{c.tag}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.55 }}>{c.desc}</div>
                </div>
              );
            }
            return (
              <div key={i} style={{ ...C(), display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ ...S, fontSize: 'var(--type-title)', color: pct !== null ? (pct >= 60 ? t.green : pct >= 45 ? t.gold : t.red) : t.t3, minWidth: 64, textAlign: "center" }}>{rec}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{c.name} <span style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.accent, marginLeft: 4 }}>{c.tag}</span></div>
                  <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.5, marginTop: 2 }}>{c.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ATTENDANCE */}
        <SectionDivider />
        <div id="season-attendance" style={L}>Attendance</div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section-gap)' }}>
          {isCompact ? (
            /* Compact: card list sorted by sessions descending */
            [...sorted].sort((a, b) => b[1].g - a[1].g).map(([name, d], i, arr) => {
              const rate = Math.round(d.g / totalS * 100);
              const dec = d.w + d.l;
              const wpct = dec > 0 ? Math.round(d.w / dec * 100) : null;
              const tier = rate >= 90 ? ["IRON", t.accent] : rate >= 70 ? ["REG", t.green] : rate >= 40 ? ["PT", t.blue] : rate >= 15 ? ["DROP", t.gold] : ["1x", t.t3];
              return (
                <div key={name} style={{ padding: '12px var(--space-card-padding)', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{name}</span>
                      <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, padding: "2px 6px", borderRadius: 3, background: `${tier[1]}18`, color: tier[1] }}>{tier[0]}</span>
                    </div>
                    <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: tier[1] }}>{rate}%</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 'var(--type-body-sm)', color: t.t2 }}>
                    <span>{d.g}/{totalS} games</span>
                    <span style={{ color: t.blue }}>{d.bt}B</span>
                    <span style={{ color: t.white }}>{d.wt}W</span>
                    {dec > 0 && <span style={{ marginLeft: "auto", fontWeight: 600 }}>{d.w}-{d.l} ({wpct}%)</span>}
                  </div>
                </div>
              );
            })
          ) : (
            /* Regular/Wide: table */
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 'var(--type-body-sm)' }}>
                <thead><tr style={{ background: t.inset, borderBottom: `1px solid ${t.border}` }}>
                  {["Player", "Games", "Rate", "Blue", "White", "W-L", "Win%"].map(h => <th key={h} style={{ padding: "10px 8px", fontSize: 'var(--type-label)', fontWeight: 700, letterSpacing: 1, color: t.t3, textAlign: h === "Player" ? "left" : "center", ...(h === "Player" ? { paddingLeft: 16, minWidth: 80 } : {}) }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {sorted.map(([name, d]) => {
                    const rate = Math.round(d.g / totalS * 100);
                    const dec = d.w + d.l;
                    const wpct = dec > 0 ? Math.round(d.w / dec * 100) : null;
                    const tier = rate >= 90 ? ["IRON", t.accent] : rate >= 70 ? ["REG", t.green] : rate >= 40 ? ["PT", t.blue] : rate >= 15 ? ["DROP", t.gold] : ["1x", t.t3];
                    return (
                      <tr key={name} style={{ borderBottom: `1px solid ${t.border}` }}>
                        <td style={{ padding: "9px 16px", fontWeight: 600, fontSize: 'var(--type-body)' }}>{name}<span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, padding: "2px 6px", borderRadius: 3, background: `${tier[1]}18`, color: tier[1], marginLeft: 8 }}>{tier[0]}</span></td>
                        <td style={{ textAlign: "center", color: t.t2 }}>{d.g}/{totalS}</td>
                        <td style={{ textAlign: "center", ...S, fontSize: 'var(--type-stat-md)', color: tier[1] }}>{rate}%</td>
                        <td style={{ textAlign: "center", color: t.blue, fontWeight: 600 }}>{d.bt}</td>
                        <td style={{ textAlign: "center", color: t.white, fontWeight: 600 }}>{d.wt}</td>
                        <td style={{ textAlign: "center", fontSize: 'var(--type-body-sm)', fontWeight: 600, color: dec > 0 ? t.t2 : t.t3 }}>{dec > 0 ? `${d.w}-${d.l}` : "\u2014"}</td>
                        <td style={{ textAlign: "center", ...S, fontSize: 'var(--type-body)', color: wpct !== null ? (wpct >= 60 ? t.green : wpct >= 45 ? t.gold : t.red) : t.t3 }}>{wpct !== null ? `${wpct}%` : "\u2014"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TYLER LOSSES */}
        {playerLosses["Tyler"] && playerLosses["Tyler"].length > 0 && (() => {
          const losses = playerLosses["Tyler"];
          const allLossTeammates = losses.flatMap(l => l.teammates);
          const freq = {};
          allLossTeammates.forEach(n => freq[n] = (freq[n]||0) + 1);
          const cursed = Object.entries(freq).filter(([,v]) => v === losses.length).map(([k]) => k);
          return (
            <>
              <SectionDivider />
              <div id="season-tyler" style={L}>The Tyler Losses Files</div>
              <div style={{ ...C(), marginBottom: 'var(--space-section-gap)', borderColor: dark ? "rgba(248,113,113,.2)" : "rgba(248,113,113,.15)", background: dark ? "rgba(248,113,113,.03)" : "rgba(248,113,113,.02)" }}>
                <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.6, marginBottom: 14 }}>Tyler has lost exactly {losses.length} series. Every single one is catalogued below. The group text demanded forensic accountability.</div>
                {losses.map((loss, i) => (
                  <div key={i} style={{ padding: isCompact ? '10px 12px' : "12px 14px", background: dark ? 'rgba(239,68,68,.06)' : 'rgba(239,68,68,.05)', borderRadius: 10, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{loss.day}</div>
                      <div style={{ fontSize: 'var(--type-body-sm)', color: t.red, fontWeight: 600 }}>Lost {loss.score}</div>
                    </div>
                    <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.6 }}><strong style={{ color: t.text }}>Tyler{"'"}s teammates:</strong> {loss.teammates.join(", ") || "(solo, apparently)"}</div>
                    <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.6 }}><strong style={{ color: t.text }}>Opposing team:</strong> {loss.opponents.join(", ")}</div>
                  </div>
                ))}
                {cursed.length > 0 && (
                  <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.55, marginTop: 10, paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
                    <strong style={{ color: t.red }}>The Curse Suspects:</strong> {cursed.join(", ")} {cursed.length === 1 ? "has" : "have"} been on Tyler{"'"}s team for every single one of his losses. Cosmic coincidence or smoking gun? Jury{"'"}s out.
                  </div>
                )}
              </div>
            </>
          );
        })()}

        {/* THE 7/7 CLUB */}
        <SectionDivider />
        <div id="season-club" style={L}>The 7/7 Club</div>
        <div style={{ ...C(), marginBottom: 'var(--space-section-gap)', borderColor: dark ? "rgba(251,191,36,.2)" : "rgba(202,138,4,.15)", background: dark ? "rgba(251,191,36,.04)" : "rgba(202,138,4,.03)" }}>
          <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.6, marginBottom: 14 }}>Three players have shot perfect from the field in a single game and scored every one of their team{"'"}s seven points. This club is exclusive, unintentional, and possibly cursed.</div>
          <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : isWide ? "1fr 1fr 1fr" : "1fr 1fr", gap: 10 }}>
            <div style={{ padding: "14px", background: dark ? 'rgba(251,191,36,.06)' : 'rgba(251,191,36,.05)', borderRadius: 10, border: `1px solid ${dark ? "rgba(251,191,36,.15)" : "rgba(251,191,36,.2)"}` }}>
              <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 4 }}>FOUNDING MEMBER</div>
              <div style={{ ...S, fontSize: 'var(--type-title)', color: t.text }}>Gabe</div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, marginTop: 4, lineHeight: 1.5 }}>Mon 3/23 · Game 1<br />Three threes and a layup. Was mortal again by Game 2.</div>
            </div>
            <div style={{ padding: "14px", background: dark ? 'rgba(251,191,36,.06)' : 'rgba(251,191,36,.05)', borderRadius: 10, border: `1px solid ${dark ? "rgba(251,191,36,.15)" : "rgba(251,191,36,.2)"}` }}>
              <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 4 }}>SECOND MEMBER</div>
              <div style={{ ...S, fontSize: 'var(--type-title)', color: t.text }}>Tyler</div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, marginTop: 4, lineHeight: 1.5 }}>Fri 3/27 · Game 2<br />Capped a 4-0 sweep. Tyler does this kind of thing.</div>
            </div>
            <div style={{ padding: "14px", background: dark ? 'rgba(251,191,36,.06)' : 'rgba(251,191,36,.05)', borderRadius: 10, border: `1px solid ${dark ? "rgba(251,191,36,.15)" : "rgba(251,191,36,.2)"}` }}>
              <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 4 }}>NEWEST MEMBER</div>
              <div style={{ ...S, fontSize: 'var(--type-title)', color: t.text }}>Lee</div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, marginTop: 4, lineHeight: 1.5 }}>Fri 5/1 · Pivotal Game 5<br />Three threes and a layup in a pivotal Game 5. Blue won the series 4-3.</div>
            </div>
          </div>
        </div>

        {/* ALGORITHM MATCHUP */}
        {(() => {
          const candidates = Object.entries(players)
            .filter(([, d]) => d.w + d.l >= 5)
            .map(([n, d]) => ({ name: n, wpct: d.w / (d.w + d.l), games: d.g }))
            .sort((a,b) => b.games - a.games)
            .slice(0, 8);
          if (candidates.length < 8) return null;
          const sorted2 = [...candidates].sort((a,b) => b.wpct - a.wpct);
          const teamA = [], teamB = [];
          let sumA = 0, sumB = 0;
          sorted2.forEach(p => {
            if (sumA <= sumB) { teamA.push(p); sumA += p.wpct; }
            else { teamB.push(p); sumB += p.wpct; }
          });
          const predA = (sumA / teamA.length * 100).toFixed(0);
          const predB = (sumB / teamB.length * 100).toFixed(0);
          const diff = Math.abs(parseFloat(predA) - parseFloat(predB)).toFixed(0);
          const renderTeamPanel = (team, label, color, pred) => (
            <div style={{ padding: 'var(--space-card-padding)', background: t.inset, borderRadius: 10 }}>
              <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color, marginBottom: 8 }}>{label} · AVG {pred}%</div>
              {team.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 'var(--type-body)' }}>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                  <span style={{ color: t.t3, fontSize: 'var(--type-body-sm)' }}>{Math.round(p.wpct * 100)}%</span>
                </div>
              ))}
            </div>
          );
          return (
            <>
              <SectionDivider />
              <div id="season-algorithm" style={L}>The Algorithm{"'"}s Matchup</div>
              <div style={{ ...C(), marginBottom: 'var(--space-section-gap)', borderColor: dark ? "rgba(52,211,153,.2)" : "rgba(22,163,74,.15)", background: dark ? "rgba(52,211,153,.03)" : "rgba(22,163,74,.02)" }}>
                <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.6, marginBottom: 14 }}>
                  <strong style={{ color: t.green }}>Computed from actual data.</strong> Top 8 players by games played, sorted by win percentage, greedy-balanced to minimize predicted differential. No vibes, no feelings, just math at 4:45 AM.
                </div>
                {isCompact ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {renderTeamPanel(teamA, "TEAM A", t.accent, predA)}
                    <div style={{ textAlign: "center", ...S, fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic", padding: "4px 0" }}>vs</div>
                    {renderTeamPanel(teamB, "TEAM B", t.blue, predB)}
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {renderTeamPanel(teamA, "TEAM A", t.accent, predA)}
                    {renderTeamPanel(teamB, "TEAM B", t.blue, predB)}
                  </div>
                )}
                <div style={{ fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.55, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${t.border}`, fontStyle: "italic" }}>
                  Predicted differential: {diff} percentage points. Closer to zero = closer to fair. Someone on this list is a ceiling. Someone else is an anchor. The spreadsheet knows. The spreadsheet always knows.
                </div>
              </div>
            </>
          );
        })()}
      </div>
    );
  };

  let view;
  const currentMonth = MONTHS.find(m => m.id === tab);
  if (tab === "summary") view = renderSummary();
  else if (tab === "season") view = renderSeason();
  else if (currentMonth) view = renderMonth(currentMonth);
  else view = renderSummary();

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: "'Outfit',sans-serif", minHeight: "100vh", transition: "background .3s,color .3s" }}>
      <style dangerouslySetInnerHTML={{ __html: "@media(prefers-reduced-motion:reduce){*{transition:none!important}}" }} />
      <main style={{ maxWidth: 'var(--content-max)', margin: "0 auto", padding: "var(--space-page-top) var(--space-page-x) var(--space-page-bot)" }}>
        <div style={{ display: "flex", flexDirection: isCompact ? "column" : "row", justifyContent: "space-between", alignItems: isCompact ? "flex-start" : "flex-start", gap: isCompact ? 16 : 0, marginBottom: 'var(--space-section-gap)', paddingBottom: 'var(--space-section-gap)', borderBottom: `1px solid ${t.border}` }}>
          <div>
            <div style={{ fontSize: 'var(--type-label)', fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 8 }}>4:45 AM · Middle School Gym · 3 Months Deep</div>
            <h1 style={{ ...S, fontSize: "var(--type-display)", fontWeight: 400, letterSpacing: -1, lineHeight: 1.05, margin: 0 }}>Morning <em style={{ fontStyle: "italic", color: t.accent }}>Hoops</em></h1>
            <p style={{ fontSize: 'var(--type-body)', color: t.t2, marginTop: 8, maxWidth: 500, lineHeight: 'var(--type-body-lh)' }}>A group of grown adults wake up before the sun to play 7-game series where children learn fractions. Tyler is mortal. Gabe is everywhere. Cal is occasionally in Florida. Sean is asleep. Nobody has explained how they're all available at 4:45 AM.</p>
          </div>
          <button onClick={() => setDark(!dark)} aria-label="Toggle dark/light mode" style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: isCompact ? "6px 10px" : "8px 14px", cursor: "pointer", color: t.t2, fontSize: isCompact ? 10 : 11, fontWeight: 600, fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 6, marginTop: isCompact ? 0 : 8, minHeight: 44 }}>{dark ? "☀️" : "🌙"} {dark ? "Light" : "Dark"}</button>
        </div>

        <nav role="tablist" style={{ display: "flex", gap: 6, marginBottom: 'var(--space-section-gap)', overflowX: "auto", WebkitOverflowScrolling: "touch", padding: 4, background: t.inset, borderRadius: 999, scrollbarWidth: "none", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
          {tabs.map(tb => <button key={tb.id} role="tab" aria-selected={tab === tb.id} onClick={() => setTab(tb.id)} style={{ background: tab === tb.id ? t.card : "transparent", border: tab === tb.id ? `1px solid ${t.border}` : "1px solid transparent", borderRadius: 999, padding: "8px 16px", cursor: "pointer", fontSize: 'var(--type-body)', fontWeight: tab === tb.id ? 700 : 500, color: tab === tb.id ? t.accent : t.t2, fontFamily: "'Outfit',sans-serif", transition: "all .15s", whiteSpace: "nowrap", minHeight: 44, minWidth: 44 }}>{tb.label}</button>)}
        </nav>

        <div style={{ display: "flex", gap: 16, marginBottom: 20, fontSize: 'var(--type-body-sm)', color: t.t3, justifyContent: isCompact ? "center" : "flex-start" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Dot team="blue" dark={dark} /> Blue team</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Dot team="white" dark={dark} /> White team</span>
        </div>

        <div role="tabpanel">
          {view}
        </div>
      </main>

      <footer style={{ textAlign: "center", fontSize: 'var(--type-label)', color: t.t3, paddingBottom: 40, lineHeight: 1.7 }}>
        <span style={{ color: t.accent }}>Morning Hoops</span> · 7-Game Series · Verified from spreadsheet<br />
        Played at 4:45 AM. Tyler is mortal. Gabe is unkillable. Cal is under investigation. The spreadsheet is gospel.
      </footer>
    </div>
  );
}

function uniquePlayers(players) { return Object.keys(players).length; }
