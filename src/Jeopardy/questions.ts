// `wrong` holds the 3 incorrect options shown next to the answer
export type QA = { question: string; answer: string; wrong: string[] };

// `options` is the answer plus the wrong options, already shuffled
export type Tile = { question: string; answer: string; options: string[]; value: number; used: boolean };

export type Category = { name: string; tiles: Tile[] };

export const VALUES = [200, 400, 600, 800, 1000];
export const CATEGORIES_PER_GAME = 4;
// Labels for the 4 answer options
export const LETTERS = ["A", "B", "C", "D"];

// Each category has questions grouped by difficulty: index 0 = easiest (200) ... 4 = hardest (1000).
// Exported so the test script can check every question has 3 unique wrong options.
export const BANK: Record<string, QA[][]> = {
    Vocabulary: [
        [
            { question: "What do you call a baby dog?", answer: "A puppy", wrong: ["A kitten", "A cub", "A calf"] },
            { question: "What is the color of the sky on a clear day?", answer: "Blue", wrong: ["Green", "Red", "Yellow"] },
        ],
        [
            { question: "What do you call the room where you cook?", answer: "The kitchen", wrong: ["The bedroom", "The bathroom", "The garage"] },
            { question: "What is a person who teaches called?", answer: "A teacher", wrong: ["A student", "A doctor", "A driver"] },
        ],
        [
            { question: "What is a word for 'very happy'?", answer: "Delighted", wrong: ["Exhausted", "Furious", "Anxious"] },
            { question: "What do you call a place where you borrow books?", answer: "A library", wrong: ["A bookshop", "A bakery", "A pharmacy"] },
        ],
        [
            { question: "What does 'reluctant' mean?", answer: "Unwilling or hesitant", wrong: ["Very excited", "Extremely tired", "Easy to understand"] },
            { question: "What does 'ancient' mean?", answer: "Very old", wrong: ["Very new", "Very large", "Very fast"] },
        ],
        [
            { question: "What does 'ubiquitous' mean?", answer: "Present everywhere", wrong: ["Very rare", "Extremely large", "Impossible to see"] },
            { question: "What does 'meticulous' mean?", answer: "Very careful and precise", wrong: ["Careless and quick", "Loud and rude", "Shy and quiet"] },
        ],
    ],
    Grammar: [
        [
            { question: "Complete: She ___ a student.", answer: "is", wrong: ["am", "are", "be"] },
            { question: "Complete: They ___ happy.", answer: "are", wrong: ["am", "is", "be"] },
        ],
        [
            { question: "What is the plural of 'child'?", answer: "Children", wrong: ["Childs", "Childrens", "Childes"] },
            { question: "What is the plural of 'mouse'?", answer: "Mice", wrong: ["Mouses", "Mices", "Meese"] },
        ],
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
            {
                question: "Complete: By next year, I ___ here for ten years.",
                answer: "will have been working",
                wrong: ["will be working", "have worked", "would work"],
            },
            {
                question: "Complete: If she had studied, she ___ the exam.",
                answer: "would have passed",
                wrong: ["would pass", "will have passed", "had passed"],
            },
        ],
    ],
    Spelling: [
        [
            { question: "Spell the number 8.", answer: "E-I-G-H-T", wrong: ["E-I-G-T-H", "A-I-G-H-T", "E-I-T-E"] },
            { question: "Spell the day after Monday.", answer: "T-U-E-S-D-A-Y", wrong: ["T-U-S-E-D-A-Y", "T-H-U-E-S-D-A-Y", "T-U-E-Z-D-A-Y"] },
        ],
        [
            { question: "Spell the month after January.", answer: "F-E-B-R-U-A-R-Y", wrong: ["F-E-B-U-A-R-Y", "F-E-B-R-U-A-R-I", "F-E-B-R-A-R-Y"] },
            { question: "Spell the opposite of 'enemy'.", answer: "F-R-I-E-N-D", wrong: ["F-R-E-I-N-D", "F-R-E-N-D", "F-R-I-N-D"] },
        ],
        [
            { question: "Which is spelled correctly? (to get something)", answer: "Receive", wrong: ["Recieve", "Receeve", "Resieve"] },
            { question: "Which is spelled correctly? (very pretty)", answer: "Beautiful", wrong: ["Beatiful", "Beautifull", "Beutiful"] },
        ],
        [
            { question: "Which is spelled correctly? (needed)", answer: "Necessary", wrong: ["Neccessary", "Necesary", "Neccesary"] },
            { question: "Which is spelled correctly? (for sure)", answer: "Definitely", wrong: ["Definately", "Definitly", "Defenitely"] },
        ],
        [
            { question: "Which is spelled correctly? (a place to stay)", answer: "Accommodation", wrong: ["Acommodation", "Accomodation", "Acomodation"] },
            { question: "Which is spelled correctly? (to make someone feel ashamed)", answer: "Embarrass", wrong: ["Embarass", "Embarras", "Enbarrass"] },
        ],
    ],
    Opposites: [
        [
            { question: "What is the opposite of 'hot'?", answer: "Cold", wrong: ["Warm", "Wet", "Dry"] },
            { question: "What is the opposite of 'big'?", answer: "Small", wrong: ["Tall", "Wide", "Heavy"] },
        ],
        [
            { question: "What is the opposite of 'early'?", answer: "Late", wrong: ["Soon", "Fast", "Before"] },
            { question: "What is the opposite of 'cheap'?", answer: "Expensive", wrong: ["Cheerful", "Free", "Poor"] },
        ],
        [
            { question: "What is the opposite of 'generous'?", answer: "Selfish", wrong: ["Kind", "Gentle", "Rich"] },
            { question: "What is the opposite of 'remember'?", answer: "Forget", wrong: ["Remind", "Repeat", "Recall"] },
        ],
        [
            { question: "What is the opposite of 'increase'?", answer: "Decrease", wrong: ["Raise", "Grow", "Expand"] },
            { question: "What is the opposite of 'ancient'?", answer: "Modern", wrong: ["Old", "Antique", "Historic"] },
        ],
        [
            { question: "What is the opposite of 'scarce'?", answer: "Plentiful", wrong: ["Rare", "Limited", "Scared"] },
            { question: "What is the opposite of 'optimistic'?", answer: "Pessimistic", wrong: ["Hopeful", "Realistic", "Positive"] },
        ],
    ],
    "Irregular Verbs": [
        [
            { question: "Past tense of 'go'?", answer: "Went", wrong: ["Goed", "Gone", "Going"] },
            { question: "Past tense of 'eat'?", answer: "Ate", wrong: ["Eated", "Eaten", "Eat"] },
        ],
        [
            { question: "Past tense of 'buy'?", answer: "Bought", wrong: ["Buyed", "Brought", "Boughten"] },
            { question: "Past tense of 'see'?", answer: "Saw", wrong: ["Seed", "Seen", "Sawn"] },
        ],
        [
            { question: "Past participle of 'write'?", answer: "Written", wrong: ["Wrote", "Writed", "Writen"] },
            { question: "Past participle of 'speak'?", answer: "Spoken", wrong: ["Spoke", "Speaked", "Spoked"] },
        ],
        [
            { question: "Past tense and past participle of 'catch'?", answer: "Caught, caught", wrong: ["Catched, catched", "Caught, catched", "Cought, cought"] },
            { question: "Past tense and past participle of 'teach'?", answer: "Taught, taught", wrong: ["Teached, teached", "Thought, thought", "Taught, teached"] },
        ],
        [
            { question: "Past tense and past participle of 'forbid'?", answer: "Forbade, forbidden", wrong: ["Forbid, forbid", "Forbidded, forbidded", "Forbade, forbade"] },
            { question: "Past tense and past participle of 'swear'?", answer: "Swore, sworn", wrong: ["Sweared, sweared", "Swore, swore", "Sware, sworn"] },
        ],
    ],
    Idioms: [
        [
            { question: "Complete the idiom: 'It's raining cats and ___.'", answer: "dogs", wrong: ["mice", "birds", "frogs"] },
            { question: "Complete the idiom: 'A piece of ___' (very easy).", answer: "cake", wrong: ["bread", "pie", "paper"] },
        ],
        [
            { question: "What does 'break a leg' mean?", answer: "Good luck", wrong: ["Get hurt", "Be careful", "Run fast"] },
            { question: "What does 'under the weather' mean?", answer: "Feeling sick", wrong: ["Feeling cold", "Outside in the rain", "Very happy"] },
        ],
        [
            { question: "What does 'hit the books' mean?", answer: "To study hard", wrong: ["To read for fun", "To throw books", "To be angry"] },
            { question: "What does 'cost an arm and a leg' mean?", answer: "To be very expensive", wrong: ["To be dangerous", "To be very cheap", "To hurt a lot"] },
        ],
        [
            { question: "What does 'let the cat out of the bag' mean?", answer: "To reveal a secret", wrong: ["To free an animal", "To go shopping", "To make a mistake"] },
            { question: "What does 'once in a blue moon' mean?", answer: "Very rarely", wrong: ["Every night", "At midnight", "Very often"] },
        ],
        [
            {
                question: "What does 'bite the bullet' mean?",
                answer: "To face something difficult bravely",
                wrong: ["To get angry", "To eat quickly", "To avoid a problem"],
            },
            {
                question: "What does 'beat around the bush' mean?",
                answer: "To avoid the main point",
                wrong: ["To work in the garden", "To win easily", "To speak very directly"],
            },
        ],
    ],
};

function shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function pickOne<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

export function markUsed(board: Category[], col: number, row: number): Category[] {
    return board.map((category, c) => ({
        ...category,
        tiles: category.tiles.map((tile, r) => (c === col && r === row ? { ...tile, used: true } : tile)),
    }));
}

export function allUsed(board: Category[]): boolean {
    return board.every((category) => category.tiles.every((tile) => tile.used));
}

export function buildBoard(): Category[] {
    const names = shuffle(Object.keys(BANK)).slice(0, CATEGORIES_PER_GAME);
    return names.map((name) => ({
        name,
        tiles: VALUES.map((value, level) => {
            const { question, answer, wrong } = pickOne(BANK[name][level]);
            return { question, answer, options: shuffle([answer, ...wrong]), value, used: false };
        }),
    }));
}
