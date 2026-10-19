import type { TopicContent } from "./types";

// Java a fondo, en español: cortocircuito/ternario/rarezas, cadenas, funciones,
// arreglos y matrices. Casi todo es leer código. Las opciones van balanceadas en
// longitud (lengthGiveaway en el seed lo exige).
export const javaDepth: TopicContent = {
    id: "java-depth",
    name: "Java a Fondo",
    categories: {
        "Cortocircuito y Ternario": [
            [
                { question: "¿Qué operador es el AND lógico en Java?", answer: "&&", wrong: ["&", "and", "++"] },
                { question: "¿Qué imprime?", code: "System.out.println(5 > 3 ? \"sí\" : \"no\");", answer: "sí", wrong: ["no", "true", "5"] },
                { question: "En a && b, ¿cuándo NO se evalúa b?", answer: "Cuando a es false", wrong: ["Cuando a es true", "Cuando b es false", "Siempre se evalúa"] },
            ],
            [
                { question: "¿Qué imprime?", code: "int x = 7 / 2;\nSystem.out.println(x);", answer: "3", wrong: ["3.5", "4", "Error de compilación"] },
                { question: "Si lento() tarda 10 segundos, ¿qué pasa?", code: "boolean r = true || lento();\nSystem.out.println(r);", answer: "Imprime true al instante: lento() no se llama", wrong: ["Imprime true pero después de esperar 10 segundos", "Imprime false", "No compila sin más código"] },
                { question: "¿Qué valor tiene y?", code: "int y = (10 % 3 == 1) ? 100 : 200;", answer: "100", wrong: ["200", "1", "Error de compilación"] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(\"5\" + 3 + 2);", answer: "532", wrong: ["10", "55", "Error de compilación"] },
                { question: "¿Qué imprime?", code: "System.out.println(3 + 2 + \"5\");", answer: "55", wrong: ["532", "325", "10"] },
                { question: "¿Qué imprime?", code: "int a = 0;\nif (a != 0 && 10 / a > 1) {\n    System.out.println(\"grande\");\n} else {\n    System.out.println(\"seguro\");\n}", answer: "seguro", wrong: ["grande", "ArithmeticException por dividir entre cero", "No compila"] },
            ],
            [
                { question: "¿Qué imprime?", code: "int x = 5;\nboolean b = false && ++x > 0;\nSystem.out.println(x);", answer: "5 (el ++x nunca se ejecuta)", wrong: ["6 (el ++x sí se ejecuta)", "0", "Error de compilación"] },
                { question: "¿Qué imprime?", code: "char c = 'A';\nSystem.out.println(c + 1);", answer: "66", wrong: ["A1", "B", "Error de compilación"] },
                { question: "¿Qué valor tiene s?", code: "int n = 7;\nString s = n % 2 == 0 ? \"par\" : n < 10 ? \"impar chico\" : \"impar grande\";", answer: "impar chico", wrong: ["par", "impar grande", "No compila por anidar ternarios"] },
            ],
            [
                { question: "¿Qué imprime?", code: "String a = \"hola\";\nString b = new String(\"hola\");\nSystem.out.println(a == b);\nSystem.out.println(a.equals(b));", answer: "false y true", wrong: ["true y true", "true y false", "false y false"] },
                { question: "¿Qué imprime?", code: "int big = Integer.MAX_VALUE;\nSystem.out.println(big + 1);", answer: "-2147483648 (desbordamiento)", wrong: ["2147483648", "Error en tiempo de ejecución", "Integer.MAX_VALUE"] },
                { question: "¿Qué imprime?", code: "System.out.println(0.1 + 0.2 == 0.3);", answer: "false", wrong: ["true", "0.3", "Error de compilación"] },
            ],
        ],
        "Cadenas": [
            [
                { question: "¿Cómo se obtiene el número de caracteres de una cadena s?", answer: "s.length()", wrong: ["s.length", "s.size()", "s.count()"] },
                { question: "¿Qué imprime?", code: "System.out.println(\"café\".length());", answer: "4", wrong: ["5", "3", "Error de compilación"] },
                { question: "¿Entre qué comillas va un String en Java?", answer: "Comillas dobles \"…\"", wrong: ["Comillas simples '…'", "Acentos graves `…`", "Paréntesis (…)"] },
            ],
            [
                { question: "¿Qué imprime?", code: "String s = \"colegio\";\nSystem.out.println(s.charAt(2));", answer: "l", wrong: ["o", "c", "e"] },
                { question: "¿Qué imprime?", code: "System.out.println(\"uno,dos,tres\".split(\",\").length);", answer: "3", wrong: ["2", "12", "Error de compilación"] },
                { question: "¿Qué imprime?", code: "System.out.println(\"banana\".indexOf(\"na\"));", answer: "2", wrong: ["3", "1", "-1"] },
            ],
            [
                { question: "¿Qué imprime?", code: "String s = \"programar\";\nSystem.out.println(s.substring(3, 6));", answer: "gra", wrong: ["ogr", "gram", "ram"] },
                { question: "¿Qué imprime?", code: "String s = \"abc\";\ns.toUpperCase();\nSystem.out.println(s);", answer: "abc (los String son inmutables)", wrong: ["ABC (toUpperCase la modifica)", "abcABC", "Error de compilación"] },
                { question: "¿Cómo se comparan correctamente los textos de a y b?", answer: "a.equals(b)", wrong: ["a == b", "a = b", "a.compare(b)"] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(\"  Java  \".trim().length());", answer: "4", wrong: ["8", "6", "0"] },
                { question: "¿Qué imprime?", code: "String s = \"ja\";\ns += \"va\";\nSystem.out.println(s);", answer: "java", wrong: ["ja", "vaja", "Error: los String no se pueden sumar"] },
                { question: "¿Qué imprime?", code: "System.out.println(\"Hola\".replace('o', '0'));", answer: "H0la", wrong: ["Hola", "H0l0", "00la"] },
            ],
            [
                { question: "¿Por qué conviene StringBuilder para concatenar en un bucle?", answer: "Porque cada + crea un String nuevo en memoria", wrong: ["Porque + no funciona dentro de bucles", "Porque StringBuilder imprime más rápido", "Porque los String tienen un tamaño máximo"] },
                { question: "¿Qué imprime?", code: "String s = null;\nSystem.out.println(s + \"!\");", answer: "null!", wrong: ["!", "NullPointerException", "Error de compilación"] },
                { question: "¿Qué imprime?", code: "System.out.println(\"Suma: \" + 2 + 3 + \" y \" + (2 + 3));", answer: "Suma: 23 y 5", wrong: ["Suma: 5 y 5", "Suma: 23 y 23", "Suma: 5 y 23"] },
            ],
        ],
        "Funciones": [
            [
                { question: "¿Qué palabra clave indica que un método no devuelve nada?", answer: "void", wrong: ["null", "empty", "static"] },
                { question: "¿Qué devuelve suma(2, 3)?", code: "static int suma(int a, int b) {\n    return a + b;\n}", answer: "5", wrong: ["23", "0", "Error de compilación"] },
                { question: "¿Cómo se llaman los valores que recibe un método?", answer: "Parámetros", wrong: ["Variables", "Retornos", "Constantes"] },
            ],
            [
                { question: "¿Qué hace return en un método?", answer: "Devuelve un valor y termina el método", wrong: ["Imprime un valor en consola", "Repite el método otra vez", "Declara una variable nueva"] },
                { question: "¿Qué imprime?", code: "static void saluda() {\n    System.out.println(\"¡Hola!\");\n}\n// en main:\nsaluda();\nsaluda();", answer: "¡Hola! dos veces", wrong: ["¡Hola! una vez", "Nada, no se llama", "Error de compilación"] },
                { question: "¿Qué significa static en un método?", answer: "Pertenece a la clase, no a un objeto", wrong: ["No se puede modificar nunca", "Se ejecuta automáticamente", "Solo se llama una vez"] },
            ],
            [
                { question: "¿Qué imprime?", code: "static int doble(int n) {\n    return n * 2;\n}\n// en main:\nSystem.out.println(doble(doble(3)));", answer: "12", wrong: ["6", "9", "36"] },
                { question: "Dos métodos suma, uno con int y otro con double. ¿Cómo se llama esto?", answer: "Sobrecarga (overloading)", wrong: ["Herencia de métodos", "Recursión de métodos", "Error: no se permite"] },
                { question: "¿Qué imprime?", code: "static void cambia(int x) {\n    x = 99;\n}\n// en main:\nint n = 5;\ncambia(n);\nSystem.out.println(n);", answer: "5 (Java pasa una copia del valor)", wrong: ["99 (la función cambia el original)", "0", "Error de compilación"] },
            ],
            [
                { question: "¿Qué imprime?", code: "static int f(int n) {\n    if (n <= 1) return 1;\n    return n * f(n - 1);\n}\n// en main:\nSystem.out.println(f(4));", answer: "24", wrong: ["4", "10", "Desbordamiento de pila"] },
                { question: "¿Qué pasa si un método int no tiene return en algún camino?", answer: "No compila", wrong: ["Devuelve 0", "Devuelve null", "Lanza una excepción"] },
                { question: "¿Qué imprime?", code: "static int x = 1;\nstatic void sube() {\n    int x = 10;\n    x++;\n}\n// en main:\nsube();\nSystem.out.println(x);", answer: "1 (la x del método es otra variable)", wrong: ["11 (la x global sube dentro del método)", "2", "10"] },
            ],
            [
                { question: "¿Qué imprime?", code: "static int misterio(int n) {\n    if (n == 0) return 0;\n    return n + misterio(n - 1);\n}\n// en main:\nSystem.out.println(misterio(4));", answer: "10", wrong: ["4", "24", "0"] },
                { question: "¿Qué pasa al llamar a bucle()?", code: "static void bucle() {\n    bucle();\n}", answer: "StackOverflowError al llamarla", wrong: ["No compila", "Se detiene sola al rato", "No pasa nada al llamarla"] },
                { question: "¿Qué imprime?", code: "static void cambia(int[] a) {\n    a[0] = 99;\n}\n// en main:\nint[] arr = {1, 2};\ncambia(arr);\nSystem.out.println(arr[0]);", answer: "99 (la copia apunta al mismo arreglo)", wrong: ["1 (los métodos no cambian arreglos)", "2", "Error de compilación"] },
            ],
        ],
        "Arreglos": [
            [
                { question: "¿Cuál es el índice del primer elemento de un arreglo?", answer: "0", wrong: ["1", "-1", "Depende del arreglo"] },
                { question: "¿Cómo se obtiene el tamaño de un arreglo a?", answer: "a.length", wrong: ["a.length()", "a.size()", "a.count"] },
                { question: "¿Cuál crea un arreglo válido en Java?", answer: "int[] a = {1, 2, 3};", wrong: ["int a = [1, 2, 3];", "array a = (1, 2, 3);", "int a[] = <1, 2, 3>;"] },
            ],
            [
                { question: "¿Qué imprime?", code: "int[] a = {10, 20, 30};\nSystem.out.println(a[1]);", answer: "20", wrong: ["10", "30", "Error de compilación"] },
                { question: "¿Qué imprime?", code: "int[] a = new int[3];\nSystem.out.println(a[0]);", answer: "0", wrong: ["null", "Error en tiempo de ejecución", "3"] },
                { question: "¿Qué pasa aquí?", code: "int[] a = {1, 2, 3};\nSystem.out.println(a[3]);", answer: "ArrayIndexOutOfBoundsException", wrong: ["Imprime 3", "Imprime 0", "No compila"] },
            ],
            [
                { question: "¿Qué imprime?", code: "int[] a = {1, 2, 3, 4};\nint s = 0;\nfor (int n : a) {\n    s += n;\n}\nSystem.out.println(s);", answer: "10", wrong: ["4", "24", "1234"] },
                { question: "¿Qué imprime?", code: "int[] a = {5, 6};\nint[] b = a;\nb[0] = 9;\nSystem.out.println(a[0]);", answer: "9 (b apunta al mismo arreglo)", wrong: ["5 (b es una copia independiente)", "6", "Error de compilación"] },
                { question: "¿Qué imprime?", code: "int[] a = {3, 1, 2};\nArrays.sort(a);\nSystem.out.println(a[0]);", answer: "1", wrong: ["3", "2", "Error de compilación"] },
            ],
            [
                { question: "¿Qué imprime?", code: "int[] a = {1, 2, 3};\nfor (int i = a.length - 1; i >= 0; i--) {\n    System.out.print(a[i]);\n}", answer: "321", wrong: ["123", "12", "33"] },
                { question: "¿Qué imprime?", code: "int[] a = {2, 4, 6};\nSystem.out.println(a[a.length - 1]);", answer: "6", wrong: ["4", "2", "ArrayIndexOutOfBoundsException"] },
                { question: "¿Cuántos elementos tiene new int[5] y qué contienen?", answer: "5 elementos, todos en 0", wrong: ["5 elementos sin valor (null)", "4 elementos, todos en 0", "5 elementos, todos en 1"] },
            ],
            [
                { question: "¿Qué imprime?", code: "int[] a = {1, 2, 3};\nint[] b = a.clone();\nb[0] = 9;\nSystem.out.println(a[0] + \",\" + b[0]);", answer: "1,9", wrong: ["9,9", "1,1", "9,1"] },
                { question: "¿Qué imprime?", code: "System.out.println(new int[]{1, 2} == new int[]{1, 2});", answer: "false (son dos objetos distintos)", wrong: ["true (tienen los mismos valores)", "Error de compilación", "true (Java compara el contenido)"] },
                { question: "¿Qué imprime?", code: "int[] a = {7, 8, 9};\nSystem.out.println(a);", answer: "Algo como [I@1b6d3586 (la referencia)", wrong: ["[7, 8, 9] (el contenido del arreglo)", "789", "Error de compilación"] },
            ],
        ],
        "Matrices": [
            [
                { question: "¿Cómo se declara una matriz de enteros en Java?", answer: "int[][] m", wrong: ["int[,] m", "matrix m", "int(2) m"] },
                { question: "En m[2][3], ¿qué significan los números?", answer: "Fila 2, columna 3", wrong: ["Columna 2, fila 3", "El valor 2 y el valor 3", "Dos matrices juntas"] },
                { question: "Una matriz en Java es en realidad…", answer: "Un arreglo de arreglos", wrong: ["Una tabla de base de datos", "Un tipo primitivo especial", "Una lista de cadenas"] },
            ],
            [
                { question: "¿Qué imprime?", code: "int[][] m = {{1, 2}, {3, 4}};\nSystem.out.println(m[1][0]);", answer: "3", wrong: ["2", "1", "4"] },
                { question: "¿Cuántas filas tiene esta matriz?", code: "int[][] m = new int[3][5];", answer: "3", wrong: ["5", "15", "8"] },
                { question: "¿Qué imprime?", code: "int[][] m = {{1, 2}, {3, 4}};\nSystem.out.println(m.length);", answer: "2 (el número de filas)", wrong: ["4 (el total de elementos)", "2 (el número de columnas)", "1"] },
            ],
            [
                { question: "¿Cómo se obtiene el número de columnas de la fila 0?", answer: "m[0].length", wrong: ["m.length[0]", "m.columns()", "m.length"] },
                { question: "¿Qué imprime?", code: "int[][] m = new int[2][2];\nm[0][1] = 7;\nSystem.out.println(m[0][1] + m[1][0]);", answer: "7", wrong: ["14", "0", "Error de compilación"] },
                { question: "¿Qué recorre este código?", code: "for (int i = 0; i < m.length; i++)\n    for (int j = 0; j < m[i].length; j++)\n        System.out.print(m[i][j]);", answer: "Toda la matriz, fila por fila", wrong: ["Toda la matriz, columna por columna", "Solo la primera fila completa", "Solo la diagonal principal"] },
            ],
            [
                { question: "¿Qué imprime?", code: "int[][] m = {{1, 2, 3}, {4, 5, 6}};\nSystem.out.println(m[0][2] + m[1][1]);", answer: "8", wrong: ["7", "9", "Error de compilación"] },
                { question: "¿Es válida una matriz con filas de distinto tamaño?", code: "int[][] m = {{1}, {2, 3, 4}};", answer: "Sí, se llama matriz irregular (jagged)", wrong: ["No, no compila en Java", "Sí, pero rellena las filas con ceros", "Solo si las filas van de mayor a menor"] },
                { question: "¿Qué imprime?", code: "int[][] m = {{1, 2}, {3, 4, 5}};\nSystem.out.println(m[1].length);", answer: "3", wrong: ["2", "5", "Error de compilación"] },
            ],
            [
                { question: "¿Qué imprime?", code: "int[][] m = {{1, 2}, {3, 4}};\nint s = 0;\nfor (int i = 0; i < m.length; i++)\n    s += m[i][i];\nSystem.out.println(s);", answer: "5 (la diagonal: 1 + 4)", wrong: ["10 (toda la matriz)", "4 (la última fila)", "3 (la primera columna)"] },
                { question: "¿Qué imprime?", code: "int[][] m = new int[2][];\nm[0] = new int[]{1, 2, 3};\nSystem.out.println(m[1]);", answer: "null (la fila 1 no existe todavía)", wrong: ["[0, 0, 0] (se crea vacía sola)", "0", "ArrayIndexOutOfBoundsException"] },
                { question: "¿Qué imprime?", code: "int[][] m = {{1, 2}, {3, 4}};\nfor (int j = 0; j < m[0].length; j++)\n    for (int i = 0; i < m.length; i++)\n        System.out.print(m[i][j]);", answer: "1324 (recorre por columnas)", wrong: ["1234 (recorre por filas)", "4321", "1243"] },
            ],
        ],
    },
};
