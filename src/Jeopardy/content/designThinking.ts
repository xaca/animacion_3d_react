import type { TopicContent } from "./types";

// Design Thinking en español: el proceso, la etapa de empatizar, entrevistas,
// mapa de empatía y journey map. Opciones balanceadas en longitud (lengthGiveaway).
export const designThinking: TopicContent = {
    id: "design-thinking",
    name: "Design Thinking",
    categories: {
        "Design Thinking": [
            [
                { question: "¿Cuántas etapas tiene el proceso clásico de Design Thinking?", answer: "5", wrong: ["3", "7", "10"] },
                { question: "¿Cuál es la primera etapa del Design Thinking?", answer: "Empatizar", wrong: ["Idear", "Prototipar", "Testear"] },
            ],
            [
                { question: "¿Cuál es el orden correcto de las etapas?", answer: "Empatizar, definir, idear, prototipar, testear", wrong: ["Idear, empatizar, testear, definir, prototipar", "Definir, idear, empatizar, testear, prototipar", "Prototipar, testear, idear, definir, empatizar"] },
                { question: "El Design Thinking pone en el centro a…", answer: "Las personas usuarias", wrong: ["La tecnología disponible", "El presupuesto del proyecto", "La opinión del jefe"] },
            ],
            [
                { question: "¿Qué significa que el proceso sea iterativo?", answer: "Se puede volver a etapas anteriores y repetirlas", wrong: ["Cada etapa se hace una sola vez y en orden", "Solo se repite la etapa de testeo", "Se hace todo al mismo tiempo"] },
                { question: "¿En qué etapa se formula el problema a resolver?", answer: "Definir", wrong: ["Empatizar", "Prototipar", "Testear"] },
            ],
            [
                { question: "¿Qué etapa busca generar muchas ideas sin juzgarlas?", answer: "Idear", wrong: ["Definir", "Testear", "Empatizar"] },
                { question: "'Fallar rápido y barato' se logra principalmente con…", answer: "Prototipos simples que se prueban pronto", wrong: ["Documentos extensos de requisitos", "Lanzar el producto final de una sola vez", "Encuestas al final del proyecto"] },
            ],
            [
                { question: "Un equipo salta de la idea al desarrollo sin hablar con usuarios. ¿Qué etapa se saltó?", answer: "Empatizar (y definir con datos reales)", wrong: ["Prototipar, porque ya tenían la idea", "Testear, porque aún no hay producto", "Ninguna: así funciona el proceso"] },
                { question: "¿El Design Thinking sirve solo para diseñadores?", answer: "No: lo usa cualquier equipo que resuelve problemas", wrong: ["Sí, es exclusivo de diseñadores gráficos", "Solo sirve para equipos de software", "Solo se usa en universidades"] },
            ],
        ],
        "Empatizar": [
            [
                { question: "¿Qué busca la etapa de empatizar?", answer: "Entender las necesidades reales de las personas", wrong: ["Venderle el producto a las personas", "Dibujar la interfaz de la aplicación", "Elegir los colores del diseño"] },
                { question: "Para empatizar hay que hablar con…", answer: "Las personas usuarias reales", wrong: ["Solo con el equipo de diseño", "Solo con los gerentes", "Nadie: basta con imaginar"] },
            ],
            [
                { question: "¿Cuál de estas actividades pertenece a empatizar?", answer: "Observar cómo la gente usa un producto", wrong: ["Programar la base de datos", "Diseñar el logo del proyecto", "Escribir el manual de usuario"] },
                { question: "Suponer lo que el usuario necesita sin preguntarle es…", answer: "Un error común que empatizar evita", wrong: ["La forma más rápida y correcta", "Parte de la etapa de testeo", "Obligatorio al inicio del proyecto"] },
            ],
            [
                { question: "¿Qué pesa más al empatizar?", answer: "Observar lo que la gente hace", wrong: ["Confiar solo en lo que la gente dice", "Leer estadísticas generales del país", "Copiar a la competencia"] },
                { question: "Durante la observación conviene registrar…", answer: "Hechos concretos, sin interpretarlos aún", wrong: ["Solo nuestras conclusiones personales", "Solo lo que confirma nuestra idea", "Nada: la memoria es suficiente"] },
            ],
            [
                { question: "'Ponerse en los zapatos del otro' significa…", answer: "Vivir el problema desde la perspectiva del usuario", wrong: ["Disfrazarse igual que el usuario", "Darle siempre la razón al usuario", "Decidir por el usuario lo que necesita"] },
                { question: "¿Por qué empatizar con usuarios extremos (expertos y novatos)?", answer: "Sus necesidades revelan problemas que el promedio oculta", wrong: ["Porque son mucho más fáciles de encontrar y citar", "Porque se quejan menos que el resto", "Para descartar sus opiniones raras"] },
            ],
            [
                { question: "Un usuario dice que ama la app pero la abandona a los 2 días. ¿Qué hace un buen equipo?", answer: "Investiga el comportamiento: los hechos pesan más que las palabras", wrong: ["Confía en sus palabras porque el usuario siempre dice la verdad", "Lo descarta como un usuario mentiroso", "Le pide que firme un compromiso de uso"] },
                { question: "La empatía en diseño NO es…", answer: "Lástima: es comprender sin juzgar", wrong: ["Comprender el contexto del usuario", "Escuchar sus frustraciones", "Observar sus rutinas reales"] },
            ],
        ],
        "Entrevistas": [
            [
                { question: "¿Qué tipo de pregunta da más información en una entrevista?", answer: "Abierta: '¿cómo haces tus compras?'", wrong: ["Cerrada: '¿te gusta comprar?'", "Una de sí o no", "Una con la respuesta sugerida"] },
                { question: "En una entrevista, lo más importante es…", answer: "Escuchar", wrong: ["Hablar", "Vender", "Opinar"] },
            ],
            [
                { question: "¿Cuál es una buena pregunta de entrevista?", answer: "Cuéntame la última vez que pediste un domicilio", wrong: ["¿Te gustaría una app perfecta y gratis?", "¿Verdad que nuestra idea es buena?", "¿Prefieres el botón azul o el rojo?"] },
                { question: "¿Por qué evitar preguntas que sugieren la respuesta?", answer: "Porque sesgan lo que la persona contesta", wrong: ["Porque alargan mucho la entrevista", "Porque son difíciles de pronunciar", "Porque la gente no las entiende"] },
            ],
            [
                { question: "Preguntar '¿por qué?' varias veces sirve para…", answer: "Llegar a la causa real detrás de la respuesta", wrong: ["Incomodar al entrevistado a propósito", "Rellenar el tiempo de la entrevista", "Comprobar si la persona se contradice"] },
                { question: "¿Qué conviene hacer durante la entrevista?", answer: "Tomar notas o grabar con permiso", wrong: ["Corregir al usuario cuando se equivoca", "Mostrarle la solución ya diseñada", "Responder por él cuando duda"] },
            ],
            [
                { question: "El entrevistado guarda silencio tras una pregunta. ¿Qué haces?", answer: "Esperar: el silencio suele traer respuestas valiosas", wrong: ["Llenar el silencio con tu propia opinión", "Pasar rápido a la siguiente pregunta", "Responderle tú mismo para ayudarlo"] },
                { question: "¿A cuántas personas basta entrevistar para empezar a ver patrones?", answer: "Unas 5, bien elegidas", wrong: ["Al menos 500", "Exactamente 100", "A toda la población objetivo"] },
            ],
            [
                { question: "'¿No te parece que nuestra app es fácil de usar?' ¿Qué falla?", answer: "Sugiere la respuesta y presiona al usuario", wrong: ["Es demasiado corta para una entrevista", "Usa la palabra 'app', que es técnica", "Nada: es una pregunta perfecta"] },
                { question: "Después de varias entrevistas, el siguiente paso es…", answer: "Buscar patrones y sintetizar lo aprendido", wrong: ["Archivar las notas y no volver a verlas", "Entrevistar a las mismas personas otra vez", "Pasar directo a programar la app"] },
            ],
        ],
        "Mapa de Empatía": [
            [
                { question: "¿Qué organiza un mapa de empatía?", answer: "Lo que el usuario dice, piensa, hace y siente", wrong: ["Las pantallas de la aplicación", "Las tareas del equipo de diseño", "Los colores y tipografías del producto"] },
                { question: "¿Sobre quién se construye un mapa de empatía?", answer: "Sobre el usuario", wrong: ["Sobre el diseñador", "Sobre la competencia", "Sobre el producto"] },
            ],
            [
                { question: "¿En qué cuadrante va una frase textual del usuario?", answer: "Dice", wrong: ["Piensa", "Hace", "Siente"] },
                { question: "'Le da miedo perder su dinero' va en el cuadrante…", answer: "Siente", wrong: ["Dice", "Hace", "Piensa"] },
            ],
            [
                { question: "¿Qué diferencia hay entre 'dice' y 'piensa'?", answer: "Piensa incluye lo que no se atreve a decir", wrong: ["Son exactamente lo mismo", "Dice se llena con suposiciones", "Piensa se llena con sus frases textuales"] },
                { question: "¿Con qué se llena un buen mapa de empatía?", answer: "Con datos de entrevistas y observación", wrong: ["Con la imaginación del equipo", "Con frases de la competencia", "Con los deseos del gerente"] },
            ],
            [
                { question: "Además de los 4 cuadrantes, muchos mapas incluyen…", answer: "Dolores y ganancias (pains y gains)", wrong: ["Presupuesto y cronograma", "Colores y tipografías", "Código y base de datos"] },
                { question: "¿Cuándo conviene crear el mapa de empatía?", answer: "Después de empatizar y antes de definir", wrong: ["Al final, para decorar la entrega", "Antes de hablar con cualquier usuario", "Durante la escritura del código"] },
            ],
            [
                { question: "El equipo llena el mapa sin haber hablado con nadie. ¿Resultado?", answer: "Un mapa de suposiciones, no de empatía", wrong: ["Un mapa más objetivo y neutral", "Un mapa válido si el equipo es experto", "El mapa oficial que exige el método"] },
                { question: "'Hace' se diferencia de 'dice' porque registra…", answer: "Comportamientos observados, no palabras", wrong: ["Las promesas del usuario", "Las quejas por escrito", "Los sentimientos profundos"] },
            ],
        ],
        "Journey Map": [
            [
                { question: "¿Qué muestra un journey map?", answer: "El recorrido del usuario paso a paso", wrong: ["El mapa del sitio web", "El organigrama de la empresa", "El plano de la oficina"] },
                { question: "Un journey map se cuenta desde la perspectiva de…", answer: "El usuario", wrong: ["El gerente", "El programador", "El diseñador"] },
            ],
            [
                { question: "¿Qué es un punto de contacto (touchpoint)?", answer: "Cada momento en que el usuario interactúa con el servicio", wrong: ["El formulario de contacto que aparece en el sitio web", "La oficina central de la empresa", "El número de teléfono de soporte"] },
                { question: "La línea de emociones del journey muestra…", answer: "Cómo se siente el usuario en cada etapa", wrong: ["Cuánto cuesta cada etapa del proceso", "Cuánto tarda cada pantalla en cargar", "El ánimo del equipo de diseño"] },
            ],
            [
                { question: "¿Qué revela un 'punto de dolor' en el journey?", answer: "Un momento donde el usuario sufre o se frustra", wrong: ["El precio más alto del producto", "Una etapa que el usuario disfruta mucho", "El final del recorrido del usuario"] },
                { question: "Un journey completo suele incluir…", answer: "Antes, durante y después del uso", wrong: ["Solo el momento de la compra", "Solo el uso de la aplicación", "Solo la publicidad del producto"] },
            ],
            [
                { question: "¿Para qué sirven los puntos de dolor detectados?", answer: "Son oportunidades de mejora y de ideación", wrong: ["Para culpar al equipo anterior", "Para esconderlos en la presentación", "Para subir el precio del producto"] },
                { question: "¿Qué pasa si el journey se hace solo con suposiciones?", answer: "Refleja al equipo, no a los usuarios reales", wrong: ["Queda más limpio y profesional", "Es igual de útil que con datos", "Se vuelve el estándar del método"] },
            ],
            [
                { question: "Etapas típicas de un journey de compra en línea:", answer: "Descubrir, comparar, comprar, recibir, usar", wrong: ["Pagar, pagar, pagar, pagar, pagar", "Diseñar, programar, testear, lanzar", "Definir, idear, prototipar, testear"] },
                { question: "¿Journey map y mapa de empatía son lo mismo?", answer: "No: uno sigue el recorrido, el otro un momento de la persona", wrong: ["Sí, solo cambia el nombre del formato", "No: el journey es solo para apps móviles", "Sí, pero el journey usa más colores"] },
            ],
        ],
    },
};
