import type { TopicContent } from "./types";

// Artificial intelligence basics for beginners: concepts, ML, LLMs and prompts, data, safe use.
export const ai: TopicContent = {
    id: "ai",
    name: "Artificial Intelligence",
    categories: {
        "AI Basics": [
            [
                { question: "What does AI stand for?", answer: "Artificial Intelligence", wrong: ["Automatic Internet", "Advanced Interface", "Applied Information"] },
                { question: "Which of these is an example of AI in daily life?", answer: "A voice assistant understanding a question", wrong: ["A light switch", "A paper calendar", "A calculator adding 2 + 2"] },
            ],
            [
                { question: "What is a chatbot?", answer: "A program that talks with people in natural language", wrong: ["A robot that cleans", "A virus that sends messages", "A type of keyboard"] },
                { question: "What is computer vision?", answer: "AI that understands images and video", wrong: ["A screen with high resolution", "Glasses for programmers", "A video editing app"] },
            ],
            [
                { question: "What is \"narrow\" AI?", answer: "AI that is good at one specific task", wrong: ["AI that runs on small screens", "AI with few users", "AI that thinks like a human in everything"] },
                { question: "What is generative AI?", answer: "AI that creates new content: text, images, music or code", wrong: ["AI that only sorts files", "AI that generates electricity", "AI that only answers yes or no"] },
            ],
            [
                { question: "What is natural language processing (NLP)?", answer: "AI that works with human language", wrong: ["Processing natural foods", "A programming language", "Translating code to binary"] },
                { question: "What is an algorithm?", answer: "A step-by-step set of instructions to solve a problem", wrong: ["A type of robot", "A computer screen", "A random guess"] },
            ],
            [
                { question: "What is the Turing test about?", answer: "Whether a machine's conversation can pass as human", wrong: ["How fast a computer is", "Whether a robot can walk", "Testing internet speed"] },
                { question: "What is AGI (artificial general intelligence)?", answer: "AI that could do any intellectual task a human can", wrong: ["A graphics card", "AI for games only", "The government agency for AI"] },
            ],
        ],
        "Machine Learning": [
            [
                { question: "Machine learning means a computer…", answer: "Learns patterns from data instead of following only fixed rules", wrong: ["Builds machines", "Learns to type faster", "Repairs itself"] },
                { question: "What does a machine learning model need to learn?", answer: "Data (examples)", wrong: ["A keyboard", "A bigger screen", "Electricity only"] },
            ],
            [
                { question: "Photos labeled \"cat\" or \"dog\" used to train a model are called…", answer: "Labeled training data", wrong: ["Wallpapers", "Source code", "Passwords"] },
                { question: "What is a prediction in ML?", answer: "The model's output for new, unseen data", wrong: ["A horoscope", "The training data", "A bug in the code"] },
            ],
            [
                { question: "Learning from examples with the right answers is called…", answer: "Supervised learning", wrong: ["Unsupervised learning", "Remote learning", "Deep sleep"] },
                { question: "Grouping customers by similarity without labels is…", answer: "Unsupervised learning (clustering)", wrong: ["Supervised learning", "Copy and paste", "Encryption"] },
            ],
            [
                { question: "What is a neural network inspired by?", answer: "The human brain's neurons", wrong: ["Spider webs", "Computer networks only", "Fishing nets"] },
                { question: "Why split data into training and test sets?", answer: "To check the model on data it has never seen", wrong: ["To save disk space", "To train twice as fast", "Because the data is too big to read"] },
            ],
            [
                { question: "What is overfitting?", answer: "The model memorizes training data and fails on new data", wrong: ["The model is too big for the screen", "Training takes too long", "The data has too many columns"] },
                { question: "Learning by trial and error with rewards is called…", answer: "Reinforcement learning", wrong: ["Supervised learning", "Deep copying", "Transfer printing"] },
            ],
        ],
        "Prompts & LLMs": [
            [
                { question: "What is a prompt?", answer: "The instruction or question you give to an AI", wrong: ["The AI's answer", "A computer virus", "A type of chip"] },
                { question: "What does LLM stand for?", answer: "Large Language Model", wrong: ["Long Learning Machine", "Language Logic Module", "Large Logic Memory"] },
            ],
            [
                { question: "Which prompt will probably give a better answer?", answer: "\"Explain loops in Java to a beginner with one short example\"", wrong: ["\"loops\"", "\"java\"", "\"tell me stuff\""] },
                { question: "What does an LLM do, basically?", answer: "Predicts the next words based on patterns in text", wrong: ["Searches one fixed list of answers", "Copies a website", "Runs only math formulas"] },
            ],
            [
                { question: "What is an AI \"hallucination\"?", answer: "A confident answer that is false or made up", wrong: ["An AI that sees images", "A very creative poem", "A computer that overheats"] },
                { question: "Giving the AI a role, like \"You are a math teacher\", is called…", answer: "Role prompting", wrong: ["Hacking", "Compiling", "Debugging"] },
            ],
            [
                { question: "What is a token for an LLM?", answer: "A small piece of text, like a word or part of a word", wrong: ["A password", "A coin to pay for answers", "A whole document"] },
                { question: "Including a couple of examples in your prompt is called…", answer: "Few-shot prompting", wrong: ["Zero-shot prompting", "Screen sharing", "Overfitting"] },
            ],
            [
                { question: "What is the context window of an LLM?", answer: "How much text it can consider at once", wrong: ["The size of the chat window", "The browser it runs in", "The time zone it uses"] },
                { question: "Why should you check AI-generated code before using it?", answer: "It can contain bugs or security problems", wrong: ["AI code never compiles", "It is always copied from the internet", "It only works on Mondays"] },
            ],
        ],
        "Data & Bias": [
            [
                { question: "Why does data matter so much for AI?", answer: "The AI learns from it, so bad data gives bad results", wrong: ["It makes the computer look nicer", "It is only used for backups", "It doesn't matter"] },
                { question: "Which is an example of personal data?", answer: "Your full name and phone number", wrong: ["The weather in Bogotá", "The color blue", "The number pi"] },
            ],
            [
                { question: "What is bias in AI?", answer: "Unfair results that favor or harm some groups", wrong: ["A faster processor", "A type of chart", "A friendly voice"] },
                { question: "A face recognition model trained mostly on one skin tone may…", answer: "Work worse for people with other skin tones", wrong: ["Work better for everyone", "Stop working completely", "Change people's photos"] },
            ],
            [
                { question: "Where can bias in an AI come from?", answer: "The training data and the choices of the people who build it", wrong: ["Only from the computer's color", "Only from the internet speed", "It can never happen"] },
                { question: "What is a dataset?", answer: "A collection of data used for training or analysis", wrong: ["A single photo", "A database password", "A set of computers"] },
            ],
            [
                { question: "What does \"garbage in, garbage out\" mean?", answer: "Poor-quality input data leads to poor results", wrong: ["Delete your files often", "AI can clean any data", "Recycle old computers"] },
                { question: "What is data privacy?", answer: "People's control over how their personal data is collected and used", wrong: ["Hiding your screen", "Making all data public", "Deleting the internet"] },
            ],
            [
                { question: "Why test an AI system with diverse groups of people?", answer: "To find out if it works fairly for everyone", wrong: ["To make it slower", "To change its name", "Because the law forbids small tests"] },
                { question: "What is anonymizing data?", answer: "Removing information that identifies specific people", wrong: ["Making data bigger", "Encrypting it with a password", "Sharing it on social media"] },
            ],
        ],
        "AI Ethics & Safety": [
            [
                { question: "Is it OK to paste your passwords into an AI chat?", answer: "No, never share secrets with an AI tool", wrong: ["Yes, AI keeps them safe", "Only on weekends", "Yes, if it is a short password"] },
                { question: "Should you trust every AI answer without checking?", answer: "No, verify important facts with reliable sources", wrong: ["Yes, AI is always right", "Only if it answers quickly", "Yes, if it sounds confident"] },
            ],
            [
                { question: "What is a deepfake?", answer: "Fake but realistic video, image or audio made with AI", wrong: ["A very deep swimming pool", "A secure password", "A broken video file"] },
                { question: "Using AI to write your whole homework and presenting it as yours is…", answer: "Academic dishonesty (unless your teacher allows it)", wrong: ["Always fine", "Required", "A type of research"] },
            ],
            [
                { question: "What does transparency mean for an AI system?", answer: "Being clear about how and when AI is used", wrong: ["The screen is see-through", "The code is very short", "It has no data"] },
                { question: "Who is responsible for decisions made with the help of AI?", answer: "The people and organizations who use it", wrong: ["Nobody", "The computer alone", "The electricity company"] },
            ],
            [
                { question: "Why should a human review AI decisions about jobs or loans?", answer: "Mistakes and bias can seriously affect people's lives", wrong: ["Computers get tired", "It is faster", "AI cannot read"] },
                { question: "Copyright and AI: what's a good practice?", answer: "Respect the rights of creators whose work you reuse", wrong: ["Everything AI makes is free to copy", "Copyright does not exist online", "Only images have copyright"] },
            ],
            [
                { question: "What is \"human in the loop\"?", answer: "A person checks or approves the AI's important outputs", wrong: ["A person stuck in a loop", "A robot shaped like a human", "A while loop in Python"] },
                { question: "What is a prompt injection attack?", answer: "Hidden instructions in content that try to make an AI misbehave", wrong: ["A vaccine for computers", "Typing very fast", "Injecting code into a USB"] },
            ],
        ],
    },
};
