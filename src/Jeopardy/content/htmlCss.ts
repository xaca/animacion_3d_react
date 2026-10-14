import type { TopicContent } from "./types";

// HTML and CSS basics: tags, selectors, colors and layout.
export const htmlCss: TopicContent = {
    id: "html-css",
    name: "HTML & CSS",
    categories: {
        "HTML Basics": [
            [
                { question: "What does HTML stand for?", answer: "HyperText Markup Language", wrong: ["High Tech Modern Language", "Home Tool Markup Language", "HyperText Machine Logic"] },
                { question: "Which tag is the root of an HTML page?", answer: "<html>", wrong: ["<body>", "<root>", "<page>"] },
            ],
            [
                { question: "Which tag contains the visible content of the page?", answer: "<body>", wrong: ["<head>", "<main-content>", "<content>"] },
                { question: "Which tag holds the page title and metadata?", answer: "<head>", wrong: ["<header>", "<title-bar>", "<meta-data>"] },
            ],
            [
                { question: "What is the first line of an HTML5 document?", answer: "<!DOCTYPE html>", wrong: ["<html5>", "<?html?>", "<doc html>"] },
                { question: "What is src here?", code: "<img src=\"cat.png\">", answer: "An attribute: extra information on a tag", wrong: ["A tag inside another tag", "The text of the element", "The text shown when the image loads"] },
            ],
            [
                { question: "How do you write a comment in HTML?", answer: "<!-- comment -->", wrong: ["// comment", "/* comment */", "# comment"] },
                { question: "Which tag links a CSS file?", answer: "<link rel=\"stylesheet\" href=\"style.css\">", wrong: ["<stylesheet link=\"style.css\" rel=\"css\">", "<style href=\"style.css\">", "<script src=\"style.css\">"] },
            ],
            [
                { question: "Which meta tag makes a page scale properly on phones?", answer: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", wrong: ["<meta name=\"mobile\" content=\"true\">", "<meta name=\"screen\" content=\"responsive, scale=device\">", "<meta name=\"scale\" content=\"auto\">"] },
                { question: "What does semantic HTML mean?", answer: "Using tags that describe their meaning (nav, article, footer)", wrong: ["Writing tags that the browser checks for spelling (div, span, box)", "Writing HTML in lowercase", "Adding a comment to every tag"] },
            ],
        ],
        "Tags & Elements": [
            [
                { question: "Which tag makes the largest heading?", answer: "<h1>", wrong: ["<h6>", "<heading>", "<head>"] },
                { question: "Which tag makes a paragraph?", answer: "<p>", wrong: ["<para>", "<text>", "<pg>"] },
            ],
            [
                { question: "Which tag creates a link?", answer: "<a>", wrong: ["<link>", "<href>", "<url>"] },
                { question: "Which tag shows an image?", answer: "<img>", wrong: ["<image>", "<picture-file>", "<src>"] },
            ],
            [
                { question: "Which attribute holds the destination of a link?", code: "<a ...>Go</a>", answer: "href", wrong: ["src", "link", "url"] },
                { question: "Which tags make a bulleted list?", answer: "<ul> and <li>", wrong: ["<ol> and <li>", "<list> and <item>", "<bl> and <li>"] },
            ],
            [
                { question: "Which attribute gives alternative text to an image?", answer: "alt", wrong: ["title", "text", "desc"] },
                { question: "Which tag creates a line break?", answer: "<br>", wrong: ["<lb>", "<break>", "<newline>"] },
            ],
            [
                { question: "What is the difference between <div> and <span>?", answer: "div is block-level, span is inline", wrong: ["div is for text, span for images", "span is block-level, div is inline", "There is no difference"] },
                { question: "Which tag creates a table row?", answer: "<tr>", wrong: ["<td>", "<row>", "<th>"] },
            ],
        ],
        "CSS Basics": [
            [
                { question: "What does CSS stand for?", answer: "Cascading Style Sheets", wrong: ["Computer Style System", "Creative Style Syntax", "Colorful Sheet Styles"] },
                { question: "Which property changes the text color?", answer: "color", wrong: ["text-color", "font-color", "foreground"] },
            ],
            [
                { question: "Which property changes the background color?", answer: "background-color", wrong: ["bg-color", "color-background", "background-fill"] },
                { question: "What is this?", code: "p {\n  color: red;\n}", answer: "A CSS rule for all p elements", wrong: ["An HTML tag", "A JavaScript function", "A comment"] },
            ],
            [
                { question: "Which property changes the text size?", answer: "font-size", wrong: ["text-size", "size", "font-height"] },
                { question: "How do you write a comment in CSS?", answer: "/* comment */", wrong: ["// comment", "<!-- comment -->", "# comment"] },
            ],
            [
                { question: "Which color is #ff0000?", answer: "Red", wrong: ["Blue", "Green", "White"] },
                { question: "What does px mean?", answer: "Pixels", wrong: ["Percent", "Points per inch", "Pixels per second"] },
            ],
            [
                { question: "Which has the highest priority when styles conflict?", answer: "Inline style, then id, then class, then element", wrong: ["Element, then class, then id, then inline", "Class, then id, then element, then inline", "They all have the same priority"] },
                { question: "What does rem mean?", answer: "A size relative to the root font size", wrong: ["Remaining space", "Relative to the parent element", "Random em"] },
            ],
        ],
        "Selectors": [
            [
                { question: "Which selector targets the class \"box\"?", answer: ".box", wrong: ["#box", "box", "*box"] },
                { question: "Which selector targets the id \"menu\"?", answer: "#menu", wrong: [".menu", "menu", "@menu"] },
            ],
            [
                { question: "Which selector targets every element?", answer: "*", wrong: ["all", "#all", ".every"] },
                { question: "Which selector targets all p elements?", answer: "p", wrong: [".p", "#p", "<p>"] },
            ],
            [
                { question: "What does \"div p\" select?", answer: "p elements inside a div", wrong: ["div and p elements", "Only divs", "p elements next to a div"] },
                { question: "What does \"h1, h2\" select?", answer: "Both h1 and h2 elements", wrong: ["h2 inside h1", "Only h1", "h1 followed by h2"] },
            ],
            [
                { question: "What does a:hover style?", answer: "A link while the mouse is over it", wrong: ["A visited link", "A clicked link", "A link the user is clicking right now"] },
                { question: "What does \"div > p\" select?", answer: "p elements that are direct children of a div", wrong: ["All p inside a div at any depth", "div elements after a p", "p elements bigger than a div"] },
            ],
            [
                { question: "Which is more specific, .box or #box?", answer: "#box", wrong: [".box", "Both are equal", "It depends on the order"] },
                { question: "What does input[type=\"text\"] select?", answer: "Inputs whose type attribute is text", wrong: ["All inputs", "The text inside inputs", "Inputs with the class text"] },
            ],
        ],
        "Layout & Box Model": [
            [
                { question: "Which property adds space inside an element, around its content?", answer: "padding", wrong: ["margin", "spacing", "gap"] },
                { question: "Which property adds space outside an element?", answer: "margin", wrong: ["padding", "border", "offset"] },
            ],
            [
                { question: "What are the four parts of the box model, inside to outside?", answer: "Content, padding, border, margin", wrong: ["Margin, border, padding, content", "Content, margin, border, padding", "Padding, content, margin, border"] },
                { question: "Which property draws a line around an element?", answer: "border", wrong: ["outline-color", "frame", "edge"] },
            ],
            [
                { question: "Which display value makes an element start on a new line and take the full width?", answer: "block", wrong: ["inline", "none", "flex-item"] },
                { question: "What does display: none do?", answer: "Hides the element completely", wrong: ["Makes it transparent", "Shows it on one line", "Removes its border"] },
            ],
            [
                { question: "Which display value lines up the children in a row by default?", answer: "flex", wrong: ["block", "inline-row", "table"] },
                { question: "In a flex row, which property centers the items horizontally?", answer: "justify-content: center", wrong: ["align-items: center", "text-align: center", "margin: center"] },
            ],
            [
                { question: "What does box-sizing: border-box do?", answer: "The width includes padding and border", wrong: ["Adds a border to every box", "Removes the margin", "Doubles the padding"] },
                { question: "Which property creates the columns in CSS Grid?", answer: "grid-template-columns", wrong: ["grid-columns", "columns-template", "grid-cols"] },
            ],
        ],
    },
};
