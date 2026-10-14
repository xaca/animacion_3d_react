import type { TopicContent } from "./types";

// Beginner English (A1). Reuses the easiest questions from the original bank.
export const englishA1: TopicContent = {
    id: "english-a1",
    name: "English A1",
    categories: {
        "Vocabulary": [
            [
                { question: "What do you call a baby dog?", answer: "A puppy", wrong: ["A kitten", "A cub", "A chick"] },
                { question: "What is the color of the sky on a clear day?", answer: "Blue", wrong: ["Green", "Red", "Yellow"] },
            ],
            [
                { question: "What do you call the room where you cook?", answer: "The kitchen", wrong: ["The bedroom", "The bathroom", "The garage"] },
                { question: "What is a person who teaches called?", answer: "A teacher", wrong: ["A student", "A doctor", "A driver"] },
            ],
            [
                { question: "What is the opposite of 'hot'?", answer: "Cold", wrong: ["Warm", "Wet", "Soft"] },
                { question: "What do you call the first meal of the day?", answer: "Breakfast", wrong: ["Lunch", "Dinner", "Supper"] },
            ],
            [
                { question: "What day comes after Monday?", answer: "Tuesday", wrong: ["Sunday", "Wednesday", "Thursday"] },
                { question: "Which season is the coldest?", answer: "Winter", wrong: ["Summer", "Spring", "Autumn"] },
            ],
            [
                { question: "What do you call your mother's sister?", answer: "Your aunt", wrong: ["Your cousin", "Your niece", "Your grandmother"] },
                { question: "How many months are there in a year?", answer: "Twelve", wrong: ["Ten", "Eleven", "Twenty"] },
            ],
        ],
        "Grammar": [
            [
                { question: "Complete: She ___ a student.", answer: "is", wrong: ["am", "are", "be"] },
                { question: "Complete: They ___ happy.", answer: "are", wrong: ["am", "is", "be"] },
            ],
            [
                { question: "Complete: I ___ from Colombia.", answer: "am", wrong: ["is", "are", "be"] },
                { question: "What is the plural of 'child'?", answer: "Children", wrong: ["Childs", "Childrens", "Childes"] },
            ],
            [
                { question: "Complete: She eats ___ apple every day.", answer: "an", wrong: ["a", "any", "some"] },
                { question: "Complete: He ___ TV every day.", answer: "watches", wrong: ["watch", "watching", "watched"] },
            ],
            [
                { question: "Complete: There ___ two cats in the house.", answer: "are", wrong: ["is", "am", "be"] },
                { question: "Complete: Do you like pizza? — Yes, I ___.", answer: "do", wrong: ["like", "am", "does"] },
            ],
            [
                { question: "Complete: She ___ like coffee.", answer: "doesn't", wrong: ["don't", "isn't", "aren't"] },
                { question: "Complete: ___ you swim?", answer: "Can", wrong: ["Do can", "Are", "Does"] },
            ],
        ],
        "Verbs": [
            [
                { question: "What is the opposite of 'to open'?", answer: "To close", wrong: ["To start", "To put", "To break"] },
                { question: "Complete: I ___ breakfast every morning.", answer: "eat", wrong: ["eats", "eating", "ate"] },
            ],
            [
                { question: "What is the past of 'go'?", answer: "went", wrong: ["goed", "gone", "wented"] },
                { question: "What is the past of 'eat'?", answer: "ate", wrong: ["eated", "eaten", "ated"] },
            ],
            [
                { question: "Complete: She is ___ a book right now.", answer: "reading", wrong: ["read", "reads", "readed"] },
                { question: "Complete: They ___ football yesterday.", answer: "played", wrong: ["play", "plays", "playing"] },
            ],
            [
                { question: "What is the past of 'have'?", answer: "had", wrong: ["haved", "has", "haded"] },
                { question: "Complete: We ___ to school by bus every day.", answer: "go", wrong: ["goes", "going", "gone"] },
            ],
            [
                { question: "What is the past of 'see'?", answer: "saw", wrong: ["seed", "seen", "sawed"] },
                { question: "What is the past of 'buy'?", answer: "bought", wrong: ["buyed", "brought", "boughted"] },
            ],
        ],
        "Spelling": [
            [
                { question: "Which spelling is correct?", answer: "house", wrong: ["hause", "howse", "huose"] },
                { question: "Which spelling is correct?", answer: "water", wrong: ["watter", "woter", "uater"] },
            ],
            [
                { question: "Which spelling is correct?", answer: "friend", wrong: ["freind", "frend", "friand"] },
                { question: "Which spelling is correct?", answer: "school", wrong: ["scool", "shcool", "schol"] },
            ],
            [
                { question: "Which spelling is correct?", answer: "because", wrong: ["becouse", "becase", "becuase"] },
                { question: "Which spelling is correct?", answer: "people", wrong: ["peaple", "pepole", "poeple"] },
            ],
            [
                { question: "Which spelling is correct?", answer: "beautiful", wrong: ["beutiful", "beautifull", "biutiful"] },
                { question: "Which spelling is correct?", answer: "Wednesday", wrong: ["Wensday", "Wednsday", "Wendesday"] },
            ],
            [
                { question: "Which spelling is correct?", answer: "February", wrong: ["Febuary", "Feburary", "Februery"] },
                { question: "Which spelling is correct?", answer: "tomorrow", wrong: ["tomorow", "tommorow", "tommorrow"] },
            ],
        ],
        "Everyday Phrases": [
            [
                { question: "What do you say when you meet someone in the morning?", answer: "Good morning", wrong: ["Good night", "Goodbye", "Good evening"] },
                { question: "Someone says 'Thank you'. What do you answer?", answer: "You're welcome", wrong: ["Please", "No thanks", "Me too"] },
            ],
            [
                { question: "'How are you?' — What is a good answer?", answer: "I'm fine, thanks", wrong: ["I'm a student", "Yes, I am", "I'm 20 years old"] },
                { question: "What do you say when you meet a person for the first time?", answer: "Nice to meet you", wrong: ["See you later", "How old are you?", "You're welcome"] },
            ],
            [
                { question: "What do you ask to know the price of something?", answer: "How much is it?", wrong: ["How many is it?", "How old is it?", "How far is it?"] },
                { question: "What do you say when you arrive late?", answer: "I'm sorry", wrong: ["You're late", "I'm early", "No problem"] },
            ],
            [
                { question: "What do you say when you want to hear something again?", answer: "Can you repeat that, please?", wrong: ["Can you listen, please?", "Repeat you, please?", "What do you say?"] },
                { question: "What does a shop assistant usually ask you?", answer: "Can I help you?", wrong: ["Can you help me?", "Do I help you?", "What do you want?"] },
            ],
            [
                { question: "Which question asks about someone's job?", answer: "What do you do?", wrong: ["How do you do?", "What are you doing now?", "What do you make?"] },
                { question: "What do you say before going to bed?", answer: "Good night", wrong: ["Good evening", "Good morning", "Goodbye"] },
            ],
        ],
    },
};
