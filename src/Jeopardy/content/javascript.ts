import type { TopicContent } from "./types";

// JavaScript fundamentals for beginners: variables, functions, arrays and objects.
export const javascript: TopicContent = {
    id: "javascript",
    name: "JavaScript Fundamentals",
    categories: {
        "Variables & Types": [
            [
                { question: "Which keyword declares a variable that can change?", answer: "let", wrong: ["const", "int", "define"] },
                { question: "Which keyword declares a constant?", answer: "const", wrong: ["let", "final", "static"] },
            ],
            [
                { question: "What is typeof \"Hello\"?", answer: "string", wrong: ["text", "char", "word"] },
                { question: "What is typeof 42?", answer: "number", wrong: ["int", "integer", "float"] },
            ],
            [
                { question: "What is the result of 7 / 2 in JavaScript?", answer: "3.5", wrong: ["3", "4", "An error"] },
                { question: "What is typeof true?", answer: "boolean", wrong: ["bool", "bit", "truth"] },
            ],
            [
                { question: "What does this print?", code: "console.log(\"5\" + 3);", answer: "53", wrong: ["8", "15", "An error"] },
                { question: "What is the difference between null and undefined?", answer: "undefined: no value assigned yet; null: intentionally empty", wrong: ["They are the same", "null is a number", "undefined is a string"] },
            ],
            [
                { question: "What does this print?", code: "console.log(\"5\" - 3);", answer: "2", wrong: ["53", "NaN", "An error"] },
                { question: "What does this print?", code: "let x;\nconsole.log(typeof x);", answer: "undefined", wrong: ["null", "number", "object"] },
            ],
        ],
        "Operators & Comparisons": [
            [
                { question: "What is the result of 3 + 4 * 2?", answer: "11", wrong: ["14", "24", "9"] },
                { question: "What is the result of 10 % 3?", answer: "1", wrong: ["3", "0", "3.3"] },
            ],
            [
                { question: "Which operator checks value AND type?", answer: "===", wrong: ["==", "=", "equals"] },
                { question: "What is the result of \"5\" == 5?", answer: "true", wrong: ["false", "undefined", "An error"] },
            ],
            [
                { question: "What is the result of \"5\" === 5?", answer: "false", wrong: ["true", "undefined", "An error"] },
                { question: "What is the result of !true?", answer: "false", wrong: ["true", "null", "0"] },
            ],
            [
                { question: "What does this print?", code: "let a = 4;\na += 3;\nconsole.log(a);", answer: "7", wrong: ["4", "43", "12"] },
                { question: "What is the result of (3 > 1) && (2 > 5)?", answer: "false", wrong: ["true", "2", "undefined"] },
            ],
            [
                { question: "What is y?", code: "let y = 5 > 3 ? \"yes\" : \"no\";", answer: "yes", wrong: ["no", "true", "5"] },
                { question: "What is the result of null ?? \"default\"?", answer: "\"default\"", wrong: ["null", "undefined", "An error"] },
            ],
        ],
        "Functions": [
            [
                { question: "Which keyword defines a function?", answer: "function", wrong: ["def", "func", "method"] },
                { question: "What does return do?", answer: "Sends a value back and ends the function", wrong: ["Prints a value", "Repeats the function", "Declares a variable"] },
            ],
            [
                { question: "What does this print?", code: "function greet(name) {\n  return \"Hi \" + name;\n}\nconsole.log(greet(\"Ana\"));", answer: "Hi Ana", wrong: ["Hi name", "greet", "undefined"] },
                { question: "What are a and b called here?", code: "function add(a, b) { }", answer: "Parameters", wrong: ["Variables", "Returns", "Methods"] },
            ],
            [
                { question: "What is this syntax?", code: "const sq = (x) => x * x;", answer: "An arrow function", wrong: ["A comparison", "An array", "An object"] },
                { question: "What does a function return if it has no return statement?", answer: "undefined", wrong: ["null", "0", "An empty string"] },
            ],
            [
                { question: "What does this print?", code: "const sq = (x) => x * x;\nconsole.log(sq(4));", answer: "16", wrong: ["8", "44", "undefined"] },
                { question: "What is a callback?", answer: "A function passed to another function to be called later", wrong: ["A function that calls itself", "A function with no parameters", "A function that returns a number"] },
            ],
            [
                { question: "What does this print?", code: "let n = 1;\nfunction inc() { n++; }\ninc();\ninc();\nconsole.log(n);", answer: "3", wrong: ["1", "2", "undefined"] },
                { question: "What is a closure?", answer: "A function that remembers the variables of the scope where it was created", wrong: ["A function with no name", "A closed loop", "A function that returns nothing"] },
            ],
        ],
        "Arrays": [
            [
                { question: "How do you create an empty array?", answer: "[]", wrong: ["{}", "()", "<>"] },
                { question: "What is the index of the first element?", answer: "0", wrong: ["1", "-1", "first"] },
            ],
            [
                { question: "What does arr.length give?", answer: "The number of elements", wrong: ["The last element", "The first element", "The largest value"] },
                { question: "Which method adds an element to the end?", answer: "push", wrong: ["add", "append", "insert"] },
            ],
            [
                { question: "What does this print?", code: "const a = [10, 20, 30];\nconsole.log(a[1]);", answer: "20", wrong: ["10", "30", "undefined"] },
                { question: "Which method removes the last element?", answer: "pop", wrong: ["shift", "remove", "delete"] },
            ],
            [
                { question: "What does map do?", answer: "Creates a new array by transforming each element", wrong: ["Sorts the array", "Removes elements", "Joins the elements into a string"] },
                { question: "What does this print?", code: "const a = [1, 2, 3];\nconsole.log(a.map((x) => x * 2));", answer: "[2, 4, 6]", wrong: ["[1, 2, 3]", "12", "[2, 4, 6, 2, 4, 6]"] },
            ],
            [
                { question: "What does this print?", code: "const a = [1, 2, 3, 4];\nconsole.log(a.filter((x) => x % 2 === 0));", answer: "[2, 4]", wrong: ["[1, 3]", "[true, false, true, false]", "2"] },
                { question: "What does reduce do?", answer: "Combines all elements into a single value", wrong: ["Removes duplicates", "Shortens the array by one", "Reverses the array"] },
            ],
        ],
        "Objects & JSON": [
            [
                { question: "How do you create an empty object?", answer: "{}", wrong: ["[]", "()", "new Array()"] },
                { question: "Which is the key and which is the value?", code: "const p = { name: \"Ana\" };", answer: "name is the key, \"Ana\" is the value", wrong: ["\"Ana\" is the key, name is the value", "Both are keys", "p is the key"] },
            ],
            [
                { question: "How do you read the name?", code: "const p = { name: \"Ana\", age: 20 };", answer: "p.name", wrong: ["p->name", "p[name]", "p::name"] },
                { question: "What does JSON stand for?", answer: "JavaScript Object Notation", wrong: ["Java Standard Object Name", "JavaScript Online Network", "Just Simple Object Nodes"] },
            ],
            [
                { question: "What does this print?", code: "const p = { name: \"Ana\" };\np.age = 20;\nconsole.log(p.age);", answer: "20", wrong: ["undefined", "An error", "name"] },
                { question: "Which function converts an object to a JSON string?", answer: "JSON.stringify", wrong: ["JSON.parse", "JSON.toString", "Object.toJSON"] },
            ],
            [
                { question: "Which function converts a JSON string into an object?", answer: "JSON.parse", wrong: ["JSON.stringify", "JSON.read", "Object.parse"] },
                { question: "What does this print?", code: "const p = { name: \"Ana\" };\nconsole.log(p.email);", answer: "undefined", wrong: ["null", "An error", "\"\""] },
            ],
            [
                { question: "What is this syntax?", code: "const { name, age } = person;", answer: "Object destructuring", wrong: ["A comparison", "Creating a class", "An array"] },
                { question: "What does this print?", code: "const a = { x: 1 };\nconst b = a;\nb.x = 2;\nconsole.log(a.x);", answer: "2", wrong: ["1", "undefined", "An error"] },
            ],
        ],
    },
};
