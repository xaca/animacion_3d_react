import type { TopicContent } from "./types";

// "Java Condicionales" — básico en español, sin OOP. Evita repetir javaDepth.ts
// (cortocircuito/ternario) y el banco de TingoTango.
export const JAVA_CONDICIONALES: TopicContent = {
    id: "java-condicionales",
    name: "Java Condicionales",
    categories: {
        "if y else": [
            [
                {
                    question: "¿Para qué sirve un if en Java?",
                    answer: "Para ejecutar código solo si se cumple algo",
                    wrong: ["Para repetir código varias veces", "Para declarar una variable nueva", "Para imprimir en la consola"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "if (true) {\n    System.out.println(\"entra\");\n}",
                    answer: "entra",
                    wrong: ["true", "Nada", "Error de compilación"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int vidas = 0;\nif (vidas > 0) {\n    System.out.println(\"sigues\");\n} else {\n    System.out.println(\"perdiste\");\n}",
                    answer: "perdiste",
                    wrong: ["sigues", "0", "Nada"],
                },
                {
                    question: "¿El bloque else es obligatorio después de un if?",
                    answer: "No, es opcional",
                    wrong: ["Sí, siempre va", "Solo dentro del main", "Solo si el if tiene llaves"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int hora = 14;\nif (hora < 12) {\n    System.out.println(\"mañana\");\n} else {\n    System.out.println(\"tarde\");\n}",
                    answer: "tarde",
                    wrong: ["mañana", "14", "mañana y tarde"],
                },
                {
                    question: "¿Qué pasa aquí?",
                    code: "int x = 5;\nif (x = 10) {\n    System.out.println(\"diez\");\n}",
                    answer: "No compila: = asigna, no compara",
                    wrong: ["Imprime diez (x pasa a valer 10)", "No imprime nada (5 no es 10)", "Imprime 10"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "boolean lluvia = false;\nif (!lluvia) {\n    System.out.println(\"paseo\");\n} else {\n    System.out.println(\"casa\");\n}",
                    answer: "paseo (!false es true)",
                    wrong: ["casa (lluvia es false)", "Nada (la condición falla)", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int p = 8;\nif (p > 5) {\n    p = p + 10;\n}\nSystem.out.println(p);",
                    answer: "18",
                    wrong: ["8", "10", "5"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int a = 3;\nif (a > 1) {\n    if (a > 5) {\n        System.out.println(\"grande\");\n    } else {\n        System.out.println(\"medio\");\n    }\n}",
                    answer: "medio (entra al primero, no al segundo)",
                    wrong: ["grande (cumple los dos if)", "Nada (no entra a ninguno)", "grande y medio"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int x = 4;\nif (x % 2 == 0)\n    x++;\nelse\n    x--;\nSystem.out.println(x);",
                    answer: "5 (4 es par, sube a 5)",
                    wrong: ["3 (4 es impar, baja a 3)", "4 (no cambia nada)", "Error: faltan las llaves"],
                },
            ],
        ],
        "Comparaciones": [
            [
                { question: "¿Qué operador significa \"mayor o igual que\"?", answer: ">=", wrong: ["=>", ">==", "≥="] },
                { question: "¿Qué operador significa \"distinto de\"?", answer: "!=", wrong: ["<>", "=/=", "not="] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(3 <= 3);", answer: "true", wrong: ["false", "3", "Error de compilación"] },
                { question: "¿De qué tipo es el resultado de una comparación como a > b?", answer: "boolean", wrong: ["int", "String", "char"] },
            ],
            [
                { question: "¿Qué imprime?", code: "int a = 6, b = 9;\nSystem.out.println(a != b);", answer: "true", wrong: ["false", "6", "Error de compilación"] },
                {
                    question: "¿Cuál condición es verdadera cuando nota está entre 1 y 5?",
                    answer: "nota >= 1 && nota <= 5",
                    wrong: ["1 <= nota <= 5", "nota >= 1 || nota <= 5", "nota == 1 && nota == 5"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int edad = 18;\nSystem.out.println(edad > 18);",
                    answer: "false (18 no es mayor que 18)",
                    wrong: ["true (18 ya es mayoría de edad)", "18", "Error de compilación"],
                },
                {
                    question: "¿Cómo se comparan bien dos textos a y b en una condición?",
                    answer: "a.equals(b)",
                    wrong: ["a == b", "a = b", "a.igual(b)"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int x = 10;\nSystem.out.println(x > 5 == true);",
                    answer: "true",
                    wrong: ["false", "10", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "char letra = 'b';\nSystem.out.println(letra == 'b');",
                    answer: "true",
                    wrong: ["false", "b", "Error: los char no se comparan"],
                },
            ],
        ],
        "Operadores lógicos": [
            [
                { question: "¿Qué operador es el OR lógico (\"o\") en Java?", answer: "||", wrong: ["or", "|O|", "&&"] },
                { question: "¿Qué hace el operador ! en una condición?", answer: "La niega (invierte su valor)", wrong: ["La repite dos veces", "La vuelve siempre falsa", "La compara con cero"] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(true && false);", answer: "false", wrong: ["true", "truefalse", "Error de compilación"] },
                { question: "¿Qué imprime?", code: "System.out.println(false || true);", answer: "true", wrong: ["false", "falsetrue", "Error de compilación"] },
            ],
            [
                {
                    question: "Con edad = 20 y dinero = 0, ¿qué da edad >= 18 && dinero > 0?",
                    answer: "false (la segunda parte falla)",
                    wrong: ["true (la primera parte basta)", "20", "Error de compilación"],
                },
                {
                    question: "¿Cuándo es verdadero a || b?",
                    answer: "Cuando al menos uno es true",
                    wrong: ["Solo cuando los dos son true", "Solo cuando los dos son false", "Cuando a es distinto de b"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int n = 7;\nSystem.out.println(n > 0 && n < 10);",
                    answer: "true",
                    wrong: ["false", "7", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "boolean vip = false;\nboolean invitado = true;\nSystem.out.println(vip || !invitado);",
                    answer: "false",
                    wrong: ["true", "vip", "Error de compilación"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int x = 12;\nSystem.out.println(!(x % 2 == 0));",
                    answer: "false (12 es par y se niega)",
                    wrong: ["true (12 es par)", "12", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int a = 5, b = 5;\nSystem.out.println(a != b || b > 10 || a == 5);",
                    answer: "true (la última parte se cumple)",
                    wrong: ["false (las dos primeras fallan)", "5", "Error de compilación"],
                },
            ],
        ],
        "else if en cadena": [
            [
                {
                    question: "¿Para qué sirve encadenar else if?",
                    answer: "Para elegir entre varios casos en orden",
                    wrong: ["Para repetir el if varias veces", "Para salir del programa", "Para declarar varias variables"],
                },
                {
                    question: "En una cadena if / else if / else, ¿cuántos bloques se ejecutan?",
                    answer: "Solo uno: el primero que se cumpla",
                    wrong: ["Todos los que se cumplan", "Siempre el del else", "Los dos primeros"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int nota = 4;\nif (nota == 5) {\n    System.out.println(\"excelente\");\n} else if (nota == 4) {\n    System.out.println(\"bien\");\n} else {\n    System.out.println(\"a mejorar\");\n}",
                    answer: "bien",
                    wrong: ["excelente", "a mejorar", "bien y a mejorar"],
                },
                {
                    question: "¿Dónde va el else final de una cadena?",
                    answer: "Al final, sin condición",
                    wrong: ["Al inicio, con condición", "Después de cada else if", "Dentro del primer if"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int t = 25;\nif (t < 10) {\n    System.out.println(\"frío\");\n} else if (t < 20) {\n    System.out.println(\"fresco\");\n} else if (t < 30) {\n    System.out.println(\"cálido\");\n} else {\n    System.out.println(\"calor\");\n}",
                    answer: "cálido",
                    wrong: ["fresco", "calor", "frío"],
                },
                {
                    question: "Con x = 15, ¿cuántas condiciones se evalúan?",
                    code: "if (x < 5) { }\nelse if (x < 10) { }\nelse if (x < 20) { }\nelse { }",
                    answer: "3 (para en la primera verdadera)",
                    wrong: ["4 (siempre se evalúan todas)", "1 (solo la del primer if)", "0 (va directo al else)"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int x = 50;\nif (x > 10) {\n    System.out.println(\"A\");\n} else if (x > 40) {\n    System.out.println(\"B\");\n}",
                    answer: "A (el orden de la cadena manda)",
                    wrong: ["B (50 es mayor que 40)", "A y B (cumple las dos)", "Nada"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int d = 3;\nString dia;\nif (d == 1) dia = \"lunes\";\nelse if (d == 2) dia = \"martes\";\nelse dia = \"otro\";\nSystem.out.println(dia);",
                    answer: "otro",
                    wrong: ["martes", "lunes", "3"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int p = 85;\nif (p >= 90) {\n    System.out.println(\"oro\");\n} else if (p >= 80) {\n    System.out.println(\"plata\");\n} else if (p >= 80) {\n    System.out.println(\"bronce\");\n}",
                    answer: "plata (el segundo >= 80 nunca gana)",
                    wrong: ["plata y bronce (ambos se cumplen)", "bronce (el último manda)", "oro"],
                },
                {
                    question: "Estas dos versiones, ¿se comportan igual con x = 8?",
                    code: "// A:\nif (x > 5) y = 1;\nelse if (x > 7) y = 2;\n\n// B:\nif (x > 5) y = 1;\nif (x > 7) y = 2;",
                    answer: "No: A deja y en 1 y B deja y en 2",
                    wrong: ["Sí: en ambas y termina en 1", "Sí: en ambas y termina en 2", "No: B no compila"],
                },
            ],
        ],
        "switch": [
            [
                {
                    question: "¿Qué palabra marca cada opción dentro de un switch?",
                    answer: "case",
                    wrong: ["option", "when", "if"],
                },
                {
                    question: "¿Qué palabra marca el caso \"ninguno de los anteriores\"?",
                    answer: "default",
                    wrong: ["else", "otherwise", "final"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int n = 2;\nswitch (n) {\n    case 1: System.out.println(\"uno\"); break;\n    case 2: System.out.println(\"dos\"); break;\n    default: System.out.println(\"otro\");\n}",
                    answer: "dos",
                    wrong: ["uno", "otro", "dos y otro"],
                },
                {
                    question: "¿Sobre qué decide un switch?",
                    answer: "Sobre el valor de una expresión",
                    wrong: ["Sobre varias condiciones a la vez", "Sobre el tamaño del programa", "Sobre el tipo de la variable"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int n = 9;\nswitch (n) {\n    case 1: System.out.println(\"uno\"); break;\n    case 2: System.out.println(\"dos\"); break;\n    default: System.out.println(\"otro\");\n}",
                    answer: "otro",
                    wrong: ["uno", "dos", "Nada"],
                },
                {
                    question: "¿Qué tipos acepta un switch clásico?",
                    answer: "int, char, String y enum",
                    wrong: ["Solo int y nada más", "Solo String y char", "double, float y boolean"],
                },
            ],
            [
                {
                    question: "¿Qué imprime? (ojo: sin break)",
                    code: "int n = 1;\nswitch (n) {\n    case 1: System.out.print(\"uno \");\n    case 2: System.out.print(\"dos \");\n    default: System.out.print(\"otro\");\n}",
                    answer: "uno dos otro (sigue de largo sin break)",
                    wrong: ["uno (solo su caso)", "uno otro (salta al default)", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "String color = \"rojo\";\nswitch (color) {\n    case \"azul\": System.out.println(\"cielo\"); break;\n    case \"rojo\": System.out.println(\"fuego\"); break;\n}",
                    answer: "fuego",
                    wrong: ["cielo", "rojo", "Error: switch no acepta String"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int mes = 2;\nint dias;\nswitch (mes) {\n    case 1: case 3: case 5: dias = 31; break;\n    case 2: dias = 28; break;\n    default: dias = 30;\n}\nSystem.out.println(dias);",
                    answer: "28",
                    wrong: ["31", "30", "Error: casos repetidos"],
                },
                {
                    question: "¿Cuándo conviene switch en vez de else if?",
                    answer: "Con muchos valores fijos de una variable",
                    wrong: ["Con rangos como nota >= 3", "Con condiciones de true o false", "Nunca: hacen cosas distintas"],
                },
            ],
        ],
    },
};
