import type { TopicContent } from "./types";

// "Java Arreglos" — básico en español, sin OOP ni ArrayList. Preguntas nuevas: no repiten
// la categoría Arreglos de javaDepth.ts.
export const JAVA_ARREGLOS_BASICO: TopicContent = {
    id: "java-arreglos-basico",
    name: "Java Arreglos",
    categories: {
        "Crear arreglos": [
            [
                {
                    question: "¿Qué es un arreglo en Java?",
                    answer: "Una lista de valores del mismo tipo",
                    wrong: ["Una variable con dos nombres", "Un texto con varias palabras", "Un ciclo que guarda datos"],
                },
                { question: "¿Cuál crea un arreglo de 4 enteros vacío?", answer: "int[] a = new int[4];", wrong: ["int a = int[4];", "int[] a = int(4);", "array a = new int[4];"] },
            ],
            [
                { question: "¿Cuál crea un arreglo con los valores 7, 8 y 9?", answer: "int[] a = {7, 8, 9};", wrong: ["int[] a = (7, 8, 9);", "int[] a = [7, 8, 9];", "int a = {7, 8, 9};"] },
                { question: "¿Cuál es el tipo correcto para guardar varios nombres?", answer: "String[]", wrong: ["String", "char[]", "int[]"] },
            ],
            [
                {
                    question: "¿Qué contiene un new boolean[3] recién creado?",
                    answer: "false, false, false",
                    wrong: ["true, true, true", "null, null, null", "Nada: está sin valores"],
                },
                {
                    question: "¿Puede cambiar de tamaño un arreglo ya creado?",
                    answer: "No: su tamaño queda fijo al crearlo",
                    wrong: ["Sí, con a.resize(n)", "Sí, asignando más posiciones", "Solo si es de tipo String"],
                },
            ],
            [
                {
                    question: "¿Qué contiene un new String[2] recién creado?",
                    answer: "null y null",
                    wrong: ["\"\" y \"\" (textos vacíos)", "0 y 0", "Espacios en blanco"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "double[] d = new double[2];\nSystem.out.println(d[0]);",
                    answer: "0.0",
                    wrong: ["0", "null", "Error en ejecución"],
                },
            ],
            [
                {
                    question: "¿Qué pasa aquí?",
                    code: "int[] a = new int[-2];",
                    answer: "NegativeArraySizeException al ejecutar",
                    wrong: ["No compila: el tamaño es negativo", "Crea un arreglo vacío normal", "Crea 2 posiciones y las marca"],
                },
                {
                    question: "¿Cuál combina declarar con new y llenar después?",
                    answer: "int[] a = new int[2]; a[0] = 5;",
                    wrong: ["int[] a = new int[2] = {5};", "int[] a; a = {5, 0};", "new a[2]; a[0] = 5;"],
                },
            ],
        ],
        "Índices y acceso": [
            [
                { question: "¿Qué imprime?", code: "int[] a = {4, 8, 15};\nSystem.out.println(a[0]);", answer: "4", wrong: ["8", "15", "0"] },
                { question: "¿Entre qué símbolos va el índice de un arreglo?", answer: "Corchetes [ ]", wrong: ["Paréntesis ( )", "Llaves { }", "Comillas \" \""] },
            ],
            [
                { question: "En un arreglo de 10 posiciones, ¿cuál es el ÍNDICE del último?", answer: "9", wrong: ["10", "11", "0"] },
                { question: "¿Qué imprime?", code: "String[] s = {\"uva\", \"pera\"};\nSystem.out.println(s[1]);", answer: "pera", wrong: ["uva", "1", "pera uva"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {3, 6, 9};\na[1] = 60;\nSystem.out.println(a[1]);",
                    answer: "60",
                    wrong: ["6", "9", "Error: no se puede cambiar"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {5, 10, 15};\nint i = 2;\nSystem.out.println(a[i]);",
                    answer: "15",
                    wrong: ["10", "5", "2"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {2, 4, 6, 8};\nSystem.out.println(a[1] + a[3]);",
                    answer: "12",
                    wrong: ["10", "48", "4 y 8"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {7, 7, 7};\na[0] = a[2] + 1;\nSystem.out.println(a[0]);",
                    answer: "8",
                    wrong: ["7", "14", "1"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {10, 20, 30};\nint j = a.length - 2;\nSystem.out.println(a[j]);",
                    answer: "20",
                    wrong: ["30", "10", "2"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {1, 2, 3};\na[a[0]] = 9;\nSystem.out.println(a[1]);",
                    answer: "9 (a[0] vale 1, cambia a[1])",
                    wrong: ["2 (nada cambió en a[1])", "1 (cambia la primera)", "Error de compilación"],
                },
            ],
        ],
        "Recorrer arreglos": [
            [
                {
                    question: "¿Qué ciclo recorre un arreglo posición por posición?",
                    answer: "for (int i = 0; i < a.length; i++)",
                    wrong: ["for (int i = 1; i <= a.size; i++)", "while (a > 0)", "switch (a)"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {1, 2};\nfor (int i = 0; i < a.length; i++) {\n    System.out.print(a[i]);\n}",
                    answer: "12",
                    wrong: ["21", "1", "012"],
                },
            ],
            [
                {
                    question: "¿Cómo se llama esta forma de recorrer?",
                    code: "for (int x : numeros) {\n    System.out.println(x);\n}",
                    answer: "for-each (para cada elemento)",
                    wrong: ["for clásico con índice", "do-while de arreglos", "switch de recorrido"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "String[] s = {\"a\", \"b\", \"c\"};\nfor (String letra : s) {\n    System.out.print(letra + \"-\");\n}",
                    answer: "a-b-c-",
                    wrong: ["a-b-c", "abc-", "c-b-a-"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {5, 6, 7};\nfor (int i = a.length - 1; i >= 0; i--) {\n    System.out.print(a[i] + \" \");\n}",
                    answer: "7 6 5",
                    wrong: ["5 6 7", "7 6", "6 5"],
                },
                {
                    question: "En el for-each, ¿qué NO puedes saber directamente?",
                    answer: "El índice del elemento actual",
                    wrong: ["El valor del elemento actual", "El tipo de los elementos", "Cuándo termina el recorrido"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {1, 2, 3, 4};\nfor (int i = 0; i < a.length; i += 2) {\n    System.out.print(a[i]);\n}",
                    answer: "13 (posiciones 0 y 2)",
                    wrong: ["24 (posiciones 1 y 3)", "1234 (todas)", "12"],
                },
                {
                    question: "¿Qué hace este recorrido?",
                    code: "for (int i = 0; i < a.length; i++) {\n    a[i] = a[i] * 2;\n}",
                    answer: "Duplica cada valor del arreglo",
                    wrong: ["Duplica el tamaño del arreglo", "Imprime cada valor dos veces", "Copia el arreglo en otro nuevo"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {2, 5, 8};\nint c = 0;\nfor (int x : a) {\n    if (x % 2 == 0) {\n        c++;\n    }\n}\nSystem.out.println(c);",
                    answer: "2 (el 2 y el 8 son pares)",
                    wrong: ["1 (solo el 2)", "3 (todos cuentan)", "0"],
                },
                {
                    question: "¿Por qué falla este recorrido?",
                    code: "int[] a = {1, 2, 3};\nfor (int i = 0; i <= a.length; i++) {\n    System.out.println(a[i]);\n}",
                    answer: "El <= llega al índice 3, que no existe",
                    wrong: ["El for no puede usar a.length", "Empieza en 0 y debería ser 1", "Le falta el paso i += 1"],
                },
            ],
        ],
        "Operaciones": [
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {10, 20};\nSystem.out.println(a[0] + a[1]);",
                    answer: "30",
                    wrong: ["1020", "10", "20"],
                },
                {
                    question: "Para sumar todo un arreglo, ¿qué necesitas además del ciclo?",
                    answer: "Un acumulador que empiece en 0",
                    wrong: ["Un contador que empiece en 1", "Ordenar el arreglo primero", "Un arreglo extra del mismo tamaño"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {4, 1, 7};\nint s = 0;\nfor (int x : a) {\n    s += x;\n}\nSystem.out.println(s);",
                    answer: "12",
                    wrong: ["417", "7", "3"],
                },
                {
                    question: "¿Qué calcula este código?",
                    code: "int m = a[0];\nfor (int x : a) {\n    if (x > m) {\n        m = x;\n    }\n}",
                    answer: "El valor máximo del arreglo",
                    wrong: ["El valor mínimo del arreglo", "La suma de los valores", "La posición del mayor"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[] notas = {3, 5, 4};\nint s = 0;\nfor (int n : notas) {\n    s += n;\n}\nSystem.out.println(s / notas.length);",
                    answer: "4 (el promedio entero)",
                    wrong: ["4.0 (el promedio exacto)", "12 (la suma total)", "3"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {9, 2, 9};\nint menor = a[0];\nfor (int x : a) {\n    if (x < menor) {\n        menor = x;\n    }\n}\nSystem.out.println(menor);",
                    answer: "2",
                    wrong: ["9", "0", "20"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {4, 8, 4};\nint buscado = 4, veces = 0;\nfor (int x : a) {\n    if (x == buscado) {\n        veces++;\n    }\n}\nSystem.out.println(veces);",
                    answer: "2",
                    wrong: ["1", "3", "4"],
                },
                {
                    question: "¿Qué hace la variable bandera aquí?",
                    code: "boolean hay = false;\nfor (int x : a) {\n    if (x == 7) {\n        hay = true;\n    }\n}",
                    answer: "Recuerda si el 7 apareció en el arreglo",
                    wrong: ["Cuenta cuántas veces aparece el 7", "Guarda la posición del 7", "Borra el 7 del arreglo"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {1, 3, 5};\nint[] b = new int[3];\nfor (int i = 0; i < a.length; i++) {\n    b[i] = a[a.length - 1 - i];\n}\nSystem.out.println(b[0] + \"\" + b[1] + b[2]);",
                    answer: "531 (b es a al revés)",
                    wrong: ["135 (b es una copia igual)", "555", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {6, 2, 9, 4};\nint pos = 0;\nfor (int i = 1; i < a.length; i++) {\n    if (a[i] > a[pos]) {\n        pos = i;\n    }\n}\nSystem.out.println(pos);",
                    answer: "2 (ahí está el 9)",
                    wrong: ["9 (el valor mayor)", "3 (la última posición)", "0"],
                },
            ],
        ],
        "Errores comunes": [
            [
                {
                    question: "¿Qué error lanza usar un índice que no existe?",
                    answer: "ArrayIndexOutOfBoundsException",
                    wrong: ["NullPointerException", "NumberFormatException", "StackOverflowError"],
                },
                {
                    question: "¿Cuál índice NO existe en int[] a = new int[5]?",
                    answer: "5",
                    wrong: ["0", "4", "1"],
                },
            ],
            [
                {
                    question: "¿Qué pasa aquí?",
                    code: "int[] a = {1, 2};\na[2] = 3;",
                    answer: "Explota: la posición 2 no existe",
                    wrong: ["El arreglo crece a 3 posiciones", "Se ignora la asignación", "No compila"],
                },
                {
                    question: "¿Qué pasa aquí?",
                    code: "int[] a = null;\nSystem.out.println(a.length);",
                    answer: "NullPointerException",
                    wrong: ["Imprime 0", "Imprime null", "No compila"],
                },
            ],
            [
                {
                    question: "¿Por qué este ciclo se salta el primer elemento?",
                    code: "for (int i = 1; i < a.length; i++) {\n    System.out.println(a[i]);\n}",
                    answer: "Empieza en i = 1 y el primero está en 0",
                    wrong: ["Los for siempre inician en el segundo", "a.length no cuenta el primero", "El < debería ser un <="],
                },
                {
                    question: "¿Cuál es la forma correcta del tamaño de un arreglo?",
                    answer: "a.length (sin paréntesis)",
                    wrong: ["a.length() (con paréntesis)", "a.size", "length(a)"],
                },
            ],
            [
                {
                    question: "¿Qué pasa aquí?",
                    code: "int[] a = {1, 2, 3};\nint i = -1;\nSystem.out.println(a[i]);",
                    answer: "Explota: -1 está fuera del arreglo",
                    wrong: ["Imprime 3 (cuenta desde atrás)", "Imprime 1 (lo corrige a 0)", "No compila"],
                },
                {
                    question: "¿Qué pasa aquí?",
                    code: "int[] a;\na[0] = 1;",
                    answer: "No compila: a nunca se creó con new",
                    wrong: ["Funciona: a se crea solo", "NullPointerException al correr", "Crea un arreglo de 1 posición"],
                },
            ],
            [
                {
                    question: "¿Cuál es el error de lógica?",
                    code: "int[] a = {5, 3, 8};\nint max = 0;\nfor (int x : a) {\n    if (x > max) {\n        max = x;\n    }\n}",
                    answer: "Con valores negativos, max daría 0",
                    wrong: ["El for-each no sirve para máximos", "max debería empezar en 100", "Falta un break tras encontrarlo"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[] a = {1, 2, 3};\nfor (int i = 0; i < a.length; i++);\nSystem.out.println(\"vueltas: \" + a[0]);",
                    answer: "vueltas: 1 (el ; dejó el for vacío)",
                    wrong: ["vueltas: 1 tres veces seguidas", "No compila por el punto y coma", "vueltas: 3"],
                },
            ],
        ],
    },
};
