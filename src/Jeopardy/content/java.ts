import type { TopicContent } from "./types";

// Java coding fundamentals for beginners: variables to methods.
export const java: TopicContent = {
    id: "java",
    name: "Java Fundamentals",
    categories: {
        "Variables & Types": [
            [
                { question: "Which keyword declares a whole number variable?", answer: "int", wrong: ["number", "integer", "digit"] },
                { question: "Which type can only be true or false?", answer: "boolean", wrong: ["bit", "binary", "truth"] },
            ],
            [
                { question: "What is the type of \"Hello\" in Java?", answer: "String", wrong: ["char", "text", "word"] },
                { question: "Which of these is a valid variable name?", answer: "myAge", wrong: ["2players", "my-age", "class"] },
            ],
            [
                { question: "What does the final keyword do to a variable?", answer: "Its value cannot be changed", wrong: ["It deletes the variable", "It makes it visible everywhere", "It converts it to text"] },
                { question: "What is the value of x?", code: "int x = 7 / 2;", answer: "3", wrong: ["3.5", "4", "2"] },
            ],
            [
                { question: "What is the value of x?", code: "int x = (int) 9.99;", answer: "9", wrong: ["10", "9.99", "0"] },
                { question: "Which type should you use for decimal numbers like 3.14?", answer: "double", wrong: ["int", "decimal", "long"] },
            ],
            [
                { question: "What does this print?", code: "System.out.println(\"5\" + 3);", answer: "53", wrong: ["8", "15", "An error"] },
                { question: "What is the difference between int and Integer?", answer: "Integer is an object, int is a primitive", wrong: ["They are exactly the same", "int can be null", "Integer is faster"] },
            ],
        ],
        "Operators": [
            [
                { question: "What is the result of 3 + 4 * 2?", answer: "11", wrong: ["14", "24", "9"] },
                { question: "Which operator checks if two numbers are equal?", answer: "==", wrong: ["=", "=>", "!="] },
            ],
            [
                { question: "What is the result of 10 % 3?", answer: "1", wrong: ["3", "0", "3.3"] },
                { question: "What does x++ do?", answer: "Adds 1 to x", wrong: ["Doubles x", "Subtracts 1 from x", "Raises x to a power"] },
            ],
            [
                { question: "What is the result of true && false?", answer: "false", wrong: ["true", "null", "An error"] },
                { question: "What is the result of (3 > 1) || (2 > 5)?", answer: "true", wrong: ["false", "2", "An error"] },
            ],
            [
                { question: "What is the value of x?", code: "int x = 4;\nx += 3;", answer: "7", wrong: ["4", "3", "12"] },
                { question: "In a && b, when is b NOT evaluated?", answer: "When a is false", wrong: ["When a is true", "When b is false", "It is always evaluated"] },
            ],
            [
                { question: "What is the value of y?", code: "int y = (5 > 3) ? 10 : 20;", answer: "10", wrong: ["20", "5", "true"] },
                { question: "How do you compare the text inside two Strings a and b?", answer: "a.equals(b)", wrong: ["a == b", "a = b", "a.compare(b)"] },
            ],
        ],
        "Conditionals": [
            [
                { question: "Which keyword runs code only when a condition is true?", answer: "if", wrong: ["when", "case", "loop"] },
                { question: "When does the else block run?", answer: "When the if condition is false", wrong: ["When the if condition is true", "Always", "Never"] },
            ],
            [
                { question: "What does this print?", code: "int age = 18;\nif (age >= 18) {\n    System.out.println(\"Adult\");\n}", answer: "Adult", wrong: ["Nothing", "Minor", "An error"] },
                { question: "Which syntax is correct?", answer: "if (x > 5) { }", wrong: ["if x > 5 then { }", "if (x > 5) then", "if x > 5 { }"] },
            ],
            [
                { question: "Which statement chooses between many fixed values?", answer: "switch", wrong: ["choose", "select", "match"] },
                { question: "What does this print?", code: "int x = 10;\nif (x > 5) {\n    if (x > 8) {\n        System.out.println(\"Big\");\n    }\n}", answer: "Big", wrong: ["Nothing", "Small", "An error"] },
            ],
            [
                { question: "What happens in a classic switch case without break?", answer: "Execution falls through to the next case", wrong: ["The program crashes", "The switch exits", "Only the default runs"] },
                { question: "When does the default case of a switch run?", answer: "When no other case matches", wrong: ["Always first", "When there is an error", "When the value is zero"] },
            ],
            [
                { question: "What happens with this code?", code: "int x = 3;\nif (x = 5) {\n    System.out.println(\"Hi\");\n}", answer: "It does not compile", wrong: ["It prints Hi", "It prints nothing", "x stays 3"] },
                { question: "What does this print?", code: "String s = \"b\";\nswitch (s) {\n    case \"a\": System.out.println(1); break;\n    case \"b\": System.out.println(2); break;\n    default: System.out.println(3);\n}", answer: "2", wrong: ["1", "3", "Nothing"] },
            ],
        ],
        "Loops": [
            [
                { question: "Which loop repeats while a condition is true?", answer: "while", wrong: ["repeat", "until", "if"] },
                { question: "How many times does this print Hi?", code: "for (int i = 0; i < 3; i++) {\n    System.out.println(\"Hi\");\n}", answer: "3", wrong: ["2", "4", "Forever"] },
            ],
            [
                { question: "What does break do inside a loop?", answer: "Exits the loop immediately", wrong: ["Pauses the loop", "Restarts the loop", "Skips one iteration"] },
                { question: "What does continue do inside a loop?", answer: "Jumps to the next iteration", wrong: ["Exits the loop", "Repeats the same iteration", "Stops the program"] },
            ],
            [
                { question: "Which loop always runs its body at least once?", answer: "do-while", wrong: ["while", "for", "for-each"] },
                { question: "What is the value of sum?", code: "int sum = 0;\nfor (int i = 1; i <= 3; i++) {\n    sum += i;\n}", answer: "6", wrong: ["3", "5", "9"] },
            ],
            [
                { question: "Which of these creates an infinite loop?", answer: "while (true) { }", wrong: ["while (false) { }", "for (int i = 0; i < 10; i++) { }", "do { } while (false);"] },
                { question: "How many stars are printed?", code: "for (int i = 0; i < 2; i++) {\n    for (int j = 0; j < 3; j++) {\n        System.out.println(\"*\");\n    }\n}", answer: "6", wrong: ["5", "2", "3"] },
            ],
            [
                { question: "What is this kind of loop called?", code: "int[] nums = {1, 2, 3};\nfor (int n : nums) {\n    System.out.println(n);\n}", answer: "A for-each loop", wrong: ["A while loop", "A do-while loop", "An index loop"] },
                { question: "What numbers are printed?", code: "for (int i = 1; i <= 5; i += 2) {\n    System.out.println(i);\n}", answer: "1, 3, 5", wrong: ["1, 2, 3, 4, 5", "2, 4", "1, 3, 5, 7"] },
            ],
        ],
        "Methods": [
            [
                { question: "Which keyword means a method returns nothing?", answer: "void", wrong: ["null", "empty", "none"] },
                { question: "What is a method?", answer: "A named block of code you can call", wrong: ["A type of variable", "A loop that never ends", "A Java file"] },
            ],
            [
                { question: "How do you call a method named greet?", answer: "greet();", wrong: ["call greet;", "greet[];", "method greet();"] },
                { question: "What are the values a method receives called?", answer: "Parameters", wrong: ["Results", "Variables", "Returns"] },
            ],
            [
                { question: "What does return do?", answer: "Sends a value back and ends the method", wrong: ["Prints a value", "Repeats the method", "Deletes the method"] },
                { question: "What does twice(4) return?", code: "int twice(int n) {\n    return n * 2;\n}", answer: "8", wrong: ["4", "6", "16"] },
            ],
            [
                { question: "Can two methods in the same class have the same name?", answer: "Yes, if their parameters are different", wrong: ["No, never", "Yes, always", "Only if one is void"] },
                { question: "What does add(2, add(1, 1)) return?", code: "int add(int a, int b) {\n    return a + b;\n}", answer: "4", wrong: ["2", "3", "5"] },
            ],
            [
                { question: "What does static mean on a method?", answer: "It belongs to the class, not to an object", wrong: ["It cannot return anything", "It runs automatically", "It is private"] },
                { question: "Which is the correct main method?", answer: "public static void main(String[] args)", wrong: ["public void main(String[] args)", "static main(String args)", "public static int main()"] },
            ],
        ],
    },
};
