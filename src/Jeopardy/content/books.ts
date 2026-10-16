import type { TopicContent } from "./types";

// Books: classic novels, fantasy sagas, Latin American literature, authors and characters. Facts chosen to not go out of date.
export const books: TopicContent = {
    id: "books",
    name: "Books",
    categories: {
        "Classic Novels": [
            [
                { question: "In which book does a girl named Alice fall down a rabbit hole?", answer: "Alice in Wonderland", wrong: ["Peter Pan", "The Wizard of Oz", "Little Women"] },
                { question: "In the story of Pinocchio, what happens when Pinocchio lies?", answer: "His nose grows", wrong: ["His ears grow", "He turns blue", "He starts to cry"] },
            ],
            [
                { question: "In \"Moby-Dick\", what animal does Captain Ahab hunt?", answer: "A white whale", wrong: ["A giant shark", "A sea monster", "A black octopus"] },
                { question: "In \"Frankenstein\", who creates the monster?", answer: "Victor Frankenstein", wrong: ["Count Dracula", "Doctor Jekyll", "Captain Nemo"] },
            ],
            [
                { question: "In a famous Jules Verne novel, Phileas Fogg travels around the world in how many days?", answer: "80 days", wrong: ["30 days", "100 days", "365 days"] },
                { question: "In \"Robinson Crusoe\", where is the main character stuck for many years?", answer: "On an island", wrong: ["In a prison", "In a desert", "On a mountain"] },
            ],
            [
                { question: "In George Orwell's \"1984\", what is the name of the leader who is always watching?", answer: "Big Brother", wrong: ["The Big Boss", "Mr. Watcher", "Father Eye"] },
                { question: "In \"Don Quixote\", what does the hero think the windmills are?", answer: "Giants", wrong: ["Dragons", "Castles", "Soldiers"] },
            ],
            [
                { question: "Which Jane Austen novel tells the story of Elizabeth Bennet and Mr. Darcy?", answer: "Pride and Prejudice", wrong: ["Sense and Sensibility", "Emma", "Persuasion"] },
                { question: "In \"The Great Gatsby\", what color is the light at the end of Daisy's dock?", answer: "Green", wrong: ["Red", "White", "Yellow"] },
            ],
        ],
        "Fantasy & Sagas": [
            [
                { question: "What is the name of Harry Potter's best friend with red hair?", answer: "Ron Weasley", wrong: ["Neville Longbottom", "Draco Malfoy", "Cedric Diggory"] },
                { question: "In Harry Potter, what sport do wizards play on flying broomsticks?", answer: "Quidditch", wrong: ["Gobstones", "Wizard chess", "Broomball"] },
            ],
            [
                { question: "In \"The Hobbit\", which hobbit goes on the adventure with the dwarves?", answer: "Bilbo Baggins", wrong: ["Frodo Baggins", "Samwise Gamgee", "Peregrin Took"] },
                { question: "In The Chronicles of Narnia, what kind of animal is Aslan?", answer: "A lion", wrong: ["A tiger", "A bear", "An eagle"] },
            ],
            [
                { question: "What is the name of the main character in \"The Hunger Games\"?", answer: "Katniss Everdeen", wrong: ["Hermione Granger", "Tris Prior", "Bella Swan"] },
                { question: "Which dark wizard killed Harry Potter's parents?", answer: "Lord Voldemort", wrong: ["Severus Snape", "Lucius Malfoy", "Gellert Grindelwald"] },
            ],
            [
                { question: "In \"The Lord of the Rings\", what kind of creature is Gimli?", answer: "A dwarf", wrong: ["An elf", "A hobbit", "A wizard"] },
                { question: "Who wrote \"A Song of Ice and Fire\", the books behind Game of Thrones?", answer: "George R. R. Martin", wrong: ["J. R. R. Tolkien", "Brandon Sanderson", "Patrick Rothfuss"] },
            ],
            [
                { question: "What is the name of the dragon in \"The Hobbit\"?", answer: "Smaug", wrong: ["Glaurung", "Ancalagon", "Drogon"] },
                { question: "In the Percy Jackson books, Percy is the son of which Greek god?", answer: "Poseidon", wrong: ["Zeus", "Hades", "Apollo"] },
            ],
        ],
        "Latin American Literature": [
            [
                { question: "Which Colombian writer wrote \"One Hundred Years of Solitude\"?", answer: "Gabriel García Márquez", wrong: ["Mario Vargas Llosa", "Jorge Luis Borges", "Pablo Neruda"] },
                { question: "In which country was Gabriel García Márquez born?", answer: "Colombia", wrong: ["Mexico", "Cuba", "Venezuela"] },
            ],
            [
                { question: "What is the name of the town in \"One Hundred Years of Solitude\"?", answer: "Macondo", wrong: ["Comala", "Aracataca", "Santa María"] },
                { question: "The famous poet Pablo Neruda was from which country?", answer: "Chile", wrong: ["Peru", "Argentina", "Uruguay"] },
            ],
            [
                { question: "The writer Jorge Luis Borges was from which country?", answer: "Argentina", wrong: ["Spain", "Chile", "Mexico"] },
                { question: "Which Chilean writer wrote \"The House of the Spirits\"?", answer: "Isabel Allende", wrong: ["Gabriela Mistral", "Laura Esquivel", "Elena Poniatowska"] },
            ],
            [
                { question: "Who wrote the Colombian novel \"María\" (1867)?", answer: "Jorge Isaacs", wrong: ["José Asunción Silva", "Rafael Pombo", "Tomás Carrasquilla"] },
                { question: "Which Colombian poet wrote the children's poems \"Simón el bobito\" and \"El renacuajo paseador\"?", answer: "Rafael Pombo", wrong: ["Jorge Isaacs", "León de Greiff", "José Asunción Silva"] },
            ],
            [
                { question: "Who was the first Latin American writer to win the Nobel Prize in Literature, in 1945?", answer: "Gabriela Mistral", wrong: ["Pablo Neruda", "Octavio Paz", "Miguel Ángel Asturias"] },
                { question: "Which Mexican writer wrote the novel \"Pedro Páramo\"?", answer: "Juan Rulfo", wrong: ["Carlos Fuentes", "Octavio Paz", "Juan José Arreola"] },
            ],
        ],
        "Authors": [
            [
                { question: "Who wrote the Harry Potter books?", answer: "J. K. Rowling", wrong: ["Stephenie Meyer", "Suzanne Collins", "Roald Dahl"] },
                { question: "Who wrote the play \"Romeo and Juliet\"?", answer: "William Shakespeare", wrong: ["Charles Dickens", "Oscar Wilde", "Mark Twain"] },
            ],
            [
                { question: "Who wrote \"Don Quixote\"?", answer: "Miguel de Cervantes", wrong: ["Lope de Vega", "Federico García Lorca", "Benito Pérez Galdós"] },
                { question: "Who wrote \"The Little Prince\"?", answer: "Antoine de Saint-Exupéry", wrong: ["Jules Verne", "Victor Hugo", "Jean de La Fontaine"] },
            ],
            [
                { question: "Who wrote the novel \"Frankenstein\"?", answer: "Mary Shelley", wrong: ["Jane Austen", "Emily Brontë", "Agatha Christie"] },
                { question: "Which author created the detective Sherlock Holmes?", answer: "Arthur Conan Doyle", wrong: ["Agatha Christie", "Edgar Allan Poe", "Charles Dickens"] },
            ],
            [
                { question: "Who wrote \"Twenty Thousand Leagues Under the Sea\"?", answer: "Jules Verne", wrong: ["H. G. Wells", "Alexandre Dumas", "Victor Hugo"] },
                { question: "Who wrote the Russian novel \"War and Peace\"?", answer: "Leo Tolstoy", wrong: ["Fyodor Dostoevsky", "Anton Chekhov", "Nikolai Gogol"] },
            ],
            [
                { question: "What was the real name of the writer Mark Twain?", answer: "Samuel Clemens", wrong: ["Samuel Johnson", "Thomas Clemens", "Henry Thomas"] },
                { question: "Who wrote \"The Metamorphosis\", where a man wakes up as a giant insect?", answer: "Franz Kafka", wrong: ["Albert Camus", "Hermann Hesse", "Thomas Mann"] },
            ],
        ],
        "Characters": [
            [
                { question: "In \"Peter Pan\", what is the name of the little fairy?", answer: "Tinker Bell", wrong: ["Wendy", "Tiger Lily", "Fairy Godmother"] },
                { question: "In \"Little Red Riding Hood\", who does the girl go to visit?", answer: "Her grandmother", wrong: ["Her aunt", "Her teacher", "Her cousin"] },
            ],
            [
                { question: "In \"The Little Prince\", what does the prince love on his planet?", answer: "A rose", wrong: ["A fox", "A star", "A tree"] },
                { question: "What is the name of Sherlock Holmes's friend and helper?", answer: "Doctor Watson", wrong: ["Inspector Lestrade", "Professor Moriarty", "Mycroft Holmes"] },
            ],
            [
                { question: "In \"Charlie and the Chocolate Factory\", who owns the factory?", answer: "Willy Wonka", wrong: ["Augustus Gloop", "Mr. Bucket", "Grandpa Joe"] },
                { question: "In \"Don Quixote\", what is the name of the hero's loyal helper?", answer: "Sancho Panza", wrong: ["Dulcinea", "Rocinante", "Lazarillo"] },
            ],
            [
                { question: "In \"Treasure Island\", what is the name of the pirate with one leg?", answer: "Long John Silver", wrong: ["Captain Hook", "Blackbeard", "Captain Flint"] },
                { question: "In \"Dracula\", in which region is Count Dracula's castle?", answer: "Transylvania", wrong: ["Bavaria", "Sicily", "Siberia"] },
            ],
            [
                { question: "In \"One Hundred Years of Solitude\", what is the last name of the main family?", answer: "Buendía", wrong: ["Ariza", "Vicario", "Daza"] },
                { question: "In \"Moby-Dick\", which character tells the story?", answer: "Ishmael", wrong: ["Ahab", "Queequeg", "Starbuck"] },
            ],
        ],
    },
};
