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
- **Flujo del profe**: `setup` (`HostSetup`: pasos libres 1·Tema → 2·Tiempos → 3·Preguntas → 4·Resumen,
  código oculto, `joinRoom` lanza `ROOM_NOT_OPEN`) → **Abrir sala** (`openRoom`) → `lobby`
  (QR + resumen; "⚙ Ajustes" = `backToSetup`, los jugadores siguen dentro) → juego.
  "Nueva sala" copia los ajustes y abre directo el lobby.
- **Subir temas desde la app** (📥 en el paso Tema o en el menú Profe de setup y lobby, `UploadTopicModal`):
  JSON `{ name, tagline, questions: [{ question, answer, wrong[3], code? }] }` (5–400
  preguntas; también acepta un JSON de Jeopardy con `categories`). Lo valida
  `contentValidation.ts` (el mismo validador del seed) y `customTopics.ts` lo escribe en
  `tingo_questions` con prefijo `custom-` + una tarjeta en `tingo_custom_topics`. Las
  reglas solo dejan escribir `custom-` con forma válida: el banco sembrado sigue
  bloqueado y no hay baile de reglas. `QuestionSource.subscribeTopics` + `useTopics()`
  mezclan los temas fijos con los subidos en vivo.
- **Podio y empates**: igual puntaje = empate. Si un empate toca el 1.º, 2.º o 3.º puesto,
  `finishGame` (todo camino a `end` pasa por ahí) lo resuelve con piedra, papel o tijera
  automático (`tiebreak.ts`) DENTRO de la transacción y guarda las jugadas en
  `room.tiebreaks`; host y celulares reproducen la misma secuencia (`TiebreakShow`:
  anuncio → cara a cara VS → "¡Piedra! ¡Papel! ¡Tijera!" palabra por palabra → jugadas
  (la mano ganadora embiste, el perdedor se apaga) → ganador; el profe puede "Saltar ⏭") y
  el podio lo resume. Máx. 6 rondas por puesto (la última es decisiva). Empates bajo el 3.º
  se comparten. Con debug on, el menú del juego trae "🧪 Forzar empate" para probarlo.
  Nadie mide tiempos en el celular (lección de Jeopardy).
- **Prueba**: `npm run test:tingo` (`scripts/tingo-test.ts`) valida el contenido, revisa el
  banco sembrado y juega partidas reales en salas desechables: setup por pasos, subida de
  temas + reglas, y todas las reglas del juego (lectura, solo responde el elegido, puntos
  una vez, sorteo justo, salir, fin, otra partida, nueva sala). Borra todo al final.

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
