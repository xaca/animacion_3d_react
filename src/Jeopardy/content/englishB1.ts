import type { TopicContent } from "./types";

// Intermediate English (B1). Reuses the hardest questions from the original bank.
export const englishB1: TopicContent = {
    id: "english-b1",
    name: "English B1",
    categories: {
        "Vocabulary": [
            [
                { question: "What is a word for 'very happy'?", answer: "Delighted", wrong: ["Exhausted", "Furious", "Anxious"] },
                { question: "What do you call a place where you borrow books?", answer: "A library", wrong: ["A bookshop", "A bakery", "A pharmacy"] },
            ],
            [
                { question: "What does 'reluctant' mean?", answer: "Unwilling or hesitant", wrong: ["Very excited", "Extremely tired", "Easy to understand"] },
                { question: "What does 'ancient' mean?", answer: "Very old", wrong: ["Very new", "Very large", "Very fast"] },
            ],
            [
                { question: "What does 'exhausted' mean?", answer: "Very tired", wrong: ["Very hungry", "Very angry", "Very bored"] },
                { question: "What is the opposite of 'generous'?", answer: "Stingy", wrong: ["Kind", "Wealthy", "Polite"] },
            ],
            [
                { question: "What does 'to postpone' mean?", answer: "To delay something to a later time", wrong: ["To cancel something forever", "To finish something early", "To forget something"] },
                { question: "What is 'a bargain'?", answer: "Something bought for less than its usual price", wrong: ["A serious argument", "A heavy load", "An expensive gift"] },
            ],
            [
                { question: "What does 'ubiquitous' mean?", answer: "Present everywhere", wrong: ["Very rare", "Extremely large", "Impossible to see"] },
                { question: "What does 'meticulous' mean?", answer: "Very careful and precise", wrong: ["Careless and quick", "Loud and rude", "Shy and quiet"] },
            ],
        ],
        "Grammar": [
            [
                { question: "Complete: I have lived here ___ 2015.", answer: "since", wrong: ["for", "from", "during"] },
                { question: "Complete: He is ___ than his brother.", answer: "taller", wrong: ["more tall", "tallest", "more taller"] },
            ],
            [
                {
                    question: "Change to passive: 'Tom wrote the letter.'",
                    answer: "The letter was written by Tom.",
                    wrong: ["The letter is wrote by Tom.", "The letter was wrote by Tom.", "Tom was written by the letter."],
                },
                { question: "Complete: If I ___ rich, I would travel.", answer: "were", wrong: ["am", "will be", "been"] },
            ],
            [
                { question: "Complete: I look forward to ___ you.", answer: "seeing", wrong: ["see", "to see", "saw"] },
                { question: "Complete: She asked me where ___.", answer: "I lived", wrong: ["did I live", "do I live", "I am live"] },
            ],
            [
                { question: "Complete: I ___ my homework yet.", answer: "haven't finished", wrong: ["didn't finished", "haven't finish", "don't finished"] },
                { question: "Complete: You ___ smoke here. It's forbidden.", answer: "mustn't", wrong: ["don't have to", "needn't", "might not"] },
            ],
            [
                { question: "Complete: If she had studied, she ___ the exam.", answer: "would have passed", wrong: ["would pass", "will pass", "had passed"] },
                { question: "Complete: The man ___ car was stolen called the police.", answer: "whose", wrong: ["who", "which", "that"] },
            ],
        ],
        "Phrasal Verbs": [
            [
                { question: "What does 'to give up' mean?", answer: "To stop trying", wrong: ["To stand up", "To look up", "To start again"] },
                { question: "What does 'to wake up' mean?", answer: "To stop sleeping", wrong: ["To go to bed", "To get dressed", "To take a nap"] },
            ],
            [
                { question: "What does 'to look for' mean?", answer: "To try to find something", wrong: ["To watch something", "To take care of something", "To wait for something"] },
                { question: "What does 'to turn off' mean?", answer: "To stop a machine or light", wrong: ["To start a machine", "To break a machine", "To buy a machine"] },
            ],
            [
                { question: "What does 'to run out of' mean?", answer: "To have no more of something", wrong: ["To exercise outside", "To leave a place quickly", "To find extra of something"] },
                { question: "What does 'to find out' mean?", answer: "To discover information", wrong: ["To lose something", "To go outside", "To invent an excuse"] },
            ],
            [
                { question: "What does 'to put off' mean?", answer: "To postpone", wrong: ["To wear something", "To turn off the lights", "To insult someone"] },
                { question: "What does 'to look after' mean?", answer: "To take care of someone", wrong: ["To search for someone", "To follow someone", "To admire someone"] },
            ],
            [
                { question: "What does 'to come up with' mean?", answer: "To think of an idea", wrong: ["To climb something", "To arrive late", "To agree with someone"] },
                { question: "What does 'to put up with' mean?", answer: "To tolerate something annoying", wrong: ["To build something", "To raise your hand", "To store something upstairs"] },
            ],
        ],
        "Spelling": [
            [
                { question: "Which spelling is correct?", answer: "different", wrong: ["diferent", "differant", "diffrent"] },
                { question: "Which spelling is correct?", answer: "interesting", wrong: ["intresting", "interessing", "intersting"] },
            ],
            [
                { question: "Which spelling is correct?", answer: "necessary", wrong: ["neccessary", "necesary", "neccesary"] },
                { question: "Which spelling is correct?", answer: "beginning", wrong: ["begining", "beggining", "beginnig"] },
            ],
            [
                { question: "Which spelling is correct?", answer: "receive", wrong: ["recieve", "receeve", "riceive"] },
                { question: "Which spelling is correct?", answer: "accommodation", wrong: ["acommodation", "accomodation", "acomodation"] },
            ],
            [
                { question: "Which spelling is correct?", answer: "embarrassed", wrong: ["embarassed", "embarrased", "emberrassed"] },
                { question: "Which spelling is correct?", answer: "definitely", wrong: ["definately", "definetly", "definitly"] },
            ],
            [
                { question: "Which spelling is correct?", answer: "occurrence", wrong: ["occurence", "ocurrence", "occurrance"] },
                { question: "Which spelling is correct?", answer: "conscious", wrong: ["concious", "consious", "conscius"] },
            ],
        ],
        "Idioms": [
            [
                { question: "What does 'a piece of cake' mean?", answer: "Very easy", wrong: ["Very sweet", "Very expensive", "Very small"] },
                { question: "What does 'break a leg' mean?", answer: "Good luck", wrong: ["Be careful", "Get well soon", "Stop running"] },
            ],
            [
                { question: "What does 'it's raining cats and dogs' mean?", answer: "It's raining very heavily", wrong: ["Animals are falling", "It's barely raining", "The rain is about to stop"] },
                { question: "What does 'once in a blue moon' mean?", answer: "Very rarely", wrong: ["Every night", "Once a month", "Very quickly"] },
            ],
            [
                { question: "What does 'to be broke' mean?", answer: "To have no money", wrong: ["To be injured", "To be tired", "To be wrong"] },
                { question: "What does 'to hit the books' mean?", answer: "To study hard", wrong: ["To damage the library", "To write a novel", "To stop reading"] },
            ],
            [
                { question: "What does 'to feel under the weather' mean?", answer: "To feel ill", wrong: ["To stand in the rain", "To feel cold", "To be outdoors"] },
                { question: "What does 'to spill the beans' mean?", answer: "To reveal a secret", wrong: ["To make a mess", "To cook badly", "To waste food"] },
            ],
            [
                { question: "What does 'to beat around the bush' mean?", answer: "To avoid saying something directly", wrong: ["To work in the garden", "To win easily", "To search everywhere"] },
                { question: "What does 'the ball is in your court' mean?", answer: "It is your turn to act or decide", wrong: ["You are winning the game", "You must play tennis", "You lost your chance"] },
            ],
        ],
    },
};
