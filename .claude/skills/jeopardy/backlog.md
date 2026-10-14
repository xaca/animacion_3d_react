# Jeopardy backlog

Found while reviewing the code on 2026-10-14. Roughly ordered by value for a classroom. Nothing here is implemented yet.

## Known issues

1. **"Show answer" doesn't lock answers.** If the host reveals before anyone wins, players can tap the answer they now see on the big screen.
   *Fix idea:* add `revealed: boolean` to `Room` (+ `firestore.rules`), set it from a `revealAnswer(code)` action, make `answer()` ignore answers when `revealed`, and pass `room.revealed` to `QuestionModal`. Reset it in `openTile`/`closeTile`.

2. **One idle player blocks "Nobody got it".** `nobodyGotIt` waits for every player on a team, including phones that went to sleep or players who left the room open.
   *Fix idea:* combine with a timer (see below), or count only players who were in the room when the question opened.

3. **Rooms are never cleaned up** if the host closes the tab instead of clicking "Close room". Old documents pile up in Firestore.
   *Fix idea:* add `createdAt` (+ rules) and a Firestore TTL policy on `rooms` (set in the Google Cloud console; check it's available on the free Spark plan first), or delete rooms older than a day when creating a new one.

4. **Anyone with the room code can control the room**: open `/host/CODE`, change scores, or close it.
   *Fix idea:* Firebase anonymous auth (already enabled in `firebase.json`): store `hostUid` on the room and allow host-only actions in the rules only when `request.auth.uid == resource.data.hostUid`.

5. **Player phone shows only "Game over!"** at the end, without the winning team.
   *Fix idea:* reuse the winner logic from `EndScreen.tsx` (extract a `winnersOf(teams)` helper into `teams.ts`).

6. **Duplicate player names are allowed** in the same room, which makes the answer list ambiguous.

## Gameplay ideas

- **Countdown timer** per question (e.g. 20 s): store `openedAt` in the room; phones and host show the countdown; when it ends, reveal. Also fixes issue 2.
- **Speed bonus or streaks** for the winning team.
- **Daily Double** tile: one hidden tile where the team bets points.
- **Final round** with a bet, before the end screen.
- **Sound effects** on the host screen (correct / wrong / time up).
- **Join by QR code** shown in the host lobby (encode `https://jeopardy-76b82.web.app/join?code=ABCD` and prefill the code).
- **Kick player** button in the host lobby.

## Content ideas

- More questions per level (currently 2 per level per category, 60 total), so games repeat less.
- New categories (Phrasal Verbs, Prepositions, False Friends for Spanish speakers, Pronunciation).
- Let the teacher edit questions without code: store question sets in Firestore (`questionSets/{id}`) with a simple editor page; `buildBoard()` reads the chosen set.
- Difficulty or level selector (A1–C1) in the lobby.

## Code cleanups

- `teamName()` is duplicated in `HostGame.tsx` and `PlayerGame.tsx`; move it to `roomService.ts` helpers.
- `HostGame.tsx` computes the active tile by hand; use `activeTileOf(room)`.
- `LocalGame.tsx` and the multiplayer host share most of the flow; if more modes come, consider one reducer used by both.
- The JS bundle is ~700 kB (mostly Firebase); lazy-load the multiplayer screens with `React.lazy` so `/local` starts faster.
