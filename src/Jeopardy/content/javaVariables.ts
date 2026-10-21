import type { TopicContent } from "./types";

// "Java Variables" — básico en español, sin OOP. Tema independiente (un tablero completo
// solo de variables). Preguntas nuevas: no repiten java.ts (inglés), javaDepth.ts ni el
// banco de TingoTango.
export const JAVA_VARIABLES: TopicContent = {
    id: "java-variables",
    name: "Java Variables",
    categories: {
        "Declaración y asignación": [
            [
                { question: "¿Qué símbolo asigna un valor a una variable?", answer: "=", wrong: ["==", ":=", "->"] },
                { question: "¿Cuál declara una variable entera llamada puntos?", answer: "int puntos;", wrong: ["puntos int;", "entero puntos;", "var: puntos;"] },
            ],
            [
                {
                    question: "¿Qué significa \"declarar\" una variable?",
                    answer: "Crearla diciendo su tipo y su nombre",
                    wrong: ["Imprimir su valor en consola", "Borrarla de la memoria", "Convertirla en una constante"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int a;\na = 3 + 2;\nSystem.out.println(a);",
                    answer: "5",
                    wrong: ["32", "3 + 2", "Error de compilación"],
                },
            ],
            [
                {
                    question: "¿Se puede declarar y asignar en la misma línea?",
                    answer: "Sí: int x = 10;",
                    wrong: ["No, siempre en dos líneas", "Solo con la palabra new", "Solo con el tipo String"],
                },
                {
                    question: "¿Qué pasa al compilar?",
                    code: "int x;\nSystem.out.println(x);",
                    answer: "No compila: x no tiene valor todavía",
                    wrong: ["Imprime 0 (valor por defecto)", "Imprime null", "Imprime un número al azar"],
                },
            ],
            [
                { question: "¿Cuál declara DOS variables enteras en una sola línea?", answer: "int a, b;", wrong: ["int a + b;", "int a y b;", "a, b: int;"] },
                {
                    question: "¿Qué imprime?",
                    code: "int a = 4;\nint b = a;\na = 9;\nSystem.out.println(b);",
                    answer: "4 (b copió el valor, no la variable)",
                    wrong: ["9 (b sigue los cambios de a)", "13 (suma los dos valores)", "Error de compilación"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int x = 2;\nx = x + x;\nx = x * x;\nSystem.out.println(x);",
                    answer: "16",
                    wrong: ["8", "4", "12"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int a = 1, b = 2, c = 3;\na = c;\nc = b;\nSystem.out.println(\"\" + a + b + c);",
                    answer: "322",
                    wrong: ["123", "321", "332"],
                },
            ],
        ],
        "Tipos enteros": [
            [
                { question: "¿Qué tipo se usa normalmente para un número entero?", answer: "int", wrong: ["double", "String", "boolean"] },
                { question: "¿Cuál de estos valores puede guardarse en un int?", answer: "250", wrong: ["2.5", "\"250\"", "dos cincuenta"] },
            ],
            [
                { question: "¿Qué tipo entero guarda números MÁS grandes que int?", answer: "long", wrong: ["short", "byte", "char"] },
                { question: "¿Qué imprime?", code: "int x = 10 / 4;\nSystem.out.println(x);", answer: "2", wrong: ["2.5", "3", "Error de compilación"] },
            ],
            [
                {
                    question: "¿Cuáles son los 4 tipos enteros de Java?",
                    answer: "byte, short, int y long",
                    wrong: ["int, float, double y long", "byte, int, char y String", "short, int, long y boolean"],
                },
                {
                    question: "¿Por qué no compila?",
                    code: "int grande = 3000000000;",
                    answer: "3 mil millones no caben en un int",
                    wrong: ["Falta la palabra new adelante", "Los int no aceptan tantos dígitos pares", "El nombre grande está reservado"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int monedas = 7;\nint cada = monedas / 3;\nint sobra = monedas % 3;\nSystem.out.println(cada + \" y \" + sobra);",
                    answer: "2 y 1",
                    wrong: ["2.3 y 0", "3 y 1", "1 y 2"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int x = 5;\nx = x / 2 * 2;\nSystem.out.println(x);",
                    answer: "4 (5/2 es 2, por ser enteros)",
                    wrong: ["5 (dividir y multiplicar se anulan)", "6 (redondea hacia arriba)", "Error de compilación"],
                },
            ],
            [
                {
                    question: "¿Hasta aproximadamente qué valor llega un int?",
                    answer: "Unos 2.100 millones",
                    wrong: ["Unos 32 mil", "Unos 9 trillones", "No tiene ningún límite"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "int x = 9 % 2 + 9 / 2;\nSystem.out.println(x);",
                    answer: "5 (1 + 4)",
                    wrong: ["9 (vuelve al original)", "4.5 (la mitad exacta)", "6 (2 + 4)"],
                },
            ],
        ],
        "Decimales y boolean": [
            [
                { question: "¿Qué tipo guarda un número con decimales como 2.5?", answer: "double", wrong: ["int", "boolean", "char"] },
                { question: "¿Qué tipo usarías para guardar si un estudiante aprobó o no?", answer: "boolean", wrong: ["int", "String", "double"] },
            ],
            [
                { question: "¿Qué imprime?", code: "double d = 7;\nSystem.out.println(d);", answer: "7.0", wrong: ["7", "0.7", "Error de compilación"] },
                { question: "¿Qué imprime?", code: "boolean b = 10 < 3;\nSystem.out.println(b);", answer: "false", wrong: ["true", "10 < 3", "Error de compilación"] },
            ],
            [
                { question: "¿Qué imprime?", code: "System.out.println(5.0 / 2);", answer: "2.5", wrong: ["2", "2.0", "Error de compilación"] },
                { question: "¿Cuál asigna bien un decimal a un float?", answer: "float f = 2.5f;", wrong: ["float f = 2.5;", "float f = \"2.5\";", "float f = (2,5);"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "double d = 1.5 + 1;\nSystem.out.println(d);",
                    answer: "2.5",
                    wrong: ["2", "2.0", "Error: no se pueden mezclar tipos"],
                },
                {
                    question: "¿Por qué NO conviene double para dinero exacto?",
                    answer: "Tiene pequeños errores de redondeo",
                    wrong: ["Solo guarda números enteros", "Es más lento que usar String", "No acepta valores grandes"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "System.out.println(1 / 4 + 1.0);",
                    answer: "1.0 (1/4 entre enteros da 0)",
                    wrong: ["1.25 (un cuarto más uno)", "0.25 (solo la división)", "Error de compilación"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "double d = 10 / 4 * 1.0;\nSystem.out.println(d);",
                    answer: "2.0 (10/4 se hace entero primero)",
                    wrong: ["2.5 (todo se hace con decimales)", "2 (sin parte decimal)", "Error de compilación"],
                },
            ],
        ],
        "Nombres y convenciones": [
            [
                {
                    question: "¿Con qué estilo se nombran las variables en Java?",
                    answer: "camelCase (miVariable)",
                    wrong: ["MAYUSCULAS (MIVARIABLE)", "kebab-case (mi-variable)", "Con espacios (mi variable)"],
                },
                { question: "¿Puede un nombre de variable empezar con un número?", answer: "No, nunca", wrong: ["Sí, siempre", "Solo si es un número par", "Solo en las constantes"] },
            ],
            [
                {
                    question: "¿Cuál es un nombre INVÁLIDO de variable?",
                    answer: "mi-edad (el guion no se permite)",
                    wrong: ["edad2 (termina en número)", "_edad (empieza con guion bajo)", "miEdad (mezcla mayúsculas)"],
                },
                {
                    question: "¿Java distingue entre las variables edad y Edad?",
                    answer: "Sí, son dos variables distintas",
                    wrong: ["No, son exactamente la misma", "Solo dentro de un ciclo", "Solo si una es constante"],
                },
            ],
            [
                {
                    question: "¿Cómo se suele escribir el nombre de una constante?",
                    answer: "EN_MAYUSCULAS (MAX_VIDAS)",
                    wrong: ["enMinusculas (maxVidas)", "Entre comillas (\"MAX\")", "Empezando en número (1MAX)"],
                },
                { question: "¿Cuál nombre comunica mejor lo que guarda?", answer: "edadEstudiante", wrong: ["x1", "dato", "aaa"] },
            ],
            [
                {
                    question: "¿Qué pasa aquí?",
                    code: "int for = 5;",
                    answer: "No compila: for es palabra reservada",
                    wrong: ["Compila sin ningún problema", "Compila solo dentro del main", "Compila pero con advertencia"],
                },
                { question: "¿Cuál de estos nombres SÍ es válido en Java?", answer: "$precio", wrong: ["precio total", "9precio", "precio-total"] },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int suma = 10;\nint Suma = 20;\nSystem.out.println(suma + Suma);",
                    answer: "30 (son variables distintas)",
                    wrong: ["20 (la segunda reemplaza)", "40 (se duplica la mayor)", "Error: nombre repetido"],
                },
                { question: "¿Cuál de estas palabras está reservada (no sirve como nombre)?", answer: "class", wrong: ["clase", "Main", "numero"] },
            ],
        ],
        "Conversiones (casting)": [
            [
                { question: "¿Qué imprime?", code: "int x = 7;\ndouble d = x;\nSystem.out.println(d);", answer: "7.0", wrong: ["7", "0.0", "Error de compilación"] },
                {
                    question: "¿Cómo se llama convertir un valor de un tipo a otro?",
                    answer: "Casting (conversión)",
                    wrong: ["Printing (impresión)", "Looping (repetición)", "Naming (nombramiento)"],
                },
            ],
            [
                { question: "¿Cuál convierte un double a int?", answer: "int x = (int) 3.9;", wrong: ["int x = int(3.9);", "int x = 3.9 a int;", "int x = [int] 3.9;"] },
                {
                    question: "¿Qué imprime?",
                    code: "int x = (int) 5.8;\nSystem.out.println(x);",
                    answer: "5 (se corta el decimal)",
                    wrong: ["6 (redondea al más cercano)", "5.8 (queda igual)", "Error de compilación"],
                },
            ],
            [
                {
                    question: "¿De int a double hace falta casting explícito?",
                    answer: "No: esa conversión es automática",
                    wrong: ["Sí, siempre con (int) adelante", "Sí, siempre con (double) adelante", "No se puede convertir nunca"],
                },
                { question: "¿Qué imprime?", code: "double d = 9.99;\nint x = (int) d;\nSystem.out.println(x);", answer: "9", wrong: ["10", "9.99", "0"] },
            ],
            [
                {
                    question: "¿Cómo se convierte el texto \"42\" en un número int?",
                    answer: "Integer.parseInt(\"42\")",
                    wrong: ["(int) \"42\"", "\"42\".toInt()", "int(\"42\")"],
                },
                {
                    question: "¿Qué imprime?",
                    code: "System.out.println((int) 'A');",
                    answer: "65 (el código del carácter)",
                    wrong: ["A (la letra tal cual)", "'A' (con sus comillas)", "Error de compilación"],
                },
            ],
            [
                {
                    question: "¿Qué imprime?",
                    code: "int a = 7, b = 2;\ndouble d = (double) a / b;\nSystem.out.println(d);",
                    answer: "3.5",
                    wrong: ["3", "3.0", "Error de compilación"],
                },
                { question: "¿Qué imprime?", code: "System.out.println((int) (2.5 + 2.5));", answer: "5", wrong: ["4", "2", "5.0"] },
            ],
        ],
    },
};
