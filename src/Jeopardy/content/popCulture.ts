import type { TopicContent } from "./types";

// Games, music, movies and series. Facts chosen to not go out of date.
export const popCulture: TopicContent = {
    id: "pop-culture",
    name: "Popular Culture",
    categories: {
        "Video Games": [
            [
                { question: "What is the name of Mario's brother?", answer: "Luigi", wrong: ["Wario", "Toad", "Yoshi"] },
                { question: "Which company makes the PlayStation?", answer: "Sony", wrong: ["Microsoft", "Nintendo", "Sega"] },
            ],
            [
                { question: "In Minecraft, what does a Creeper do when it gets close to you?", answer: "It explodes", wrong: ["It steals your items", "It turns into a zombie", "It runs away"] },
                { question: "Pikachu is a character from which franchise?", answer: "Pokémon", wrong: ["Digimon", "Mario", "Sonic"] },
            ],
            [
                { question: "What game genre is Fortnite's most famous mode?", answer: "Battle royale", wrong: ["Racing", "Sports", "Puzzle"] },
                { question: "Which company created Mario?", answer: "Nintendo", wrong: ["Sony", "Sega", "Capcom"] },
            ],
            [
                { question: "What does GTA stand for?", answer: "Grand Theft Auto", wrong: ["Great Tank Attack", "Grand Turbo Arena", "Giant Theft Action"] },
                { question: "In The Legend of Zelda, what is the hero's name?", answer: "Link", wrong: ["Zelda", "Ganon", "Navi"] },
            ],
            [
                { question: "What is the best-selling video game of all time?", answer: "Minecraft", wrong: ["Tetris", "GTA V", "Wii Sports"] },
                { question: "Which 1972 arcade game with two paddles and a ball started the industry?", answer: "Pong", wrong: ["Pac-Man", "Space Invaders", "Tetris"] },
            ],
        ],
        "Music": [
            [
                { question: "Which singer is known as the King of Pop?", answer: "Michael Jackson", wrong: ["Elvis Presley", "Prince", "Justin Bieber"] },
                { question: "Which instrument has 88 keys?", answer: "The piano", wrong: ["The guitar", "The violin", "The accordion"] },
            ],
            [
                { question: "Shakira was born in which country?", answer: "Colombia", wrong: ["Mexico", "Spain", "Argentina"] },
                { question: "The Beatles came from which English city?", answer: "Liverpool", wrong: ["London", "Manchester", "Oxford"] },
            ],
            [
                { question: "Which band recorded \"Bohemian Rhapsody\"?", answer: "Queen", wrong: ["The Rolling Stones", "ABBA", "Pink Floyd"] },
                { question: "BTS is a famous band from which country?", answer: "South Korea", wrong: ["Japan", "China", "Thailand"] },
            ],
            [
                { question: "Which Colombian singer is nicknamed \"La Bichota\"?", answer: "Karol G", wrong: ["Shakira", "Greeicy", "Farina"] },
                { question: "\"Despacito\" was sung by Luis Fonsi and which other artist?", answer: "Daddy Yankee", wrong: ["Bad Bunny", "J Balvin", "Maluma"] },
            ],
            [
                { question: "Which composer continued writing music after going deaf?", answer: "Beethoven", wrong: ["Mozart", "Bach", "Chopin"] },
                { question: "In which decade did the Woodstock festival take place?", answer: "The 1960s", wrong: ["The 1950s", "The 1970s", "The 1980s"] },
            ],
        ],
        "Movies": [
            [
                { question: "In Toy Story, what is the name of the cowboy doll?", answer: "Woody", wrong: ["Buzz", "Rex", "Andy"] },
                { question: "Elsa and Anna are sisters in which movie?", answer: "Frozen", wrong: ["Moana", "Tangled", "Brave"] },
            ],
            [
                { question: "What is the name of Harry Potter's school?", answer: "Hogwarts", wrong: ["Hogsmeade", "Gryffindor", "Durmstrang"] },
                { question: "A ring must be destroyed in a volcano in which saga?", answer: "The Lord of the Rings", wrong: ["Harry Potter", "Narnia", "Star Wars"] },
            ],
            [
                { question: "The movie Encanto takes place in which country?", answer: "Colombia", wrong: ["Mexico", "Brazil", "Peru"] },
                { question: "Thanos is the villain of which movie saga?", answer: "Avengers", wrong: ["Justice League", "X-Men", "Transformers"] },
            ],
            [
                { question: "Who directed both Titanic and Avatar?", answer: "James Cameron", wrong: ["Steven Spielberg", "Christopher Nolan", "Peter Jackson"] },
                { question: "In The Matrix, which pill does Neo take?", answer: "The red pill", wrong: ["The blue pill", "The green pill", "Both pills"] },
            ],
            [
                { question: "What was the first feature-length animated Disney movie (1937)?", answer: "Snow White and the Seven Dwarfs", wrong: ["Pinocchio", "Cinderella", "Bambi"] },
                { question: "Hayao Miyazaki co-founded which animation studio?", answer: "Studio Ghibli", wrong: ["Pixar", "Toei Animation", "DreamWorks"] },
            ],
        ],
        "TV Series": [
            [
                { question: "Where does SpongeBob live?", answer: "In a pineapple under the sea", wrong: ["Under a rock", "In a boat", "In a cave"] },
                { question: "In which city do The Simpsons live?", answer: "Springfield", wrong: ["Shelbyville", "Quahog", "South Park"] },
            ],
            [
                { question: "In Stranger Things, what is the dark parallel world called?", answer: "The Upside Down", wrong: ["The Other Side", "The Dark Zone", "The Underworld"] },
                { question: "In which series do robbers wear red suits and Dalí masks?", answer: "Money Heist", wrong: ["Lupin", "Narcos", "Elite"] },
            ],
            [
                { question: "\"Winter is coming\" is a famous phrase from which series?", answer: "Game of Thrones", wrong: ["Vikings", "The Witcher", "Outlander"] },
                { question: "In Breaking Bad, what subject does Walter White teach?", answer: "Chemistry", wrong: ["Physics", "Math", "Biology"] },
            ],
            [
                { question: "In The Office (US), what is the name of the paper company?", answer: "Dunder Mifflin", wrong: ["Sabre", "Scranton Paper Co.", "Prince Paper"] },
                { question: "In Friends, what is the name of the coffee shop?", answer: "Central Perk", wrong: ["Central Park", "The Coffee House", "MacLaren's"] },
            ],
            [
                { question: "What is the name of Doctor Who's time machine?", answer: "The TARDIS", wrong: ["The DeLorean", "The Enterprise", "The Millennium Falcon"] },
                { question: "Black Mirror tells dark stories mainly about what?", answer: "Technology", wrong: ["Magic", "War", "Cooking"] },
            ],
        ],
        "Mixed Bag": [
            [
                { question: "Which superhero got his powers from a spider bite?", answer: "Spider-Man", wrong: ["Batman", "Superman", "Ant-Man"] },
                { question: "What shape is Harry Potter's scar?", answer: "A lightning bolt", wrong: ["A star", "A circle", "A snake"] },
            ],
            [
                { question: "Lionel Messi was born in which country?", answer: "Argentina", wrong: ["Brazil", "Spain", "Uruguay"] },
                { question: "TikTok was created in which country?", answer: "China", wrong: ["United States", "Japan", "South Korea"] },
            ],
            [
                { question: "In which city does Batman fight crime?", answer: "Gotham City", wrong: ["Metropolis", "New York", "Star City"] },
                { question: "Who is the Marvel god of thunder?", answer: "Thor", wrong: ["Loki", "Odin", "Zeus"] },
            ],
            [
                { question: "Which social network has a ghost as its logo?", answer: "Snapchat", wrong: ["Discord", "Telegram", "Reddit"] },
                { question: "What device do Pokémon trainers use to identify Pokémon?", answer: "A Pokédex", wrong: ["A Pokéball", "A Pokénav", "A Pokégear"] },
            ],
            [
                { question: "Stan Lee co-created the heroes of which comic universe?", answer: "Marvel", wrong: ["DC", "Dark Horse", "Image"] },
                { question: "The word \"anime\" refers to animation from which country?", answer: "Japan", wrong: ["China", "South Korea", "United States"] },
            ],
        ],
    },
};
