import type { TopicContent } from "./types";

// "Java Fundamentos" — básico en español, sin OOP: qué es Java, estructura, consola,
// sintaxis y el ciclo compilar/ejecutar. Preguntas nuevas (no repiten java.ts, javaDepth.ts
// ni el banco de TingoTango, que vive en otra colección).
export const JAVA_FUNDAMENTOS_J: TopicContent = {
    id: "java-fundamentos",
    name: "Java Fundamentos",
    categories: {
        "Qué es Java": [
            [
                { question: "¿Qué es Java?", answer: "Un lenguaje de programación", wrong: ["Un sistema operativo", "Un navegador de internet", "Una base de datos"] },
                {
                    question: "¿Java y JavaScript son el mismo lenguaje?",
                    answer: "No, son lenguajes distintos",
                    wrong: ["Sí, Java es la versión corta", "Sí, solo cambia el logo", "JavaScript es Java mejorado"],
                },
            ],
            [
                {
                    question: "En Java, ¿las variables declaran su tipo?",
                    answer: "Sí: es un lenguaje tipado",
                    wrong: ["No: las variables son libres", "Solo las variables de texto", "Solo dentro de los ciclos"],
                },
                {
                    question: "¿Para qué se usa mucho Java hoy?",
                    answer: "Apps Android y sistemas de empresas",
                    wrong: ["Solo páginas web estáticas", "Solo videojuegos de consola", "Editar fotos y videos"],
                },
            ],
            [
                {
                    question: "¿Java es compilado o interpretado?",
                    answer: "Ambos: se compila y la JVM lo ejecuta",
                    wrong: ["Solo compilado a código de máquina", "Solo interpretado línea a línea", "Ninguno: corre tal cual se escribe"],
                },
                {
                    question: "¿Dónde corre un programa Java ya compilado?",
                    answer: "En la máquina virtual (JVM)",
                    wrong: ["Directo en el procesador", "Siempre en el navegador", "Dentro del compilador javac"],
                },
            ],
            [
                { question: "¿Qué empresa creó Java en los años 90?", answer: "Sun Microsystems", wrong: ["Apple Computer", "Google", "IBM"] },
                {
                    question: "¿Qué significa que Java sea de tipado fuerte?",
                    answer: "El tipo de cada dato se respeta estricto",
                    wrong: ["Que es muy difícil de aprender", "Que todo se escribe en mayúsculas", "Que sus programas pesan más"],
                },
            ],
            [
                {
                    question: "¿Qué gana Java al usar bytecode?",
                    answer: "El mismo .class corre en varios sistemas",
                    wrong: ["Programas más pequeños que todos", "No necesitar nunca la memoria", "Colores automáticos en la consola"],
                },
                { question: "¿Qué empresa mantiene Java actualmente?", answer: "Oracle", wrong: ["Microsoft", "Google", "Mozilla"] },
            ],
        ],
        "main y estructura": [
            [
                { question: "¿Dentro de qué va TODO el código de Java?", answer: "De una clase", wrong: ["De un archivo .txt", "De una función suelta", "Del navegador"] },
                {
                    question: "¿Cuál es la firma típica del main?",
                    answer: "public static void main(String[] args)",
                    wrong: ["public static int main(String[] args)", "static main(String args)", "int main(void)"],
                },
            ],
            [
                {
                    question: "¿Qué pasa si una clase no tiene main?",
                    answer: "No se puede ejecutar como programa",
                    wrong: ["No compila de ninguna forma", "Se ejecuta la primera línea", "Corre pero sin imprimir nada"],
                },
                {
                    question: "¿Qué recibe el main entre paréntesis?",
                    answer: "Un arreglo de String (los argumentos)",
                    wrong: ["Un número con la versión", "La lista de variables usadas", "Nada: siempre va vacío"],
                },
            ],
            [
                {
                    question: "El nombre del archivo .java debe coincidir con…",
                    answer: "El nombre de la clase pública",
                    wrong: ["El nombre del método main", "El nombre del computador", "Cualquier nombre sirve"],
                },
                {
                    question: "¿Cuál es el orden correcto de la estructura?",
                    answer: "Clase afuera, main adentro, código en el main",
                    wrong: ["Main afuera y la clase adentro", "El código va fuera de todo", "El orden no importa en Java"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "public static void main(String[] args) {\n    System.out.println(\"1\");\n    System.out.println(\"2\");\n}",
                    answer: "1 y 2, cada uno en su línea",
                    wrong: ["2 y luego 1", "12 en la misma línea", "Solo el 1"],
                },
                {
                    question: "¿Puede un archivo .java tener dos clases?",
                    answer: "Sí, pero solo una puede ser pública",
                    wrong: ["No, siempre una por archivo", "Sí, y todas deben ser públicas", "Solo si se llaman igual"],
                },
            ],
            [
                {
                    question: "Si se ejecuta con: java Hola uno dos — ¿qué imprime?",
                    code: "public static void main(String[] args) {\n    System.out.println(args[0]);\n}",
                    answer: "uno",
                    wrong: ["Hola", "dos", "args[0]"],
                },
                {
                    question: "¿Por qué el main es static?",
                    answer: "Para ejecutarse sin crear un objeto",
                    wrong: ["Para que nadie pueda cambiarlo", "Para correr mucho más rápido", "Para poder recibir argumentos"],
                },
            ],
        ],
        "Imprimir en consola": [
            [
                {
                    question: "¿Qué diferencia a println de print?",
                    answer: "println salta de línea al final",
                    wrong: ["println imprime más rápido", "println imprime en mayúsculas", "Ninguna: son iguales"],
                },
                { question: "¿Qué imprime?", code: "System.out.println(3 + 4);", answer: "7", wrong: ["34", "3 + 4", "Error de compilación"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "System.out.print(\"a\");\nSystem.out.print(\"b\");",
                    answer: "ab (en la misma línea)",
                    wrong: ["a y b en dos líneas", "ba", "Solo la b"],
                },
                {
                    question: "¿Cómo imprimes la variable edad junto a un texto?",
                    answer: "System.out.println(\"Edad: \" + edad);",
                    wrong: ["System.out.println(\"Edad: edad\");", "System.out.println(Edad: + edad);", "println.System(\"Edad\", edad);"],
                },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(1 + \"0\");", answer: "10 (queda como texto)", wrong: ["1 (la suma falla)", "01", "Error de compilación"] },
                { question: "¿Qué hace \\n dentro de un texto?", answer: "Salta a una línea nueva", wrong: ["Imprime la letra n", "Borra la línea anterior", "Agrega una tabulación"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "System.out.println(10 + 5 + \" puntos\");",
                    answer: "15 puntos (suma antes del texto)",
                    wrong: ["105 puntos (pega los números)", "10 5 puntos", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "System.out.println(\"Dijo: \\\"hola\\\"\");",
                    answer: "Dijo: \"hola\"",
                    wrong: ["Dijo: \\hola\\", "Dijo: hola (sin comillas)", "Error de compilación"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "System.out.print(\"x\\ny\");",
                    answer: "x y luego y en otra línea",
                    wrong: ["x\\ny tal cual, con barra", "xy en una sola línea", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int a = 2;\nSystem.out.println(\"a\" + a + 'a');",
                    answer: "a2a",
                    wrong: ["aaa", "a299", "Error de compilación"],
                },
            ],
        ],
        "Comentarios y sintaxis": [
            [
                { question: "¿Cómo EMPIEZA un comentario de varias líneas?", answer: "/*", wrong: ["//", "<!--", "**"] },
                {
                    question: "¿El computador ejecuta los comentarios?",
                    answer: "No, los ignora por completo",
                    wrong: ["Sí, al final del programa", "Solo los de una línea", "Solo si están en inglés"],
                },
            ],
            [
                { question: "¿Con qué TERMINA un comentario de varias líneas?", answer: "*/", wrong: ["//", "-->", "**"] },
                {
                    question: "¿Qué imprime?",
                    code: "// System.out.println(\"a\");\nSystem.out.println(\"b\");",
                    answer: "b (la primera línea es comentario)",
                    wrong: ["a (la primera línea gana)", "a y b en dos líneas", "Nada"],
                },
            ],
            [
                {
                    question: "¿Para qué sirve un comentario /** … */?",
                    answer: "Documentación del código (javadoc)",
                    wrong: ["Comentarios secretos cifrados", "Código que corre a veces", "Multiplicar un comentario"],
                },
                {
                    question: "¿La sangría (indentación) es obligatoria en Java?",
                    answer: "No, pero ayuda mucho a leer",
                    wrong: ["Sí, el compilador la exige", "Solo dentro del main", "Solo dentro de los ciclos"],
                },
            ],
            [
                { question: "¿Qué comillas usa un char como la letra a?", answer: "Simples: 'a'", wrong: ["Dobles: \"a\"", "Invertidas: `a`", "Ninguna: va sin comillas"] },
                {
                    question: "¿Cuántas instrucciones hay en esta línea?",
                    code: "int a = 1; int b = 2; a = b;",
                    answer: "3 (cada ; cierra una)",
                    wrong: ["1 (es una sola línea)", "2 (las que usan int)", "6"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "/* System.out.println(\"x\"); */\nSystem.out.println(\"y\");",
                    answer: "y (la x quedó comentada)",
                    wrong: ["x (el comentario no cierra)", "x y luego y", "Nada"],
                },
                {
                    question: "¿Qué pasa aquí?",
                    code: "int Edad = 15;\nSystem.out.println(edad);",
                    answer: "No compila: edad no existe (es Edad)",
                    wrong: ["Imprime 15: mayúsculas dan igual aquí", "Imprime 0 por defecto", "Imprime la palabra Edad"],
                },
            ],
        ],
        "Compilar y ejecutar": [
            [
                { question: "¿Qué comando compila el archivo Hola.java?", answer: "javac Hola.java", wrong: ["java Hola.java", "run Hola.java", "compile Hola"] },
                { question: "¿Qué archivo aparece después de compilar Hola.java?", answer: "Hola.class", wrong: ["Hola.exe", "Hola.byte", "Hola.run"] },
            ],
            [
                { question: "¿Qué comando EJECUTA el programa ya compilado?", answer: "java Hola", wrong: ["javac Hola", "java Hola.class", "run Hola"] },
                {
                    question: "¿Qué paquete trae el compilador y las herramientas para desarrollar?",
                    answer: "El JDK",
                    wrong: ["El JRE", "La JVM sola", "El navegador"],
                },
            ],
            [
                {
                    question: "¿Cuándo aparece un error de compilación?",
                    answer: "Antes de ejecutar: algo está mal escrito",
                    wrong: ["Mientras el programa corre", "Solo al apagar el computador", "Solo con ciclos infinitos"],
                },
                {
                    question: "¿Cuándo aparece una excepción (como dividir por cero)?",
                    answer: "Mientras el programa está corriendo",
                    wrong: ["Antes de poder compilar el programa", "Al guardar el archivo", "Solo al imprimir texto"],
                },
            ],
            [
                {
                    question: "¿Qué pasa con esta línea?",
                    code: "System.out.println(10 / 0);",
                    answer: "Compila, pero explota al ejecutarse",
                    wrong: ["No compila: división por cero", "Imprime la palabra Infinity", "Imprime 0"],
                },
                {
                    question: "Si cambias el código fuente, ¿debes recompilar?",
                    answer: "Sí, para generar el .class nuevo",
                    wrong: ["No, el .class se actualiza solo", "Solo si cambiaste el main", "Solo la primera vez del día"],
                },
            ],
            [
                {
                    question: "¿Qué es el bytecode?",
                    answer: "El código intermedio que entiende la JVM",
                    wrong: ["El código máquina del procesador", "El texto del .java comprimido", "La memoria que usa el programa"],
                },
                {
                    question: "¿Qué imprime este programa al EJECUTARSE?",
                    code: "public static void main(String[] args) {\n    int x = 5 / (3 - 3);\n    System.out.println(\"fin\");\n}",
                    answer: "Nada: explota antes de llegar a fin",
                    wrong: ["fin (la división no se imprime)", "Infinity y después fin", "No compila por el paréntesis"],
                },
            ],
        ],
    },
};
