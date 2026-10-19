# Jeopardy backlog

Reviewed 2026-10-14 after the v2 release (topics, Firestore questions, player-created
teams, countdown, podium). Roughly ordered by value for a classroom.

## Done in v2 (2026-10-14)

- Questions live in Firestore (`questions`), seeded from `src/Jeopardy/content/` (4 topics × 50).
- Topic picker (Java, Pop Culture, English A1/B1) + timer picker (15/20/30 s) in the host lobby.
- Countdown per question; when it hits zero the host screen reveals and answers lock.
- "Show answer" now locks players out (old issue 1) and an idle player no longer blocks anything (old issue 2) — the timer ends the question.
- Teams are created by players with a nickname (unique, 1–3 players); first teammate to answer uses the team's one try.
- Podium on host and phones (old issue 5: phones only said "Game over!").
- Local mode hidden from the home screen (still at `/local`, still uses the legacy in-code `BANK`).

## Done in v3 (2026-10-14)

- Host-defined teams: the lobby sets the team count (2–10) and max players per team (1–6); random color + animal names (`teamNames.ts`) with a reroll button; players only pick a team. Replaces player-created nickname teams and the ✕ button.
- Host flow split in two: **Setup** (config only, code hidden, nobody can join) → **Open room** → **Waiting room** (QR + URL + code, teams filling up).
- Start countdown (10/15/30/60 s, set in Setup): Start game runs it as a last call to pick a team, with Start now / Cancel; empty teams are eliminated when it ends, loose players can join mid-game. (A "We're ready" step was tried and removed the same day: too much friction for a classroom.)
- Join by QR code (`qrcode` package), `/join?code=ABCD` prefills the form.
- Four new topics (50 questions each): C# Fundamentals, JavaScript Fundamentals, HTML & CSS, Object-Oriented Programming (language-agnostic). 8 topics / 400 questions seeded.
- Reading time (0/5/10/15 s, default 10, set in Setup): the question is shown alone first, then the options appear and the answer timer starts; host can "Show options now". Requested by the players.
- Fairness fix after a class incident (phones on a cached old bundle answered during the reading time): `index.html` served `no-cache`; rooms store the build `version` and stale devices reload once; the options are revealed by the host screen's `showOptions` (Firestore push), not by each phone's clock.
- Host PIN (1041, stored as SHA-256 hash in `hostAuth.ts`) on `/host` and `/host/CODE`, remembered per device until "Log out".
- New scoring (fairness): every team answers once, every correct team scores at the reveal; the host screen is the only clock; phones' bars are local durations. Replaces "first correct team wins".
- Topic name on board/phone headers. Java, C#, JavaScript rewritten with language-prefixed categories and 3 questions per level (75 each). New topics: Artificial Intelligence, UX/UI Design (50 each). 10 topics / 575 questions.
- Board UX: score panel on the left, board fits the screen without scrolling, +/− score buttons removed, phones show only their team's score and place.
- Score sidebar rebuilt (shadcn Sidebar as reference, GSAP only): expanded / icon rail / hidden, Ctrl/⌘+B and S shortcuts, inset board, animated width, re-rank slide, score count-up with "+N" badge, answer pulse, sliding results toast.
- Test players (bots) answered by the host screen, to try the game with a single phone.
- Topic groups in Setup (tab row, `GROUPS` in topics.ts); new Graphic Design topic (11 topics / 625 questions).
- Answer-length balance: 130 questions fixed where the correct answer was clearly the longest option; the rule is now enforced by the seed script and the round test.
- "Leave game" returns to the join form with the code prefilled; bilingual How to play / Cómo jugar overlay (ES default) on home, join and team-pick screens.
- Mid-game leavers: a team vanishes (with its points) when its last member leaves; all teams gone → "Everyone left the game" end screen. Rail tooltip z-order/stacking fix.
- Question screen rebuilt (`HostQuestionView`): fits one viewport with auto-shrinking text (`useFitText`), top-bar countdowns, bottom bar with one main action (yellow Next/Finish, Enter/→ shortcut, questions-left counter), ⭐ Final question badge, GameOverSplash + animated podium with confetti. Sidebar scrollbar removed (compact rows from 6 teams). +/- hint gone.

## Done in v4 (2026-10-15)

- 8 new topics (50 each): Technology (in the AI tab, renamed 🤖 Tech & AI), Video Games and Books (🎉 Popular Culture), Rap & Hip-Hop, Reggaeton, Pop, Rock (new 🎵 Music tab), Sports with soccer, basketball and NBA/NCAA/NFL/NHL/FIFA team names (new ⚽ Sports tab). 19 topics / 1025 questions.
- Host setup redesign: 4 free step tabs (shadcn-Tabs look, plain Tailwind + GSAP), class calculator (students → teams, manual selects kept), ⚡ Quick start from the last setup, profile menu (Cancel room / Log out / new room), after a game the teacher picks "Next game, same room" (`newGame`, players keep their teams) or "New room"; phones show a "Get ready!" card meanwhile.

## Ideas parked (decided against for now)

- Speed bonus for the fastest correct team, measured as reaction time on each phone (from options shown to tap). Fair across network delay but trusts the phone; could be an option in Setup.
- Penalty for wrong answers (e.g. −half value) to discourage guessing.

- Nuevo tema "Java a Fondo" (75 preguntas en español: cortocircuito/ternario/rarezas, cadenas, funciones, arreglos, matrices). Tab title "Classroom Jeopardy 🎓" + dynamic per-screen title + 🎓 favicon. 20 topics / 1100 questions.

- Renamed to **Quizzing with Friends** (by Coding with Friends). Spanish team names with classic colors. Min 1 team/1 player; "+1 slot" per team (`bonus`); board size 3×3/4×4/5×5; optional time limit (10/15/20 min, host-screen `GameClock` + `endGame`); mid-game ↩ Restart menu; `npm run pin -- NNNN`; host code-clip bug fixed (shrink-0 + fit); sidebar compact rows keep student names.

- Calculator: "per team" options above the student count gray out and the selection follows when students drop; singular/plural fixed. Phone question view capped at max-w-md with wrapping code lines (no more horizontal cut-off on narrow phones). Tabs control supports disabled items.

- Lobby redesign: one viewport (no scroll), compact one-line team cards, host tools moved into the profile menu. Calculator distributes leftovers automatically as +1 spots (8×2 + one of 3 for 17); manual "+1 slot" buttons removed.

- Lobby head-count legend ("👥 2/17 players · 15 left to join", count-up, "🎉 All 17 in!") plus an ℹ️ note when the split isn't exact (one team of +1).
- Lobby laid out from the teacher's sketch: brand title top-left, big QR beside a dark join panel, topic as a headline, natural-width team cards, bottom bar (settings pill left, breathing yellow Start right), dotted background. GSAP: staggered entrance, card bounce on joins, flip on 🎲 rename.

- Board sizes 1×1 (una pregunta de 600, relámpago) y 2×2 (200/1000). Nuevo tema "Design Thinking" en español (50 preguntas: proceso, empatizar, entrevistas, mapa de empatía, journey map) — 21 topics / 1150 questions. "🧹 Clean old rooms" + `npm run clean:rooms` + `createdAt`.

## Known issues

1. ~~Rooms are never cleaned up~~ → manual cleanup shipped ("🧹 Clean old rooms" in Setup + `npm run clean:rooms`), rooms now store `createdAt`. Remaining idea: a Firestore TTL policy on `createdAt` for automatic deletion (console setup, check Spark availability).
2. **Anyone with the room code can control the room** by calling the Firestore API directly (the host PIN only gates the UI; rules can't tell host writes from player writes).
   *Fix idea:* Firebase anonymous auth; store `hostUid` and check it in the rules for host-only actions.
3. **Duplicate player names are allowed** in the same room.
4. **Host tab must stay open** — it is the game's clock: it reveals the options, closes each question and starts the game. If it's closed mid-question, the question stays open until it's reopened.
5. **Local mode is stale**: hidden, still uses the old `BANK` in `questions.ts`, no topics/timer/podium wiring beyond `EndScreen`. Either re-wire it to Firestore questions or delete it (and `BANK`).

## Gameplay ideas

- **Speed bonus or streaks** for the winning team.
- **Daily Double** tile: one hidden tile where the team bets points.
- **Final round** with a bet, before the end screen.
- **Sound effects** on the host screen (correct / wrong / time up).
- **Kick a single player** in the host lobby.
- **Presence detection** (Firebase Realtime Database `onDisconnect`): drop players whose phone silently disconnects, so ghost players/teams can't linger when someone closes the browser instead of tapping Leave.

## Content ideas

- More questions per level (currently 2 per level per category), so games repeat less.
- More topics (Prepositions, False Friends for Spanish speakers, Pronunciation, more Java: arrays/OOP).
- Let the teacher edit questions without code: an editor page writing to Firestore (needs auth + rules for writes).

## Code cleanups

- `teamName()` is duplicated in `HostGame.tsx` and `PlayerGame.tsx`; move it to `roomService.ts` helpers.
- `HostGame.tsx` computes the active tile by hand; use `activeTileOf(room)`.
- The JS bundle is ~700 kB (mostly Firebase); lazy-load the multiplayer screens with `React.lazy`.
- Remove `BANK`/`buildBoard` from `questions.ts` once local mode is re-wired or dropped.
