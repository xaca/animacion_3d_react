---
name: jeopardy
description: Everything about the "Do you know your English?" Jeopardy game in src/Jeopardy — architecture, Firestore data model (rooms + questions), game rules, how to add questions and topics, seed, test, and deploy to Firebase. Use whenever working on the Jeopardy game, its questions, its multiplayer/Firebase code, or its deployment.
---

# Jeopardy game ("Do you know your English?")

A classroom quiz game. The host shows the board on a big screen; players answer
multiple-choice questions on their phones. Topics: Java, C#, JavaScript, HTML & CSS,
OOP (language-agnostic), pop culture, English A1 and B1. Live at **https://jeopardy-76b82.web.app**.

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
| `topics.ts` | `TOPICS`: id/name/tagline cards for the lobby (ids must match `content/`) |
| `content/` | Source of all questions (`java.ts`, `csharp.ts`, `javascript.ts`, `htmlCss.ts`, `oop.ts`, `popCulture.ts`, `englishA1.ts`, `englishB1.ts`, `index.ts`, `types.ts`). Uploaded by the seed script; **never imported by the app** so answers stay out of the bundle |
| `teams.ts` | `Team` type (`id`, `name`, `score`, `color?`), `makeTeams(n)` (local mode only), `rankTeams` (competition ranking for the podium) |
| `teamNames.ts` | `TEAM_NAMES` pool (16 color + animal names, e.g. "Red Fox", each with a hex color) and `pickTeamNames(n, taken)` |
| `Board.tsx` | Category × value grid |
| `QuestionModal.tsx` | Question + optional `code` snippet + A–D options + reveal; props `revealed`, `onReveal`, `timer`, `optionsHidden` (reading time), `closeLabel`, `hint`, `children` |
| `Countdown.tsx` | Seconds + shrinking bar to an epoch deadline; optional `label`; `onDone` fires once (host uses it to auto-reveal / start the game; both screens use it to end the reading time) |
| `Podium.tsx` | 2nd–1st–3rd blocks, ties share a step, 4th+ listed below; `EndScreen.tsx` wraps it with "Play again" |
| `TeamScores.tsx` | Score cards with optional +/− buttons |
| `LocalGame.tsx`, `SetupScreen.tsx` | One-screen mode (hidden; still uses the legacy BANK) |
| `multiplayer/roomService.ts` | **All Firestore room access.** Types `Room`, `Player`, `Answer`; host/player actions; helpers `activeTileOf`, `winnerOf`, `nobodyGotIt`, `teamAnswerOf`, `startProblem` |
| `multiplayer/useRoom.ts` | `useRoom(code)` → `undefined` loading, `null` missing/error, else `Room` (live via `onSnapshot`). Reloads the page once if the room was hosted by a newer build (`room.version` > `APP_VERSION`) |
| `multiplayer/hostAuth.ts`, `HostLogin.tsx` | Host PIN gate: SHA-256 hash of the PIN in `hostAuth.ts` (currently the hash of **1041**), unlock remembered in `localStorage["jeopardy-host"]` until "Log out" (Setup). Deterrent only: runs in the browser |
| `multiplayer/HostSetup.tsx` | Host-only config (status `setup`, code hidden): topic cards, Timer / Teams / Max per team / Start countdown selects, team-name chips + "🎲 New names", **Open room** |
| `multiplayer/HostLobby.tsx` | Waiting room (status `lobby`): QR + URL + code, settings summary, team cards, Start game → last-call countdown with Start now / Cancel, Settings (back to setup), Close room |
| `multiplayer/HostGame.tsx` | Routes by status (`HostSetup` / `HostLobby` / board / `EndScreen`); `HostQuestion` (keyed per tile: reading countdown + "Show options now", then answer countdown); `AnswerList` shows ✔/✘ and the winner |
| `multiplayer/JoinQr.tsx` | Canvas QR for `${origin}/join?code=ABCD` (package `qrcode`) |
| `multiplayer/PlayerGame.tsx` | Phone: `TeamPicker` (pick one of the host's teams; shows the start countdown), `AnswerPicker` (options + countdown + result) |
| `multiplayer/JoinScreen.tsx`, `HomeScreen.tsx`, `ui.tsx` | Join form (code prefilled from the QR link, still editable), home, shared Tailwind classes (`primaryButton`, `linkButton`, `input`, `Screen`, `Message`) |

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
  readEndsAt: number | null,     // epoch ms, set by openTile (now + readSeconds); display only
  optionsAt: number | null,      // null during the reading time (options hidden, answers rejected); set by the host screen's showOptions
  questionEndsAt: number | null, // epoch ms = optionsAt + timerSeconds; answers after it are ignored
  revealed: boolean,             // answer shown to all + answers locked
  answers: { playerId, name, team, choice, correct, at }[],   // current question only
  players: Record<id, { id, name, team: string | null }>,     // team = Team id
}
```

Status flow: `setup` → `openRoom` → `lobby` (⇄ `backToSetup`) → `startCountdown` → `startGame` (loads questions, builds board, keeps only teams with players) → `board` ⇄ (`openTile` → `question` → `closeTile`) → `end` when every tile is used → `backToLobby`.

Every room write goes through `mutate(code, room => newRoom)`, which runs a **Firestore transaction** and `tx.set`s the whole document. That's what guarantees "two correct answers at once → exactly one winner". Keep using `mutate` for new actions.

## Game rules (decided with the user)

- **Setup** (host only, code hidden; `joinRoom` throws `ROOM_NOT_OPEN`): **topic**, **reading time** (0/5/10/15 s, default 10), **answer time** (15/20/30 s, default 20), **number of teams** (2–10, default 3), **max players per team** (1–6, default 3), **start countdown** (10/15/30/60 s, default 30). Teams get random color + animal names ("Red Fox"); "🎲 New names" rerolls them (ids stay). **Open room** → lobby.
- **Lobby / waiting room**: big screen shows the URL, the code and a QR (`/join?code=ABCD`, code still typeable). Players **pick** a team from their phone (tapping another one moves them; a player is on exactly one team) and wait; no confirmation step. Lowering the count removes teams from the end and unassigns their players; lowering the max doesn't move anyone, it blocks Start until they move. "Settings" goes back to setup (players stay, new joins paused).
- **Start**: enabled with ≥2 teams that have players and none over the max (`startProblem`). Pressing it runs `startCountdown` (`startSeconds`, shown on the big screen and phones as a last call to pick a team) with **Start now** and **Cancel**. When it ends, `startGame` keeps the teams that have players; **empty teams are eliminated** (no points, no podium). Players still without a team stay in the room and can join a team with space mid-game. `startGame` throws if fewer than 2 teams have players; the lobby shows the message and cancels the countdown.
- Host picks category + value; the question (and `code` snippet) appears **alone** on the big screen and phones for the **reading time** ("Options in N s"). When the host screen's countdown ends (or "Show options now"), `showOptions` sets `optionsAt` and the options appear on every device at once — no phone clock involved — and the **answer countdown** starts. `answer()` rejects taps while `optionsAt` is null. With reading time 0 the options show immediately.
- **Host PIN**: `/host` and `/host/CODE` show `HostLogin` until the PIN is entered; remembered on the device until "Log out". Players never see it.
- **Same build for everyone**: `createRoom` stores `APP_VERSION`; a device on an older build reloads itself once when it opens the room (`useRoom`). `index.html` is served `no-cache` so a reload always gets the latest build. After a deploy: host a **new** room; old phones update when they join.
- **One try per TEAM**: whoever taps first answers for the whole team. Wrong = no penalty, team locked out for that question.
- **First correct answer wins**: tile value added to the team automatically inside `answer()`.
- Question ends on: winner, every team answered wrong (`nobodyGotIt`), countdown reaches zero (host screen auto-calls `revealAnswer`), or host clicks "Show answer" (also `revealAnswer`). All of these **lock further answers**; host then clicks **Next question**. +/− buttons remain for manual fixes.
- Players can join mid-game and pick any team that isn't full; the team count and names can only change before the game (setup or lobby). Teams never vanish on their own (only empty ones at start).
- Game over → podium (host: with member names; phones: compact).

## Firebase

- Project `jeopardy-76b82`, Firestore `(default)` in `northamerica-northeast1`, Spark (free) plan. The Firebase CLI on this machine is logged in.
- Web config in `src/lib/firebase.ts` is public by design; access is controlled by `firestore.rules`.
- Hosting headers (`firebase.json`): `index.html` → `Cache-Control: no-cache`, `assets/**` → immutable for a year (file names are hashed). Without this, phones kept an old bundle for up to an hour after a deploy.
- **Rules**: `rooms/{code}` open to anyone with a valid shape (keys checked in `isRoom()`); `questions` read-only; everything else closed.

## Common tasks

**Run locally:** `npm run dev` → http://localhost:5173. Use separate tabs (or a phone on the same network with `npm run dev -- --host`) as players.

**Add or edit questions:** edit the topic file in `src/Jeopardy/content/`. Each category needs 5 levels × ≥2 questions; wrong options plausible for the audience. Then **seed** (below) and run `npm run test:jeopardy`.

**Add a topic:** new file in `content/` (5 categories × 5 levels × ≥2), register it in `content/index.ts` **and** `topics.ts`, seed, test.

**Seed questions into Firestore:** writes to `questions` are blocked by rules and the user has no service-account key, so seeding is a 3-step dance with the user (the auto-mode classifier rejects Claude deploying weakened rules):
1. Set `allow write: if true;` on `questions` in `firestore.rules`; **the user** runs `npx firebase deploy --only firestore:rules`.
2. Run `npm run seed` (all topics) or `npm run seed -- java` (one). It validates, deletes the topic's old docs, uploads with deterministic ids.
3. Revert to `allow write: if false;`; **the user** deploys rules again. Verify with a quick read + rejected write.

**Add a field to `Room`:** update the type and every place that creates/resets the room in `roomService.ts`, **and add the key to `isRoom()` in `firestore.rules`** — otherwise every write fails with "Missing or insufficient permissions". Deploy with `npm run deploy:all`.

**Test:** `npm run test:jeopardy` — validates all content offline, checks the seeded collection, then plays a real round against live Firestore with 6 fake players (room version, setup blocks joins, team count / max / start countdown / reroll, full-team rule, empty teams dropped at start, reading time lock + showOptions, one-try-per-team, simultaneous winners, reveal lock, countdown lock; throwaway room, deleted at the end). Script: [scripts/round-test.ts](scripts/round-test.ts). Exit code 1 on failure. Takes ~1 min; sandbox network flakes (`ENETUNREACH`) can kill the live part — just rerun.

**Deploy:** `npm run deploy` (build + Hosting only) or `npm run deploy:all` (also Firestore rules and indexes). Build runs `tsc -b` first, so any unused import anywhere in `src/` blocks deployment.

## Gotchas

- Changing the `Room` shape breaks rooms created before the change. Tell the user to host a new room.
- The countdown compares `questionEndsAt` with each device's clock; a phone with a very wrong clock sees a wrong countdown (accepted for a classroom).
- `Countdown`'s auto-reveal only runs while the host screen is open; if the host closes the tab mid-question, time never "runs out" server-side (answers are still ignored after `questionEndsAt`). Same for the start countdown (`startGame`) and the reading time (`showOptions`): both are called by the host screen's `Countdown.onDone`. If the host tab is closed during a reading time, the options never appear until it's reopened.
- Game rules run in the **players'** JavaScript (the Firestore transaction executes client-side), so a phone on an old bundle plays by the old rules. That's why rooms carry `version` and stale devices reload.
- Changing the PIN: put the SHA-256 hex of the new PIN in `hostAuth.ts` (command in the file's comment) and deploy.
- A Firestore error in `onSnapshot` shows "This room no longer exists" (see console for the real error); `createRoom` failures show an alert.
- The correct answer is inside the room document, so a player inspecting network traffic could find it. Accepted for a classroom; hiding it needs Cloud Functions (paid Blaze plan).
- ESLint `react-refresh/only-export-components`: don't export constants from component files (that's why `LETTERS` is in `questions.ts` and `rankTeams` in `teams.ts`).
- ESLint `react-hooks/refs`: don't write `ref.current` during render; copy props into a ref inside an effect (see `Countdown.tsx`).
- In the Bash tool, heredocs containing apostrophes (lots of them in the questions) can break; write files with the Write/Edit tools.
- Code style: 4-space indent, double quotes, semicolons, Tailwind classes inline, colors `#2a3698` (blue) and `yellow-300` (highlight). Comments are short and explain *why*.

## Working with this user

The user often asks for "a plan and wait": present the plan, list decisions with a recommended option, and don't change files until they say "go". After implementing, run `npm run test:jeopardy` and lint (`npx eslint src/Jeopardy scripts`), and deploy only when asked or when it was part of the plan. The user pair-programs: Claude writes the code, the user runs Firebase-console / rules-deploy steps that Claude can't.
