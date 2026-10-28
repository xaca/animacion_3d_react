import type { TopicContent } from "./types";

// Design Thinking, etapa de empatía — en español. Enfocado SOLO en empatizar
// (fundamentos, entrevistas, observación, mapa de empatía y casos prácticos), pensado
// como complemento del tema "Design Thinking" de Jeopardy: mismas aulas, preguntas
// distintas. Niveles 1→5 van de definición a criterio. Opciones balanceadas en longitud
// (el seed falla si la correcta es claramente la más larga o la más corta).
export const DESIGN_THINKING_EMPATIA: TopicContent = {
    id: "design-thinking-empatia",
    name: "Design Thinking: Empatía",
    categories: {
        "Empatía: fundamentos": [
            [
                { question: "¿Qué busca el equipo en la etapa de empatía?", answer: "Comprender a las personas usuarias", wrong: ["Vender el producto terminado", "Decorar la presentación final", "Elegir el logo del proyecto"] },
                { question: "En Design Thinking, empatizar es la etapa número…", answer: "1", wrong: ["3", "5", "2"] },
            ],
            [
                { question: "Empatizar significa comprender al usuario…", answer: "Sin juzgar lo que dice o hace", wrong: ["Para convencerlo de comprar", "Dándole siempre la razón", "Solo cuando está de acuerdo"] },
                { question: "La base de una buena empatía son…", answer: "Evidencias de usuarios reales", wrong: ["Las opiniones del equipo", "Las modas del mercado", "Las ideas del profesor"] },
            ],
            [
                { question: "¿Cuál es un sesgo típico al empatizar?", answer: "Buscar solo datos que confirmen nuestra idea", wrong: ["Entrevistar a personas distintas entre sí", "Registrar los hechos tal como ocurren", "Preguntar antes de suponer cualquier cosa"] },
                { question: "¿Por qué empatizar antes de definir el problema?", answer: "Porque el problema real vive en el contexto del usuario", wrong: ["Porque así lo exige el cronograma del proyecto", "Para tener algo que mostrar en la primera reunión", "Porque definir primero ahorra tiempo de investigación"] },
            ],
            [
                { question: "Un equipo dice: 'no hace falta investigar, ya sabemos qué quiere la gente'. Eso es…", answer: "Diseñar desde suposiciones, el riesgo que la empatía evita", wrong: ["Una buena práctica cuando el equipo tiene experiencia", "La forma recomendada de ahorrar tiempo en el proyecto", "Parte normal de la etapa de prototipado del proceso"] },
                { question: "Empatía NO es lo mismo que…", answer: "Simpatía: sentir lástima por el otro", wrong: ["Comprender el contexto del usuario", "Escuchar sin interrumpir al usuario", "Observar las rutinas de la gente"] },
            ],
            [
                { question: "Tu usuario describe con entusiasmo una rutina que en los datos casi nunca cumple. ¿Qué concluyes?", answer: "Hay brecha entre el decir y el hacer: investiga el comportamiento", wrong: ["Que el usuario miente y hay que descartar su entrevista", "Que los datos están mal porque él conoce su rutina", "Que la entrevista basta y no hace falta observar nada"] },
                { question: "¿Cuándo 'termina' la empatía en un proyecto real?", answer: "Nunca del todo: se vuelve a ella en cada iteración", wrong: ["Al firmar el acta de inicio del proyecto", "Cuando el equipo entrega los prototipos", "Al aprobar el presupuesto con el cliente"] },
            ],
        ],
        "Entrevistas en profundidad": [
            [
                { question: "¿Qué pregunta es abierta?", answer: "¿Cómo organizas tu día?", wrong: ["¿Te gusta tu rutina?", "¿Madrugas sí o no?", "¿Usas agenda de papel?"] },
                { question: "Antes de entrevistar conviene preparar…", answer: "Una guía con temas y preguntas", wrong: ["Un contrato de compraventa", "Un examen con calificación", "Un discurso de ventas"] },
            ],
            [
                { question: "'¿Verdad que esta app es útil?' es una pregunta…", answer: "Sugestiva: empuja la respuesta", wrong: ["Abierta: invita a contar historias", "Neutral: no influye en nada", "De seguimiento: profundiza un tema"] },
                { question: "Para romper el hielo al inicio de la entrevista…", answer: "Conversa de su contexto antes de entrar al tema", wrong: ["Muestra tu solución para impresionar", "Pide que firme el consentimiento y calla", "Lanza la pregunta más difícil primero"] },
            ],
            [
                { question: "La técnica de los 5 porqués sirve para…", answer: "Encontrar la causa profunda de una respuesta", wrong: ["Completar las cinco preguntas mínimas", "Medir la inteligencia del entrevistado", "Alargar la entrevista cuando va corta"] },
                { question: "Pedir 'cuéntame la última vez que…' funciona porque…", answer: "Trae hechos concretos y no opiniones generales", wrong: ["Obliga a responder con un sí o un no", "Hace la entrevista más corta y barata", "Evita que la persona hable de su vida"] },
            ],
            [
                { question: "El entrevistado se desvía hacia una historia que no esperabas. ¿Qué haces?", answer: "La exploras: ahí pueden estar los hallazgos", wrong: ["Lo interrumpes para volver a tu guía", "Cambias de entrevistado de inmediato", "Anotas que no sabe responder bien"] },
                { question: "¿Cuál es un error del entrevistador?", answer: "Completar las frases del entrevistado", wrong: ["Grabar la sesión con su permiso", "Hacer silencios y esperar la respuesta", "Tomar notas de hechos y citas textuales"] },
            ],
            [
                { question: "Tras 5 entrevistas todas dicen lo mismo que tu hipótesis. ¿Qué sospechas primero?", answer: "Que tus preguntas pudieron sugerir las respuestas", wrong: ["Que ya probaste tu idea y puedes programar", "Que la gente se puso de acuerdo para responder", "Que no hace falta hablar con nadie más nunca"] },
                { question: "¿Entrevistar por chat reemplaza la entrevista en persona?", answer: "No del todo: se pierden gestos, tono y contexto", wrong: ["Sí, porque escribir es más cómodo para todos", "Sí, siempre que se usen muchos emojis claros", "No, porque por chat la gente siempre miente"] },
            ],
        ],
        "Observación e inmersión": [
            [
                { question: "Observar a la gente usando un producto se hace idealmente…", answer: "En su contexto natural", wrong: ["En un laboratorio secreto", "Desde la oficina del jefe", "En la sala de juntas"] },
                { question: "Al observar, lo primero que se registra son…", answer: "Hechos", wrong: ["Juicios", "Gustos", "Modas"] },
            ],
            [
                { question: "¿Qué es el shadowing?", answer: "Acompañar al usuario durante su actividad real", wrong: ["Espiar al usuario sin su permiso", "Seguir las redes sociales del usuario", "Dibujar la sombra del producto final"] },
                { question: "¿Por qué observar además de preguntar?", answer: "Porque la gente no siempre hace lo que dice", wrong: ["Porque las entrevistas están prohibidas", "Porque mirar es más barato que hablar", "Porque así no hay que tomar notas"] },
            ],
            [
                { question: "En el marco de observación AEIOU, la A corresponde a…", answer: "Actividades", wrong: ["Actitudes", "Alimentos", "Artefactos"] },
                { question: "La inmersión consiste en…", answer: "Vivir la experiencia del usuario en carne propia", wrong: ["Sumergir el prototipo en pruebas de agua", "Mudarse a la casa del usuario un mes", "Leer todos los informes del sector"] },
            ],
            [
                { question: "Observas que los clientes de la cafetería cargan el portátil en el piso. ¿Qué anotas?", answer: "El hecho: conectan en enchufes lejos de las mesas", wrong: ["La solución: vender mesas con enchufe ya mismo", "El juicio: a la gente le encanta sentarse mal", "Nada: eso no tiene relación con el servicio"] },
                { question: "¿Qué registra un diario de usuario (diary study)?", answer: "Lo que la persona vive durante días, contado por ella", wrong: ["Lo que el equipo opina del usuario cada día", "Las ventas diarias del producto en la tienda", "Los sueños que el usuario recuerda al despertar"] },
            ],
            [
                { question: "Para empatizar con pasajeros con muletas, el equipo recorre la estación con muletas. ¿Qué técnica es?", answer: "Inmersión: experimentar la barrera uno mismo", wrong: ["Entrevista grupal con usuarios expertos", "Encuesta masiva con preguntas cerradas", "Prototipado rápido de baja fidelidad"] },
                { question: "¿Cuál es el riesgo de observar y no registrar en el momento?", answer: "La memoria reescribe los detalles importantes", wrong: ["Que el cuaderno de notas se quede sin hojas", "Que el usuario pida ver lo que escribiste", "Ninguno: lo importante siempre se recuerda"] },
            ],
        ],
        "Mapa de empatía": [
            [
                { question: "¿Cuántos cuadrantes clásicos tiene el mapa de empatía?", answer: "4", wrong: ["2", "6", "8"] },
                { question: "El mapa de empatía se llena con información de…", answer: "Entrevistas y observaciones reales", wrong: ["La imaginación del diseñador", "Las metas de venta del negocio", "Los colores de la marca"] },
            ],
            [
                { question: "Una cita textual del usuario va en el cuadrante…", answer: "Dice", wrong: ["Siente", "Piensa", "Hace"] },
                { question: "'Teme que sus datos se filtren' va en el cuadrante…", answer: "Siente", wrong: ["Dice", "Hace", "Oye"] },
            ],
            [
                { question: "¿Qué son los 'dolores' en el mapa de empatía?", answer: "Frustraciones y obstáculos del usuario", wrong: ["Enfermedades físicas del usuario", "Errores técnicos del prototipo", "Quejas del equipo de diseño"] },
                { question: "¿Qué diferencia 'dice' de 'piensa'?", answer: "Piensa incluye lo que no se atreve a decir", wrong: ["Son el mismo cuadrante con otro nombre", "Dice se llena solo con datos numéricos", "Piensa lo escribe el usuario en persona"] },
            ],
            [
                { question: "¿Qué señal delata un mapa de empatía mal hecho?", answer: "Está lleno de suposiciones sin evidencia", wrong: ["Tiene citas textuales de los usuarios", "Muestra contradicciones del usuario", "Se actualizó después de observar"] },
                { question: "El usuario dice 'todo bien' pero bufa y reinicia la app tres veces. ¿Dónde va cada cosa?", answer: "'Todo bien' en dice; bufar y reiniciar en hace", wrong: ["Todo va en dice, porque él lo confirmó", "Todo va en siente, porque es emocional", "Nada se anota: son datos contradictorios"] },
            ],
            [
                { question: "¿Para qué sirven las contradicciones entre cuadrantes?", answer: "Revelan tensiones donde hay oportunidades de diseño", wrong: ["Demuestran que el usuario no es confiable", "Obligan a repetir el mapa desde cero", "Sirven para decorar la presentación final"] },
                { question: "Después del mapa de empatía, lo aprendido alimenta…", answer: "La definición del problema (siguiente etapa)", wrong: ["El manual técnico del producto final", "La campaña de publicidad del lanzamiento", "El contrato de servicio con el cliente"] },
            ],
        ],
        "Casos de aula": [
            [
                { question: "Vas a diseñar una app para abuelos. ¿Primer paso?", answer: "Hablar y pasar tiempo con abuelos reales", wrong: ["Descargar apps y copiar la mejor", "Pedirle la idea al profesor", "Hacer el logo y los colores"] },
                { question: "Tu compañero dice 'yo ya sé lo que necesitan los niños'. ¿Qué le propones?", answer: "Ir a observar y preguntar a los niños", wrong: ["Confiar en él porque tiene sobrinos", "Votar en el equipo y seguir", "Buscar la respuesta en redes"] },
            ],
            [
                { question: "Entrevistas a un vendedor ambulante que no para de trabajar. ¿Qué haces?", answer: "Lo acompañas y preguntas mientras trabaja", wrong: ["Le pides que cierre el puesto una hora", "Le dejas un cuestionario de 50 preguntas", "Desistes: no es un usuario válido"] },
                { question: "Solo tienes 3 usuarios disponibles. ¿Sirve de algo?", answer: "Sí: pocos usuarios bien escuchados ya enseñan mucho", wrong: ["No: con menos de 100 no hay estadística", "Solo si los tres opinan exactamente igual", "Solo si son expertos en diseño de apps"] },
            ],
            [
                { question: "En la entrevista el usuario pide tu opinión sobre su forma de hacer las cosas. ¿Qué respondes?", answer: "Devuelves la pregunta sin juzgar: '¿y tú cómo lo ves?'", wrong: ["Le das tu opinión sincera y bien detallada", "Le dices que eso está mal y lo corriges", "Terminas la entrevista por protocolo"] },
                { question: "El equipo entrevistó solo a sus amigos del salón. ¿Cuál es el problema?", answer: "Muestra sesgada: gente demasiado parecida entre sí", wrong: ["Ninguno: los amigos responden con confianza", "Que los amigos no firman consentimientos", "Que debieron pagar por cada entrevista"] },
            ],
            [
                { question: "Diseñas para madrugadores pero todo tu equipo trasnocha. ¿Qué hacen?", answer: "Madrugar con ellos y vivir su rutina un día", wrong: ["Suponer la rutina viendo videos en línea", "Cambiar el proyecto a uno para trasnochadores", "Preguntar en el grupo familiar de WhatsApp"] },
                { question: "Un usuario llora al contar su problema. ¿Qué haces primero?", answer: "Pausas la guía y lo acompañas con respeto", wrong: ["Sigues con la guía para no perder tiempo", "Cambias de tema a algo más alegre ya", "Apagas la grabadora y das todo por terminado"] },
            ],
            [
                { question: "Tu informe de empatía dice: 'los usuarios quieren IA'. El profesor lo devuelve. ¿Por qué?", answer: "Es una solución supuesta, no una necesidad observada", wrong: ["Porque a los profesores no les gusta la IA", "Porque faltó citar artículos científicos", "Porque el informe debía ser más largo"] },
                { question: "¿Cuál evidencia vale MÁS para definir el problema?", answer: "Patrones repetidos en varias entrevistas y observaciones", wrong: ["Una frase brillante de un solo usuario", "La intuición del integrante más antiguo del equipo", "Un dato viral de una red social popular"] },
            ],
        ],
    },
};
