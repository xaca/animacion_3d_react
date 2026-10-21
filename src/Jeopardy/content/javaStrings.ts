import type { TopicContent } from "./types";

// "Java Strings" — básico en español, sin OOP (uso práctico de String, nada de clases).
// Preguntas nuevas: no repiten la categoría Cadenas de javaDepth.ts ni TingoTango.
export const JAVA_STRINGS: TopicContent = {
    id: "java-strings",
    name: "Java Strings",
    categories: {
        "Crear y concatenar": [
            [
                { question: "¿Cuál crea bien un String?", answer: "String s = \"sol\";", wrong: ["String s = 'sol';", "String s = sol;", "texto s = \"sol\";"] },
                { question: "¿Qué operador une dos textos?", answer: "+", wrong: ["&", "++", "."] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(\"buenos\" + \" \" + \"días\");", answer: "buenos días", wrong: ["buenosdías", "buenos + días", "Error de compilación"] },
                { question: "¿Qué imprime?", code: "String s = \"ab\";\ns = s + s;\nSystem.out.println(s);", answer: "abab", wrong: ["ab", "abba", "aabb"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String nombre = \"Ana\";\nint edad = 15;\nSystem.out.println(nombre + \" tiene \" + edad);",
                    answer: "Ana tiene 15",
                    wrong: ["nombre tiene edad", "Ana tiene edad", "Error: no se mezclan tipos"],
                },
                { question: "¿Puede un String estar vacío?", answer: "Sí: String s = \"\";", wrong: ["No, mínimo un carácter", "Solo si vale null", "Solo con un espacio dentro"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "System.out.println(\"nota: \" + (4 + 1));",
                    answer: "nota: 5 (el paréntesis suma primero)",
                    wrong: ["nota: 41 (pega los números)", "nota: 4 + 1", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"x\";\nfor (int i = 0; i < 2; i++) {\n    s += \"o\";\n}\nSystem.out.println(s);",
                    answer: "xoo",
                    wrong: ["xo", "xooo", "oox"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int a = 2, b = 3;\nSystem.out.println(a + b + \"!\" + a + b);",
                    answer: "5!23",
                    wrong: ["23!23", "5!5", "23!5"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"hola\";\nString t = s;\ns = s + \"!\";\nSystem.out.println(t);",
                    answer: "hola (t quedó con el texto original)",
                    wrong: ["hola! (t cambia junto con s)", "null", "Error de compilación"],
                },
            ],
        ],
        "length y charAt": [
            [
                { question: "¿Qué devuelve \"Colombia\".length()?", answer: "8", wrong: ["7", "9", "Colombia"] },
                { question: "¿En qué posición está la PRIMERA letra de un String?", answer: "0", wrong: ["1", "-1", "Depende del texto"] },
            ],
            [
                { question: "¿Qué imprime?", code: "String s = \"queso\";\nSystem.out.println(s.charAt(1));", answer: "u", wrong: ["q", "e", "s"] },
                { question: "¿Qué devuelve \"\".length() (texto vacío)?", answer: "0", wrong: ["1", "null", "Error en ejecución"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"taza\";\nSystem.out.println(s.charAt(s.length() - 1));",
                    answer: "a (la última letra)",
                    wrong: ["z (la penúltima)", "t (la primera)", "Error: índice fuera de rango"],
                },
                { question: "¿Qué imprime?", code: "System.out.println(\"dos tazas\".length());", answer: "9 (el espacio también cuenta)", wrong: ["8 (sin contar el espacio)", "2 (las palabras)", "10"] },
            ],
            [
                {
                    question: "¿Qué pasa aquí?",
                    code: "String s = \"pan\";\nSystem.out.println(s.charAt(3));",
                    answer: "StringIndexOutOfBoundsException",
                    wrong: ["Imprime n (la última)", "Imprime un espacio vacío", "No compila"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"loro\";\nSystem.out.println(s.charAt(0) + \"\" + s.charAt(2));",
                    answer: "lr",
                    wrong: ["lo", "or", "217 (suma los códigos)"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"café\";\nint medio = s.length() / 2;\nSystem.out.println(s.charAt(medio));",
                    answer: "f (posición 2)",
                    wrong: ["a (posición 1)", "é (la última)", "c (la primera)"],
                },
                {
                    question: "¿Qué imprime? (ojo con el + sin comillas)",
                    code: "String s = \"sol\";\nSystem.out.println(s.charAt(0) + s.charAt(1));",
                    answer: "226 (suma los códigos de s y o)",
                    wrong: ["so (pega las dos letras)", "s111 (mezcla letra y código)", "Error de compilación"],
                },
            ],
        ],
        "Transformar": [
            [
                {
                    question: "¿Qué imprime?",
                    code: "System.out.println(\"sol\".toUpperCase());",
                    answer: "SOL",
                    wrong: ["sol (no cambia nada)", "Sol (solo la inicial)", "S.O.L."],
                },
                { question: "¿Qué método pasa un texto a minúsculas?", answer: "toLowerCase()", wrong: ["toMinus()", "lower()", "downCase()"] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(\"papa\".replace('p', 'm'));", answer: "mama", wrong: ["papa", "mapa", "pama"] },
                { question: "¿Qué hace trim() en un String?", answer: "Quita espacios del inicio y el final", wrong: ["Quita TODOS los espacios", "Corta el texto a la mitad", "Pasa el texto a minúsculas"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"  Bogotá  \";\nSystem.out.println(\"[\" + s.trim() + \"]\");",
                    answer: "[Bogotá]",
                    wrong: ["[  Bogotá  ]", "[Bogota]", "[ Bogotá ]"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "System.out.println(\"Perro\".toLowerCase());",
                    answer: "perro (todo baja)",
                    wrong: ["PERRO (todo sube)", "Perro (queda igual)", "PeRrO (alterna)"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"a-b-c\";\nSystem.out.println(s.replace(\"-\", \"\"));",
                    answer: "abc",
                    wrong: ["a-b-c", "a b c", "-abc-"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"Rio\";\nString t = s.toUpperCase().toLowerCase();\nSystem.out.println(t);",
                    answer: "rio (la R también baja)",
                    wrong: ["Rio (vuelve al original)", "RIO (gana la primera llamada)", "Error: no se pueden encadenar"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"banano\";\nSystem.out.println(s.substring(2, 5));",
                    answer: "nan",
                    wrong: ["ana", "nano", "ban"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"abc\";\nSystem.out.println(s.repeat(2) + s.length());",
                    answer: "abcabc3",
                    wrong: ["abcabc6", "abc2", "abcabcabc"],
                },
            ],
        ],
        "Buscar": [
            [
                { question: "¿Qué método dice si un texto CONTIENE otro?", answer: "contains", wrong: ["includes", "has", "find"] },
                { question: "¿Qué imprime?", code: "System.out.println(\"arepa\".contains(\"pa\"));", answer: "true", wrong: ["false", "pa", "3"] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(\"chocolate\".indexOf(\"co\"));", answer: "3", wrong: ["0", "2", "-1"] },
                { question: "¿Qué devuelve indexOf cuando NO encuentra el texto?", answer: "-1", wrong: ["0", "null", "false"] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(\"maleta\".startsWith(\"mal\"));", answer: "true", wrong: ["false", "mal", "Error de compilación"] },
                { question: "¿Qué imprime?", code: "System.out.println(\"camino\".endsWith(\"mino\"));", answer: "true", wrong: ["false", "mino", "2"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"lalala\";\nSystem.out.println(s.indexOf(\"la\"));",
                    answer: "0 (devuelve la PRIMERA aparición)",
                    wrong: ["4 (devuelve la última)", "3 (cuenta las apariciones)", "-1 (hay varias y se confunde)"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"Verde\";\nSystem.out.println(s.contains(\"verde\"));",
                    answer: "false (contains distingue mayúsculas)",
                    wrong: ["true (ignora las mayúsculas)", "Verde", "Error de compilación"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"mar y sol\";\nif (s.indexOf(\"y\") >= 0) {\n    System.out.println(\"tiene y\");\n} else {\n    System.out.println(\"no tiene\");\n}",
                    answer: "tiene y",
                    wrong: ["no tiene", "4", "y"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"abcabc\";\nSystem.out.println(s.indexOf(\"b\", 2));",
                    answer: "4 (busca desde la posición 2)",
                    wrong: ["1 (la primera b del texto)", "-1 (no hay b después de 2)", "2"],
                },
            ],
        ],
        "equals y comparación": [
            [
                { question: "¿Qué método compara el CONTENIDO de dos Strings?", answer: "equals", wrong: ["==", "compare", "same"] },
                { question: "¿Qué imprime?", code: "System.out.println(\"sol\".equals(\"sol\"));", answer: "true", wrong: ["false", "sol", "1"] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(\"Casa\".equals(\"casa\"));", answer: "false", wrong: ["true", "Casa", "Error de compilación"] },
                { question: "¿Qué método compara ignorando mayúsculas y minúsculas?", answer: "equalsIgnoreCase", wrong: ["equalsNoCase", "compareLower", "equalsAll"] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(\"JAVA\".equalsIgnoreCase(\"java\"));", answer: "true", wrong: ["false", "JAVA", "Error de compilación"] },
                {
                    question: "¿Por qué se recomienda equals y no == para Strings?",
                    answer: "== puede comparar referencias, no el texto",
                    wrong: ["== solo funciona con números", "equals es más corto de escribir", "== cambia el texto al compararlo"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String s = \"te\";\nSystem.out.println(s.isEmpty());",
                    answer: "false",
                    wrong: ["true", "te", "2"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "String clave = \"abc123\";\nString intento = \"abc123\";\nif (intento.equals(clave)) {\n    System.out.println(\"entra\");\n} else {\n    System.out.println(\"no entra\");\n}",
                    answer: "entra",
                    wrong: ["no entra", "abc123", "Error de compilación"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String s = \" si \";\nSystem.out.println(s.equals(\"si\"));",
                    answer: "false (los espacios cuentan)",
                    wrong: ["true (los espacios se ignoran)", "si", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "String a = null;\nString b = \"hola\";\nSystem.out.println(b.equals(a));",
                    answer: "false (comparar con null da false)",
                    wrong: ["NullPointerException seguro", "true", "null"],
                },
            ],
        ],
    },
};
