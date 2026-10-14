import type { TopicContent } from "./types";

// C# fundamentals for beginners. Category names start with "C#" so a board can't be
// mistaken for Java; questions use C#-only syntax ($"", var, properties, List<T>, ??).
export const csharp: TopicContent = {
    id: "csharp",
    name: "C# Fundamentals",
    categories: {
        "C# Types & var": [
            [
                { question: "Which C# type stores a whole number?", answer: "int", wrong: ["number", "integer", "num"] },
                { question: "Which C# type can only be true or false?", answer: "bool", wrong: ["boolean", "bit", "flag"] },
                { question: "Which C# type is written in lowercase for text?", answer: "string", wrong: ["text", "char", "str"] },
            ],
            [
                { question: "What does var do here?", code: "var count = 5;", answer: "The compiler infers the type (int)", wrong: ["count can hold any type later", "It makes count a constant", "It makes count a string"] },
                { question: "Which C# type is best for money?", answer: "decimal", wrong: ["double", "float", "int"] },
                { question: "Which keyword declares a C# constant?", answer: "const", wrong: ["final", "let", "static"] },
            ],
            [
                { question: "What is the value of x?", code: "int x = 7 / 2;", answer: "3", wrong: ["3.5", "4", "2"] },
                { question: "What is the value of x?", code: "int x = (int)9.99;", answer: "9", wrong: ["10", "9.99", "An error"] },
                { question: "What happens here?", code: "var x = 5;\nx = \"hello\";", answer: "It does not compile: x is an int", wrong: ["x becomes \"hello\"", "x becomes 0", "It crashes when it runs"] },
            ],
            [
                { question: "What does this declare?", code: "int? age = null;", answer: "A nullable int", wrong: ["An int with a question", "It does not compile", "An int equal to 0"] },
                { question: "Which method converts the text \"42\" to an int in C#?", answer: "int.Parse(\"42\")", wrong: ["Integer.parseInt(\"42\")", "parseInt(\"42\")", "(int)\"42\""] },
                { question: "Which suffix turns 9.99 into a decimal literal in C#?", answer: "m (9.99m)", wrong: ["d (9.99d)", "f (9.99f)", "L (9.99L)"] },
            ],
            [
                { question: "What does ?? do here?", code: "string name = input ?? \"Guest\";", answer: "Uses \"Guest\" when input is null", wrong: ["Compares the two strings", "Joins the two strings", "Throws if input is null"] },
                { question: "What is int in C# really?", answer: "An alias for System.Int32", wrong: ["A class you must create with new", "A 64-bit number", "An alias for System.Number"] },
                { question: "What does TryParse return when the text is not a number?", code: "bool ok = int.TryParse(\"abc\", out int n);", answer: "false, and n is 0", wrong: ["It throws an exception", "true, and n is 0", "false, and n is null"] },
            ],
        ],
        "C# Strings": [
            [
                { question: "Which C# method prints text and moves to a new line?", answer: "Console.WriteLine", wrong: ["System.out.println", "console.log", "print"] },
                { question: "Which method reads a line typed by the user in a C# console app?", answer: "Console.ReadLine()", wrong: ["Console.Input()", "Scanner.nextLine()", "input()"] },
                { question: "Which property gives the number of characters of a C# string s?", answer: "s.Length", wrong: ["s.length()", "s.Size", "s.Count()"] },
            ],
            [
                { question: "Which is C# string interpolation?", answer: "$\"Hello {name}\"", wrong: ["`Hello ${name}`", "\"Hello %s\"", "f\"Hello {name}\""] },
                { question: "What does this print?", code: "Console.WriteLine(\"csharp\".StartsWith(\"cs\"));", answer: "True", wrong: ["False", "cs", "An error"] },
                { question: "What does this print?", code: "int age = 20;\nConsole.WriteLine($\"Age: {age + 1}\");", answer: "Age: 21", wrong: ["Age: {age + 1}", "Age: 201", "Age: age + 1"] },
            ],
            [
                { question: "What does this print?", code: "Console.WriteLine(\"Hello World\".Substring(6));", answer: "World", wrong: ["Hello", "Hello W", "o World"] },
                { question: "What does this print?", code: "Console.WriteLine(\"banana\".Contains(\"nan\"));", answer: "True", wrong: ["False", "2", "nan"] },
                { question: "What does this print?", code: "Console.WriteLine(\"a-b-c\".Replace(\"-\", \"\"));", answer: "abc", wrong: ["a-b-c", "a b c", "-"] },
            ],
            [
                { question: "Which check is true for both null and \"\"?", answer: "string.IsNullOrEmpty(s)", wrong: ["s == null", "s.Length == 0", "s.IsEmpty()"] },
                { question: "What does this print?", code: "string[] parts = \"a,b,c\".Split(',');\nConsole.WriteLine(parts.Length);", answer: "3", wrong: ["5", "2", "1"] },
                { question: "What does the @ do here?", code: "string path = @\"C:\\files\\new\";", answer: "Makes a verbatim string: backslashes are not escapes", wrong: ["Makes the string read-only", "Interpolates variables", "It is an error"] },
            ],
            [
                { question: "Why use StringBuilder in a loop that adds text many times?", answer: "Strings are immutable, so += creates a new string each time", wrong: ["+= does not work in loops", "StringBuilder prints faster", "Strings have a maximum length of 100"] },
                { question: "What does this print?", code: "string s = \"abc\";\ns.Replace(\"a\", \"x\");\nConsole.WriteLine(s);", answer: "abc", wrong: ["xbc", "x", "An error"] },
                { question: "What does this print?", code: "string a = \"hi\";\nstring b = \"h\" + \"i\";\nConsole.WriteLine(a == b);", answer: "True", wrong: ["False", "An error", "hi"] },
            ],
        ],
        "C# Conditions & switch": [
            [
                { question: "Which syntax is correct in C#?", answer: "if (x > 5) { }", wrong: ["if x > 5 then { }", "if (x > 5) then", "if x > 5: "] },
                { question: "Which operator means AND in a C# condition?", answer: "&&", wrong: ["and", "&", "++"] },
                { question: "Which operator means NOT EQUAL in C#?", answer: "!=", wrong: ["<>", "=!", "not"] },
            ],
            [
                { question: "What does this print?", code: "int x = 10;\nif (x > 5 && x < 8)\n    Console.WriteLine(\"A\");\nelse\n    Console.WriteLine(\"B\");", answer: "B", wrong: ["A", "AB", "Nothing"] },
                { question: "What is r?", code: "int n = 0;\nstring r = n == 0 ? \"zero\" : \"other\";", answer: "zero", wrong: ["other", "0", "true"] },
                { question: "Which statement chooses between many fixed values?", answer: "switch", wrong: ["select", "choose", "match"] },
            ],
            [
                { question: "What happens in C# if a switch case has code but no break?", answer: "It does not compile", wrong: ["It falls through to the next case", "It skips the case", "It runs default"] },
                { question: "What does this print?", code: "string role = \"admin\";\nif (role == \"Admin\") Console.WriteLine(\"Yes\");\nelse Console.WriteLine(\"No\");", answer: "No", wrong: ["Yes", "An error", "Nothing"] },
                { question: "When does the default case of a switch run?", answer: "When no other case matches", wrong: ["Always first", "When there is an error", "When the value is 0"] },
            ],
            [
                { question: "What is s?", code: "int day = 2;\nstring s = day switch\n{\n    1 => \"Mon\",\n    2 => \"Tue\",\n    _ => \"Other\"\n};", answer: "Tue", wrong: ["Mon", "Other", "It does not compile"] },
                { question: "In a C# switch expression, what does _ mean?", answer: "Any other value (the default)", wrong: ["An empty string", "Zero", "A variable named _"] },
                { question: "What does this print?", code: "int? n = null;\nConsole.WriteLine(n.HasValue);", answer: "False", wrong: ["True", "null", "An error"] },
            ],
            [
                { question: "What is grade?", code: "int score = 85;\nstring grade = score switch\n{\n    >= 90 => \"A\",\n    >= 80 => \"B\",\n    _ => \"C\"\n};", answer: "B", wrong: ["A", "C", "It does not compile"] },
                { question: "What does this pattern check?", code: "if (obj is string text) { }", answer: "Whether obj is a string, and stores it in text", wrong: ["Whether obj equals the word \"text\"", "Converts obj to a string always", "It does not compile"] },
                { question: "What does ?. do here?", code: "int? len = name?.Length;", answer: "Returns null instead of crashing when name is null", wrong: ["Checks if Length is positive", "Makes name nullable", "Throws when name is null"] },
            ],
        ],
        "C# Collections & Loops": [
            [
                { question: "Which loop goes through every item of a C# collection?", answer: "foreach", wrong: ["forall", "for each", "loop"] },
                { question: "How many times does this print Hi?", code: "for (int i = 0; i < 3; i++)\n{\n    Console.WriteLine(\"Hi\");\n}", answer: "3", wrong: ["2", "4", "Forever"] },
                { question: "Which C# collection is a list that can grow?", answer: "List<T>", wrong: ["ArrayList<T>", "Array<T>", "Vector<T>"] },
            ],
            [
                { question: "Which method adds an item to a C# List?", answer: "Add", wrong: ["Push", "Append", "Put"] },
                { question: "How do you get the number of items in a C# List list?", answer: "list.Count", wrong: ["list.Length", "list.Size()", "list.Items"] },
                { question: "What is sum?", code: "int sum = 0;\nforeach (int n in new[] { 1, 2, 3 })\n{\n    sum += n;\n}", answer: "6", wrong: ["3", "123", "0"] },
            ],
            [
                { question: "What does this print?", code: "var names = new List<string> { \"Ana\", \"Ben\" };\nConsole.WriteLine(names[1]);", answer: "Ben", wrong: ["Ana", "An error", "2"] },
                { question: "How many times does a do-while loop run at least?", answer: "1", wrong: ["0", "2", "It depends"] },
                { question: "How do you get the size of a C# array arr?", answer: "arr.Length", wrong: ["arr.Count", "arr.Size()", "arr.length()"] },
            ],
            [
                { question: "Which C# collection stores key-value pairs?", answer: "Dictionary<TKey, TValue>", wrong: ["List<TKey, TValue>", "Map<TKey, TValue>", "Pair<TKey, TValue>"] },
                { question: "What does this print?", code: "var ages = new Dictionary<string, int>();\nages[\"Ana\"] = 20;\nConsole.WriteLine(ages[\"Ana\"]);", answer: "20", wrong: ["Ana", "An error", "0"] },
                { question: "What does this print?", code: "var l = new List<int> { 1, 2, 3 };\nl.Remove(2);\nConsole.WriteLine(l.Count);", answer: "2", wrong: ["3", "1", "An error"] },
            ],
            [
                { question: "What does this LINQ query return?", code: "var even = numbers.Where(n => n % 2 == 0);", answer: "Only the even numbers", wrong: ["Only the odd numbers", "true or false", "The first even number"] },
                { question: "What happens if you Add to a List inside a foreach over that same List?", answer: "InvalidOperationException: the collection was modified", wrong: ["The new item is skipped", "The loop restarts", "Nothing special"] },
                { question: "What does this print?", code: "var l = new List<int> { 3, 1, 2 };\nl.Sort();\nConsole.WriteLine(string.Join(\",\", l));", answer: "1,2,3", wrong: ["3,1,2", "3,2,1", "An error"] },
            ],
        ],
        "C# Methods & Properties": [
            [
                { question: "What is the entry point of a C# console app?", answer: "Main", wrong: ["Start", "Run", "Program"] },
                { question: "Which keyword means a C# method returns nothing?", answer: "void", wrong: ["null", "none", "empty"] },
                { question: "Which keyword creates a new object in C#?", answer: "new", wrong: ["create", "make", "init"] },
            ],
            [
                { question: "What does Add(2, 3) return?", code: "int Add(int a, int b)\n{\n    return a + b;\n}", answer: "5", wrong: ["23", "void", "An error"] },
                { question: "What is this?", code: "public string Name { get; set; }", answer: "An auto-property to read and write a value", wrong: ["A method with no return", "A constant", "A constructor"] },
                { question: "C# method names are usually written in…", answer: "PascalCase (CalculateTotal)", wrong: ["camelCase (calculateTotal)", "snake_case (calculate_total)", "UPPERCASE (CALCULATETOTAL)"] },
            ],
            [
                { question: "What is a constructor in C#?", answer: "A method with the class's name that runs on new", wrong: ["A method named Init", "The Main method", "A static field"] },
                { question: "What does this property allow?", code: "public int Age { get; private set; }", answer: "Anyone can read Age; only the class can change it", wrong: ["Nobody can read Age", "Anyone can change Age", "Age is a constant"] },
                { question: "Which syntax makes a C# class inherit from Animal?", answer: "class Dog : Animal", wrong: ["class Dog extends Animal", "class Dog inherits Animal", "class Dog(Animal)"] },
            ],
            [
                { question: "What does Greet() return?", code: "string Greet(string name = \"friend\") => $\"Hi {name}\";", answer: "Hi friend", wrong: ["Hi name", "Hi ", "It does not compile"] },
                { question: "Which keywords let a C# method be overridden in a subclass?", answer: "virtual in the parent, override in the child", wrong: ["override in both", "@Override in the child", "abstract in the child"] },
                { question: "What does out do here?", code: "int.TryParse(\"42\", out int n);", answer: "The method writes its result into n", wrong: ["Prints the result", "Makes n a constant", "Returns n to Main"] },
            ],
            [
                { question: "What is the difference between a class and a struct in C#?", answer: "A class is a reference type, a struct is a value type", wrong: ["Structs cannot have methods", "Classes cannot have fields", "They are identical"] },
                { question: "What does this print?", code: "class Box { public int V; }\nvar a = new Box { V = 1 };\nvar b = a;\nb.V = 5;\nConsole.WriteLine(a.V);", answer: "5", wrong: ["1", "0", "An error"] },
                { question: "What is a record in C# 9+?", answer: "A type built for data, with value-based equality", wrong: ["A database table", "A list of logs", "A struct that cannot have properties"] },
            ],
        ],
    },
};
