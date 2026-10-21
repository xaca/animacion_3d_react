import type { TopicContent } from "./types";

// "Java Ciclos" — básico en español, sin OOP. Preguntas nuevas, distintas a javaDepth.ts
// y al banco de TingoTango.
export const JAVA_CICLOS: TopicContent = {
    id: "java-ciclos",
    name: "Java Ciclos",
    categories: {
        "while": [
            [
                {
                    question: "¿Cuándo se ejecuta el cuerpo de un while?",
                    answer: "Mientras la condición sea true",
                    wrong: ["Mientras la condición sea false", "Siempre exactamente una vez", "Solo cuando hay un break"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int i = 1;\nwhile (i <= 3) {\n    System.out.print(\"a\");\n    i++;\n}",
                    answer: "aaa",
                    wrong: ["a", "aa", "aaaa"],
                },
            ],
            [
                {
                    question: "¿Cuántas veces se ejecuta el cuerpo?",
                    code: "int i = 10;\nwhile (i < 5) {\n    i++;\n}",
                    answer: "0 veces (la condición ya es falsa)",
                    wrong: ["1 vez (siempre entra la primera)", "5 veces", "Infinitas veces"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int n = 8;\nwhile (n > 2) {\n    n = n / 2;\n}\nSystem.out.println(n);",
                    answer: "2",
                    wrong: ["1", "4", "8"],
                },
            ],
            [
                {
                    question: "¿Qué le falta a este ciclo para no ser infinito?",
                    code: "int i = 0;\nwhile (i < 3) {\n    System.out.println(i);\n}",
                    answer: "Aumentar i dentro del cuerpo (i++)",
                    wrong: ["Un else después del while", "Un punto y coma tras la condición", "Declarar i como double"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int i = 5;\nwhile (i > 0) {\n    i = i - 2;\n}\nSystem.out.println(i);",
                    answer: "-1 (va 5, 3, 1, -1)",
                    wrong: ["0 (se detiene justo en cero)", "1 (para antes de bajar más)", "Ciclo infinito"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int suma = 0, i = 1;\nwhile (i <= 3) {\n    suma += i * 2;\n    i++;\n}\nSystem.out.println(suma);",
                    answer: "12 (2 + 4 + 6)",
                    wrong: ["6 (1 + 2 + 3)", "8 (solo los pares)", "14"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int x = 1;\nwhile (x < 100) {\n    x = x * 3;\n}\nSystem.out.println(x);",
                    answer: "243",
                    wrong: ["81", "99", "100"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int i = 0, cuenta = 0;\nwhile (i < 10) {\n    if (i % 3 == 0) {\n        cuenta++;\n    }\n    i++;\n}\nSystem.out.println(cuenta);",
                    answer: "4 (0, 3, 6 y 9)",
                    wrong: ["3 (3, 6 y 9)", "10 (todas las vueltas)", "0"],
                },
                {
                    question: "¿Qué pasa aquí?",
                    code: "int i = 0;\nwhile (i < 3); {\n    i++;\n}",
                    answer: "Ciclo infinito: el ; deja el while vacío",
                    wrong: ["Imprime 3 y termina normal", "No compila por el punto y coma", "El cuerpo corre 3 veces igual"],
                },
            ],
        ],
        "for": [
            [
                {
                    question: "¿Qué ciclo es ideal cuando sabes cuántas vueltas quieres?",
                    answer: "for",
                    wrong: ["while", "switch", "if"],
                },
                {
                    question: "¿Cuántas veces imprime?",
                    code: "for (int i = 0; i < 4; i++) {\n    System.out.println(\"vuelta\");\n}",
                    answer: "4",
                    wrong: ["3", "5", "0"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "for (int i = 5; i >= 3; i--) {\n    System.out.print(i);\n}",
                    answer: "543",
                    wrong: ["345", "54", "5432"],
                },
                {
                    question: "En for (int i = 0; i < 10; i++), ¿qué parte se ejecuta UNA sola vez?",
                    answer: "int i = 0 (la inicialización)",
                    wrong: ["i < 10 (la condición)", "i++ (el incremento)", "El cuerpo del ciclo"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "for (int i = 0; i <= 10; i += 5) {\n    System.out.print(i + \" \");\n}",
                    answer: "0 5 10",
                    wrong: ["0 5", "5 10", "0 1 2 3 4 5"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int total = 0;\nfor (int i = 1; i <= 4; i++) {\n    total = total + 10;\n}\nSystem.out.println(total);",
                    answer: "40",
                    wrong: ["10", "4", "44"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "for (int i = 2; i <= 8; i = i * 2) {\n    System.out.print(i + \",\");\n}",
                    answer: "2,4,8,",
                    wrong: ["2,4,6,8,", "2,4,", "4,8,16,"],
                },
                {
                    question: "¿Se puede usar la variable i del for fuera del ciclo?",
                    code: "for (int i = 0; i < 3; i++) { }\nSystem.out.println(i);",
                    answer: "No compila: i solo vive dentro del for",
                    wrong: ["Imprime 3 (su último valor)", "Imprime 0 (se reinicia al salir)", "Imprime null"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"\";\nfor (int i = 1; i <= 3; i++) {\n    s = i + s;\n}\nSystem.out.println(s);",
                    answer: "321 (cada número entra adelante)",
                    wrong: ["123 (cada número entra atrás)", "6 (los suma como enteros)", "111"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int p = 1;\nfor (int i = 1; i <= 4; i++) {\n    p = p * i;\n}\nSystem.out.println(p);",
                    answer: "24 (1×2×3×4)",
                    wrong: ["10 (1+2+3+4)", "4 (la última vuelta)", "256"],
                },
            ],
        ],
        "do-while": [
            [
                {
                    question: "¿Qué garantiza un do-while que un while no?",
                    answer: "Que el cuerpo corre mínimo una vez",
                    wrong: ["Que el ciclo nunca es infinito", "Que la condición siempre es true", "Que corre más rápido"],
                },
                {
                    question: "¿Dónde va la condición en un do-while?",
                    answer: "Al final, después del do { }",
                    wrong: ["Al inicio, antes del do", "Dentro de las llaves", "No lleva condición"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int i = 50;\ndo {\n    System.out.print(\"hola\");\n} while (i < 10);",
                    answer: "hola (una vez, aunque la condición falle)",
                    wrong: ["Nada (la condición es falsa)", "hola infinitas veces", "Error de compilación"],
                },
                {
                    question: "¿Qué signo va después del while en un do-while?",
                    answer: "Punto y coma ;",
                    wrong: ["Llaves { }", "Dos puntos :", "Nada"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int i = 1;\ndo {\n    System.out.print(i);\n    i++;\n} while (i <= 3);",
                    answer: "123",
                    wrong: ["12", "1234", "1"],
                },
                {
                    question: "¿Para qué caso es típico el do-while?",
                    answer: "Pedir un dato hasta que sea válido",
                    wrong: ["Recorrer un arreglo completo", "Elegir entre varios casos fijos", "Declarar varias variables"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int x = 10;\ndo {\n    x = x - 4;\n} while (x > 0);\nSystem.out.println(x);",
                    answer: "-2 (va 6, 2, -2)",
                    wrong: ["2 (se queda en positivo)", "0 (termina justo en cero)", "10 (no entra al ciclo)"],
                },
                {
                    question: "Con la condición false desde el inicio, ¿cuántas vueltas da cada uno?",
                    answer: "while: 0 vueltas · do-while: 1 vuelta",
                    wrong: ["while: 1 vuelta · do-while: 0 vueltas", "Ambos dan 0 vueltas", "Ambos dan 1 vuelta"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int n = 7, digitos = 0;\ndo {\n    n = n / 10;\n    digitos++;\n} while (n > 0);\nSystem.out.println(digitos);",
                    answer: "1 (7 tiene un dígito)",
                    wrong: ["0 (no entra al ciclo)", "7 (una por unidad)", "2"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int i = 0, s = 0;\ndo {\n    i++;\n    s += i;\n} while (s < 6);\nSystem.out.println(i + \"-\" + s);",
                    answer: "3-6 (1+2+3 llega a 6)",
                    wrong: ["2-3 (para antes de 6)", "4-10 (una vuelta de más)", "6-6"],
                },
            ],
        ],
        "break y continue": [
            [
                {
                    question: "¿Qué hace break dentro de un ciclo?",
                    answer: "Termina el ciclo de inmediato",
                    wrong: ["Salta a la siguiente vuelta", "Pausa el ciclo un segundo", "Reinicia el contador a cero"],
                },
                {
                    question: "¿Qué hace continue dentro de un ciclo?",
                    answer: "Salta lo que queda de ESA vuelta",
                    wrong: ["Termina el ciclo de inmediato", "Repite la vuelta anterior", "Duplica la velocidad del ciclo"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "for (int i = 1; i <= 5; i++) {\n    if (i == 3) {\n        break;\n    }\n    System.out.print(i);\n}",
                    answer: "12",
                    wrong: ["12345", "1245", "123"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "for (int i = 1; i <= 5; i++) {\n    if (i == 3) {\n        continue;\n    }\n    System.out.print(i);\n}",
                    answer: "1245",
                    wrong: ["12", "12345", "45"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int i = 0;\nwhile (true) {\n    i++;\n    if (i == 4) {\n        break;\n    }\n}\nSystem.out.println(i);",
                    answer: "4",
                    wrong: ["Ciclo infinito", "3", "0"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "for (int i = 1; i <= 6; i++) {\n    if (i % 2 == 1) {\n        continue;\n    }\n    System.out.print(i);\n}",
                    answer: "246 (salta los impares)",
                    wrong: ["135 (salta los pares)", "123456 (no salta nada)", "2468"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int suma = 0;\nfor (int i = 1; i <= 10; i++) {\n    if (suma > 5) {\n        break;\n    }\n    suma += i;\n}\nSystem.out.println(suma);",
                    answer: "6 (1+2+3, y al pasar de 5 corta)",
                    wrong: ["55 (suma todo hasta 10)", "5 (corta exactamente en 5)", "10"],
                },
                {
                    question: "En un ciclo dentro de otro, ¿a cuál afecta un break?",
                    answer: "Solo al ciclo más interno",
                    wrong: ["A los dos ciclos a la vez", "Solo al ciclo externo", "Al programa completo"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String r = \"\";\nfor (int i = 1; i <= 5; i++) {\n    if (i == 2 || i == 4) {\n        continue;\n    }\n    if (i == 5) {\n        break;\n    }\n    r += i;\n}\nSystem.out.println(r);",
                    answer: "13",
                    wrong: ["135", "1234", "15"],
                },
                {
                    question: "¿Qué pasa con el código escrito justo después de un break?",
                    code: "while (true) {\n    break;\n    System.out.println(\"hola\");\n}",
                    answer: "No compila: es código inalcanzable",
                    wrong: ["Imprime hola una vez", "Se ignora en silencio", "Imprime hola infinitas veces"],
                },
            ],
        ],
        "Ciclos anidados": [
            [
                {
                    question: "¿Qué es un ciclo anidado?",
                    answer: "Un ciclo dentro de otro ciclo",
                    wrong: ["Dos ciclos uno después del otro", "Un ciclo que nunca termina", "Un ciclo con dos condiciones"],
                },
                {
                    question: "¿Cuántas veces corre el print?",
                    code: "for (int i = 0; i < 2; i++) {\n    for (int j = 0; j < 3; j++) {\n        System.out.println(\"x\");\n    }\n}",
                    answer: "6 (2 × 3)",
                    wrong: ["5 (2 + 3)", "2", "3"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "for (int i = 1; i <= 2; i++) {\n    for (int j = 1; j <= 2; j++) {\n        System.out.print(i + \"\" + j + \" \");\n    }\n}",
                    answer: "11 12 21 22",
                    wrong: ["11 22", "12 21", "11 21 12 22"],
                },
                {
                    question: "En ciclos anidados, ¿cuál se completa primero?",
                    answer: "El interno, en cada vuelta del externo",
                    wrong: ["El externo, antes de entrar al interno", "Los dos avanzan al mismo tiempo", "El que tenga menos vueltas"],
                },
            ],
            [
                {
                    question: "¿Qué dibuja este código?",
                    code: "for (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 4; j++) {\n        System.out.print(\"*\");\n    }\n    System.out.println();\n}",
                    answer: "Un rectángulo de 3 filas por 4 estrellas",
                    wrong: ["Un rectángulo de 4 filas por 3 estrellas", "Una sola fila de 12 estrellas", "Un triángulo de estrellas"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int c = 0;\nfor (int i = 0; i < 4; i++) {\n    for (int j = 0; j < 4; j++) {\n        if (i == j) {\n            c++;\n        }\n    }\n}\nSystem.out.println(c);",
                    answer: "4 (una vez por cada i == j)",
                    wrong: ["16 (todas las combinaciones)", "8 (el doble de filas)", "0"],
                },
            ],
            [
                {
                    question: "¿Qué dibuja este código?",
                    code: "for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= i; j++) {\n        System.out.print(\"#\");\n    }\n    System.out.println();\n}",
                    answer: "Un triángulo: #, ##, ###",
                    wrong: ["Un cuadrado de 3 por 3", "Un triángulo invertido: ###, ##, #", "Tres filas de un solo #"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "for (int i = 2; i <= 3; i++) {\n    for (int j = 1; j <= 2; j++) {\n        System.out.print(i * j + \" \");\n    }\n}",
                    answer: "2 4 3 6",
                    wrong: ["2 3 4 6", "2 4 6 8", "1 2 2 4"],
                },
            ],
            [
                {
                    question: "¿Cuántas veces corre el print?",
                    code: "for (int i = 0; i < 3; i++) {\n    for (int j = i; j < 3; j++) {\n        System.out.println(\"y\");\n    }\n}",
                    answer: "6 (3 + 2 + 1)",
                    wrong: ["9 (3 × 3)", "3 (una por fila)", "5"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        if (j == 2) {\n            break;\n        }\n        System.out.print(i + \"\" + j + \" \");\n    }\n}",
                    answer: "11 21 31 (cada fila corta en j = 2)",
                    wrong: ["11 (corta todo a la primera)", "11 12 13 (el break no hace nada)", "12 22 32"],
                },
            ],
        ],
    },
};
