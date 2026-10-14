import type { TopicContent } from "./types";

// JavaScript fundamentals for beginners. Category names are JavaScript-specific so a
// board can't be mistaken for Java or C#; questions use JS-only behavior and APIs.
export const javascript: TopicContent = {
    id: "javascript",
    name: "JavaScript Fundamentals",
    categories: {
        "let, const & typeof": [
            [
                { question: "Which keyword declares a JavaScript variable that can change?", answer: "let", wrong: ["const", "int", "define"] },
                { question: "Which keyword declares a JavaScript constant?", answer: "const", wrong: ["let", "final", "static"] },
                { question: "What is typeof \"Hello\"?", answer: "\"string\"", wrong: ["\"text\"", "\"char\"", "\"word\""] },
            ],
            [
                { question: "What is typeof 42?", answer: "\"number\"", wrong: ["\"int\"", "\"integer\"", "\"float\""] },
                { question: "What is the result of 7 / 2 in JavaScript?", answer: "3.5", wrong: ["3", "4", "An error"] },
                { question: "What happens here?", code: "const x = 1;\nx = 2;", answer: "TypeError: assignment to constant variable", wrong: ["SyntaxError: const cannot be reassigned twice", "x stays 1 silently", "x becomes undefined"] },
            ],
            [
                { question: "What does this print?", code: "let x;\nconsole.log(x);", answer: "undefined", wrong: ["null", "0", "An error"] },
                { question: "What is typeof true?", answer: "\"boolean\"", wrong: ["\"bool\"", "\"bit\"", "\"true\""] },
                { question: "What is typeof [1, 2, 3]?", answer: "\"object\"", wrong: ["\"array\"", "\"list\"", "\"number\""] },
            ],
            [
                { question: "What does this print?", code: "console.log(\"5\" + 3);", answer: "53", wrong: ["8", "15", "An error"] },
                { question: "What does this print?", code: "console.log(\"5\" - 3);", answer: "2", wrong: ["53", "NaN", "An error"] },
                { question: "What is typeof null?", answer: "\"object\" (a famous old bug)", wrong: ["\"null\"", "\"undefined\"", "\"number\" (null is stored as zero)"] },
            ],
            [
                { question: "What does this print?", code: "console.log(0.1 + 0.2 === 0.3);", answer: "false", wrong: ["true", "undefined", "An error"] },
                { question: "What does this print?", code: "console.log(Number(\"abc\"));", answer: "NaN", wrong: ["0", "undefined", "An error"] },
                { question: "What does this print?", code: "if (true) {\n  let a = 1;\n}\nconsole.log(typeof a);", answer: "\"undefined\"", wrong: ["\"number\"", "1", "\"object\""] },
            ],
        ],
        "JS Strings & Templates": [
            [
                { question: "Which function prints to the browser console?", answer: "console.log", wrong: ["System.out.println", "Console.WriteLine", "print"] },
                { question: "Which quotes make a template literal?", answer: "Backticks `…`", wrong: ["Double quotes \"…\"", "Single quotes '…'", "Brackets […]"] },
                { question: "How do you get the number of characters of a string s?", answer: "s.length", wrong: ["s.length()", "s.size()", "s.count"] },
            ],
            [
                { question: "What does this print?", code: "const name = \"Ana\";\nconsole.log(`Hi ${name}!`);", answer: "Hi Ana!", wrong: ["Hi ${name}!", "Hi name!", "An error"] },
                { question: "What does this print?", code: "console.log(\"hello\".at(-1));", answer: "o", wrong: ["h", "undefined", "An error"] },
                { question: "What does this print?", code: "console.log(\"Hello\"[0]);", answer: "H", wrong: ["e", "Hello", "undefined"] },
            ],
            [
                { question: "What does this print?", code: "console.log(\"a,b,c\".split(\",\"));", answer: "[\"a\", \"b\", \"c\"]", wrong: ["\"abc\"", "[\"a\", \"b,c\"]", "[\"a,b,c\"]"] },
                { question: "What does this print?", code: "console.log(\"banana\".includes(\"nan\"));", answer: "true", wrong: ["false", "2", "\"nan\""] },
                { question: "What does this print?", code: "console.log(`2 + 3 = ${2 + 3}`);", answer: "2 + 3 = 5", wrong: ["2 + 3 = 2 + 3", "5 = 5", "2 + 3 = ${2 + 3}"] },
            ],
            [
                { question: "What does this print?", code: "console.log(\"  hi  \".trim().length);", answer: "2", wrong: ["6", "4", "0"] },
                { question: "What does this print?", code: "console.log(\"Hello World\".slice(6));", answer: "World", wrong: ["Hello", "Hello W", "o World"] },
                { question: "What does this print?", code: "console.log([\"a\", \"b\"].join(\"-\"));", answer: "a-b", wrong: ["ab", "[a-b]", "a,b"] },
            ],
            [
                { question: "What does this print?", code: "console.log(\"5\" == 5, \"5\" === 5);", answer: "true false", wrong: ["true true", "false false", "false true"] },
                { question: "What does this print?", code: "console.log(\"10\" < \"9\");", answer: "true (strings compare letter by letter)", wrong: ["false (numbers are compared as numbers)", "An error", "NaN"] },
                { question: "What does this print?", code: "console.log(\"ha\".repeat(3));", answer: "hahaha", wrong: ["ha3", "ha ha ha", "An error"] },
            ],
        ],
        "JS Functions": [
            [
                { question: "Which keyword defines a function in JavaScript?", answer: "function", wrong: ["def", "func", "method"] },
                { question: "What does return do?", answer: "Sends a value back and ends the function", wrong: ["Pauses the function until it is called again", "Repeats the function", "Declares a variable"] },
                { question: "What are a and b called here?", code: "function add(a, b) { }", answer: "Parameters", wrong: ["Returns", "Methods", "Properties"] },
            ],
            [
                { question: "What does this print?", code: "function greet(name) {\n  return \"Hi \" + name;\n}\nconsole.log(greet(\"Ana\"));", answer: "Hi Ana", wrong: ["Hi name", "greet", "undefined"] },
                { question: "What is this syntax?", code: "const sq = (x) => x * x;", answer: "An arrow function", wrong: ["A comparison", "An array", "An object"] },
                { question: "What does a function return if it has no return?", answer: "undefined", wrong: ["null", "0", "An empty string"] },
            ],
            [
                { question: "What does this print?", code: "const sq = (x) => x * x;\nconsole.log(sq(4));", answer: "16", wrong: ["8", "44", "undefined"] },
                { question: "What does this print?", code: "function hi(name = \"friend\") {\n  return `Hi ${name}`;\n}\nconsole.log(hi());", answer: "Hi friend", wrong: ["Hi undefined", "Hi ", "An error"] },
                { question: "What is a callback?", answer: "A function passed to another function to be called later", wrong: ["A function that calls itself", "A function with no parameters", "A function that returns another function immediately"] },
            ],
            [
                { question: "What does this print?", code: "let n = 1;\nfunction inc() { n++; }\ninc();\ninc();\nconsole.log(n);", answer: "3", wrong: ["1", "2", "undefined"] },
                { question: "What does this print after about 1 second?", code: "setTimeout(() => console.log(\"B\"), 1000);\nconsole.log(\"A\");", answer: "A then B", wrong: ["B then A", "Only B", "Only A"] },
                { question: "What does this print?", code: "console.log(add(2, 3));\nfunction add(a, b) { return a + b; }", answer: "5 (function declarations are hoisted)", wrong: ["An error: add is not defined", "undefined", "23"] },
            ],
            [
                { question: "What is a closure?", answer: "A function that remembers the variables of the place where it was created", wrong: ["A function that copies all global variables into itself when called", "A function that closes the browser", "A function that returns nothing"] },
                { question: "What does await do?", code: "const res = await fetch(url);", answer: "Waits for the Promise to finish and gives its result", wrong: ["Stops the whole browser", "Turns the Promise into a loop that never blocks", "Cancels the request"] },
                { question: "What does this print?", code: "const counter = () => {\n  let c = 0;\n  return () => ++c;\n};\nconst next = counter();\nnext();\nconsole.log(next());", answer: "2", wrong: ["1", "0", "undefined"] },
            ],
        ],
        "JS Arrays": [
            [
                { question: "How do you create an empty array in JavaScript?", answer: "[]", wrong: ["{}", "()", "new List()"] },
                { question: "What is the index of the first element?", answer: "0", wrong: ["1", "-1", "first"] },
                { question: "Which method adds an element to the end of an array?", answer: "push", wrong: ["add", "append", "insert"] },
            ],
            [
                { question: "What does this print?", code: "const a = [10, 20, 30];\nconsole.log(a[1]);", answer: "20", wrong: ["10", "30", "undefined"] },
                { question: "Which method removes the last element?", answer: "pop", wrong: ["shift", "remove", "delete"] },
                { question: "What does this print?", code: "const a = [1, 2, 3];\nconsole.log(a[5]);", answer: "undefined", wrong: ["An error", "null", "3"] },
            ],
            [
                { question: "What does map do?", answer: "Creates a new array by transforming each element", wrong: ["Sorts the array", "Removes elements", "Changes each element of the original array in place"] },
                { question: "What does this print?", code: "console.log([1, 2, 3].map((x) => x * 2));", answer: "[2, 4, 6]", wrong: ["[1, 2, 3]", "12", "[2, 4, 6, 2, 4, 6]"] },
                { question: "What does this print?", code: "console.log([1, 2, 3, 4].filter((x) => x % 2 === 0));", answer: "[2, 4]", wrong: ["[1, 3]", "[true, false, true, false]", "2"] },
            ],
            [
                { question: "What does this print?", code: "console.log([1, 2, 3].includes(2));", answer: "true", wrong: ["false", "1", "2"] },
                { question: "What does this print?", code: "console.log([5, 8, 12].find((x) => x > 6));", answer: "8", wrong: ["[8, 12]", "12", "true"] },
                { question: "What does reduce do?", code: "[1, 2, 3].reduce((sum, x) => sum + x, 0)", answer: "Combines all elements into one value (here 6)", wrong: ["Builds a new array with one element removed (here [2, 3])", "Shortens the array by one", "Reverses the array"] },
            ],
            [
                { question: "What does this print?", code: "console.log([10, 9, 1].sort());", answer: "[1, 10, 9] (sorted as text)", wrong: ["[1, 9, 10]", "[10, 9, 1]", "[9, 10, 1] (sorted in reverse)"] },
                { question: "What does this print?", code: "const a = [1, 2];\nconst b = [...a, 3];\nconsole.log(b);", answer: "[1, 2, 3]", wrong: ["[[1, 2], 3]", "[1, 2]", "An error"] },
                { question: "What does this print?", code: "const a = [1, 2];\nconst b = a;\nb.push(3);\nconsole.log(a.length);", answer: "3", wrong: ["2", "1", "undefined"] },
            ],
        ],
        "JS Objects & DOM": [
            [
                { question: "How do you create an empty object in JavaScript?", answer: "{}", wrong: ["[]", "()", "new Object[]"] },
                { question: "How do you read the name?", code: "const p = { name: \"Ana\", age: 20 };", answer: "p.name", wrong: ["p->name", "p::name", "p(name)"] },
                { question: "What does DOM stand for?", answer: "Document Object Model", wrong: ["Data Object Manager", "Digital Output Mode", "Document Order Map"] },
            ],
            [
                { question: "Which method finds the first element matching a CSS selector?", answer: "document.querySelector", wrong: ["document.find", "document.getCss", "document.select"] },
                { question: "What does this print?", code: "const p = { name: \"Ana\" };\nconsole.log(p.email);", answer: "undefined", wrong: ["null", "An error", "\"\""] },
                { question: "What does JSON stand for?", answer: "JavaScript Object Notation", wrong: ["Java Standard Object Name", "JavaScript Online Network", "Just Simple Object Nodes"] },
            ],
            [
                { question: "Which method runs a function when a button is clicked?", code: "button.___(\"click\", handleClick);", answer: "addEventListener", wrong: ["onClick", "listen", "attachClick"] },
                { question: "Which property changes the text inside an element?", answer: "textContent", wrong: ["innerText()", "value()", "text"] },
                { question: "Which function turns a JSON string into an object?", answer: "JSON.parse", wrong: ["JSON.stringify", "JSON.read", "Object.parse"] },
            ],
            [
                { question: "What is this syntax?", code: "const { name, age } = person;", answer: "Object destructuring", wrong: ["A comparison", "Creating a class", "An array"] },
                { question: "Which function turns an object into a JSON string?", answer: "JSON.stringify", wrong: ["JSON.parse", "JSON.toString", "Object.toJSON"] },
                { question: "What does this print?", code: "const p = { a: 1, b: 2 };\nconsole.log(Object.keys(p));", answer: "[\"a\", \"b\"]", wrong: ["[1, 2]", "2", "{ a, b }"] },
            ],
            [
                { question: "What does this print?", code: "const a = { x: 1 };\nconst b = a;\nb.x = 2;\nconsole.log(a.x);", answer: "2", wrong: ["1", "undefined", "An error"] },
                { question: "What does this print?", code: "const user = null;\nconsole.log(user?.name);", answer: "undefined", wrong: ["An error", "null", "\"\""] },
                { question: "Why add event.preventDefault() in a form's submit handler?", answer: "To stop the page from reloading", wrong: ["To send the form faster", "To clear the form", "To validate the email"] },
            ],
        ],
    },
};
