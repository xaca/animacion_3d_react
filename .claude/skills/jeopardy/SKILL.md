---
name: jeopardy
description: Everything about the "Do you know your English?" Jeopardy game in src/Jeopardy — architecture, Firestore data model, game rules, how to add questions, test, and deploy to Firebase. Use whenever working on the Jeopardy game, its questions, its multiplayer/Firebase code, or its deployment.
---

# Jeopardy game ("Do you know your English?")

An English-learning Jeopardy for a classroom. The host shows the board on a big screen;
players answer multiple-choice questions on their phones. Live at **https://jeopardy-76b82.web.app**.

This repo (`react_test`) is a lab of class examples; `src/App.tsx` currently renders only `<Jeopardy />`.
Stack: React 19 + TypeScript (strict, `noUnusedLocals`) + Vite + Tailwind 4 + Firebase 13 (Firestore + Hosting).

For improvement ideas and known issues, read [backlog.md](backlog.md) before planning new work.

## Modes and URLs

Routing is hand-written in `src/Jeopardy/Jeopardy.tsx` (no router library): `viewFromPath()` maps the URL to a view, `go()` uses `history.pushState`.

| URL | Screen |
|---|---|
| `/` | Home: Host a game / Join a game / Play on one screen |
| `/local` | One-screen game, host awards points by hand (no Firebase) |
| `/join` | Join form: room code + name |
| `/host/ABCD` | Host's big screen for room ABCD |
| `/play/ABCD` | Player's phone. Player id comes from `sessionStorage["jeopardy-player:ABCD"]`; without it the join form shows |

`sessionStorage` is per tab, so several tabs in one browser can be different players (handy for testing).

## File map (`src/Jeopardy/`)

| File | Role |
|---|---|
| `Jeopardy.tsx` | Entry + URL routing |
| `questions.ts` | Question `BANK`, `Tile`/`Category` types, `buildBoard()` (4 random categories × 5 values, options shuffled), `markUsed`, `allUsed`, `LETTERS` |
| `teams.ts` | `Team` type, `makeTeams(n)` |
| `Board.tsx` | Category × value grid (shared by local and host) |
| `QuestionModal.tsx` | Question + A–D options + reveal; props `revealed`, `closeLabel`, `hint`, `children` |
| `TeamScores.tsx` | Score cards with optional +/− buttons |
| `EndScreen.tsx` | Winner / tie + Play again |
| `LocalGame.tsx`, `SetupScreen.tsx` | One-screen mode (all state in React) |
| `multiplayer/roomService.ts` | **All Firestore access.** Types `Room`, `Player`, `Answer`; host/player actions; helpers `activeTileOf`, `winnerOf`, `nobodyGotIt` |
| `multiplayer/useRoom.ts` | `useRoom(code)` → `undefined` loading, `null` missing/error, else `Room` (live via `onSnapshot`) |
| `multiplayer/HostGame.tsx`, `HostLobby.tsx` | Host screens; `AnswerList` shows ✔/✘ per player and the winner |
| `multiplayer/PlayerGame.tsx` | Phone: `TeamPicker`, `AnswerPicker` (4 option buttons + result) |
| `multiplayer/JoinScreen.tsx`, `HomeScreen.tsx`, `ui.tsx` | Join form, home, shared Tailwind classes (`primaryButton`, `linkButton`, `input`, `Screen`, `Message`) |

Firebase setup lives outside the folder: `src/lib/firebase.ts` (exports `db`), `firebase.json`, `.firebaserc`, `firestore.rules`.

## Data model

One Firestore document per room: `rooms/{code}` (code = 4 letters from `ABCDEFGHJKLMNPQRSTUVWXYZ`, no I/O).

```ts
Room = {
  code, status: "lobby" | "board" | "question" | "end",
  teams: { name, score }[],
  board: { name, tiles: { question, answer, options[4], value, used }[] }[],
  activeTile: { col, row } | null,
  answers: { playerId, name, team, choice, correct, at }[],   // current question only
  players: Record<id, { id, name, team: number | null }>,
}
```

Status flow: `lobby` → `startGame` → `board` ⇄ (`openTile` → `question` → `closeTile`) → `end` when every tile is used → `backToLobby`.

Every write goes through `mutate(code, room => newRoom)`, which runs a **Firestore transaction** and `tx.set`s the whole document. That's what guarantees "two correct answers at once → exactly one winner". Keep using `mutate` for new actions.

## Game rules (decided with the user)

- Host picks category + value; question and options A–D appear on the big screen and on phones.
- Each player gets **one try** per question. Wrong = no penalty, locked out for that question.
- **First correct answer wins**: tile value is added to the player's team automatically inside `answer()`.
- After a winner (or when every player on a team answered wrong → `nobodyGotIt`), the answer is revealed and the host clicks **Next question**. Host's +/− buttons remain for manual fixes.
- Players with no team see the team picker, even mid-game.
- `/local` mode: no phones, host reveals the answer and awards points with +/−.

## Firebase

- Project `jeopardy-76b82`, Firestore `(default)` in `northamerica-northeast1`, Spark (free) plan. The Firebase CLI on this machine is logged in.
- Web config in `src/lib/firebase.ts` is public by design; access is controlled by `firestore.rules`.
- **Rules** allow anyone to read/create/update/delete `rooms/{code}` if the code is 4 capital letters and the document only has the `Room` keys; everything else is denied. No login (anonymous auth is enabled in `firebase.json` but unused).

## Common tasks

**Run locally:** `npm run dev` → http://localhost:5173. Use separate tabs (or a phone on the same network with `npm run dev -- --host`) as players.

**Add or edit questions:** edit `BANK` in `questions.ts`. Each entry: `{ question, answer, wrong: [3 strings] }`, grouped per category into 5 difficulty levels (200…1000). Wrong options should be plausible for English learners (near-misspellings, wrong verb forms, false friends). A new category needs all 5 levels. Then run `npm run test:jeopardy`.

**Add a field to `Room`:** update the type and every place that creates/resets the room in `roomService.ts`, **and add the key to `isRoom()` in `firestore.rules`** — otherwise every write fails with "Missing or insufficient permissions". Deploy with `npm run deploy:all`.

**Test:** `npm run test:jeopardy` — checks the whole question bank offline, then plays a real round against live Firestore with 3 fake players (throwaway room, deleted at the end). Script: [scripts/round-test.ts](scripts/round-test.ts). Exit code 1 on failure.

**Deploy:** `npm run deploy` (build + Hosting only) or `npm run deploy:all` (also Firestore rules and indexes). Build runs `tsc -b` first, so any unused import anywhere in `src/` blocks deployment.

## Gotchas

- Changing the `Room` shape breaks rooms created before the change (rules reject their old keys). Tell the user to host a new room.
- A Firestore error in `onSnapshot` shows "This room no longer exists" (see console for the real error); `createRoom` failures show an alert.
- "Show answer" on the host is local state only; it does not stop players from answering.
- The correct answer is inside the room document, so a player inspecting network traffic could find it. Accepted for a classroom; hiding it needs Cloud Functions (paid Blaze plan).
- `nobodyGotIt` needs **every** player on a team to answer; one idle phone blocks it, so the host uses "Show answer".
- ESLint `react-refresh/only-export-components`: don't export constants from component files (that's why `LETTERS` is in `questions.ts`).
- In the Bash tool, heredocs containing apostrophes (lots of them in the questions) can break; write files with the Write/Edit tools.
- Code style: 4-space indent, double quotes, semicolons, Tailwind classes inline, colors `#2a3698` (blue) and `yellow-300` (highlight). Comments are short and explain *why*.

## Working with this user

The user often asks for "a plan and wait": present the plan, list decisions with a recommended option, and don't change files until they say "go". After implementing, run `npm run test:jeopardy` and lint (`npx eslint src/Jeopardy`), and deploy only when asked or when it was part of the plan.
