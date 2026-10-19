---
name: jeopardy
description: Everything about the "Do you know your English?" Jeopardy game in src/Jeopardy — architecture, Firestore data model (rooms + questions), game rules, how to add questions and topics, seed, test, and deploy to Firebase. Use whenever working on the Jeopardy game, its questions, its multiplayer/Firebase code, or its deployment.
---

# Jeopardy game ("Do you know your English?")

A classroom quiz game. The host shows the board on a big screen; players answer
multiple-choice questions on their phones. 20 topics / 1100 questions, organized in groups
(`GROUPS` in topics.ts, tabs in Setup): 💻 Coding (Java, "Java a Fondo" — in Spanish —, C#, JavaScript — 75 each — HTML & CSS, OOP),
🎨 Design (UX/UI, Graphic Design), 🤖 Tech & AI (AI, Technology), 🇬🇧 English (A1, B1), 🎉 Popular Culture (Popular Culture, Video Games, Books), 🎵 Music (Rap & Hip-Hop, Reggaeton, Pop, Rock), ⚽ Sports (50 each). Live at **https://jeopardy-76b82.web.app**.

This repo (`react_test`) is a lab of class examples; `src/App.tsx` currently renders only `<Jeopardy />`.
Stack: React 19 + TypeScript (strict, `noUnusedLocals`) + Vite + Tailwind 4 + Firebase 13 (Firestore + Hosting).

For improvement ideas and known issues, read [backlog.md](backlog.md) before planning new work.

## Modes and URLs

Routing is hand-written in `src/Jeopardy/Jeopardy.tsx` (no router library): `viewFromPath()` maps the URL to a view, `go()` uses `history.pushState`.

| URL | Screen |
|---|---|
| `/` | Home: Host a game / Join a game |
| `/local` | One-screen game (hidden from the home screen for now; no topics/timer/Firebase) |
| `/join` | Join form: room code + name. `/join?code=ABCD` (from the QR) prefills the code |
| `/host` | Host PIN screen (`HostLogin`), then creates a room and redirects to `/host/ABCD` |
| `/host/ABCD` | Host's screen for room ABCD (PIN required): setup → lobby (waiting room) → game |
| `/play/ABCD` | Player's phone. Player id comes from `sessionStorage["jeopardy-player:ABCD"]`; without it the join form shows |

`sessionStorage` is per tab, so several tabs in one browser can be different players (handy for testing).

## File map (`src/Jeopardy/`)

| File | Role |
|---|---|
| `Jeopardy.tsx` | Entry + URL routing |
| `questions.ts` | `Tile`/`Category` types, `shuffle`, `pickOne`, `markUsed`, `allUsed`, `LETTERS`, `VALUES`; plus the legacy `BANK` + `buildBoard()` used only by the hidden local mode |
| `questionService.ts` | `loadQuestions(topic)` (Firestore `questions` query) and `buildBoardFrom(questions)` (5 categories × 5 values, options shuffled) |
| `topics.ts` | `GROUPS` (tab row) and `TOPICS`: id/name/tagline/group cards for Setup (ids must match `content/`) |
| `content/` | Source of all questions (`java.ts`, `javaDepth.ts` — Spanish —, `csharp.ts`, `javascript.ts`, `htmlCss.ts`, `oop.ts`, `ai.ts`, `uxUi.ts`, `graphicDesign.ts`, `popCulture.ts`, `englishA1.ts`, `englishB1.ts`, `technology.ts`, `videoGames.ts`, `books.ts`, `rap.ts`, `reggaeton.ts`, `pop.ts`, `rock.ts`, `sports.ts`, `index.ts`, `types.ts`). Uploaded by the seed script; **never imported by the app** so answers stay out of the bundle |
| `teams.ts` | `Team` type (`id`, `name`, `score`, `color?`), `makeTeams(n)` (local mode only), `rankTeams` (competition ranking for the podium) |
| `teamNames.ts` | `TEAM_NAMES` pool (16 color + animal names, e.g. "Red Fox", each with a hex color) and `pickTeamNames(n, taken)` |
| `Board.tsx` | Category × value grid |
| `QuestionModal.tsx` | **Local mode only** now: question + options + reveal (multiplayer host uses `HostQuestionView`) |
| `useFitText.ts` | `useFitText(max, min, deps)`: shrinks the font until the content fits its box (bounded flex/grid child + overflow-hidden); reruns on resize |
| `GameOverSplash.tsx` | Full-screen "🏁 Game over!" (or `text`, e.g. "🎮 Next game!") GSAP moment between the last question and the podium (host + phones), `onDone` when finished |
| `Countdown.tsx` | Default `Countdown`: bar to an epoch deadline on this device's clock (host only; `onDone` fires once → showOptions / reveal / start). `LocalCountdown`: runs N seconds from mount (phones; never compares clocks) |
| `Podium.tsx` | 2nd–1st–3rd blocks, ties share a step, 4th+ listed below; GSAP: steps rise 3rd→2nd→1st, confetti burst on the winner; `EndScreen.tsx` wraps it with "Play again" (local) or `actions` (host: 🔁 Next game, same room / ✨ New room / Close room, rising in after the podium; Enter = same room) |
| `TeamScores.tsx` | Score cards with optional +/− buttons (local mode only) |
| `multiplayer/ScorePanel.tsx`, `panelMode.ts` | Host score sidebar (shadcn-Sidebar-inspired layout, plain Tailwind + **GSAP**, no shadcn). States `expanded` (280 px: topic, room, ranked rows with initials avatar, members, score) / `rail` (72 px: avatars + score, CSS tooltip) / `hidden` (only a "Scores ›" tab; `ResultToast` slides results in for 3 s). Remembered in `localStorage["jeopardy-score-panel"]`; **S** cycles, **Ctrl/⌘+B** toggles expanded↔rail; narrow windows default to rail. GSAP: width tween with content swapped only while it fits, staggered fade-in, FLIP re-rank slide (plain tweens), score count-up + "+N" badge, ring pulse on answer. `MOTION` = 0 under prefers-reduced-motion |
| `multiplayer/useBots.ts` | Test players: host screen answers for every `bot` player once the options show (random choice ~50% correct, random time within 80% of the answer time) via the normal `answer()` |
| `LocalGame.tsx`, `SetupScreen.tsx` | One-screen mode (hidden; still uses the legacy BANK) |
| `multiplayer/roomService.ts` | **All Firestore room access.** Types `Room`, `Player`, `Answer`; host/player actions; helpers `activeTileOf`, `optionsVisible`, `answerOf`, `answerProgress`, `allTeamsAnswered`, `tilesLeft`, `isLastTile`, `startProblem` |
| `multiplayer/useRoom.ts` | `useRoom(code)` → `undefined` loading, `null` missing/error, else `Room` (live via `onSnapshot`). Reloads the page once if the room was hosted by a newer build (`room.version` > `APP_VERSION`) |
| `multiplayer/hostAuth.ts`, `HostLogin.tsx` | Host PIN gate: SHA-256 hash of the PIN in `hostAuth.ts` (currently the hash of **1041**), unlock remembered in `localStorage["jeopardy-host"]` until "Log out" (Setup). Deterrent only: runs in the browser |
| `multiplayer/HostSetup.tsx` | Host-only config (status `setup`, code hidden), one viewport: header (live summary chips + small "Open room" + `ProfileMenu`), 4 **free** step tabs (Category → Topic → Game → Teams, ✓ on visited ones), keyed step panel, footer Back / Next / **Open room**. Step, chosen category and class calculator are local state; every value shown comes from `room`. Busy ref against double opens |
| `multiplayer/setup/` | Steps: `CategoryStep` (group cards), `TopicStep` (topic cards), `GameStep` (reading / answer / start times as segmented `Tabs`), `TeamsStep` (class calculator "students + per team → Apply", manual Teams / Max selects, team chips with members, 🎲), `QuickStart` (⚡ "Same as last time": Open room now / Same settings, new topic — teams untouched while players wait). `anim.ts`: shared GSAP helpers `staggerIn`, `pulse`, `popIn`, `ring` |
| `multiplayer/Tabs.tsx` | shadcn-Tabs-inspired segmented control (no shadcn): pill track, white indicator sliding with GSAP, ARIA tabs, ←/→/Home/End; optional step number → ✓ |
| `multiplayer/ProfileMenu.tsx` | "👩‍🏫 Host ▾" dropdown: (after a game) ✨ Start over in a new room, Cancel room (confirm when players are in), Log out |
| `multiplayer/teamMath.ts`, `setupPrefs.ts` | `splitClass(students, perTeam)` → 2–10 teams × 1–6 (23/3 → 8×3); last setup in `localStorage["jeopardy-setup-last"]` for Quick start + calculator |
| `multiplayer/HostLobby.tsx` | Waiting room (status `lobby`): QR + URL + code, settings summary, team cards, Start game → last-call countdown with Start now / Cancel, Settings (back to setup), Close room |
| `multiplayer/HostGame.tsx` | Routes by status (`HostSetup` / `HostLobby` / question / board / `GameOverSplash` → `EndScreen`); `h-dvh` layout, sidebar + inset board, `ResultToast` |
| `multiplayer/HostQuestionView.tsx` | Host question screen (keyed per tile), one viewport, no scrolling: top bar (category · value, ⭐ Final question badge, compact countdowns), auto-fitting question/code (`useFitText`, em-based children), 2×2 options grid, bottom bar (status left; one main action right: "Show options now" → "Show answer" → yellow "Next question →" / "🏆 See final results" + questions-left counter). **Enter / →** presses the main button (busy ref swallows doubles). Holds the clock logic: reading/answer countdowns, 1 s close grace, auto-reveal when all answered, `useBots` |
| `multiplayer/JoinQr.tsx` | Canvas QR for `${origin}/join?code=ABCD` (package `qrcode`) |
| `multiplayer/PlayerGame.tsx` | Phone: `TeamPicker` (pick one of the host's teams; shows the start countdown), `AnswerPicker` (options + countdown + result) |
| `multiplayer/JoinScreen.tsx`, `HomeScreen.tsx`, `ui.tsx` | Join form (code prefilled from the QR link, still editable), home, shared Tailwind classes (`primaryButton`, `linkButton`, `input`, `Screen`, `Message` with optional `backLabel`) |
| `multiplayer/debug.ts`, `debugReports.ts`, `debugSwitch.ts`, `DebugConsole.tsx`, `DebugPanel.tsx` | **Debug mode, centralized on the teacher's screen.** Switch: "🐞 Debug mode" in the profile menu (setup + lobby) or the lobby's "🐞 Debug: off" link → `setRoomDebug` sets the optional `room.debug`. While on: every device logs (`isLogging()`; `useRoom` restarts its listener with metadata), each phone's `DebugReporter` (in `PlayerGame`, tiny 🐞 dot) writes `rooms/{code}/debug/{playerId}` on view changes (≤1/s) + 5 s heartbeat (`startReporting`), and the host shows the lazy **🐞 DEBUG · console** (bottom-left): phones sorted by trouble (🔴 silent >12 s / error, 🟡 behind the room >3 s or from cache, ⚪ no report), host log, 📋 Copy everything, 🔄 Check server (`fetchRoom`), 🔌 Reconnect host, 🧹 Clear, Turn debug off (clears reports). `newGame` keeps the switch, New room starts off; `deleteRoom` clears reports (best effort). Fallback: `?debug=1` on one device → per-device `DebugPanel` (bottom-right). Debug never touches game rules |
| `multiplayer/HowToPlay.tsx` | "❓ How to play · Cómo jugar" link + bilingual instructions overlay (6 steps, ES\|EN toggle, **Spanish default**, remembered in `localStorage["jeopardy-lang"]`). On home, join form and the player's team picker |

Firebase setup lives outside the folder: `src/lib/firebase.ts` (exports `db`), `firebase.json`, `.firebaserc`, `firestore.rules`.
The seed script is `scripts/seed-questions.ts` (repo root).

## Data model

**`questions/{id}`** — one document per question, id `topic__category-slug__level-n`:
`{ topic, category, level: 1..5, question, code?, answer, wrong: [3] }`.
Read-only for the app; written only by the seed script.

**`rooms/{code}`** (code = 4 letters from `ABCDEFGHJKLMNPQRSTUVWXYZ`, no I/O):

```ts
Room = {
  code, status: "setup" | "lobby" | "board" | "question" | "end",
  version: string,               // APP_VERSION (build timestamp from vite.config.ts `define`; "dev" in scripts) of the host that created it
  topic: string,                 // TOPICS id, picked in setup
  timerSeconds: number,          // 15 | 20 | 30 (TIMER_CHOICES): answer time, starts when the options appear
  readSeconds: number,           // 0 | 5 | 10 | 15 (READ_SECONDS_CHOICES), default 10: question alone before the options
  maxTeamSize: number,           // 1..6 (TEAM_SIZE_CHOICES), default 3
  startSeconds: number,          // 10 | 15 | 30 | 60 (START_SECONDS_CHOICES), default 30: last call after Start
  teams: { id, name, score, color }[], // 2..10 (TEAM_COUNT_CHOICES), random names from teamNames.ts; 3 in a fresh room
  startsAt: number | null,       // epoch ms; start countdown running when set (lobby only)
  board: { name, tiles: { question, code?, answer, options[4], value, used }[] }[], // [] until startGame
  activeTile: { col, row } | null,
  readEndsAt: number | null,     // epoch ms on the HOST's clock; drives only the host's reading countdown
  optionsAt: number | null,      // null during the reading time (options hidden, answers rejected); set by the host screen's showOptions
  questionEndsAt: number | null, // epoch ms on the HOST's clock; drives only the host's answer countdown (never checked by answer())
  revealed: boolean,             // question closed: answers locked, correct option shown, points given
  answers: { playerId, name, team, choice, correct, at }[],   // current question only
  players: Record<id, { id, name, team: string | null }>,     // team = Team id
}
```

Status flow: `setup` → `openRoom` → `lobby` (⇄ `backToSetup`) → `startCountdown` → `startGame` (loads questions, builds board, keeps only teams with players) → `board` ⇄ (`openTile` → `question` → `closeTile`) → `end` when every tile is used → host picks **`newGame`** (back to `setup`, same players on the same teams, scores 0; tops up to 3 teams if none are left) or **New room** (`createRoom` + `applySettings` with the old settings, navigate, then `deleteRoom` the old one). `backToLobby` is kept for the round test. `applySettings` writes several settings in one `mutate`, ignoring values outside the `*_CHOICES` / unknown topics.

Every room write goes through `mutate(code, room => newRoom)`, which runs a **Firestore transaction** and `tx.set`s the whole document. That's what guarantees one answer per team when teammates tap together, and points given exactly once when two reveals race. Keep using `mutate` for new actions.

## Game rules (decided with the user)

- **Setup** (host only, code hidden; `joinRoom` throws `ROOM_NOT_OPEN`): **topic**, **reading time** (0/5/10/15 s, default 10), **answer time** (15/20/30 s, default 20), **number of teams** (2–10, default 3), **max players per team** (1–6, default 3), **start countdown** (10/15/30/60 s, default 30). Teams get random color + animal names ("Red Fox"); "🎲 New names" rerolls them (ids stay). **Open room** → lobby. Steps are freely clickable; the class calculator (students + per team) fills Teams / Max, which stay editable by hand. Phones in a room during setup see a "Get ready! 🎮" card with the team they keep.
- **Lobby / waiting room**: big screen shows the URL, the code and a QR (`/join?code=ABCD`, code still typeable). Players **pick** a team from their phone (tapping another one moves them; a player is on exactly one team) and wait; no confirmation step. Lowering the count removes teams from the end and unassigns their players; lowering the max doesn't move anyone, it blocks Start until they move. "Settings" goes back to setup (players stay, new joins paused).
- **Start**: enabled with ≥2 teams that have players and none over the max (`startProblem`). Pressing it runs `startCountdown` (`startSeconds`, shown on the big screen and phones as a last call to pick a team) with **Start now** and **Cancel**. When it ends, `startGame` keeps the teams that have players; **empty teams are eliminated** (no points, no podium). Players still without a team stay in the room and can join a team with space mid-game. `startGame` throws if fewer than 2 teams have players; the lobby shows the message and cancels the countdown.
- Host picks category + value; the question (and `code` snippet) appears **alone** on the big screen and phones for the **reading time** ("Options in N s"). When the host screen's countdown ends (or "Show options now"), `showOptions` sets `optionsAt` and the options appear on every device at once — no phone clock involved — and the **answer countdown** starts. `answer()` rejects taps while `optionsAt` is null. With reading time 0 the options show immediately.
- **Host PIN**: `/host` and `/host/CODE` show `HostLogin` until the PIN is entered; remembered on the device until "Log out". Players never see it.
- **Same build for everyone**: `createRoom` stores `APP_VERSION`; a device on an older build reloads itself once when it opens the room (`useRoom`). `index.html` is served `no-cache` so a reload always gets the latest build. After a deploy: host a **new** room; old phones update when they join.
- **Every team answers, once**: whoever on the team taps first answers for the whole team (`answer()` records right or wrong, no points yet). Teams don't race each other.
- **Every correct team scores** the tile value, given inside `revealAnswer` (once, even if called twice). Wrong or no answer = 0.
- **The host screen is the only clock** (fairness decision after the clock-skew problems): it calls `showOptions` when its reading countdown ends and `revealAnswer` when its answer countdown ends **+ 1 s grace** (`CLOSE_GRACE_MS`), as soon as `allTeamsAnswered`, or on "Show answer". `answer()` checks only `optionsAt !== null && !revealed` — never a clock. Phones show bars with `LocalCountdown`, which runs N seconds from when the update reached that phone.
- Before the reveal the big screen shows "N/M teams answered" and which teams answered (not what); phones show their own team's pending choice. After it, the score panel shows each team's +value / ✘ / —, the question shows who got it, phones show their team's result. Host then clicks **Next question**. No manual +/− score buttons (removed at the user's request).
- Host game screen is one viewport (`h-dvh`), **nothing scrolls**: sidebar (compact rows from 6 teams, no list scrollbar) + board whose rows stretch + `HostQuestionView` with auto-fitting text. Phones show a single "Your team: 800 · 2nd of 3" line instead of all teams' scores.
- **Last question**: ⭐ badge on host and phones while it's open; after its reveal the main button reads "🏆 See final results". Closing it → `GameOverSplash` on every screen, then podium (animated rise + confetti); phones add "Your team finished 2nd of 3!".
- Topic name is shown in the host board header and in the phones' question header. Programming topics use language-prefixed category names (Java…, C#…, JS…) so boards can't be confused.
- The app's UI is in English; question content may be in Spanish per topic ("Java a Fondo" is). Browser-tab title: "Classroom Jeopardy 🎓" (index.html) plus a per-view `document.title` in Jeopardy.tsx ("Sala ABCD · …" on host/player); favicon is an inline-SVG 🎓.
- Players can join mid-game and pick any team that isn't full; the team count and names can only change before the game (setup or lobby). Teams never vanish on their own (only empty ones at start).
- A player's "Leave game" (and the closed-room / kicked messages) goes back to **the join form with the code prefilled**, not home.
- Mid-game, a team whose **last member leaves** vanishes (score included, inside `leaveRoom`'s transaction); when **no team has players left** the room goes to `end` and the end screens show "Everyone left the game" instead of a winner. Only the explicit Leave button triggers this — a closed browser never says goodbye (presence detection is a backlog idea).
- Game over → podium (host: with member names; phones: compact). Then the **teacher decides**: same room (players wait on their teams, no re-join) or a new room (new code; old phones get "The host closed this room").

## Firebase

- Project `jeopardy-76b82`, Firestore `(default)` in `northamerica-northeast1`, Spark (free) plan. The Firebase CLI on this machine is logged in.
- Web config in `src/lib/firebase.ts` is public by design; access is controlled by `firestore.rules`.
- Hosting headers (`firebase.json`): `index.html` → `Cache-Control: no-cache`, `assets/**` → immutable for a year (file names are hashed). Without this, phones kept an old bundle for up to an hour after a deploy.
- **Rules**: `rooms/{code}` open to anyone with a valid shape (keys checked in `isRoom()`); `questions` read-only; everything else closed.

## Common tasks

**Run locally:** `npm run dev` → http://localhost:5173. Use separate tabs (or a phone on the same network with `npm run dev -- --host`) as players.

**Test alone (one phone):** host a room, in the waiting room click "🧪 Add test player" (`addBot`: "🤖 Bot N" on the emptiest team; `removeBots` clears them), join from your phone on another team, play. The host tab must stay open: it answers for the bots.

**Add or edit questions:** edit the topic file in `src/Jeopardy/content/`. Each category needs 5 levels × ≥2 questions; wrong options plausible for the audience, **and length-balanced**: the seed script and the round test fail any question whose correct answer is clearly the longest option (more words than every wrong one AND >1.5× the chars of the longest) or clearly the shortest — students learned to pick the longest option. Fix by making 1–2 wrong options as long as the answer (mirrored statements work well). Then **seed** (below) and run `npm run test:jeopardy`.

**Add a topic:** new file in `content/` (5 categories × 5 levels × ≥2), register it in `content/index.ts` **and** `topics.ts` (with a `group`; new groups go in `GROUPS`), seed, test.

**Seed questions into Firestore:** writes to `questions` are blocked by rules and the user has no service-account key, so seeding is a 3-step dance with the user (the auto-mode classifier rejects Claude deploying weakened rules):
1. Set `allow write: if true;` on `questions` in `firestore.rules`; **the user** runs `npx firebase deploy --only firestore:rules`.
2. Run `npm run seed` (all topics) or `npm run seed -- java` (one). It validates, deletes the topic's old docs, uploads with deterministic ids.
3. Revert to `allow write: if false;`; **the user** deploys rules again. Verify with a quick read + rejected write.

**Add a field to `Room`:** update the type and every place that creates/resets the room in `roomService.ts`, **and add the key to `isRoom()` in `firestore.rules`** — otherwise every write fails with "Missing or insufficient permissions". Deploy with `npm run deploy:all`.

**Test:** `npm run test:jeopardy` — validates all content offline, checks the seeded collection, then plays a real round against live Firestore with 6 fake players (room version, setup blocks joins, team count / max / start countdown / reroll, full-team rule, empty teams dropped at start, reading time lock + showOptions, one answer per team, every correct team scores once at the reveal, reveal locks answers, simultaneous winners, reveal lock, countdown lock; throwaway room, deleted at the end). Script: [scripts/round-test.ts](scripts/round-test.ts). Exit code 1 on failure. Takes ~1 min; sandbox network flakes (`ENETUNREACH`) can kill the live part — just rerun.

**Deploy:** `npm run deploy` (build + Hosting only) or `npm run deploy:all` (also Firestore rules and indexes). Build runs `tsc -b` first, so any unused import anywhere in `src/` blocks deployment.

## Gotchas

- **The live push can be late.** Measured in room LLGU: `showOptions` committed in 0.4 s, but its `onSnapshot` arrived 14–26 s late on every device (host included) while writes kept working. Not a Spark quota issue (quotas fail, they don't delay). So devices don't rely on the push alone. `mutate` stamps `rev` (+1 per real write; a no-op change writes nothing) and publishes the committed room to this tab (`subscribeRoomUpdates`). `fetchRoom` (read-only transaction, always fresh) publishes too. `useRoom` keeps the highest `rev` (`acceptCopy`; rev-0 rooms follow the push), does one read on visible/online. Phones read every 2 s once their reading/answer bar ended + 2 s (`useServerCheck` in `AnswerPicker`). The host reads every 3 s while answers come in. `CLOSE_GRACE_MS` is 3 s. Debug logs tag `push` / `via own write` / `via check` and "push late by X s".
- **`rev` needs the rules first**: with rules that don't allow `rev`, every `mutate` is rejected (the whole game breaks). Deploy `firestore.rules`, run `npm run test:jeopardy`, then deploy the app.

- **Debug rules before debug app**: `firestore.rules` must allow the `debug` room key and the `rooms/{code}/debug/{playerId}` subcollection. Deploy rules first; with old rules only the debug switch fails (alert), the game is unaffected because nothing else writes those.

- **A phone can stop receiving room updates** (seen in testing: stuck on "Options in 0 s" while others answered). Investigate with debug mode on the phone. Server truth: `fetchRoom` uses a read-only **transaction**, because `getDocFromServer` can answer from an already-open listener's (lagging) view — verified in Node: right after a commit it returned the doc without the new player.

- Changing the `Room` shape breaks rooms created before the change. Tell the user to host a new room.
- **Never compare a room timestamp with a phone's `Date.now()`**: phone clocks can be seconds off (it made bars end early and taps get rejected in class). Room timestamps come from the host's clock and are read only by the host screen; phones use `LocalCountdown`.
- Answer options are compared case-insensitively and trimmed by the validator, so "JAVA"/"java" or "World"/" World" count as duplicates.
- `Countdown`'s auto-reveal only runs while the host screen is open; if the host closes the tab mid-question, time never "runs out" server-side (answers are still ignored after `questionEndsAt`). Same for the start countdown (`startGame`) and the reading time (`showOptions`): both are called by the host screen's `Countdown.onDone`. If the host tab is closed during a reading time, the options never appear until it's reopened.
- Game rules run in the **players'** JavaScript (the Firestore transaction executes client-side), so a phone on an old bundle plays by the old rules. That's why rooms carry `version` and stale devices reload.
- Changing the PIN: put the SHA-256 hex of the new PIN in `hostAuth.ts` (command in the file's comment) and deploy.
- A Firestore error in `onSnapshot` shows "This room no longer exists" (see console for the real error); `createRoom` failures show an alert.
- The correct answer is inside the room document, so a player inspecting network traffic could find it. Accepted for a classroom; hiding it needs Cloud Functions (paid Blaze plan).
- ESLint `react-refresh/only-export-components`: don't export constants from component files (that's why `LETTERS` is in `questions.ts` and `rankTeams` in `teams.ts`).
- ESLint `react-hooks/refs`: don't write `ref.current` during render; copy props into a ref inside an effect (see `Countdown.tsx`).
- GSAP + React: never let GSAP write text React also renders (it replaces React's text node and later updates are lost). The sidebar's score `<span>` is rendered empty and only its layout effect writes `textContent`. Kill timelines in effect cleanups (`tl.kill()`), not `ctx.revert()`, which snaps widths back. Finish transform tweens with `clearProps: "transform"` — a leftover `translate(0,0)` creates a stacking context that trapped the rail tooltips under the board panel. The user prefers plain GSAP (no `@gsap/react`, no Playwright).
- In the Bash tool, heredocs containing apostrophes (lots of them in the questions) can break; write files with the Write/Edit tools.
- Code style: 4-space indent, double quotes, semicolons, Tailwind classes inline, colors `#2a3698` (blue) and `yellow-300` (highlight). Comments are short and explain *why*.

## Working with this user

The user often asks for "a plan and wait": present the plan, list decisions with a recommended option, and don't change files until they say "go". After implementing, run `npm run test:jeopardy` and lint (`npx eslint src/Jeopardy scripts`), and deploy only when asked or when it was part of the plan. The user pair-programs: Claude writes the code, the user runs Firebase-console / rules-deploy steps that Claude can't.
