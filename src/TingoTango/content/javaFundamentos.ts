import type { TopicContent } from "./types";

// "Java: Fundamentos" — básico en español, SOLO hasta fundamentos: conceptos, variables y
// tipos, operadores, condicionales y ciclos. Nada de objetos, listas, arreglos ni temas
// avanzados. Preguntas propias, distintas a las de Jeopardy (java / java-depth).
export const JAVA_FUNDAMENTOS: TopicContent = {
    id: "java-fundamentos",
    name: "Java: Fundamentos",
    categories: {
        "Conceptos": [
            [
                { question: "¿Qué extensión tiene un archivo de código fuente de Java?", answer: ".java", wrong: [".class", ".exe", ".txt"] },
                { question: "¿Cómo se llama el método donde empieza a ejecutarse un programa Java?", answer: "main", wrong: ["start", "run", "inicio"] },
            ],
            [
                {
                    question: "¿Qué hace el compilador de Java (javac)?",
                    answer: "Convierte el código .java en bytecode .class",
                    wrong: ["Ejecuta el programa línea por línea", "Corrige los errores de lógica", "Traduce el código a otro idioma"],
                },
                {
                    question: "¿Cómo se escribe un comentario de una línea en Java?",
                    answer: "// comentario",
                    wrong: ["# comentario", "<!-- comentario -->", "** comentario"],
                },
            ],
            [
                {
                    question: "¿Qué es la JVM?",
                    answer: "La máquina virtual que ejecuta el bytecode",
                    wrong: ["El editor donde se escribe Java", "Un tipo de variable de Java", "La página oficial de Java"],
                },
                {
                    question: "¿Con qué instrucción se imprime una línea en la consola?",
                    answer: "System.out.println(\"Hola\");",
                    wrong: ["print(\"Hola\");", "Console.Write(\"Hola\");", "echo \"Hola\";"],
                },
            ],
            [
                {
                    question: "¿Qué signo lleva al final casi toda instrucción en Java?",
                    answer: "El punto y coma ;",
                    wrong: ["El punto final .", "Los dos puntos :", "Ninguno, basta el salto de línea"],
                },
                {
                    question: "¿Qué par de símbolos delimita un bloque de código en Java?",
                    answer: "Las llaves { }",
                    wrong: ["Los corchetes [ ]", "Los paréntesis ( )", "Las comillas \" \""],
                },
            ],
            [
                {
                    question: "¿Por qué se dice que Java es multiplataforma?",
                    answer: "Porque su bytecode corre en cualquier JVM",
                    wrong: ["Porque se escribe igual que Python", "Porque no necesita compilarse nunca", "Porque solo funciona en Windows"],
                },
                {
                    question: "¿Qué pasa si escribes system.out.println con s minúscula?",
                    answer: "No compila: Java distingue mayúsculas",
                    wrong: ["Funciona igual que con mayúscula", "Imprime pero con una advertencia", "Se corrige solo al compilar"],
                },
            ],
        ],
        "Variables y tipos": [
            [
                { question: "¿Qué tipo guarda números enteros como 42?", answer: "int", wrong: ["double", "String", "char"] },
                { question: "¿Qué tipo guarda un texto como \"hola\"?", answer: "String", wrong: ["char", "texto", "int"] },
            ],
            [
                { question: "¿Qué tipo guarda decimales como 3.14?", answer: "double", wrong: ["int", "decimal", "char"] },
                {
                    question: "¿Qué valores puede guardar un boolean?",
                    answer: "true o false",
                    wrong: ["0 o cualquier número", "Cualquier texto corto", "Solo letras y dígitos"],
                },
            ],
            [
                {
                    question: "¿Cuál declara bien una variable entera llamada edad?",
                    answer: "int edad = 15;",
                    wrong: ["edad int = 15;", "int edad == 15;", "variable edad = 15;"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int x = 4;\nx = 9;\nSystem.out.println(x);",
                    answer: "9",
                    wrong: ["4", "13", "Error de compilación"],
                },
            ],
            [
                { question: "¿Qué tipo guarda UNA sola letra como 'A'?", answer: "char", wrong: ["String", "letter", "byte"] },
                { question: "¿Cuál es un nombre de variable válido en Java?", answer: "miEdad2", wrong: ["2miEdad", "mi edad", "int"] },
            ],
            [
                {
                    question: "¿Qué hace la palabra final en una variable?",
                    answer: "Impide cambiar su valor (constante)",
                    wrong: ["La borra al terminar el programa", "La convierte en decimal", "La imprime al final del todo"],
                },
                {
                    question: "¿Qué pasa aquí?",
                    code: "int n = \"hola\";",
                    answer: "No compila: tipos incompatibles",
                    wrong: ["n queda valiendo 0", "n guarda el texto \"hola\"", "Compila pero falla al ejecutar"],
                },
            ],
        ],
        "Operadores": [
            [
                { question: "¿Qué operador multiplica dos números en Java?", answer: "*", wrong: ["x", "%", "^"] },
                { question: "¿Qué imprime?", code: "System.out.println(2 + 3 * 2);", answer: "8", wrong: ["10", "12", "7"] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(10 - 4 / 2);", answer: "8", wrong: ["3", "6", "12"] },
                { question: "¿Qué operador pregunta si dos números son iguales?", answer: "==", wrong: ["=", "!=", "<>"] },
            ],
            [
                { question: "¿Qué hace x++ con la variable x?", answer: "Le suma 1", wrong: ["La eleva al cuadrado", "Duplica su valor", "La compara con 1"] },
                { question: "¿Qué imprime?", code: "int a = 9;\na += 3;\nSystem.out.println(a);", answer: "12", wrong: ["9", "3", "93"] },
            ],
            [
                { question: "¿Cuánto vale 14 % 5 (el residuo de la división)?", answer: "4", wrong: ["2", "2.8", "9"] },
                { question: "¿Qué imprime?", code: "System.out.println(7 > 7);", answer: "false", wrong: ["true", "7", "Error de compilación"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "double d = 1 / 2;\nSystem.out.println(d);",
                    answer: "0.0 (la división entera va primero)",
                    wrong: ["0.5 (la división da decimal)", "1.0 (redondea hacia arriba)", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int a = 5;\nint b = a++;\nSystem.out.println(b);",
                    answer: "5 (b toma el valor antes de sumar)",
                    wrong: ["6 (b toma el valor ya sumado)", "0 (b queda sin valor)", "Error de compilación"],
                },
            ],
        ],
        "Condicionales": [
            [
                { question: "¿Qué palabra clave inicia una decisión en Java?", answer: "if", wrong: ["when", "case", "for"] },
                { question: "¿Qué palabra marca el camino \"si no se cumple\"?", answer: "else", wrong: ["elif", "otherwise", "not"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int edad = 20;\nif (edad >= 18) {\n    System.out.println(\"mayor\");\n} else {\n    System.out.println(\"menor\");\n}",
                    answer: "mayor",
                    wrong: ["menor", "18", "Nada, no entra a ninguno"],
                },
                {
                    question: "¿Entre qué símbolos va la condición de un if?",
                    answer: "Paréntesis ( )",
                    wrong: ["Llaves { }", "Corchetes [ ]", "Comillas \" \""],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int n = 5;\nif (n % 2 == 0) {\n    System.out.println(\"par\");\n} else {\n    System.out.println(\"impar\");\n}",
                    answer: "impar",
                    wrong: ["par", "5", "Error de compilación"],
                },
                {
                    question: "¿Cómo se encadena otra condición después de un if?",
                    answer: "else if",
                    wrong: ["elseif (todo junto)", "elif", "or if"],
                },
            ],
            [
                {
                    question: "¿Qué estructura elige entre varios casos fijos de una variable?",
                    answer: "switch",
                    wrong: ["for", "while", "try"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int nota = 3;\nif (nota >= 3) {\n    System.out.println(\"aprueba\");\n}\nif (nota >= 5) {\n    System.out.println(\"excelente\");\n}",
                    answer: "aprueba",
                    wrong: ["aprueba y excelente", "excelente", "Nada, las dos fallan"],
                },
            ],
            [
                {
                    question: "¿Qué hace break dentro de un switch?",
                    answer: "Sale del switch al terminar el caso",
                    wrong: ["Vuelve a evaluar todos los casos", "Termina el programa completo", "Borra la variable evaluada"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int x = 10;\nif (x > 5)\n    System.out.println(\"a\");\n    System.out.println(\"b\");",
                    answer: "a y b (el if sin llaves solo cubre \"a\")",
                    wrong: ["solo a (las dos van dentro del if)", "solo b (la primera no se ejecuta)", "Error de compilación"],
                },
            ],
        ],
        "Ciclos": [
            [
                { question: "¿Qué ciclo repite mientras una condición sea verdadera?", answer: "while", wrong: ["if", "switch", "static"] },
                {
                    question: "¿Cuántas veces imprime \"hola\"?",
                    code: "for (int i = 0; i < 3; i++) {\n    System.out.println(\"hola\");\n}",
                    answer: "3",
                    wrong: ["2", "4", "Infinitas"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "for (int i = 1; i <= 3; i++) {\n    System.out.print(i);\n}",
                    answer: "123",
                    wrong: ["012", "1234", "333"],
                },
                {
                    question: "¿Cuáles son las 3 partes del paréntesis de un for, en orden?",
                    answer: "Inicio; condición; incremento",
                    wrong: ["Condición; inicio; incremento", "Tipo; nombre; valor", "Inicio; cuerpo; retorno"],
                },
            ],
            [
                {
                    question: "¿Qué pasa con while (true) sin break?",
                    answer: "El ciclo nunca termina (infinito)",
                    wrong: ["Se ejecuta una sola vez", "No compila", "Se detiene a las 100 vueltas"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int i = 0;\nwhile (i < 2) {\n    System.out.print(\"x\");\n    i++;\n}",
                    answer: "xx",
                    wrong: ["x", "xxx", "Nada, no entra al ciclo"],
                },
            ],
            [
                {
                    question: "¿Qué hace continue dentro de un ciclo?",
                    answer: "Salta a la siguiente vuelta",
                    wrong: ["Termina el ciclo por completo", "Repite la misma vuelta otra vez", "Pausa el programa un segundo"],
                },
                {
                    question: "¿Qué diferencia al do-while del while?",
                    answer: "Ejecuta el cuerpo al menos una vez",
                    wrong: ["Es más rápido que el while", "No necesita una condición", "Solo sirve para contar hacia atrás"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int s = 0;\nfor (int i = 1; i <= 5; i++) {\n    s += i;\n}\nSystem.out.println(s);",
                    answer: "15",
                    wrong: ["5", "10", "12345"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "for (int i = 3; i > 0; i--) {\n    System.out.print(i);\n}\nSystem.out.print(\"¡ya!\");",
                    answer: "321¡ya!",
                    wrong: ["123¡ya!", "3¡ya!", "¡ya!321"],
                },
            ],
        ],
    },
};
