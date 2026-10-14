import type { TopicContent } from "./types";

// UX/UI design basics for beginners: concepts, research, layout, visual design, usability.
export const uxUi: TopicContent = {
    id: "ux-ui",
    name: "UX/UI Design",
    categories: {
        "UX Basics": [
            [
                { question: "What does UX stand for?", answer: "User Experience", wrong: ["User Extension", "Universal Exchange", "Unique Example"] },
                { question: "What does UI stand for?", answer: "User Interface", wrong: ["User Internet", "Universal Input", "Unique Identity"] },
            ],
            [
                { question: "What is the main difference between UX and UI?", answer: "UX is how it works and feels; UI is how it looks and what you interact with", wrong: ["UI is how it works and feels; UX is how it looks and what you interact with", "UX is only colors", "UI is only for phones"] },
                { question: "Which of these is a UI element?", answer: "A button", wrong: ["A user's feeling", "A business goal", "A server"] },
            ],
            [
                { question: "What is a wireframe?", answer: "A simple sketch of a screen's layout, without final design", wrong: ["The cable inside a monitor", "A diagram of the cables connecting the servers", "A 3D model"] },
                { question: "What is a prototype?", answer: "A clickable model to test an idea before building it", wrong: ["The first finished version sold to real users", "A type of font", "A server backup"] },
            ],
            [
                { question: "What is a user flow?", answer: "The steps a user takes to complete a task", wrong: ["The number of users visiting the site each day", "A list of users", "The water in a design"] },
                { question: "In which order do designers usually work?", answer: "Research → wireframe → prototype → test", wrong: ["Test → research → code → wireframe", "Code → colors → research", "Logo → launch → research"] },
            ],
            [
                { question: "What is design thinking?", answer: "A process: empathize, define, ideate, prototype, test", wrong: ["Thinking only about colors", "Designing without users", "A process: sketch, code, deploy, sell, repeat"] },
                { question: "What is information architecture?", answer: "How content is organized and labeled so people can find it", wrong: ["The building where servers are", "The code of a database", "The hardware architecture that serves the content"] },
            ],
        ],
        "Users & Research": [
            [
                { question: "Who should a good design be made for?", answer: "Its real users", wrong: ["Only the designer", "Only the boss", "Only the programmers"] },
                { question: "What is a user interview?", answer: "A conversation to learn users' needs and problems", wrong: ["A job interview", "A written exam that users must pass to register", "A test of typing speed"] },
            ],
            [
                { question: "What is a persona?", answer: "A fictional profile that represents a group of real users", wrong: ["A real user hired to represent the design team", "The designer's avatar", "A password"] },
                { question: "What is a usability test?", answer: "Watching real people try to use the product", wrong: ["Testing internet speed", "Checking the code compiles", "Asking the boss for an opinion"] },
            ],
            [
                { question: "What is a pain point?", answer: "A problem or frustration users have", wrong: ["The place where users tap the screen", "A design tool", "A score in a game"] },
                { question: "What is A/B testing?", answer: "Comparing two versions to see which works better", wrong: ["Testing letters A and B", "Testing a design twice with the same version", "Testing two computers"] },
            ],
            [
                { question: "Why not just ask users \"Do you like it?\"", answer: "What people do matters more than what they say", wrong: ["Users never answer", "Questions are forbidden in professional research", "It takes too long"] },
                { question: "What is a user journey map?", answer: "A visual of the user's experience step by step, with feelings", wrong: ["A map of the office where the design team works, with notes", "A list of servers", "The company's org chart"] },
            ],
            [
                { question: "How many users often find most usability problems in a small test?", answer: "About 5", wrong: ["At least 500", "Exactly 1", "Everyone in the country"] },
                { question: "What is qualitative research?", answer: "Research about why and how, like interviews and observations", wrong: ["Research with only numbers", "Research that measures quality with numeric scores", "Reading the code"] },
            ],
        ],
        "Layout & Hierarchy": [
            [
                { question: "What is white space (negative space)?", answer: "Empty space between elements", wrong: ["A white background only", "A bug", "Missing content"] },
                { question: "Which usually catches the eye first?", answer: "The biggest, boldest element", wrong: ["The smallest text", "The footer", "The page's last line"] },
            ],
            [
                { question: "What is visual hierarchy?", answer: "Arranging elements so the most important stands out first", wrong: ["The company's org chart", "The order of files in a folder", "Sorting the pages of a site alphabetically"] },
                { question: "What does alignment do in a layout?", answer: "Lines elements up so the page looks organized", wrong: ["Makes everything the same color", "Adds animations", "Removes text"] },
            ],
            [
                { question: "What is a grid in UI design?", answer: "Columns and rows that guide where elements go", wrong: ["A table that stores the website's data", "A type of font", "An error message"] },
                { question: "What is responsive design?", answer: "A layout that adapts to different screen sizes", wrong: ["A design that responds to voice", "A fast server", "A design with many colors"] },
            ],
            [
                { question: "Many people scan a web page in which pattern?", answer: "F-pattern", wrong: ["X-pattern", "Circle pattern", "Bottom-to-top"] },
                { question: "What is the principle of proximity?", answer: "Related items should be close together", wrong: ["Items should be far from the edges", "Use only one color", "Buttons should be tiny"] },
            ],
            [
                { question: "What does \"mobile first\" mean?", answer: "Design for small screens first, then scale up", wrong: ["Only make mobile apps", "Buy the newest phone before designing anything", "Ignore desktops forever"] },
                { question: "What is consistency in UI?", answer: "Similar elements look and behave the same everywhere", wrong: ["Copying another company's design exactly", "Never changing the design", "Repeating the same text"] },
            ],
        ],
        "Color & Typography": [
            [
                { question: "What is typography?", answer: "The style and arrangement of text", wrong: ["The study of printing machines", "A printer brand", "Spelling rules"] },
                { question: "Which colors are \"warm\"?", answer: "Red, orange, yellow", wrong: ["Blue, green, purple", "Black and white", "Gray and silver"] },
            ],
            [
                { question: "What is a color palette?", answer: "The set of colors used in a design", wrong: ["A tool for mixing paint digitally", "A screen setting", "A type of font"] },
                { question: "What is a font family?", answer: "A typeface with its variants (bold, italic…)", wrong: ["Fonts made by relatives", "All fonts on a computer", "A set of icons that share one style"] },
            ],
            [
                { question: "Why is contrast important?", answer: "Text must stand out from the background to be readable", wrong: ["It makes images load faster", "Bright colors attract more visitors to the site", "It is only decoration"] },
                { question: "What's the difference between serif and sans-serif fonts?", answer: "Serif fonts have small strokes at the ends of letters", wrong: ["Serif fonts are always bold", "Sans-serif fonts are handwritten", "Sans-serif fonts have small strokes at the ends"] },
            ],
            [
                { question: "Why limit a design to 2–3 fonts?", answer: "Too many fonts look messy and inconsistent", wrong: ["Computers only support 3 fonts", "Fonts are expensive", "It is the law"] },
                { question: "Which color is usually used for errors?", answer: "Red", wrong: ["Green", "Light blue", "Gold"] },
            ],
            [
                { question: "What is the 60-30-10 rule?", answer: "60% main color, 30% secondary, 10% accent", wrong: ["60 fonts, 30 colors, 10 images", "A screen resolution", "A typing speed goal"] },
                { question: "Why not use color alone to show information?", answer: "Color-blind users may not see the difference", wrong: ["Printed versions of the page lose their meaning", "Screens show only gray", "It makes pages slower"] },
            ],
        ],
        "Usability & Accessibility": [
            [
                { question: "What is usability?", answer: "How easy and pleasant a product is to use", wrong: ["How many features a product offers its users", "How fast the server is", "How pretty the logo is"] },
                { question: "What is accessibility?", answer: "Designing so people with disabilities can use the product", wrong: ["Having a fast internet", "Making an app free", "Making the product reachable from any country"] },
            ],
            [
                { question: "Why should images have alt text?", answer: "Screen readers read it to blind users", wrong: ["It makes images load faster", "It adds a caption to everyone", "It is only for search engines"] },
                { question: "What is feedback in UI?", answer: "The interface showing the result of an action (e.g. \"Saved!\")", wrong: ["Users' comments in a store", "A survey users fill in after using the app", "An error in the code"] },
            ],
            [
                { question: "Why should buttons be big enough on phones?", answer: "So people can tap them easily with a finger", wrong: ["Big buttons load faster", "Phones only show big things", "Because small buttons break the touch screen"] },
                { question: "What is a good error message?", answer: "Clear, polite, and says how to fix the problem", wrong: ["\"Error 0x80042\"", "Red text with no explanation", "Technical, so developers can debug it quickly"] },
            ],
            [
                { question: "What are WCAG?", answer: "International guidelines for web accessibility", wrong: ["A web consortium of graphic artists", "A design tool", "A font family"] },
                { question: "Why should a website work with the keyboard only?", answer: "Some users can't use a mouse", wrong: ["Mice are too expensive", "It's faster for computers", "Keyboards are newer"] },
            ],
            [
                { question: "What is cognitive load?", answer: "The mental effort needed to use an interface", wrong: ["The weight of a laptop", "The server's CPU usage", "The time a page needs to load completely"] },
                { question: "Which is one of Nielsen's usability heuristics?", answer: "Visibility of system status", wrong: ["Use as many colors as possible", "Hide the navigation", "Always use animations"] },
            ],
        ],
    },
};
