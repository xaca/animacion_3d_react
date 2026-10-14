import type { TopicContent } from "./types";

// C# coding fundamentals for beginners: variables to methods.
export const csharp: TopicContent = {
    id: "csharp",
    name: "C# Fundamentals",
    categories: {
        "Variables & Types": [
            [
                { question: "Which keyword declares a whole number in C#?", answer: "int", wrong: ["number", "integer", "num"] },
                { question: "Which type can only be true or false?", answer: "bool", wrong: ["boolean", "bit", "flag"] },
            ],
            [
                { question: "What is the type of \"Hello\" in C#?", answer: "string", wrong: ["char", "text", "word"] },
                { question: "Which keyword lets the compiler guess the type?", code: "var x = 5;", answer: "var", wrong: ["auto", "let", "dynamic"] },
            ],
            [
                { question: "What is the value of x?", code: "int x = 7 / 2;", answer: "3", wrong: ["3.5", "4", "2"] },
                { question: "Which type is best for money (exact decimals) in C#?", answer: "decimal", wrong: ["double", "float", "int"] },
            ],
            [
                { question: "What does this print?", code: "Console.WriteLine(\"5\" + 3);", answer: "53", wrong: ["8", "15", "An error"] },
                { question: "What is the value of x?", code: "int x = (int)9.99;", answer: "9", wrong: ["10", "9.99", "An error"] },
            ],
            [
                { question: "What does this declare?", code: "int? age = null;", answer: "A nullable int", wrong: ["An int with a question", "It does not compile", "An int equal to zero"] },
                { question: "Which is C# string interpolation?", answer: "$\"Hello {name}\"", wrong: ["\"Hello \" & name", "\"Hello %s\".format(name)", "'Hello ${name}'"] },
            ],
        ],
        "Operators": [
            [
                { question: "What is the result of 3 + 4 * 2?", answer: "11", wrong: ["14", "24", "9"] },
                { question: "Which operator checks if two values are equal?", answer: "==", wrong: ["=", "===", "equals"] },
            ],
            [
                { question: "What is the result of 10 % 3?", answer: "1", wrong: ["3", "0", "3.3"] },
                { question: "What does x++ do?", answer: "Adds 1 to x", wrong: ["Doubles x", "Subtracts 1 from x", "Squares x"] },
            ],
            [
                { question: "What is the result of true && false?", answer: "false", wrong: ["true", "null", "An error"] },
                { question: "What is the result of (3 > 1) || (2 > 5)?", answer: "true", wrong: ["false", "2", "An error"] },
            ],
            [
                { question: "What is the value of x?", code: "int x = 4;\nx += 3;", answer: "7", wrong: ["4", "3", "12"] },
                { question: "What is the value of y?", code: "int y = (5 > 3) ? 10 : 20;", answer: "10", wrong: ["20", "5", "true"] },
            ],
            [
                { question: "What does ?? do here?", code: "string n = name ?? \"Guest\";", answer: "Uses \"Guest\" when name is null", wrong: ["Compares the two strings", "Joins the two strings", "Throws if name is null"] },
                { question: "What is the result of 7 / 2.0?", answer: "3.5", wrong: ["3", "4", "An error"] },
            ],
        ],
        "Conditionals": [
            [
                { question: "Which keyword runs code only when a condition is true?", answer: "if", wrong: ["when", "case", "loop"] },
                { question: "When does the else block run?", answer: "When the if condition is false", wrong: ["When the if condition is true", "Always", "Never"] },
            ],
            [
                { question: "What does this print?", code: "int age = 18;\nif (age >= 18)\n{\n    Console.WriteLine(\"Adult\");\n}", answer: "Adult", wrong: ["Nothing", "Minor", "An error"] },
                { question: "Which syntax is correct?", answer: "if (x > 5) { }", wrong: ["if x > 5 then { }", "if (x > 5) then", "if x > 5 { }"] },
            ],
            [
                { question: "Which statement chooses between many fixed values?", answer: "switch", wrong: ["choose", "select", "match"] },
                { question: "What is \"else if\" used for?", answer: "Checking another condition when the first one is false", wrong: ["Repeating the if", "Ending the program", "Declaring a variable"] },
            ],
            [
                { question: "What happens in C# if a switch case has code but no break or return?", answer: "It does not compile", wrong: ["It falls through to the next case", "It skips the case", "It runs the default"] },
                { question: "What does this print?", code: "int x = 10;\nif (x > 5 && x < 8)\n    Console.WriteLine(\"A\");\nelse\n    Console.WriteLine(\"B\");", answer: "B", wrong: ["A", "AB", "Nothing"] },
            ],
            [
                { question: "What is s?", code: "int day = 2;\nstring s = day switch\n{\n    1 => \"Mon\",\n    2 => \"Tue\",\n    _ => \"Other\"\n};", answer: "Tue", wrong: ["Mon", "Other", "An error"] },
                { question: "What is r?", code: "int n = 0;\nstring r = n == 0 ? \"zero\" : \"not zero\";", answer: "zero", wrong: ["not zero", "0", "true"] },
            ],
        ],
        "Loops": [
            [
                { question: "Which loop repeats while a condition is true?", answer: "while", wrong: ["repeat", "until", "if"] },
                { question: "How many times does this print Hi?", code: "for (int i = 0; i < 3; i++)\n{\n    Console.WriteLine(\"Hi\");\n}", answer: "3", wrong: ["2", "4", "Forever"] },
            ],
            [
                { question: "What does break do inside a loop?", answer: "Exits the loop immediately", wrong: ["Pauses the loop", "Restarts the loop", "Skips one iteration"] },
                { question: "What does continue do inside a loop?", answer: "Skips to the next iteration", wrong: ["Exits the loop", "Restarts the program", "Stops the loop forever"] },
            ],
            [
                { question: "Which loop goes through every item in a collection?", answer: "foreach", wrong: ["forall", "each", "iterate"] },
                { question: "What does this print?", code: "int i = 0;\nwhile (i < 2)\n{\n    Console.Write(i);\n    i++;\n}", answer: "01", wrong: ["12", "012", "0"] },
            ],
            [
                { question: "How many times does a do-while loop run at minimum?", answer: "1", wrong: ["0", "2", "Depends on the condition"] },
                { question: "What does this print?", code: "for (int i = 1; i <= 10; i++)\n{\n    if (i % 2 == 0) continue;\n    Console.Write(i);\n}", answer: "13579", wrong: ["246810", "12345", "1357910"] },
            ],
            [
                { question: "What happens here?", code: "while (true)\n{\n    Console.WriteLine(\"Hi\");\n}", answer: "It prints Hi forever", wrong: ["It does not compile", "It prints Hi once", "It prints nothing"] },
                { question: "What is sum?", code: "int sum = 0;\nforeach (int n in new[] { 1, 2, 3 })\n{\n    sum += n;\n}", answer: "6", wrong: ["3", "123", "0"] },
            ],
        ],
        "Methods & Classes": [
            [
                { question: "Which keyword means a method returns nothing?", answer: "void", wrong: ["null", "empty", "none"] },
                { question: "What does static mean here?", code: "static void Main(string[] args)", answer: "It belongs to the class; no object is needed", wrong: ["It cannot change", "It runs forever", "It is private"] },
            ],
            [
                { question: "What does Add(2, 3) return?", code: "int Add(int a, int b)\n{\n    return a + b;\n}", answer: "5", wrong: ["23", "void", "An error"] },
                { question: "Which keyword creates an object?", answer: "new", wrong: ["create", "make", "object"] },
            ],
            [
                { question: "What is the entry point of a C# console app?", answer: "Main", wrong: ["Start", "Run", "Program"] },
                { question: "What is this?", code: "public int Age { get; set; }", answer: "A property to read and write a value", wrong: ["A method with no return", "A constant", "A loop variable"] },
            ],
            [
                { question: "What does public mean on a method?", answer: "Any class can call it", wrong: ["Only this class can call it", "Only subclasses can call it", "Only Main can call it"] },
                { question: "What is a constructor in C#?", answer: "A method with the class name that runs on new", wrong: ["A method named Init", "The Main method", "A static field"] },
            ],
            [
                { question: "What does out do here?", code: "int.TryParse(\"42\", out int n);", answer: "The method writes its result into n", wrong: ["Prints the result", "Makes n a constant", "Returns n to Main"] },
                { question: "What is the difference between a class and a struct in C#?", answer: "A class is a reference type, a struct is a value type", wrong: ["Structs cannot have methods", "Classes cannot have fields", "They are identical"] },
            ],
        ],
    },
};
