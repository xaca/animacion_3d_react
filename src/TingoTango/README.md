# TingoTango — ¿Dónde está la bolita?

Juego de aula: la bolita salta entre los celulares de los estudiantes (representados en la
pantalla del profesor) mientras suena "Tingo, tingo, tingo…". Cuando el profesor la detiene
(o el temporizador aleatorio lo hace) aparece **Tango** y el estudiante donde cayó la bolita
responde una pregunta de selección múltiple. Puntaje individual, podio al final.

- Entrada: `TingoTango.tsx` (`<TingoTango basePath="/tingo" />` desde `src/App.tsx`).
- **Sincronización de la bolita**: la bolita salta EN los celulares. Al empezar cada ronda
  la sala guarda un calendario (`hops` + `hopMs`, una sola escritura) y cada celular lo
  reproduce localmente desde que le llega el update (filosofía `LocalCountdown`: cronómetro
  propio, nunca el reloj de otro; el push puede tardar segundos, imposible escribir cada
  salto). El tablero del profe solo "canta" (tingo, tingo, … → ¡Tango!). El sorteo real es
  de `stopTango`, en la transacción; la bolita visual es teatro.
- Datos propios en Firestore: `tingo_rooms/{code}` (salas) y `tingo_questions/{id}` (banco,
  sembrado por `npm run seed:tingo` desde `content/`). No comparte colecciones con Jeopardy.
- Cero imports desde `src/Jeopardy`: todo lo reciclado está copiado y adaptado aquí.

## ⚠️ TODO framework (leer antes de crear el tercer juego)

Este folder es la **segunda copia** del patrón de salas Firestore que nació en
`src/Jeopardy/multiplayer`. Cuando se cree el próximo proyecto que necesite salas en vivo,
NO copiar por tercera vez: extraer a `src/lib/gameRoom/` una capa genérica
(`RoomEngine<TRoom>`) y migrar Jeopardy y TingoTango a ella.

Qué es **genérico** (va al framework):

- `roomService.ts`: `mutate` transaccional + `rev`, `subscribeRoom(Updates)`, `acceptCopy`,
  `fetchRoom` (transacción de solo lectura), `createRoom`/`deleteRoom`, códigos de sala,
  `listOldRooms`/`cleanRooms`, `APP_VERSION`.
- `useRoom.ts`: push + own-write + check, recarga por versión, relectura al volver visible.
- `useServerCheck.ts`, `Countdown.tsx` (host como único reloj + `LocalCountdown`).
- Debug centralizado: `debug.ts`, `debugReports.ts`, `DebugConsole.tsx`, `DebugPanel.tsx`.
- PIN del profesor (`hostAuth.ts`, `HostLogin.tsx`), `ProfileMenu.tsx`, `JoinQr.tsx`,
  `ui.tsx`, `useFitText.ts`, `anim.ts`/`motion.ts`, `Tabs.tsx`.

Qué es **de cada juego** (queda en su folder): el tipo de sala (`TingoRoom` / `Room`), las
acciones de juego (aquí `startTingo`/`stopTango`/`answer`/`reveal`), las pantallas, el
contenido y su seed, los sonidos y la gamificación.

## Bajo acoplamiento

`TingoTango` recibe props y no conoce a Jeopardy:

```tsx
<TingoTango basePath="/tingo" questionSource={miFuente} />
```

`questionSource` (opcional) implementa `QuestionSource` (`types.ts`): `topics` y
`load(topic)`. El default lee `tingo_questions`. Para conectar con Jeopardy en el futuro,
pasar una fuente que lea su colección `questions` (mismo shape de documento) — sin tocar
nada de este folder.
