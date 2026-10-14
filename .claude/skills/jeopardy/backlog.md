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
- Question screen rebuilt (`HostQuestionView`): fits one viewport with auto-shrinking text (`useFitText`), top-bar countdowns, bottom bar with one main action (yellow Next/Finish, Enter/→ shortcut, questions-left counter), ⭐ Final question badge, GameOverSplash + animated podium with confetti. Sidebar scrollbar removed (compact rows from 6 teams). +/- hint gone.

## Ideas parked (decided against for now)

- Speed bonus for the fastest correct team, measured as reaction time on each phone (from options shown to tap). Fair across network delay but trusts the phone; could be an option in Setup.
- Penalty for wrong answers (e.g. −half value) to discourage guessing.

## Known issues

1. **Rooms are never cleaned up** if the host closes the tab instead of clicking "Close room".
   *Fix idea:* add `createdAt` (+ rules) and a Firestore TTL policy on `rooms` (check Spark availability), or delete old rooms when creating a new one.
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
- **Kick a single player** in the host lobby (teams already have ✕).

## Content ideas

- More questions per level (currently 2 per level per category), so games repeat less.
- More topics (Prepositions, False Friends for Spanish speakers, Pronunciation, more Java: arrays/OOP).
- Let the teacher edit questions without code: an editor page writing to Firestore (needs auth + rules for writes).

## Code cleanups

- `teamName()` is duplicated in `HostGame.tsx` and `PlayerGame.tsx`; move it to `roomService.ts` helpers.
- `HostGame.tsx` computes the active tile by hand; use `activeTileOf(room)`.
- The JS bundle is ~700 kB (mostly Firebase); lazy-load the multiplayer screens with `React.lazy`.
- Remove `BANK`/`buildBoard` from `questions.ts` once local mode is re-wired or dropped.
