import type { TopicContent } from "./types";

// Video games: Nintendo, consoles, characters, genres and classic games. Facts chosen to not go out of date.
export const videoGames: TopicContent = {
    id: "video-games",
    name: "Video Games",
    categories: {
        "Nintendo": [
            [
                { question: "What color is Mario's hat?", answer: "Red", wrong: ["Green", "Blue", "Yellow"] },
                { question: "What is the name of the green dinosaur that Mario rides?", answer: "Yoshi", wrong: ["Bowser", "Koopa", "Birdo"] },
            ],
            [
                { question: "What is the name of the princess that Mario often rescues?", answer: "Peach", wrong: ["Daisy", "Zelda", "Rosalina"] },
                { question: "What is the name of the big turtle king who kidnaps Princess Peach?", answer: "Bowser", wrong: ["Wario", "Ganon", "King Boo"] },
            ],
            [
                { question: "In Mario games, which item makes Mario bigger?", answer: "A Super Mushroom", wrong: ["A Fire Flower", "A Super Star", "A Green Shell"] },
                { question: "What color is Kirby?", answer: "Pink", wrong: ["Yellow", "Blue", "Red"] },
            ],
            [
                { question: "What was Mario's original name in the 1981 game Donkey Kong?", answer: "Jumpman", wrong: ["Runman", "Barrelman", "Hammerman"] },
                { question: "Before making video games, Nintendo was famous for making what?", answer: "Playing cards", wrong: ["Toy cars", "Board games", "Wooden dolls"] },
            ],
            [
                { question: "In which Japanese city was Nintendo founded in 1889?", answer: "Kyoto", wrong: ["Tokyo", "Osaka", "Nagoya"] },
                { question: "Which Nintendo designer created both Mario and The Legend of Zelda?", answer: "Shigeru Miyamoto", wrong: ["Satoru Iwata", "Hideo Kojima", "Masahiro Sakurai"] },
            ],
        ],
        "Consoles & Companies": [
            [
                { question: "Which company makes the Xbox?", answer: "Microsoft", wrong: ["Sony", "Nintendo", "Sega"] },
                { question: "Which company made the Game Boy?", answer: "Nintendo", wrong: ["Sony", "Sega", "Atari"] },
            ],
            [
                { question: "Which company created Sonic the Hedgehog?", answer: "Sega", wrong: ["Nintendo", "Capcom", "Konami"] },
                { question: "Which Nintendo console from 2006 was famous for its motion controls?", answer: "Wii", wrong: ["GameCube", "Nintendo 64", "Super Nintendo"] },
            ],
            [
                { question: "Which company created Steam, the famous store for PC games?", answer: "Valve", wrong: ["Epic Games", "Ubisoft", "Blizzard"] },
                { question: "Which company created the Street Fighter series?", answer: "Capcom", wrong: ["Sega", "Namco", "SNK"] },
            ],
            [
                { question: "In which year did the first PlayStation come out in Japan?", answer: "1994", wrong: ["1990", "1998", "2000"] },
                { question: "Which company created Pac-Man?", answer: "Namco", wrong: ["Atari", "Taito", "Konami"] },
            ],
            [
                { question: "What was the name of Sega's last home console, released in 1998?", answer: "Dreamcast", wrong: ["Saturn", "Genesis", "Game Gear"] },
                { question: "Which game company was founded by Nolan Bushnell and Ted Dabney in 1972?", answer: "Atari", wrong: ["Activision", "Sega", "Magnavox"] },
            ],
        ],
        "Iconic Characters": [
            [
                { question: "What color is Sonic the Hedgehog?", answer: "Blue", wrong: ["Red", "Green", "Purple"] },
                { question: "Which yellow character eats dots and runs away from ghosts?", answer: "Pac-Man", wrong: ["Kirby", "Dig Dug", "Q*bert"] },
            ],
            [
                { question: "What is the name of Sonic's friend, the fox with two tails?", answer: "Tails", wrong: ["Knuckles", "Shadow", "Amy"] },
                { question: "Which Pokémon is a small orange lizard with fire on its tail?", answer: "Charmander", wrong: ["Squirtle", "Bulbasaur", "Vulpix"] },
            ],
            [
                { question: "Lara Croft is the hero of which game series?", answer: "Tomb Raider", wrong: ["Uncharted", "Resident Evil", "Far Cry"] },
                { question: "Master Chief is the hero of which game series?", answer: "Halo", wrong: ["Gears of War", "Doom", "Destiny"] },
            ],
            [
                { question: "In Pac-Man, what color is the ghost named Blinky?", answer: "Red", wrong: ["Pink", "Orange", "Green"] },
                { question: "Kratos is the main character of which game series?", answer: "God of War", wrong: ["Devil May Cry", "Dark Souls", "Assassin's Creed"] },
            ],
            [
                { question: "Solid Snake is the hero of which game series?", answer: "Metal Gear", wrong: ["Splinter Cell", "Hitman", "Syphon Filter"] },
                { question: "In the Metroid games, what is the name of the hero in the power suit?", answer: "Samus Aran", wrong: ["Fox McCloud", "Captain Falcon", "Mega Man"] },
            ],
        ],
        "Game Genres & Terms": [
            [
                { question: "In video games, what does \"Game Over\" mean?", answer: "You lost the game", wrong: ["You won the game", "You paused the game", "You saved the game"] },
                { question: "What do we call a game where many people play together?", answer: "Multiplayer", wrong: ["Single-player", "Offline", "Tutorial"] },
            ],
            [
                { question: "In games, what does \"HP\" usually stand for?", answer: "Health points", wrong: ["High power", "Hit pause", "Hero points"] },
                { question: "What do we call the strongest enemy at the end of a level?", answer: "The boss", wrong: ["The captain", "The guard", "The master"] },
            ],
            [
                { question: "What does \"NPC\" mean in video games?", answer: "Non-player character", wrong: ["New power card", "Next player code", "Normal play class"] },
                { question: "What genre is a game where you build and manage a city, like SimCity?", answer: "Simulation", wrong: ["Fighting", "Platformer", "Rhythm"] },
            ],
            [
                { question: "What does \"RPG\" stand for?", answer: "Role-playing game", wrong: ["Rapid power gaming", "Real player graphics", "Random puzzle game"] },
                { question: "What is a \"speedrun\"?", answer: "Finishing a game as fast as possible", wrong: ["Playing a game with no sound", "Running in a racing game", "Buying a game on its launch day"] },
            ],
            [
                { question: "What genre is a game where you lose everything when you die and the levels change every time?", answer: "Roguelike", wrong: ["Soulslike", "Metroidvania", "Sandbox"] },
                { question: "What does \"FPS\" mean as a game genre?", answer: "First-person shooter", wrong: ["Fast power strategy", "Final player score", "Free play simulator"] },
            ],
        ],
        "Classics & Records": [
            [
                { question: "In Tetris, what do you do with the falling blocks?", answer: "Complete full lines", wrong: ["Build a tall tower", "Shoot them down", "Match three colors"] },
                { question: "In Super Mario games, what round gold objects do you collect?", answer: "Coins", wrong: ["Rings", "Stars", "Gems"] },
            ],
            [
                { question: "In which country was Tetris created?", answer: "The Soviet Union", wrong: ["Japan", "The United States", "Germany"] },
                { question: "In Space Invaders, what attacks the player from the top of the screen?", answer: "Aliens", wrong: ["Zombies", "Robots", "Dragons"] },
            ],
            [
                { question: "In which year was Super Mario Bros. released for the NES?", answer: "1985", wrong: ["1980", "1990", "1995"] },
                { question: "In the 1981 game Donkey Kong, what does the ape throw at the player?", answer: "Barrels", wrong: ["Bananas", "Rocks", "Coconuts"] },
            ],
            [
                { question: "Who created Tetris?", answer: "Alexey Pajitnov", wrong: ["Shigeru Miyamoto", "Hideo Kojima", "Satoru Iwata"] },
                { question: "Which 1993 game made first-person shooters popular, with players fighting demons?", answer: "Doom", wrong: ["Quake", "Wolfenstein 3D", "Half-Life"] },
            ],
            [
                { question: "Which handheld console came with Tetris in the box in North America in 1989?", answer: "Game Boy", wrong: ["Game Gear", "Atari Lynx", "Nintendo DS"] },
                { question: "Who designed the 1980 arcade game Pac-Man?", answer: "Toru Iwatani", wrong: ["Yu Suzuki", "Gunpei Yokoi", "Hideo Kojima"] },
            ],
        ],
    },
};
