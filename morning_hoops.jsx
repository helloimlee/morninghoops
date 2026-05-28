import { useState, useMemo, useEffect, useRef } from "react";

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
  { day: "Mon 5/4", month: "May", blue: ["Nathan","Wags","Lee","Cal"], white: ["Ryan","Kyle","Chad","Jared"], winner: "blue", score: "4-2", note: "The Dynasty reunited. Nathan, Wags, Lee & Cal — a superteam forged years ago through dozens of undefeated series — reassembled on Blue and dispatched White 4-2. They also won the in-season tournament, which is the one that actually matters. Four men. One shared delusion of grandeur. Zero apologies." },
  { day: "Tue 5/5", month: "May", blue: [], white: [], winner: null, score: null, note: "2 showed (Nathan, Lee). No game." },
  { day: "Wed 5/6", month: "May", blue: ["Lee","Mike","Gabe","Jared","Tyler"], white: ["Nathan","Chad","Cal"], winner: "blue", score: "4-3" },
  { day: "Thu 5/7", month: "May", blue: [], white: [], winner: null, score: null, note: "6 showed (Nathan, Lee, Gabe, Wags, Jared, Cal). No game." },
  { day: "Fri 5/8", month: "May", blue: ["Nathan","Kyle","Tyler","Cal"], white: ["Lee","Mike","Gabe","Mitch"], winner: "blue", score: "4-1" },
  { day: "Mon 5/11", month: "May", blue: ["Nathan","Gabe","Wags","Cal"], white: ["Sean","Ryan","Tyler","Jared"], winner: "blue", score: "4-3", note: "PHS GRADS vs All" },
  { day: "Tue 5/12", month: "May", blue: [], white: [], winner: null, score: null, note: "No game. 6 showed (Nathan, Sean, Gabe, Ryan, Wags, Cal)." },
  { day: "Wed 5/13", month: "May", blue: ["Nathan","Mike","Ryan","Tyler"], white: ["Gabe","Sean","Jared","Cal"], winner: "white", score: "4-3", note: "Old Vs Young" },
  { day: "Thu 5/14", month: "May", blue: [], white: [], winner: null, score: null, note: "No game. 5 showed (Nathan, Sean, Gabe, Ryan, Wags)." },
  { day: "Fri 5/15", month: "May", blue: [], white: [], winner: null, score: null, note: "No game. 8 showed (Nathan, Mike, Gabe, Ryan, Tyler, Mitch, Jared, Cal)." },
  { day: "Mon 5/18", month: "May", blue: ["Lee","Tyler","Gabe","Mike"], white: ["Nathan","Wags","Ryan","Chad"], winner: "white", score: "4-3" },
  { day: "Tue 5/19", month: "May", blue: [], white: [], winner: null, score: null, note: "No game." },
  { day: "Wed 5/20", month: "May", blue: ["Lee","Mike","Tyler","Gabe"], white: ["Nathan","Chad","Wags","Ryan"], winner: "white", score: "4-2", note: "Ryan hit a sick game-winning 3. Classic Chad was a flamethrower post vacation. Gabe wants the record to reflect Lee only had two points the entire series." },
  { day: "Thu 5/21", month: "May", blue: [], white: [], winner: null, score: null },
  { day: "Fri 5/22", month: "May", blue: ["Chad", "Lee", "Jared", "Mike", "Tyler"], white: ["Nathan", "Kyle", "Ryan", "Gabe", "Cody"], winner: "white", score: "4-1" },
  { day: "Mon 5/25", month: "May", blue: ["Mike", "Tyler", "Kyle", "Jared"], white: ["Nathan", "Chad", "Lee", "Ryan"], winner: "blue", score: "4-0", note: "Lee slept in past his alarm on a Monday. A Monday. The man who built this app couldn't even set a working alarm for it. His team got swept 4-0 while he was horizontal. Lee posted a lifetime-worst performance of being asleep. Dynasty founder. App creator. Alarm clock casualty." },
  { day: "Tue 5/26", month: "May", blue: [], white: [], winner: null, score: null },
  { day: "Wed 5/27", month: "May", blue: ["Lee", "Ryan", "Nathan", "Gabe"], white: ["Jared", "Mike", "Wags", "Cal"], winner: "white", score: "4-1" },
  { day: "Thu 5/28", month: "May", blue: ["Lee", "Wags", "Nathan", "Cal"], white: ["Jared", "Cody", "Ryan", "Gabe"], winner: "blue", score: "4-3", note: "The Dynasty returned in the Amici's Pizza Memorial Gymnasium — affectionately known as the Gaybe Gym — and won a tight one 4-3. The brotherhood doesn't forget how to win." },
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
    name: "The Dynasty Returns",
    commentary: "May opened with Dane's debut and Lee's 7/7 masterpiece on 5/1 — three threes and a layup, every Blue point in a game-7 series win. On 5/4, The Dynasty reunited: Nathan, Wags, Lee & Cal reassembled on Blue, dismantled White 4-2, and won the in-season tournament. The one that actually matters. On 5/5, only Nathan and Lee showed up — two humans short of basketball and one short of a reason to have driven there. On 5/6, five adults beat three adults 4-3 (heroic is one word). On 5/8, Blue (Nathan/Kyle/Tyler/Cal) beat White 4-1. On 5/11, PHS GRADS (Nathan/Gabe/Wags/Cal) clipped White 4-3. On 5/13, Old vs Young ended with White (Gabe/Sean/Jared/Cal) winning 4-3 — youth prevailed, or maybe just Cal. On 5/18, White (Nathan/Wags/Ryan/Chad) took down Blue (Lee/Tyler/Gabe/Mike) 4-3. May finished 5-2 Blue overall. Three no-games in a single week (5/12, 5/14, 5/15) suggest the league's attendance policy is 'optional, like deodorant at 4:45 AM.'",
    insight: "Blue went 5-2 in May. The Dynasty reunion on 5/4 remains the emotional peak. The 5/13 Old vs Young showdown ended with 'Young' winning, though Cal's presence on either team should require an age waiver. The 5/18 session saw Tyler take a rare L on Blue — paired with Mike, whose 5-16 career record may qualify as a federal disaster area. Mitch's career stands at 1-4. The honeymoon didn't just end; it filed for divorce. White finally got a couple of wins late in May, preventing what would have been an actual humanitarian crisis.",
  },
];

const CORRELATIONS = [
  { name: "Nathan", tag: "Structural Beam / Dynasty", desc: "26-15 lifetime. Has appeared in every single session rosters were recorded. Blue in 26 of 41. Nathan is not a player; he is a Blue jersey with legs and a pulse. If Morning Hoops were a building, Nathan would be the foundation, the walls, and most of the plumbing. Dynasty charter member, tournament champion, and the only man whose attendance record qualifies as a civil engineering project.", roast: "63% win rate sounds impressive until you realize he's been carried by Cal more times than a grocery bag. Shows up every single day like a man running from something — probably his alarm clock, possibly his life choices. Built the entire league just so he'd have somewhere to be at 4:45 AM, which is either dedication or a cry for help disguised as a jump shot. The 'Structural Beam' nickname is generous — more like the guy who won't leave the party because he organized it." },
  { name: "Tyler", tag: "Still Elite, Fully Human", desc: "16-7 lifetime (69.6%). Started 6-0 and seemed immortal. Has since proven he bleeds. Scored all 7 in game 2 of Fri 3/27 going 7/7 from the field. Charter member of the 7/7 Club. Still owns the second-best win rate in the league, and the only player whose absence immediately becomes the explanation for why his team lost.", roast: "16-7 and a 70% win rate, which he'll remind you about while you're still putting your shoes on. Started the season undefeated and treated his first loss like a death in the family. The whole group chat held a vigil. Tyler doesn't play basketball — he conducts a TED Talk in athletic shorts about why he's better than you. The 7/7 game was genuinely filthy, but he's been dining out on it for three months like a guy who peaked in high school. Oh wait." },
  { name: "Gabe", tag: "Quietly Dominant", desc: "21-14 lifetime (60.0%). Plays nearly every day, wins more than he loses, and does it all with the public profile of a filing cabinet. Founded the 7/7 Club on Mon 3/23 without telling anyone. Gabe is the league's most reliable piece of furniture — always there, always functional, occasionally load-bearing.", roast: "21-14 and nobody knows. Gabe has the personality of a well-maintained appliance. He shows up, shoots, wins 60% of the time, and goes home without making a single memory. Founded the 7/7 Club and didn't even celebrate — just clocked out like a man finishing a shift at the emotional factory. If Gabe were a spice, he'd be flour. If he were a book, he'd be the terms and conditions. His game is legitimately good. His vibes are legitimately nonexistent." },
  { name: "Cal", tag: "Flamethrower / Dynasty", desc: "22-9 lifetime (71.0%) — best win rate in the league. On Thu 4/9 hit six consecutive threes in the post-sweep run. On Wed 4/15 got swept 0-4. A meteorological event: you can't predict him, you can only evacuate. Spends a suspicious amount of time in Florida. Dynasty charter member and in-season tournament champion.", roast: "71% win rate. Highest in the league. And somehow Cal acts like HE'S the underdog. Hit six straight threes on 4/9 like the rim owed him money, then got swept three days later because God needed to nerf him. Spends half his life in Florida and the other half making everyone in Indiana feel bad about themselves. The 'Flamethrower' nickname came from his shooting; the 'Flight Risk' nickname came from his attendance. If Cal ever committed to a full season the win rate would either hit 80% or implode from the pressure of actually having to show up on consecutive days." },
  { name: "Wags", tag: "Solid Citizen / Dynasty", desc: "13-12 lifetime (52.0%). Plays a lot. Wins a respectable amount. Doesn't make headlines. Has a #23 inexplicably appended to his name in the spreadsheet. Dynasty charter member, in-season tournament champion, and the dictionary definition of 'reliable contributor' — which sports media calls a compliment but humans call boring.", roast: "13-12. Exactly one game over .500. Wags put '#23' next to his name like he's honoring Jordan, but his 52% win rate is honoring mediocrity. Dynasty member, tournament champion, and somehow still the fourth-most interesting person in a four-man group. Wags is the human equivalent of a Honda Civic — reliable, present, and absolutely nobody's first choice. He will show up. He will contribute. He will leave no lasting impression. The banner hangs in his heart. Nobody else notices it." },
  { name: "Ryan", tag: "Always There, Never Remembered", desc: "17-17 lifetime (50.0%). Plays nearly as much as Nathan and Gabe but somehow gets less screentime in the group chat. A perfectly average record achieved through maximum attendance. Ryan is the .500 line made flesh.", roast: "17-17. Perfectly .500. Ryan has played 34 decided series and the universe has concluded he is exactly average. He shows up more than almost anyone and the reward is a record so unremarkable it could be a screensaver. Ryan is the human control group of Morning Hoops — remove him and the experiment stays the same. He once subbed in at 4:45 AM for someone who couldn't make it, which means he's not just mediocre, he's EAGERLY mediocre. Nobody has ever said 'we need Ryan on our team' with urgency." },
  { name: "Jared", tag: "Streak Engine / L Collector", desc: "11-16 lifetime (40.7%). Wildly streaky — his career trajectory looks like a heart monitor. Shows up, tries hard, and the universe decides what happens next. The spreadsheet treats him less like a player and more like a weather pattern.", roast: "11-16. A 41% win rate, which is the statistical equivalent of bringing a pool noodle to a sword fight. Jared's career is a series of small tragedies connected by even smaller hopes. He'll win two in a row and you'll think 'okay, he's turning a corner,' and then he'll lose four straight like the corner was actually a cliff. The most dangerous place in Morning Hoops is between Jared and a losing streak — not because he'll hurt you, but because the sadness is contagious." },
  { name: "Chad", tag: "The Disappearer", desc: "11-12 lifetime (47.8%). Vanishes for entire weeks without explanation, reappears with no apology, just vibes. Has a 'distinguished twin' named Chadwick who debuted on 4/14. The two have never been seen in the same building.", roast: "11-12. Chad has missed more sessions than some players have attended, and when he does show up, he plays like a man who just remembered basketball exists. His 'twin' Chadwick appeared once and lost, which means both versions of Chad are below .500. Chad doesn't have a basketball identity — he has a restraining order against consistency. Ghosts at least have the decency to haunt the same house. Chad can't even commit to that." },
  { name: "Kyle", tag: "Ghost Mode", desc: "Kyle's attendance is so sporadic that each appearance feels like a season premiere. His strategy of 'not being here' may genuinely be outperforming several people who are.", roast: "Kyle's so absent from this league that listing him feels like an act of charity. Every time he shows up it's like a celebrity sighting — brief, confusing, and ultimately disappointing for everyone involved. His attendance record looks like a barcode. The league doesn't miss him so much as periodically remember he exists. Kyle treats Morning Hoops the way most people treat the gym in January: shows up twice, buys the outfit, vanishes by February." },
  { name: "Sean", tag: "Team Black Prophet / 40% Effort", desc: "8-12 lifetime (40.0%). Predicted 'team black' from his couch in a league with blue and white jerseys, then returned to the court and kept losing. The Wed 4/29 spreadsheet refers to him as 'Sean aka big dumb b——,' which is an editorial decision that earned this league its accreditation.", roast: "8-12. A 40% win rate, which coincidentally matches his effort level. Sean predicted 'team black' from his couch for a league that only has blue and white jerseys — the kind of confidence that can only come from someone who doesn't let facts interfere with opinions. The spreadsheet literally calls him 'big dumb b——' and nobody objected, which tells you everything about his standing in the community. Sean shows up late, loses, and then explains in the group chat why it wasn't his fault. He is the human equivalent of a participation trophy — present, technically involved, and fooling nobody." },
  { name: "Mike", tag: "Birthday Boy / Walking L", desc: "5-16 lifetime (23.8%) — worst win rate among regulars. Got swept on his birthday weekend. Defense remains a thought experiment across three months of data.", roast: "5-16. Twenty-three percent. Mike's win rate is lower than the interest rate on a savings account. He got the day off for his birthday, came back the next day, and got swept 0-4 — the gym's way of saying 'happy birthday, here's four Ls and a cupcake.' Mike has played 21 decided series and won five of them, which means putting Mike on your team is statistically worse than flipping a coin. His defense has been described as 'philosophical,' then upgraded to 'conceptual art,' and has now reached its final form: 'imaginary.' If losing were a skill, Mike would be the Tyler of losing." },
  { name: "Mitch", tag: "Baptized at Birth", desc: "1-4 lifetime (20.0%). Got swept 0-4 in his debut on Fri 3/27. Won once on 4/24, then resumed losing. The honeymoon is over. The league is now just marriage.", roast: "1-4. Twenty percent win rate. Mitch showed up to his first-ever Morning Hoops session and got swept 0-4 like the gym was performing an exorcism. He won exactly once — on 4/24 — and has been chasing that high like a man who found twenty dollars on the ground and now checks every sidewalk. His career record is 1-4, which means four out of five times Mitch shows up, the other team thanks God. The 'Welcome to the League' playlist has been on repeat since March. At this point it's his entrance music." },
  { name: "Lee", tag: "7/7 Club / Dynasty / Mr. .500", desc: "16-17 lifetime (48.5%). Won a Dynasty championship on 5/4. 7/7 Club member (Fri 5/1). The most .500 career in sports history — every triumph is immediately followed by a correction, like a stock market for people who can't guard a pick-and-roll.", roast: "16-17. Lee built the entire dashboard, computed everyone's stats, and STILL can't get his own record above .500. That's not irony — that's a hostage situation. He went 7/7 on 5/1 like a man possessed, then followed it up by continuing to hover around .500 like it's a lifestyle choice. Dynasty champion, 7/7 Club member, and the living proof that hardware doesn't fix your record. Lee's career is the basketball equivalent of running a marathon and finishing in the exact middle of the pack — impressive effort, aggressively average outcome. The man wakes up at 4:30 AM to be mediocre. Respect." },
  { name: "Cody", tag: "Bathroom Break", desc: "On Thursday 4/9 Cody missed the tip of game one because he was conducting important gastrointestinal business in the facilities. Blue got swept 0-4. The forensic asterisk will follow him forever.", roast: "Cody's most memorable Morning Hoops moment happened in the bathroom. That's the tweet. That's the legacy. On 4/9 he missed tip-off because nature called and he answered on company time. His team got swept 0-4. Correlation isn't causation, but the jury is leaning heavily toward 'this is your fault.' The plumbing has not been investigated. The asterisk is permanent." },
  { name: "Chadwick", tag: "Chad's Distinguished Twin", desc: "Debuted Tuesday 4/14. Is supposedly Chad's twin. Nobody has ever seen Chad and Chadwick in the same room. Currently cataloged as 'unsolved.'", roast: "Showed up once, lost, and vanished — which is exactly what a fake identity WOULD do. The investigation remains open." },
  { name: "Dane", tag: "One and Done", desc: "Debuted Friday 5/1 on White. Lost. Has not been seen since. Dane is 0-1 lifetime — he showed up once, took an L, and retired at the bottom.", roast: "0-1 lifetime. Dane showed up to one session, lost, and was never seen again. Most people call that 'quitting.' Dane calls it 'unfinished business he has no intention of finishing.' The only player whose entire career can be summarized in a single word: 'no.'" },
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
      if (!p[n]) p[n] = { g: 0, w: 0, l: 0, bt: 0, wt: 0, bw: 0, ww: 0, gw: 0, gl: 0 };
      p[n].g++; p[n][team === "blue" ? "bt" : "wt"]++;
      if (s.winner === "blue") { p[n].bw++; if (team === "blue") p[n].w++; else p[n].l++; }
      else if (s.winner === "white") { p[n].ww++; if (team === "white") p[n].w++; else p[n].l++; }
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
  return (
    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: team === "blue" ? "#3B6BF5" : (dark ? "#94A3B8" : "#64748B"), marginRight: 5, flexShrink: 0, position: "relative" }}>
      <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", borderWidth: 0 }}>
        {team === "blue" ? "Blue team" : "White team"}
      </span>
    </span>
  );
}

export default function App() {
  const [tab, setTab] = useState("summary");
  const [statsMode, setStatsMode] = useState("series"); // "series" | "games"
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("morning-hoops-theme");
    if (stored) return stored === "dark";
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return false;
    return true;
  });
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "regular";
    const w = window.innerWidth;
    return w < 480 ? "compact" : w < 768 ? "regular" : "wide";
  });

  useEffect(() => {
    localStorage.setItem("morning-hoops-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
    const metaThemeColorLight = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
    const color = dark ? '#111113' : '#FAFAF8';
    if (metaThemeColor) metaThemeColor.setAttribute('content', color);
    if (metaThemeColorLight) metaThemeColorLight.setAttribute('content', color);
  }, [dark]);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setBp(w < 480 ? "compact" : w < 768 ? "regular" : "wide");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [tab]);

  const isCompact = bp === "compact";  // < 480px (phones)
  const isRegular = bp === "regular";  // 480-767px (large phones, small tablets)
  const isWide = bp === "wide";     // ≥ 768px (tablets, desktop)


  const stats = useMemo(() => getStats(SESSIONS), []);
  const { p: players, totalS, uniqueCount, avgPerSession, topRivals, topTeammates, playerLosses, teammateReport, bestPairs, worstPairs } = stats;

  const t = {
    bg: dark ? "#09090B" : "#F7F6F3", card: dark ? "#16161A" : "#FFFFFF", inset: dark ? "#0D0D0F" : "#EDECEB",
    border: dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)", text: dark ? "#EDEDEF" : "#1A1A1A",
    t2: dark ? "#A1A1AA" : "#6B7280", t3: dark ? "#71717A" : "#6B7280",
    accent: "#EF6234", blue: dark ? "#5B8DEF" : "#3B6BF5", white: dark ? "#B4BCD0" : "#64748B",
    green: "#34D399", gold: "#FBBF24", red: "#F87171",
  };

  const C = (x = {}) => ({ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 'var(--space-card-pad)', ...x });
  const L = { fontSize: 'var(--type-label-lg)', fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: t.t3, marginBottom: 14 };
  const S = { fontFamily: "'Instrument Serif',serif" };

  const SectionDivider = () => (
    <div style={{ borderTop: `1px solid ${t.border}`, margin: 'var(--space-section) 0 20px', paddingTop: 20 }} />
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
          <div style={{ padding: '14px var(--space-card-pad)', borderBottom: i < len - 1 ? `1px solid ${t.border}` : "none", opacity: rowOpacity }}>
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
            <div style={{ padding: '0 var(--space-card-pad) 8px', borderLeft: `2px solid ${t.accent}`, marginLeft: 'var(--space-card-pad)', fontSize: 'var(--type-label)', color: t.accent, fontWeight: 600, fontStyle: "italic", letterSpacing: '0.025em' }}>{s.note}</div>
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
        <div style={{ display: "grid", gridTemplateColumns: "minmax(60px,72px) 1fr 24px 1fr minmax(60px,80px)", alignItems: "center", padding: "12px 16px", borderBottom: i < len - 1 ? `1px solid ${t.border}` : "none", gap: 'var(--space-card-gap)', opacity: rowOpacity }}>
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
        {s.note && !noGame && <div style={{ padding: `0 16px 10px ${isCompact ? '16px' : isWide ? '90px' : '48px'}`, fontSize: 'var(--type-label)', color: t.accent, fontWeight: 600, fontStyle: "italic", letterSpacing: '0.025em' }}>{s.note}</div>}
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
        padding: isCompact ? '8px var(--space-card-pad)' : "8px 16px",
        background: t.inset,
        borderTop: `1px solid ${t.border}`,
        borderBottom: `1px solid ${t.border}`,
        gap: 'var(--space-card-gap)',
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
            gap: 'var(--space-card-gap)',
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
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section)' }}>
          <div style={{ padding: 'var(--space-card-pad)', borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.65 }}>{m.commentary}</div>
          {weeks.map((week, wIdx) => (
            <div key={wIdx}>
              {renderWeekHeader(week)}
              {week.sessions.map((s) => {
                const idx = globalIdx++;
                return renderGame(s, idx, totalGames);
              })}
            </div>
          ))}
          <div style={{ padding: 'var(--space-card-pad)', paddingLeft: 18, background: t.inset, borderLeft: `2px solid ${t.accent}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.65, borderTop: `1px solid ${t.border}` }}><span style={{ color: t.accent, fontWeight: 700 }}>Debrief: </span>{m.insight}</div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    const decided = SESSIONS.filter(s => s.winner);
    const bW = decided.filter(s => s.winner === "blue").length;
    const wW = decided.filter(s => s.winner === "white").length;
    const sweeps = decided.filter(s => s.score === "4-0").length;
    const isByGames = statsMode === "games";
    const getW = (d) => isByGames ? d.gw : d.w;
    const getL = (d) => isByGames ? d.gl : d.l;
    const winSorted = Object.entries(players).filter(([, d]) => getW(d) + getL(d) >= 3).sort((a, b) => (getW(b[1]) / (getW(b[1]) + getL(b[1]))) - (getW(a[1]) / (getW(a[1]) + getL(a[1]))));
    const topWinners = winSorted.slice(0, 5);
    const bottomWinners = [...winSorted].reverse().slice(0, 3);

    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={L}>Season Summary</div>
          <h2 style={{ ...S, fontSize: 'var(--type-headline)', color: t.text, margin: 0, fontWeight: 400 }}>The State of the Gym</h2>
          <div style={{ fontSize: 'var(--type-body)', color: t.t2, marginTop: 6, lineHeight: 1.6, maxWidth: 'var(--space-prose-max)' }}>
            {decided.length} decided 7-game series. {uniquePlayers(players)} players. Blue leads {bW}–{wW}. The Dynasty reunited on 5/4 and won both the series and the in-season tournament. May finished 5-2 Blue — White finally scratched out a couple late wins to prevent full-blown humanitarian intervention. Blue{"'"}s overall league dominance is no longer a trend; it{"'"}s a zoning violation. Anyway, here{"'"}s the summary.
          </div>
        </div>

        {/* HEADLINE STATS — editorial pull-quote */}
        <div style={{ ...S, fontSize: 'var(--type-title)', fontStyle: "italic", color: t.t2, lineHeight: 1.7, marginBottom: 'var(--space-section)', padding: "20px 0 20px 20px", borderLeft: `2px solid ${t.accent}`, maxWidth: 'var(--space-prose-max)' }}>
          <span style={{ color: t.accent }}>{decided.length}</span> series decided. Blue leads <span style={{ color: t.accent }}>{bW}–{wW}</span> in the overall, with <span style={{ color: t.accent }}>{sweeps}</span> sweeps and <span style={{ color: t.accent }}>{uniquePlayers(players)}</span> players who{"'"}ve touched the court, averaging <span style={{ color: t.accent }}>{avgPerSession}</span> per session.
        </div>

        {/* SUMMARY STAT BOXES — compact: 2-col, regular: 3-col, wide: 4-col */}
        <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr 1fr" : isWide ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", gap: 'var(--space-card-gap)', marginBottom: 'var(--space-section)' }}>
          {[
            { v: String(bW), l: "Blue Wins", c: t.blue },
            { v: String(wW), l: "White Wins", c: t.white },
            { v: String(sweeps), l: "Sweeps", c: t.accent },
            { v: avgPerSession, l: "Avg/Session", c: t.green },
          ].map((m, i) => (
            <div key={i} data-stat-card="" style={{ textAlign: "center", background: t.inset, borderRadius: 8, padding: isCompact ? '10px 8px' : 12 }}>
              <div style={{ ...S, fontSize: 'var(--type-stat-lg)', color: m.c, lineHeight: 1 }}>{m.v}</div>
              <div style={{ fontSize: 'var(--type-label)', color: t.t3, fontWeight: 600, marginTop: 3 }}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* TOP 5 WIN RATES */}
        {/* STATS MODE TOGGLE */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={L}>Top 5 Win Rates {isByGames ? "(Individual Games)" : "(min 3 series)"}</div>
          <div style={{ display: "flex", background: t.inset, borderRadius: 999, padding: 3, marginBottom: 14, border: `1px solid ${t.border}` }}>
            {[{ id: "series", label: "Series" }, { id: "games", label: "Games" }].map(m => (
              <button key={m.id} onClick={() => setStatsMode(m.id)} style={{ background: statsMode === m.id ? t.card : "transparent", border: statsMode === m.id ? `1px solid ${t.border}` : "1px solid transparent", borderRadius: 999, padding: "5px 12px", cursor: "pointer", fontSize: 'var(--type-label)', fontWeight: statsMode === m.id ? 700 : 500, color: statsMode === m.id ? t.accent : t.t3, fontFamily: "'Outfit',sans-serif", transition: "all .15s", whiteSpace: "nowrap", minHeight: 32 }}>{m.label}</button>
            ))}
          </div>
        </div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section)' }}>
          {topWinners.map(([name, d], i) => {
            const w = getW(d); const l = getL(d); const dec = w + l; const pct = Math.round(w / dec * 100);
            if (isCompact) {
              return (
                <div key={name} style={{ padding: '12px var(--space-card-pad)', borderBottom: i < topWinners.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 'var(--space-card-gap)' }}>
                      <span style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent }}>{i + 1}</span>
                      <span style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</span>
                    </div>
                    <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green, flexShrink: 0 }}>{pct}%</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, minWidth: 40 }}>{w}-{l}</div>
                    <div style={{ flex: 1, height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} win rate: ${pct}%`}>
                      <div style={{ height: "100%", width: `${pct}%`, background: t.green, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "24px 1fr 80px 1fr 60px", alignItems: "center", padding: "12px var(--space-card-pad)", borderBottom: i < topWinners.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent }}>{i + 1}</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</div>
                <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600 }}>{w}-{l}</div>
                <div style={{ height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} win rate: ${pct}%`}><div style={{ height: "100%", width: `${pct}%`, background: t.green, borderRadius: 3 }} /></div>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green, textAlign: "right" }}>{pct}%</div>
              </div>
            );
          })}
        </div>

        {/* TOP PARTNERSHIPS */}
        <SectionDivider />
        <div style={L}>Best Partnerships (min 3 series together)</div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section)' }}>
          <div style={{ padding: 'var(--space-card-pad)', borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.5 }}>The pairs that win together. If you want to engineer a W, put these two on the same team and get out of their way.</div>
          {bestPairs.map((pair, i) => isCompact ? (
            <div key={i} style={{ padding: '10px var(--space-card-pad)', borderBottom: i < bestPairs.length - 1 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 'var(--space-card-gap)' }}>
                  <span style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green }}>{i + 1}</span>
                  <span style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{pair.a} + {pair.b}</span>
                </div>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green, flexShrink: 0 }}>{Math.round(pair.pct * 100)}%</div>
              </div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, marginTop: 2, paddingLeft: 28 }}>{pair.w}-{pair.l}</div>
            </div>
          ) : (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr 80px 60px", alignItems: "center", padding: "10px var(--space-card-pad)", borderBottom: i < bestPairs.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
              <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green }}>{i + 1}</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{pair.a} + {pair.b}</div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600 }}>{pair.w}-{pair.l}</div>
              <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.green, textAlign: "right" }}>{Math.round(pair.pct * 100)}%</div>
            </div>
          ))}
        </div>

        {/* WORST PARTNERSHIPS */}
        <div style={L}>Worst Partnerships (min 3 series together)</div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section)' }}>
          <div style={{ padding: 'var(--space-card-pad)', borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.5 }}>The pairs that lose together. Separate them at the door. For their sake, for the gym{"'"}s sake, for the integrity of the spreadsheet.</div>
          {worstPairs.map((pair, i) => isCompact ? (
            <div key={i} style={{ padding: '10px var(--space-card-pad)', borderBottom: i < worstPairs.length - 1 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 'var(--space-card-gap)' }}>
                  <span style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.red }}>{i + 1}</span>
                  <span style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{pair.a} + {pair.b}</span>
                </div>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.red, flexShrink: 0 }}>{Math.round(pair.pct * 100)}%</div>
              </div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, marginTop: 2, paddingLeft: 28 }}>{pair.w}-{pair.l}</div>
            </div>
          ) : (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr 80px 60px", alignItems: "center", padding: "10px var(--space-card-pad)", borderBottom: i < worstPairs.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
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
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section)' }}>
          <div style={{ padding: 'var(--space-card-pad)', borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.5 }}>The guys who seem to always be trying to beat each other, either by design or by the cruel hand of the jersey assignment fairy.</div>
          {topRivals.map((r, i) => isCompact ? (
            <div key={i} style={{ padding: '10px var(--space-card-pad)', borderBottom: i < topRivals.length - 1 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 'var(--space-card-gap)' }}>
                  <span style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent }}>{i + 1}</span>
                  <span style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{r.pair[0]} vs {r.pair[1]}</span>
                </div>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent, flexShrink: 0 }}>{r.count}x</div>
              </div>
            </div>
          ) : (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr 60px", alignItems: "center", padding: "10px var(--space-card-pad)", borderBottom: i < topRivals.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
              <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent }}>{i + 1}</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{r.pair[0]} vs {r.pair[1]}</div>
              <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.accent, textAlign: "right" }}>{r.count}x</div>
            </div>
          ))}
        </div>

        {/* THE FLORIDA INVESTIGATION */}
        <SectionDivider />
        <div style={L}>The Florida Investigation</div>
        <div style={{ ...C(), marginBottom: 'var(--space-section)', borderColor: dark ? "rgba(239,98,52,.2)" : "rgba(239,98,52,.15)", background: dark ? "rgba(239,98,52,.03)" : "rgba(239,98,52,.02)" }}>
          <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.65 }}>
            <strong style={{ color: t.accent }}>An open case.</strong> Two members of this gym are alleged to spend a suspicious amount of time in Florida. Neither has produced clear evidence of a traditional 9-to-5. The dashboard is forced to consider three possibilities: (1) two extremely flexible freelancers, (2) the same person operating a long con, or (3) Florida is where Morning Hoops players go to recover from being Morning Hoops players. Evidence is inconclusive. Investigation ongoing. The good news for the league is that whichever of them is in town tends to win, and whichever is in Florida tends to be missed. So functionally Florida might just be where this league sends people for emotional regulation.
          </div>
        </div>

        {/* BOTTOM RECORDS */}
        <div style={L}>Currently Struggling (bottom 3 win rates)</div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section)' }}>
          {bottomWinners.map(([name, d], i) => {
            const w = getW(d); const l = getL(d); const dec = w + l; const pct = Math.round(w / dec * 100);
            if (isCompact) {
              return (
                <div key={name} style={{ padding: '12px var(--space-card-pad)', borderBottom: i < bottomWinners.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</span>
                    <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: t.red, flexShrink: 0 }}>{pct}%</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, minWidth: 40 }}>{w}-{l}</div>
                    <div style={{ flex: 1, height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} win rate: ${pct}%`}>
                      <div style={{ height: "100%", width: `${pct}%`, background: t.red, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr 60px", alignItems: "center", padding: "12px var(--space-card-pad)", borderBottom: i < bottomWinners.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</div>
                <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600 }}>{w}-{l}</div>
                <div style={{ height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} win rate: ${pct}%`}><div style={{ height: "100%", width: `${pct}%`, background: t.red, borderRadius: 3 }} /></div>
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
    const isByGames = statsMode === "games";
    const getW = (d) => isByGames ? d.gw : d.w;
    const getL = (d) => isByGames ? d.gl : d.l;
    const sorted = Object.entries(players).sort((a, b) => b[1].g - a[1].g);
    const winSorted = Object.entries(players).filter(([, d]) => getW(d) + getL(d) >= 3).sort((a, b) => (getW(b[1]) / (getW(b[1]) + getL(b[1]))) - (getW(a[1]) / (getW(a[1]) + getL(a[1]))));

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
        <nav style={{ display: "flex", gap: 'var(--space-card-gap)', marginBottom: 22, overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 4, scrollbarWidth: "none", maskImage: "linear-gradient(to right, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, black 90%, transparent)" }}>
          {[
            { label: "Overview", id: "season-overview" },
            { label: "Head to Head", id: "season-h2h" },
            { label: "Records", id: "season-records" },
            { label: "Profiles", id: "season-profiles" },
            { label: "Attendance", id: "season-attendance" },
            { label: "Tyler Losses", id: "season-tyler" },
            { label: "7/7 Club", id: "season-club" },
            { label: "Dynasty", id: "season-dynasty" },
            { label: "Algorithm", id: "season-algorithm" },
          ].map((s, i) => (
            <button key={i} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })} aria-label={`Jump to ${s.label} section`} style={{ background: t.inset, border: `1px solid ${t.border}`, padding: "8px 14px", cursor: "pointer", fontSize: 'var(--type-body-sm)', fontWeight: 600, color: t.t3, fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap", borderRadius: 6, minHeight: 44, flexShrink: 0 }}>{s.label}</button>
          ))}
        </nav>

        {/* HEADLINE STATS — editorial pull-quote */}
        <div id="season-overview" style={{ ...S, fontSize: 'var(--type-title)', fontStyle: "italic", color: t.t2, lineHeight: 1.7, marginBottom: 'var(--space-section)', padding: "20px 0 20px 20px", borderLeft: `2px solid ${t.accent}`, maxWidth: 'var(--space-prose-max)', scrollMarginTop: 64 }}>
          <span style={{ color: t.accent }}>{decided.length}</span> decided series across the full season. Blue <span style={{ color: t.accent }}>{bW}</span>, White <span style={{ color: t.accent }}>{wW}</span>. <span style={{ color: t.accent }}>{uniquePlayers(players)}</span> players have stepped on the court, averaging <span style={{ color: t.accent }}>{avgPerSession}</span> per session. The spreadsheet is the source of truth. The dashboard is just the messenger.
        </div>

        <div id="season-h2h" style={{...L, scrollMarginTop: 64}}>Head to Head</div>
        <div style={{ ...C(), marginBottom: 'var(--space-section)' }}>
          {isCompact ? (
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ ...S, fontSize: 'var(--type-stat-hero)', color: t.blue, lineHeight: 1 }}>{bW}</div>
              <div style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.t3, marginTop: 2, marginBottom: 12 }}>Blue Wins</div>
              <div style={{ height: 6, borderRadius: 3, overflow: "hidden", display: "flex", background: t.inset, margin: "0 auto", maxWidth: 240 }} role="progressbar" aria-valuenow={Math.round(bW / (bW + wW) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`Head-to-head: Blue ${Math.round(bW / (bW + wW) * 100)}%, White ${Math.round(wW / (bW + wW) * 100)}%`}>
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
              <div style={{ height: 6, borderRadius: 3, overflow: "hidden", display: "flex", background: t.inset }} role="progressbar" aria-valuenow={Math.round(bW / (bW + wW) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`Head-to-head: Blue ${Math.round(bW / (bW + wW) * 100)}%, White ${Math.round(wW / (bW + wW) * 100)}%`}>
                <div style={{ width: `${bW / (bW + wW) * 100}%`, background: t.blue }} />
                <div style={{ width: `${wW / (bW + wW) * 100}%`, background: "#94A3B8" }} />
              </div>
            </>
          )}
          <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr 1fr" : isWide ? "1fr 1fr 1fr 1fr" : "1fr 1fr", gap: 'var(--space-card-gap)', marginTop: 18 }}>
            {[
              { v: String(sweeps), l: "Sweeps (4-0)", c: t.accent },
              { v: String(blowouts), l: "Blowouts (4-1)", c: t.green },
              { v: String(comfortable), l: "Comfortable (4-2)", c: t.gold },
              { v: String(nailbiters), l: "Nail-biters (4-3)", c: t.red },
            ].map((m, i) => (
              <div key={i} data-stat-card="" style={{ textAlign: "center", background: t.inset, borderRadius: 8, padding: isCompact ? '10px var(--space-card-gap)' : 'var(--space-card-pad)' }}>
                <div style={{ ...S, fontSize: 'var(--type-stat-lg)', color: m.c, lineHeight: 1 }}>{m.v}</div>
                <div style={{ fontSize: 'var(--type-label)', color: t.t3, fontWeight: 600, marginTop: 3 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WIN-LOSS RECORDS */}
        <SectionDivider />
        <div id="season-records" style={{ scrollMarginTop: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={L}>Player {isByGames ? "Game" : "Series"} Records</div>
            <div style={{ display: "flex", background: t.inset, borderRadius: 999, padding: 3, marginBottom: 14, border: `1px solid ${t.border}` }}>
              {[{ id: "series", label: "Series" }, { id: "games", label: "Games" }].map(m => (
                <button key={m.id} onClick={() => setStatsMode(m.id)} style={{ background: statsMode === m.id ? t.card : "transparent", border: statsMode === m.id ? `1px solid ${t.border}` : "1px solid transparent", borderRadius: 999, padding: "5px 12px", cursor: "pointer", fontSize: 'var(--type-label)', fontWeight: statsMode === m.id ? 700 : 500, color: statsMode === m.id ? t.accent : t.t3, fontFamily: "'Outfit',sans-serif", transition: "all .15s", whiteSpace: "nowrap", minHeight: 32 }}>{m.label}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section)' }}>
          <div style={{ padding: 'var(--space-card-pad)', borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.5 }}>{isByGames ? "Individual game record within each series. Toggle to Series to see best-of-7 wins." : "Series record. Minimum 3 decided series, because judging someone on two games is tempting but statistically irresponsible."}</div>
          {winSorted.map(([name, d], i) => {
            const w = getW(d); const l = getL(d); const dec = w + l; const pct = Math.round(w / dec * 100);
            const barColor = pct >= 60 ? t.green : pct >= 45 ? t.gold : t.red;
            if (isCompact) {
              return (
                <div key={name} style={{ padding: '12px var(--space-card-pad)', borderBottom: i < winSorted.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</div>
                    <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: barColor }}>{pct}%</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, minWidth: 40 }}>{w}-{l}</div>
                    <div style={{ flex: 1, height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} win rate: ${pct}%`}>
                      <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "minmax(80px,120px) 60px 1fr 50px", alignItems: "center", padding: "10px 16px", borderBottom: i < winSorted.length - 1 ? `1px solid ${t.border}` : "none", gap: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{name}</div>
                <div style={{ fontSize: 'var(--type-body)', color: t.t2, fontWeight: 600 }}>{w}-{l}</div>
                <div style={{ height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} win rate: ${pct}%`}><div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 3 }} /></div>
                <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: barColor, textAlign: "right" }}>{pct}%</div>
              </div>
            );
          })}
        </div>

        {/* PLAYER PROFILES */}
        <SectionDivider />
        <div id="season-profiles" style={{...L, scrollMarginTop: 64}}>Player Profiles</div>
        <div style={{ display: "grid", gap: 'var(--space-card-gap)', marginBottom: 'var(--space-section)' }}>
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
                  {c.roast && (
                    <div style={{ marginTop: 10, padding: '10px 12px', background: dark ? 'rgba(248,113,113,.06)' : 'rgba(239,68,68,.04)', borderRadius: 8, borderLeft: `2px solid ${t.red}` }}>
                      <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.2, color: t.red, marginBottom: 4 }}>🔥 SCOUTING REPORT</div>
                      <div style={{ fontSize: 'var(--type-body-sm)', color: dark ? '#FCA5A5' : '#B91C1C', lineHeight: 1.55, fontStyle: 'italic' }}>{c.roast}</div>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <div key={i} style={{ ...C() }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ ...S, fontSize: 'var(--type-title)', color: pct !== null ? (pct >= 60 ? t.green : pct >= 45 ? t.gold : t.red) : t.t3, minWidth: 64, textAlign: "center" }}>{rec}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{c.name} <span style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.accent, marginLeft: 4 }}>{c.tag}</span></div>
                    <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.5, marginTop: 2 }}>{c.desc}</div>
                  </div>
                </div>
                {c.roast && (
                  <div style={{ marginTop: 12, padding: '12px 14px', background: dark ? 'rgba(248,113,113,.06)' : 'rgba(239,68,68,.04)', borderRadius: 8, borderLeft: `3px solid ${t.red}` }}>
                    <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.2, color: t.red, marginBottom: 4 }}>🔥 SCOUTING REPORT</div>
                    <div style={{ fontSize: 'var(--type-body-sm)', color: dark ? '#FCA5A5' : '#B91C1C', lineHeight: 1.55, fontStyle: 'italic' }}>{c.roast}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ATTENDANCE */}
        <SectionDivider />
        <div id="season-attendance" style={{...L, scrollMarginTop: 64}}>Attendance</div>
        <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section)' }}>
          {isCompact ? (
            /* Compact: card list sorted by sessions descending */
            [...sorted].sort((a, b) => b[1].g - a[1].g).map(([name, d], i, arr) => {
              const rate = Math.round(d.g / totalS * 100);
              const dec = d.w + d.l;
              const wpct = dec > 0 ? Math.round(d.w / dec * 100) : null;
              const tier = rate >= 90 ? ["IRON", t.accent] : rate >= 70 ? ["REG", t.green] : rate >= 40 ? ["PT", t.blue] : rate >= 15 ? ["DROP", t.gold] : ["1x", t.t3];
              return (
                <div key={name} style={{ padding: '12px var(--space-card-pad)', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 'var(--space-card-gap)' }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{name}</span>
                      <span style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1, padding: "2px 6px", borderRadius: 3, background: `${tier[1]}18`, color: tier[1] }}>{tier[0]}</span>
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
                        <td style={{ padding: "9px 16px", fontWeight: 600, fontSize: 'var(--type-body)' }}>{name}<span style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1, padding: "2px 6px", borderRadius: 3, background: `${tier[1]}18`, color: tier[1], marginLeft: 8 }}>{tier[0]}</span></td>
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
              <div id="season-tyler" style={{...L, scrollMarginTop: 64}}>The Tyler Losses Files</div>
              <div style={{ ...C(), marginBottom: 'var(--space-section)', borderColor: dark ? "rgba(248,113,113,.2)" : "rgba(248,113,113,.15)", background: dark ? "rgba(248,113,113,.03)" : "rgba(248,113,113,.02)" }}>
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

                {/* ANALYST'S FINDINGS */}
                <div style={{ marginTop: 16, padding: isCompact ? '14px 14px' : '18px 20px', background: dark ? 'rgba(248,113,113,.06)' : 'rgba(239,68,68,.04)', borderRadius: 12, border: `1px solid ${dark ? "rgba(248,113,113,.18)" : "rgba(248,113,113,.15)"}` }}>
                  <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.red, marginBottom: 12 }}>🗂️ ANALYST{"'"}S FINDINGS — CLASSIFIED</div>
                  <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.7, marginBottom: 8, fontStyle: 'italic' }}>
                    After exhaustive review of the Tyler Losses Files, the following conclusions have been entered into the permanent record:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: isCompact ? 18 : 22, fontSize: 'var(--type-body-sm)', color: dark ? '#FCA5A5' : '#B91C1C', lineHeight: 1.75 }}>
                    <li style={{ marginBottom: 8 }}>
                      <strong>Mike</strong> appears in 5 of Tyler{"'"}s 7 losses. At some point this stops being a coincidence and starts being a strategy. If Mike texts {"\""}I{"'"}m on your team today{"\""} just fake an ankle injury in the parking lot.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                      <strong>Nathan</strong> is on the team that beats Tyler in 5 of the 7 losses. This isn{"'"}t a rivalry — it{"'"}s a restraining order that Tyler keeps violating by showing up to the gym.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                      <strong>Cal{"'"}s team</strong> has won against Tyler in 4 of 7 losses. Cal doesn{"'"}t even need to be on the same side of the court as Tyler to ruin his week. He just needs to exist in the building.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                      Tyler{"'"}s only sweep — <strong>4/29, lost 4-0</strong> — came when he had both Mike AND Ryan on his team. Pairing those two with Tyler should be classified as a Geneva Convention violation.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                      6 of 7 losses were by a score of <strong>4-3</strong>. Tyler doesn{"'"}t get blown out — he specializes in giving you hope and then methodically extinguishing it in Game 7. It{"'"}s almost a talent.
                    </li>
                    <li>
                      Tyler lost <strong>4 times in May alone</strong> (5/1, 5/11, 5/13, 5/18) — more than March and April combined. His game isn{"'"}t declining. It{"'"}s in hospice.
                    </li>
                  </ul>
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${dark ? "rgba(248,113,113,.12)" : "rgba(248,113,113,.1)"}`, fontSize: 'var(--type-body-sm)', color: t.red, fontStyle: 'italic', fontWeight: 600 }}>
                    Case status: Open. Tyler remains at large. The losses continue to accumulate.
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* THE 7/7 CLUB */}
        <SectionDivider />
        <div id="season-club" style={{...L, scrollMarginTop: 64}}>The 7/7 Club</div>
        <div style={{ ...C(), marginBottom: 'var(--space-section)', borderColor: dark ? "rgba(251,191,36,.2)" : "rgba(202,138,4,.15)", background: dark ? "rgba(251,191,36,.04)" : "rgba(202,138,4,.03)" }}>
          <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.6, marginBottom: 14 }}>Three players have shot perfect from the field in a single game and scored every one of their team{"'"}s seven points. This club is exclusive, unintentional, and possibly cursed.</div>
          <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : isRegular ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10 }}>
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

        {/* THE DYNASTY */}
        <SectionDivider />
        <div id="season-dynasty" style={{...L, scrollMarginTop: 64}}>🏆 The Dynasty</div>
        <div style={{ ...C(), marginBottom: 'var(--space-section)', borderColor: dark ? "rgba(251,191,36,.25)" : "rgba(202,138,4,.2)", background: dark ? "rgba(251,191,36,.06)" : "rgba(202,138,4,.04)" }}>
          <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.7, marginBottom: 18, maxWidth: 'var(--space-prose-max)' }}>
            Years ago, four men — Nathan, Wags, Lee & Cal — formed a fixed squad and proceeded to go undefeated across dozens of series. Nobody knows how. Science has no explanation. The film room footage is classified. They disbanded, went their separate ways, and the league moved on. Until 5/4, when they reassembled on Blue and reminded everyone why the word {"\""}dynasty{"\""} exists.
          </div>

          {/* ROSTER CARD */}
          <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr 1fr" : isRegular ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
            {[
              { name: "Nathan", role: "Structural Beam" },
              { name: "Wags", role: "Solid Citizen" },
              { name: "Lee", role: "7/7 Club" },
              { name: "Cal", role: "Flamethrower" },
            ].map(m => (
              <div key={m.name} style={{ padding: "14px", background: dark ? 'rgba(251,191,36,.08)' : 'rgba(251,191,36,.06)', borderRadius: 10, border: `1px solid ${dark ? "rgba(251,191,36,.18)" : "rgba(251,191,36,.22)"}`, textAlign: "center" }}>
                <div style={{ fontSize: 'var(--type-title)', color: t.gold, marginBottom: 2 }}>👑</div>
                <div style={{ ...S, fontSize: 'var(--type-title)', color: t.text, fontWeight: 700 }}>{m.name}</div>
                <div style={{ fontSize: 'var(--type-label)', color: t.t3, marginTop: 2 }}>{m.role}</div>
              </div>
            ))}
          </div>

          {/* MAY 4TH RESULT */}
          <div style={{ background: dark ? 'rgba(251,191,36,.05)' : 'rgba(251,191,36,.04)', borderRadius: 10, padding: 'var(--space-card-pad)', border: `1px solid ${dark ? "rgba(251,191,36,.12)" : "rgba(251,191,36,.15)"}`, marginBottom: 18 }}>
            <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 6 }}>REUNION RESULT · MON 5/4</div>
            <div style={{ ...S, fontSize: 'var(--type-stat-lg)', color: t.text, lineHeight: 1.2 }}>Dynasty 4, White 2</div>
            <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, marginTop: 8, lineHeight: 1.6 }}>
              Ryan, Kyle, Chad & Jared showed up as White and left as footnotes. The Dynasty reassembled after years apart and played like the intervening time was a clerical error. Four games to two. Clinical. Surgical. Mildly disrespectful.
            </div>
          </div>

          {/* IN-SEASON TOURNAMENT */}
          <div style={{ background: dark ? 'rgba(251,191,36,.05)' : 'rgba(251,191,36,.04)', borderRadius: 10, padding: 'var(--space-card-pad)', border: `1px solid ${dark ? "rgba(251,191,36,.12)" : "rgba(251,191,36,.15)"}`, marginBottom: 18 }}>
            <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 6 }}>🏆 IN-SEASON TOURNAMENT CHAMPIONS</div>
            <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.7 }}>
              The Dynasty didn{"'"}t just win the series — they won the in-season tournament. This is the one that actually matters. The regular season is just cardio. The tournament is where legacies are made, and The Dynasty{"'"}s legacy was already extensive before they added {"\""}tournament champions{"\""} to the résumé. The trophy is theirs. It is non-negotiable.
            </div>
          </div>

          {/* CLOSING QUIP */}
          <div style={{ fontSize: 'var(--type-body)', color: t.accent, lineHeight: 1.7, fontStyle: "italic", maxWidth: 'var(--space-prose-max)', borderTop: `1px solid ${dark ? "rgba(251,191,36,.12)" : "rgba(251,191,36,.1)"}`, paddingTop: 14 }}>
            Whether The Dynasty{"'"}s return is a one-time nostalgia tour or the beginning of a permanent restructuring of Morning Hoops power dynamics is unclear. What IS clear is that four guys showed up on a Monday and chose violence. The league has been placed on notice. The film room footage remains classified. The investigation is ongoing. The trophy is not.
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
            <div style={{ padding: 'var(--space-card-pad)', background: t.inset, borderRadius: 10 }}>
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
              <div id="season-algorithm" style={{...L, scrollMarginTop: 64}}>The Algorithm{"'"}s Matchup</div>
              <div style={{ ...C(), marginBottom: 'var(--space-section)', borderColor: dark ? "rgba(52,211,153,.2)" : "rgba(22,163,74,.15)", background: dark ? "rgba(52,211,153,.03)" : "rgba(22,163,74,.02)" }}>
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
      <style dangerouslySetInnerHTML={{ __html: "button{transition:transform 0.1s ease-out}button:active{transform:scale(0.97)}:focus-visible{outline:2px solid #EF6234;outline-offset:2px}button:focus:not(:focus-visible){outline:none}@media(hover:hover){[data-stat-card]:hover{transform:scale(1.02);transition:transform 0.15s ease-out}}@media(prefers-reduced-motion:reduce){*{transition:none!important}}" }} />
      <main style={{ maxWidth: 'var(--content-max)', margin: "0 auto", padding: "var(--space-page-top) var(--space-page-x) var(--space-page-bot)" }}>
        <div style={{ display: "flex", flexDirection: isCompact ? "column" : "row", justifyContent: "space-between", alignItems: isCompact ? "flex-start" : "flex-start", gap: isCompact ? 16 : 0, marginBottom: 'var(--space-section)', paddingBottom: 'var(--space-section)', borderBottom: `1px solid ${t.border}` }}>
          <div>
            <div style={{ fontSize: 'var(--type-label)', fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 8 }}>4:45 AM · Middle School Gym · 3 Months Deep</div>
            <h1 style={{ ...S, fontSize: "var(--type-display)", fontWeight: 400, letterSpacing: -1, lineHeight: 1.05, margin: 0 }}>Morning <em style={{ fontStyle: "italic", color: t.accent }}>Hoops</em></h1>
            <p style={{ fontSize: 'var(--type-body)', color: t.t2, marginTop: 8, maxWidth: 500, lineHeight: 'var(--type-body-lh)' }}>A group of grown adults wake up before the sun to play 7-game series where children learn fractions. Tyler is mortal. Gabe is everywhere. Cal is occasionally in Florida. Sean is asleep. Nobody has explained how they're all available at 4:45 AM.</p>
          </div>
          <button onClick={() => setDark(!dark)} aria-label="Toggle dark/light mode" style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: isCompact ? "6px 10px" : "8px 14px", cursor: "pointer", color: t.t2, fontSize: isCompact ? 'var(--type-label)' : 'var(--type-label-lg)', fontWeight: 600, fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 'var(--space-card-gap)', marginTop: isCompact ? 0 : 8, minHeight: 44 }}>{dark ? "☀️" : "🌙"} {dark ? "Light" : "Dark"}</button>
        </div>

        <nav role="tablist" onKeyDown={(e) => {
          const tabIds = tabs.map(tb => tb.id);
          const currentIndex = tabIds.indexOf(tab);
          let newIndex;
          if (e.key === "ArrowRight") {
            newIndex = (currentIndex + 1) % tabIds.length;
            e.preventDefault();
          } else if (e.key === "ArrowLeft") {
            newIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
            e.preventDefault();
          } else {
            return;
          }
          setTab(tabIds[newIndex]); window.scrollTo(0, 0);
        }} style={{ display: "flex", gap: 'var(--space-card-gap)', marginBottom: 'var(--space-section)', overflowX: "auto", WebkitOverflowScrolling: "touch", padding: '4px 0', background: t.inset, borderRadius: 999, scrollbarWidth: "none", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", scrollSnapType: "x mandatory" }}>
          {tabs.map(tb => <button key={tb.id} ref={tb.id === tab ? activeTabRef : null} role="tab" aria-selected={tab === tb.id} tabIndex={tb.id === tab ? 0 : -1} onClick={() => { setTab(tb.id); window.scrollTo(0, 0); }} style={{ background: tab === tb.id ? t.card : "transparent", border: tab === tb.id ? `1px solid ${t.border}` : "1px solid transparent", borderRadius: 999, padding: "8px 16px", cursor: "pointer", fontSize: 'var(--type-body)', fontWeight: tab === tb.id ? 700 : 500, color: tab === tb.id ? t.accent : t.t2, fontFamily: "'Outfit',sans-serif", transition: "all .15s", whiteSpace: "nowrap", minHeight: 44, minWidth: 44, scrollSnapAlign: "center" }}>{tb.label}</button>)}
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
        Played at 4:45 AM. Tyler is mortal. Gabe is unkillable. Cal is under investigation. The spreadsheet is gospel.<br />
        <span style={{ color: t.gold }}>The Dynasty{"'"}s tournament trophy is non-negotiable.</span> Now featuring dynasty-level delusions of grandeur.
      </footer>
    </div>
  );
}

function uniquePlayers(players) { return Object.keys(players).length; }
