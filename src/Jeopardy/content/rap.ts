import type { TopicContent } from "./types";

// Rap and hip-hop: history, legends, classic albums, Latin rap and hip-hop culture. Fixed historical facts only.
export const rap: TopicContent = {
    id: "rap",
    name: "Rap & Hip-Hop",
    categories: {
        "Hip-Hop History": [
            [
                { question: "In which US city was hip-hop born?", answer: "New York", wrong: ["Los Angeles", "Chicago", "Atlanta"] },
                { question: "In rap, what does \"MC\" stand for?", answer: "Master of ceremonies", wrong: ["Music creator", "Microphone controller", "Main composer"] },
            ],
            [
                { question: "Which DJ is often called the founder of hip-hop?", answer: "DJ Kool Herc", wrong: ["Grandmaster Flash", "DJ Jazzy Jeff", "DJ Premier"] },
                { question: "In which decade did hip-hop start?", answer: "The 1970s", wrong: ["The 1950s", "The 1960s", "The 1980s"] },
            ],
            [
                { question: "Which group had the 1979 hit \"Rapper's Delight\"?", answer: "The Sugarhill Gang", wrong: ["Run-DMC", "Public Enemy", "The Beastie Boys"] },
                { question: "Which rap group made \"Walk This Way\" with Aerosmith in 1986?", answer: "Run-DMC", wrong: ["De La Soul", "Public Enemy", "Salt-N-Pepa"] },
            ],
            [
                { question: "On which Bronx street was the 1973 party that started hip-hop?", answer: "Sedgwick Avenue", wrong: ["Fifth Avenue", "Lenox Avenue", "Grand Concourse"] },
                { question: "Which record label was founded by Russell Simmons and Rick Rubin?", answer: "Def Jam", wrong: ["Bad Boy", "Death Row", "Roc-A-Fella"] },
            ],
            [
                { question: "What was the name of Grandmaster Flash's group?", answer: "The Furious Five", wrong: ["The Fearless Four", "The Mighty Five", "The Magic Four"] },
                { question: "In which year was \"Rapper's Delight\" released?", answer: "1979", wrong: ["1975", "1983", "1986"] },
            ],
        ],
        "Legends": [
            [
                { question: "Which rapper is famous for the alter ego \"Slim Shady\"?", answer: "Eminem", wrong: ["Jay-Z", "50 Cent", "Snoop Dogg"] },
                { question: "Jay-Z is married to which singer?", answer: "Beyoncé", wrong: ["Rihanna", "Alicia Keys", "Shakira"] },
            ],
            [
                { question: "What is Eminem's real name?", answer: "Marshall Mathers", wrong: ["Mark Mitchell", "Matthew Miller", "Martin Myers"] },
                { question: "Which rapper starred in the TV show \"The Fresh Prince of Bel-Air\"?", answer: "Will Smith", wrong: ["LL Cool J", "Ice Cube", "Queen Latifah"] },
            ],
            [
                { question: "In which city was Tupac Shakur born?", answer: "New York", wrong: ["Los Angeles", "Oakland", "Baltimore"] },
                { question: "Which rapper's real name is Shawn Carter?", answer: "Jay-Z", wrong: ["Nas", "Diddy", "Kanye West"] },
            ],
            [
                { question: "The Notorious B.I.G. was also known by which name?", answer: "Biggie Smalls", wrong: ["Big Daddy Kane", "Big Pun", "Big Boi"] },
                { question: "Which rapper's real name is Calvin Broadus?", answer: "Snoop Dogg", wrong: ["Ice Cube", "Dr. Dre", "Nate Dogg"] },
            ],
            [
                { question: "What is Dr. Dre's real name?", answer: "Andre Young", wrong: ["Andre Brown", "Anthony Young", "Derek Young"] },
                { question: "In 2018, which rapper became the first to win the Pulitzer Prize for Music?", answer: "Kendrick Lamar", wrong: ["J. Cole", "Drake", "Kanye West"] },
            ],
        ],
        "Albums & Songs": [
            [
                { question: "\"Hotline Bling\" is a song by which rapper?", answer: "Drake", wrong: ["Kanye West", "Future", "Post Malone"] },
                { question: "\"Empire State of Mind\" is a song about which city?", answer: "New York", wrong: ["Chicago", "Los Angeles", "Miami"] },
            ],
            [
                { question: "Eminem's song \"Lose Yourself\" was made for which movie?", answer: "8 Mile", wrong: ["8 Days", "Notorious", "Hustle & Flow"] },
                { question: "Which artist had the 2019 country rap hit \"Old Town Road\"?", answer: "Lil Nas X", wrong: ["Lil Wayne", "Lil Uzi Vert", "Lil Baby"] },
            ],
            [
                { question: "\"Illmatic\" (1994) was the first album of which rapper?", answer: "Nas", wrong: ["Jay-Z", "Mos Def", "Rakim"] },
                { question: "\"The College Dropout\" (2004) was the first album of which artist?", answer: "Kanye West", wrong: ["Pharrell Williams", "Lupe Fiasco", "Common"] },
            ],
            [
                { question: "\"Reasonable Doubt\" (1996) was the first album of which rapper?", answer: "Jay-Z", wrong: ["Nas", "The Notorious B.I.G.", "DMX"] },
                { question: "Before her solo album, Lauryn Hill was a member of which group?", answer: "The Fugees", wrong: ["OutKast", "The Roots", "Black Star"] },
            ],
            [
                { question: "OutKast, the duo behind \"Hey Ya!\", comes from which city?", answer: "Atlanta", wrong: ["Houston", "Memphis", "New Orleans"] },
                { question: "Which group released the album \"The Low End Theory\" in 1991?", answer: "A Tribe Called Quest", wrong: ["De La Soul", "Jungle Brothers", "The Pharcyde"] },
            ],
        ],
        "Latin Rap": [
            [
                { question: "Calle 13 is a music group from which country?", answer: "Puerto Rico", wrong: ["Mexico", "Argentina", "Cuba"] },
                { question: "Which Argentine producer is famous for his music \"Sessions\" with other artists?", answer: "Bizarrap", wrong: ["Duki", "Nicki Nicole", "Paulo Londra"] },
            ],
            [
                { question: "The trap artist Duki is from which country?", answer: "Argentina", wrong: ["Chile", "Spain", "Uruguay"] },
                { question: "Which Argentine artist, born in 1998, sang \"Adán y Eva\"?", answer: "Paulo Londra", wrong: ["Duki", "Nicki Nicole", "Khea"] },
            ],
            [
                { question: "The rapper Canserbero was from which country?", answer: "Venezuela", wrong: ["Colombia", "Peru", "Ecuador"] },
                { question: "What are the stage names of the two founders of Calle 13?", answer: "Residente and Visitante", wrong: ["Residente and Turista", "Visitante and Viajero", "Turista and Viajero"] },
            ],
            [
                { question: "What is the real name of Residente from Calle 13?", answer: "René Pérez Joglar", wrong: ["René Ortiz Medina", "Raúl Pérez Colón", "Rubén Pérez Soto"] },
                { question: "The Colombian group ChocQuibTown takes its name from which region?", answer: "Chocó", wrong: ["Antioquia", "Nariño", "Cauca"] },
            ],
            [
                { question: "The rapper Ana Tijoux, famous in Chile, was born in which country?", answer: "France", wrong: ["Chile", "Argentina", "Spain"] },
                { question: "What is the name of the famous Buenos Aires freestyle competition where Duki became known?", answer: "El Quinto Escalón", wrong: ["La Plaza Roja", "El Tercer Nivel", "La Batalla Final"] },
            ],
        ],
        "Hip-Hop Culture": [
            [
                { question: "What is another name for the dance style \"b-boying\"?", answer: "Breakdancing", wrong: ["Salsa", "Ballet", "Tango"] },
                { question: "In rap, what is a \"freestyle\"?", answer: "Improvised rap", wrong: ["Very fast rap", "Rap about love", "Rap with no beat"] },
            ],
            [
                { question: "Breaking appeared for the first time at which Summer Olympic Games?", answer: "Paris 2024", wrong: ["Tokyo 2020", "London 2012", "Rio 2016"] },
                { question: "What do we call art painted on walls with spray cans?", answer: "Graffiti", wrong: ["Origami", "Pottery", "Mosaic"] },
            ],
            [
                { question: "In hip-hop slang, what is a \"beef\"?", answer: "A rivalry between rappers", wrong: ["A type of beat", "A very long concert", "A dance move"] },
                { question: "What does a DJ move by hand to make a \"scratch\" sound?", answer: "A vinyl record", wrong: ["A microphone", "A drum machine", "A keyboard"] },
            ],
            [
                { question: "Who is credited with inventing the DJ scratch?", answer: "Grand Wizzard Theodore", wrong: ["Grandmaster Flash", "DJ Kool Herc", "Jam Master Jay"] },
                { question: "In hip-hop, what is a \"cypher\"?", answer: "A group rapping in a circle", wrong: ["A secret code in a song", "A solo rap on stage", "A beat made with the mouth"] },
            ],
            [
                { question: "DJ Kool Herc looped the \"break\" of songs. What is the break?", answer: "The drum solo part", wrong: ["The slow intro", "The final chorus", "The sung verse"] },
                { question: "Which hip-hop magazine rated albums with \"mics\" instead of stars?", answer: "The Source", wrong: ["Vibe", "XXL", "Rolling Stone"] },
            ],
        ],
    },
};
