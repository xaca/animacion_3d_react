import type { TopicContent } from "./types";

// "Java Matrices" — básico en español, sin OOP. Preguntas nuevas: no repiten la categoría
// Matrices de javaDepth.ts (otros valores y otros ángulos).
export const JAVA_MATRICES: TopicContent = {
    id: "java-matrices",
    name: "Java Matrices",
    categories: {
        "Crear matrices": [
            [
                {
                    question: "¿Qué es una matriz en programación?",
                    answer: "Una tabla de valores con filas y columnas",
                    wrong: ["Una lista de textos ordenados", "Una variable con dos valores", "Un ciclo dentro de otro ciclo"],
                },
                { question: "¿Cuál crea una matriz de enteros de 2×3 vacía?", answer: "int[][] m = new int[2][3];", wrong: ["int[] m = new int[2, 3];", "int m = new int[2][3];", "int[][] m = int(2, 3);"] },
            ],
            [
                {
                    question: "¿Cuál crea una matriz con los valores {10, 20} y {30, 40}?",
                    answer: "int[][] m = {{10, 20}, {30, 40}};",
                    wrong: ["int[][] m = {10, 20, 30, 40};", "int[][] m = ({10, 20}, {30, 40});", "int[2][2] m = {10, 20, 30, 40};"],
                },
                { question: "¿Qué tipo usarías para una tabla de nombres?", answer: "String[][]", wrong: ["String[]", "char[][]", "texto[][]"] },
            ],
            [
                {
                    question: "¿Qué contiene new int[2][2] recién creada?",
                    answer: "Cuatro ceros",
                    wrong: ["Cuatro null", "Nada: hay que llenarla", "Dos ceros"],
                },
                {
                    question: "En new int[5][2], ¿qué significa cada número?",
                    answer: "5 filas y 2 columnas",
                    wrong: ["2 filas y 5 columnas", "5 columnas y 2 valores", "Del 5 al 2 en cuenta regresiva"],
                },
            ],
            [
                {
                    question: "¿Cuántos valores guarda en total una matriz de 4×6?",
                    answer: "24",
                    wrong: ["10", "46", "4"],
                },
                {
                    question: "¿Cuál crea una matriz de decimales de 3×3?",
                    answer: "double[][] m = new double[3][3];",
                    wrong: ["double[] m = new double[3][3];", "decimal[][] m = new decimal[3][3];", "double[][] m = new double[9];"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "boolean[][] b = new boolean[2][2];\nSystem.out.println(b[1][1]);",
                    answer: "false",
                    wrong: ["true", "null", "0"],
                },
                {
                    question: "¿Se pueden escribir los dos pares de corchetes juntos al tipo?",
                    code: "int[][] a;\nint b[][];",
                    answer: "Sí: ambas declaraciones valen",
                    wrong: ["No: solo vale la primera", "No: solo vale la segunda", "No compila ninguna"],
                },
            ],
        ],
        "Filas y columnas": [
            [
                {
                    question: "En una matriz m, ¿qué devuelve m.length?",
                    code: "int[][] m = new int[6][3];",
                    answer: "6 (las filas)",
                    wrong: ["3 (las columnas)", "18 (todo el contenido)", "9"],
                },
                { question: "¿Qué recorre primero el índice i en m[i][j], por convención?", answer: "Las filas", wrong: ["Las columnas", "Las diagonales", "Los valores pares"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = new int[4][7];\nSystem.out.println(m[0].length);",
                    answer: "7 (las columnas de la fila 0)",
                    wrong: ["4 (las filas de la matriz)", "28 (el total de celdas)", "0"],
                },
                {
                    question: "¿Qué es m[2] en una matriz int[][] m?",
                    answer: "La fila 2 completa (un arreglo)",
                    wrong: ["La columna 2 completa", "El valor de la posición 2", "Las dos primeras filas"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "String[][] s = {{\"a\", \"b\", \"c\"}, {\"d\", \"e\", \"f\"}};\nSystem.out.println(s.length + \"x\" + s[0].length);",
                    answer: "2x3",
                    wrong: ["3x2", "6x1", "2x2"],
                },
                {
                    question: "¿Cómo calculas el total de celdas de una matriz rectangular m?",
                    answer: "m.length * m[0].length",
                    wrong: ["m.length + m[0].length", "m.length * m.length", "m.total()"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{1, 2, 3, 4}, {5, 6, 7, 8}};\nint[] fila = m[1];\nSystem.out.println(fila.length);",
                    answer: "4",
                    wrong: ["2", "8", "1"],
                },
                {
                    question: "Para una matriz de notas de 30 estudiantes con 4 notas cada uno, ¿cuál encaja?",
                    answer: "double[][] notas = new double[30][4];",
                    wrong: ["double[][] notas = new double[4][120];", "double[] notas = new double[34];", "double notas = 30 * 4;"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = new int[3][];\nm[0] = new int[1];\nm[1] = new int[4];\nSystem.out.println(m[1].length - m[0].length);",
                    answer: "3",
                    wrong: ["1", "4", "Error: filas de distinto tamaño"],
                },
                {
                    question: "En una matriz irregular, ¿qué debes usar como tope del ciclo interno?",
                    answer: "m[i].length (cada fila tiene el suyo)",
                    wrong: ["m[0].length (la primera fila manda)", "m.length (el número de filas)", "Un número fijo como 10"],
                },
            ],
        ],
        "Acceso [i][j]": [
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{5, 6}, {7, 8}};\nSystem.out.println(m[0][0]);",
                    answer: "5",
                    wrong: ["6", "7", "8"],
                },
                { question: "¿Cómo se lee m[1][2]?", answer: "Fila 1, columna 2", wrong: ["Columna 1, fila 2", "El valor 12", "Las filas 1 y 2"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{2, 4, 6}, {1, 3, 5}};\nSystem.out.println(m[1][2]);",
                    answer: "5",
                    wrong: ["6", "3", "4"],
                },
                {
                    question: "¿Cómo cambias a 99 la celda de la fila 0, columna 1?",
                    answer: "m[0][1] = 99;",
                    wrong: ["m[1][0] = 99;", "m(0, 1) = 99;", "m[0, 1] = 99;"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{1, 2}, {3, 4}};\nm[0][1] = m[1][1];\nSystem.out.println(m[0][1]);",
                    answer: "4",
                    wrong: ["2", "3", "1"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{10, 20}, {30, 40}};\nSystem.out.println(m[0][1] + m[1][0]);",
                    answer: "50",
                    wrong: ["2030", "60", "30"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{1, 2}, {3, 4}};\nint i = 1;\nSystem.out.println(m[i][i - 1]);",
                    answer: "3",
                    wrong: ["2", "4", "1"],
                },
                {
                    question: "¿Qué pasa aquí?",
                    code: "int[][] m = new int[2][2];\nSystem.out.println(m[2][0]);",
                    answer: "Explota: la fila 2 no existe",
                    wrong: ["Imprime 0 (valor por defecto)", "Imprime null", "No compila"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{9, 8, 7}, {6, 5, 4}, {3, 2, 1}};\nSystem.out.println(m[m.length - 1][0]);",
                    answer: "3 (primera celda de la última fila)",
                    wrong: ["1 (la última celda de todas)", "9 (la primera celda de todas)", "7"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{1, 2}, {3, 4}};\nint x = m[0][0];\nm[0][0] = m[1][1];\nm[1][1] = x;\nSystem.out.println(m[0][0] + \",\" + m[1][1]);",
                    answer: "4,1 (las esquinas se intercambian)",
                    wrong: ["1,4 (todo queda igual)", "4,4 (se copia dos veces)", "1,1"],
                },
            ],
        ],
        "Recorrer matrices": [
            [
                {
                    question: "¿Cuántos ciclos se suelen usar para recorrer toda una matriz?",
                    answer: "2: uno de filas y uno de columnas",
                    wrong: ["1: las matrices son lineales", "3: filas, columnas y diagonal", "4: uno por cada esquina"],
                },
                {
                    question: "¿Cuántas veces corre el print?",
                    code: "int[][] m = new int[2][5];\nfor (int i = 0; i < m.length; i++) {\n    for (int j = 0; j < m[i].length; j++) {\n        System.out.println(\"celda\");\n    }\n}",
                    answer: "10",
                    wrong: ["7", "2", "5"],
                },
            ],
            [
                {
                    question: "¿Qué imprime este recorrido de UNA fila?",
                    code: "int[][] m = {{1, 2, 3}, {4, 5, 6}};\nfor (int j = 0; j < m[0].length; j++) {\n    System.out.print(m[0][j]);\n}",
                    answer: "123",
                    wrong: ["456", "14", "123456"],
                },
                {
                    question: "Dentro del doble for clásico, ¿qué representa j?",
                    code: "for (int i = 0; i < m.length; i++)\n    for (int j = 0; j < m[i].length; j++)",
                    answer: "La columna actual",
                    wrong: ["La fila actual", "El total de celdas", "El valor de la celda"],
                },
            ],
            [
                {
                    question: "¿Qué imprime este recorrido de UNA columna?",
                    code: "int[][] m = {{1, 2}, {3, 4}, {5, 6}};\nfor (int i = 0; i < m.length; i++) {\n    System.out.print(m[i][1]);\n}",
                    answer: "246",
                    wrong: ["135", "12", "456"],
                },
                {
                    question: "¿Qué deja este código en la matriz?",
                    code: "for (int i = 0; i < m.length; i++) {\n    for (int j = 0; j < m[i].length; j++) {\n        m[i][j] = 1;\n    }\n}",
                    answer: "Todas las celdas en 1",
                    wrong: ["Solo la diagonal en 1", "Solo la primera fila en 1", "Una celda cualquiera en 1"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{1, 2}, {3, 4}};\nfor (int i = 0; i < 2; i++) {\n    for (int j = 0; j < 2; j++) {\n        System.out.print(m[j][i]);\n    }\n}",
                    answer: "1324 (van invertidos i y j)",
                    wrong: ["1234 (el orden normal)", "4321", "1122"],
                },
                {
                    question: "¿Qué calcula este código?",
                    code: "int s = 0;\nfor (int j = 0; j < m[0].length; j++) {\n    s += m[0][j];\n}",
                    answer: "La suma de la primera fila",
                    wrong: ["La suma de la primera columna", "La suma de toda la matriz", "El tamaño de la matriz"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{1, 2}, {3, 4}};\nint s = 0;\nfor (int[] fila : m) {\n    for (int x : fila) {\n        s += x;\n    }\n}\nSystem.out.println(s);",
                    answer: "10",
                    wrong: ["4", "6", "1234"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = new int[2][3];\nfor (int i = 0; i < 2; i++) {\n    for (int j = 0; j < 3; j++) {\n        m[i][j] = i + j;\n    }\n}\nSystem.out.println(m[1][2]);",
                    answer: "3",
                    wrong: ["2", "12", "5"],
                },
            ],
        ],
        "Operaciones con matrices": [
            [
                {
                    question: "Para sumar TODA una matriz, ¿dónde va el acumulador?",
                    answer: "Afuera de los dos ciclos",
                    wrong: ["Dentro del ciclo interno", "Entre los dos ciclos", "En cada celda de la matriz"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{2, 2}, {3, 3}};\nSystem.out.println(m[0][0] + m[0][1] + m[1][0] + m[1][1]);",
                    answer: "10",
                    wrong: ["2233", "8", "12"],
                },
            ],
            [
                {
                    question: "¿Qué calcula este código?",
                    code: "int c = 0;\nfor (int i = 0; i < m.length; i++) {\n    for (int j = 0; j < m[i].length; j++) {\n        if (m[i][j] == 0) {\n            c++;\n        }\n    }\n}",
                    answer: "Cuántas celdas valen cero",
                    wrong: ["La suma de las celdas en cero", "Si la matriz está vacía", "La posición del primer cero"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{5, 1}, {2, 8}};\nint max = m[0][0];\nfor (int[] f : m) {\n    for (int x : f) {\n        if (x > max) {\n            max = x;\n        }\n    }\n}\nSystem.out.println(max);",
                    answer: "8",
                    wrong: ["5", "1", "16"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{1, 2, 3}, {4, 5, 6}};\nint s = 0;\nfor (int i = 0; i < m.length; i++) {\n    s += m[i][0];\n}\nSystem.out.println(s);",
                    answer: "5 (suma la columna 0: 1 + 4)",
                    wrong: ["6 (suma la fila 0: 1 + 2 + 3)", "21 (suma todo)", "3"],
                },
                {
                    question: "Quiero la fila con mayor suma. ¿Qué necesito por cada fila?",
                    answer: "Sumar la fila y compararla con la mejor",
                    wrong: ["Ordenar la fila de menor a mayor", "Multiplicar la fila por su índice", "Contar las celdas pares de la fila"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] a = {{1, 2}, {3, 4}};\nint[][] b = new int[2][2];\nfor (int i = 0; i < 2; i++) {\n    for (int j = 0; j < 2; j++) {\n        b[i][j] = a[i][j] * 10;\n    }\n}\nSystem.out.println(b[1][0]);",
                    answer: "30",
                    wrong: ["3", "40", "10"],
                },
                {
                    question: "¿Qué busca este código?",
                    code: "int fi = -1, fj = -1;\nfor (int i = 0; i < m.length; i++) {\n    for (int j = 0; j < m[i].length; j++) {\n        if (m[i][j] == 7) {\n            fi = i;\n            fj = j;\n        }\n    }\n}",
                    answer: "La posición (fila, columna) del 7",
                    wrong: ["Cuántos 7 hay en la matriz", "La suma de los 7 que aparezcan", "Si el 7 está en la diagonal"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int[][] m = {{1, 2}, {3, 4}};\nint s = 0;\nfor (int i = 0; i < 2; i++) {\n    s += m[i][1 - i];\n}\nSystem.out.println(s);",
                    answer: "5 (2 + 3, la otra diagonal)",
                    wrong: ["5 (1 + 4, la diagonal principal)", "10 (toda la matriz)", "4"],
                },
                {
                    question: "Intercambiar la fila 0 con la fila 1, ¿cuál es la forma corta?",
                    answer: "int[] t = m[0]; m[0] = m[1]; m[1] = t;",
                    wrong: ["m[0] = m[1]; m[1] = m[0];", "m.swap(0, 1);", "t = m; m[0] = t[1]; m[1] = t[0];"],
                },
            ],
        ],
    },
};
