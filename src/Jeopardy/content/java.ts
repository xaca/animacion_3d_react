import type { TopicContent } from "./types";

// Java fundamentals for beginners. Category names start with "Java" so a board can't be
// mistaken for C# or JavaScript; questions use Java-only syntax and library classes.
export const java: TopicContent = {
    id: "java",
    name: "Java Fundamentals",
    categories: {
        "Java Types & Variables": [
            [
                { question: "Which Java type stores a whole number?", answer: "int", wrong: ["number", "integer", "num"] },
                { question: "Which Java type can only be true or false?", answer: "boolean", wrong: ["bool", "bit", "truth"] },
                { question: "Which Java type stores a single character like 'A'?", answer: "char", wrong: ["String", "letter", "character"] },
            ],
            [
                { question: "Which is a valid Java variable name?", answer: "myAge", wrong: ["2players", "my-age", "class"] },
                { question: "Which Java type should you use for 3.14?", answer: "double", wrong: ["int", "decimal", "float32"] },
                { question: "Which keyword makes a Java variable a constant?", answer: "final", wrong: ["const", "static", "fixed"] },
            ],
            [
                { question: "What is the value of x?", code: "int x = 7 / 2;", answer: "3", wrong: ["3.5", "4", "2"] },
                { question: "What is the value of x?", code: "int x = (int) 9.99;", answer: "9", wrong: ["10", "9.99", "0"] },
                { question: "What is the default value of an int field in a Java class?", answer: "0", wrong: ["null", "undefined", "1"] },
            ],
            [
                { question: "What is the difference between int and Integer?", answer: "Integer is an object (wrapper), int is a primitive", wrong: ["They are exactly the same", "int is an object and Integer is a primitive", "Integer is a decimal type"] },
                { question: "Since Java 10, which keyword lets the compiler infer a local variable's type?", code: "___ list = new ArrayList<String>();", answer: "var", wrong: ["let", "auto", "dynamic"] },
                { question: "What does this print?", code: "long big = 3_000_000_000L;\nSystem.out.println(big);", answer: "3000000000", wrong: ["3_000_000_000", "An error", "-1294967296"] },
            ],
            [
                { question: "What does this print?", code: "System.out.println(\"5\" + 3 + 2);", answer: "532", wrong: ["10", "55", "An error"] },
                { question: "What does this print?", code: "System.out.println(3 + 2 + \"5\");", answer: "55", wrong: ["325", "10", "An error"] },
                { question: "What does this print?", code: "int big = Integer.MAX_VALUE;\nSystem.out.println(big + 1 < big);", answer: "true", wrong: ["false", "An error", "It never finishes"] },
            ],
        ],
        "Java Strings": [
            [
                { question: "Which Java method prints text and moves to a new line?", answer: "System.out.println", wrong: ["console.log", "Console.WriteLine", "print()"] },
                { question: "In Java, String text is written between…", answer: "Double quotes \"…\"", wrong: ["Single quotes '…'", "Backticks `…`", "Brackets […]"] },
                { question: "Which method gives the number of characters in a Java String s?", answer: "s.length()", wrong: ["s.length", "s.size()", "s.count()"] },
            ],
            [
                { question: "What does this print?", code: "System.out.println(\"Java\".replace(\"a\", \"o\"));", answer: "Jovo", wrong: ["Java", "Jova", "Jav"] },
                { question: "What does this print?", code: "String s = \"Hello\";\nSystem.out.println(s.charAt(1));", answer: "e", wrong: ["H", "l", "An error"] },
                { question: "How do you compare the text of two Strings a and b in Java?", answer: "a.equals(b)", wrong: ["a == b", "a.compare(b)", "a === b"] },
            ],
            [
                { question: "What does this print?", code: "String s = \"Hello World\";\nSystem.out.println(s.substring(0, 5));", answer: "Hello", wrong: ["Hello W", "World", "ello"] },
                { question: "What does this print?", code: "System.out.println(\"banana\".indexOf(\"n\"));", answer: "2", wrong: ["3", "1", "-1"] },
                { question: "What does this print?", code: "System.out.println(\"  hi  \".trim().length());", answer: "2", wrong: ["6", "4", "0"] },
            ],
            [
                { question: "Which class reads what the user types in the console?", answer: "Scanner", wrong: ["Reader", "Input", "Console"] },
                { question: "What does this print?", code: "String s = \"a,b,c\";\nSystem.out.println(s.split(\",\").length);", answer: "3", wrong: ["5", "2", "1"] },
                { question: "Which Java method builds a String from a template?", code: "String s = String.___(\"%s is %d\", \"Ana\", 20);", answer: "format", wrong: ["printf", "template", "concat"] },
            ],
            [
                { question: "Why use StringBuilder to join many Strings in a loop?", answer: "Strings are immutable, so + creates a new String every time", wrong: ["+ does not work in loops", "StringBuilder is the only way to join text", "Strings can only be joined once"] },
                { question: "What does this print?", code: "String a = \"hi\";\nString b = new String(\"hi\");\nSystem.out.println(a.equals(b));", answer: "true", wrong: ["false", "An error", "hi"] },
                { question: "What does this print?", code: "String s = \"abc\";\ns.concat(\"d\");\nSystem.out.println(s);", answer: "abc", wrong: ["abcd", "d", "An error"] },
            ],
        ],
        "Java Control Flow": [
            [
                { question: "Which keyword runs code only when a condition is true?", answer: "if", wrong: ["when", "case", "loop"] },
                { question: "How many times does this print Hi?", code: "for (int i = 0; i < 3; i++) {\n    System.out.println(\"Hi\");\n}", answer: "3", wrong: ["2", "4", "Forever"] },
                { question: "Which loop repeats while a condition is true?", answer: "while", wrong: ["repeat", "until", "loop"] },
            ],
            [
                { question: "What does break do inside a loop?", answer: "Exits the loop immediately", wrong: ["Skips one iteration", "Restarts the loop", "Pauses the program"] },
                { question: "What does this print?", code: "int age = 15;\nif (age >= 18) {\n    System.out.println(\"Adult\");\n} else {\n    System.out.println(\"Minor\");\n}", answer: "Minor", wrong: ["Adult", "Nothing", "An error"] },
                { question: "What does continue do inside a loop?", answer: "Skips to the next iteration", wrong: ["Exits the loop", "Restarts the program", "Repeats the same iteration"] },
            ],
            [
                { question: "How many times does a do-while loop run at least?", answer: "1", wrong: ["0", "2", "It depends on the condition"] },
                { question: "What does this print?", code: "for (int i = 1; i <= 10; i++) {\n    if (i % 2 == 0) continue;\n    System.out.print(i);\n}", answer: "13579", wrong: ["246810", "12345", "1357910"] },
                { question: "What happens in a classic switch case without break?", answer: "Execution falls through to the next case", wrong: ["The compiler reports a missing break error", "The switch exits", "Only default runs"] },
            ],
            [
                { question: "What is y?", code: "int y = (5 > 3) ? 10 : 20;", answer: "10", wrong: ["20", "5", "true"] },
                { question: "What does this print?", code: "int i = 0;\nwhile (i < 3) {\n    i++;\n}\nSystem.out.println(i);", answer: "3", wrong: ["2", "4", "0"] },
                { question: "In a && b, when is b NOT evaluated?", answer: "When a is false", wrong: ["When a is true", "When b is false", "It is always evaluated"] },
            ],
            [
                { question: "What does this Java 14+ switch expression give for day = 2?", code: "String s = switch (day) {\n    case 1 -> \"Mon\";\n    case 2 -> \"Tue\";\n    default -> \"Other\";\n};", answer: "Tue", wrong: ["Mon", "Other", "It does not compile"] },
                { question: "What happens with this code?", code: "int x = 3;\nif (x = 5) {\n    System.out.println(\"Hi\");\n}", answer: "It does not compile", wrong: ["It prints Hi", "It prints nothing", "x becomes 5 and Hi is printed"] },
                { question: "How many times does Hi print?", code: "for (int i = 0; i < 3; i++)\n    for (int j = 0; j < 2; j++)\n        System.out.println(\"Hi\");", answer: "6", wrong: ["5", "3", "2"] },
            ],
        ],
        "Java Arrays & ArrayList": [
            [
                { question: "What is the index of the first element of a Java array?", answer: "0", wrong: ["1", "-1", "first"] },
                { question: "Which is a valid way to create an int array in Java?", answer: "int[] a = {1, 2, 3};", wrong: ["int a = [1, 2, 3];", "array a = (1, 2, 3);", "int a[] = <1, 2, 3>;"] },
                { question: "How do you get the size of a Java array a?", answer: "a.length", wrong: ["a.length()", "a.size()", "a.count"] },
            ],
            [
                { question: "What does this print?", code: "int[] a = {10, 20, 30};\nSystem.out.println(a[2]);", answer: "30", wrong: ["20", "10", "An error"] },
                { question: "Which Java class is a list that can grow?", answer: "ArrayList", wrong: ["Array", "GrowList", "Vector2"] },
                { question: "Which method adds an element to an ArrayList?", answer: "add", wrong: ["push", "append", "insert"] },
            ],
            [
                { question: "How do you get the size of an ArrayList list?", answer: "list.size()", wrong: ["list.length", "list.length()", "list.count"] },
                { question: "What happens here?", code: "int[] a = new int[3];\na[3] = 7;", answer: "ArrayIndexOutOfBoundsException", wrong: ["The array grows to 4", "a[0] becomes 7", "Nothing"] },
                { question: "Which loop goes through every element without an index?", code: "for (String name : names) { }", answer: "Enhanced for (for-each)", wrong: ["while loop", "do-while loop", "The classic indexed for loop"] },
            ],
            [
                { question: "Why can't you write ArrayList<int>?", answer: "Generics need objects, so use ArrayList<Integer>", wrong: ["ArrayList only stores Strings", "Arrays cannot be used inside generic classes", "You can, it works"] },
                { question: "What does this print?", code: "ArrayList<String> l = new ArrayList<>();\nl.add(\"a\");\nl.add(\"b\");\nl.remove(0);\nSystem.out.println(l);", answer: "[b]", wrong: ["[a]", "[a, b]", "[]"] },
                { question: "What is the default value of each element here?", code: "boolean[] flags = new boolean[5];", answer: "false", wrong: ["true", "null", "0"] },
            ],
            [
                { question: "What does this print?", code: "int[] a = {3, 1, 2};\nArrays.sort(a);\nSystem.out.println(Arrays.toString(a));", answer: "[1, 2, 3]", wrong: ["[3, 1, 2]", "[3, 2, 1]", "An error"] },
                { question: "What does this print?", code: "int[] a = {1, 2};\nint[] b = a;\nb[0] = 9;\nSystem.out.println(a[0]);", answer: "9", wrong: ["1", "2", "An error"] },
                { question: "What does this print?", code: "int[][] m = {{1, 2}, {3, 4}};\nSystem.out.println(m[1][0]);", answer: "3", wrong: ["2", "1", "4"] },
            ],
        ],
        "Java Methods & Classes": [
            [
                { question: "Which keyword means a Java method returns nothing?", answer: "void", wrong: ["null", "empty", "none"] },
                { question: "What is the entry point of a Java program?", code: "public static void ___(String[] args)", answer: "main", wrong: ["start", "run", "init"] },
                { question: "Which keyword creates a new object in Java?", answer: "new", wrong: ["create", "make", "object"] },
            ],
            [
                { question: "What does add(2, 3) return?", code: "static int add(int a, int b) {\n    return a + b;\n}", answer: "5", wrong: ["23", "void", "An error"] },
                { question: "What does static mean on a method?", answer: "It belongs to the class; no object is needed to call it", wrong: ["It cannot change", "It can be called only from inside the same class", "It is private"] },
                { question: "Which access modifier hides a field from other classes?", answer: "private", wrong: ["public", "hidden", "protected"] },
            ],
            [
                { question: "What is a constructor in Java?", answer: "A method with the class's name that runs when you use new", wrong: ["A static method that runs before every other method", "The main method", "A static field"] },
                { question: "Which keyword makes a class inherit from another in Java?", answer: "extends", wrong: ["inherits", "implements", ": (colon)"] },
                { question: "What does this refer to inside a Java method?", answer: "The current object", wrong: ["The class", "The parent class", "The last object created"] },
            ],
            [
                { question: "Two methods named print in one class, one with an int and one with a String. This is…", answer: "Overloading", wrong: ["Overriding", "Inheritance", "An error"] },
                { question: "Which annotation marks a method that replaces a parent's method?", answer: "@Override", wrong: ["@Replace", "@Super", "@New"] },
                { question: "Which keyword makes a Java class implement an interface?", answer: "implements", wrong: ["extends", "uses", "interface"] },
            ],
            [
                { question: "Which method does System.out.println(obj) call to get the text?", answer: "toString()", wrong: ["print()", "getText()", "valueOf()"] },
                { question: "What happens when you call a method on a null reference?", answer: "NullPointerException", wrong: ["It returns null", "It returns 0", "Nothing"] },
                { question: "Java passes arguments to methods…", answer: "By value (for objects, the reference is copied)", wrong: ["By reference (the method gets the original variable)", "By name", "Only for primitives"] },
            ],
        ],
    },
};
