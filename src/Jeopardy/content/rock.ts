import type { TopicContent } from "./types";

// Rock music: legends, classic bands, rock en español, albums and subgenres. Facts chosen to not go out of date.
export const rock: TopicContent = {
    id: "rock",
    name: "Rock",
    categories: {
        "Rock Legends": [
            [
                { question: "Elvis Presley is known as the King of what?", answer: "Rock and roll", wrong: ["Soul music", "Country music", "The blues"] },
                { question: "Which instrument did Jimi Hendrix famously play?", answer: "The guitar", wrong: ["The drums", "The piano", "The saxophone"] },
            ],
            [
                { question: "Steven Tyler is the singer of which band?", answer: "Aerosmith", wrong: ["Bon Jovi", "Guns N' Roses", "Def Leppard"] },
                { question: "Kurt Cobain was the singer of which band?", answer: "Nirvana", wrong: ["Pearl Jam", "Soundgarden", "Alice in Chains"] },
            ],
            [
                { question: "Ozzy Osbourne was the singer of which band?", answer: "Black Sabbath", wrong: ["Iron Maiden", "Judas Priest", "Deep Purple"] },
                { question: "Which rock singer is nicknamed \"The Boss\"?", answer: "Bruce Springsteen", wrong: ["Jon Bon Jovi", "Billy Joel", "Tom Petty"] },
            ],
            [
                { question: "Which guitarist is known as \"Slowhand\"?", answer: "Eric Clapton", wrong: ["Jimmy Page", "Jeff Beck", "Keith Richards"] },
                { question: "What is the name of Elvis Presley's home in Memphis?", answer: "Graceland", wrong: ["Neverland", "Paisley Park", "Hollywood"] },
            ],
            [
                { question: "What was Freddie Mercury's real first name?", answer: "Farrokh", wrong: ["Frederick", "Farid", "Firoz"] },
                { question: "Which band did Dave Grohl start after Nirvana ended?", answer: "Foo Fighters", wrong: ["Pearl Jam", "Audioslave", "Soundgarden"] },
            ],
        ],
        "Classic Bands": [
            [
                { question: "How many members did The Beatles have?", answer: "Four", wrong: ["Three", "Five", "Six"] },
                { question: "Which band is famous for wearing black and white face paint?", answer: "Kiss", wrong: ["Queen", "Aerosmith", "Metallica"] },
            ],
            [
                { question: "The band AC/DC was formed in which country?", answer: "Australia", wrong: ["England", "Canada", "United States"] },
                { question: "Which British band had the hit \"Wonderwall\"?", answer: "Oasis", wrong: ["Blur", "Coldplay", "Radiohead"] },
            ],
            [
                { question: "Which member of The Beatles was the drummer?", answer: "Ringo Starr", wrong: ["John Lennon", "Paul McCartney", "George Harrison"] },
                { question: "Which band's logo is a mouth with the tongue sticking out?", answer: "The Rolling Stones", wrong: ["The Ramones", "Led Zeppelin", "The Sex Pistols"] },
            ],
            [
                { question: "Roger Daltrey and Pete Townshend were members of which band?", answer: "The Who", wrong: ["The Kinks", "The Animals", "Cream"] },
                { question: "Which Irish band has a singer called Bono?", answer: "U2", wrong: ["The Cranberries", "Coldplay", "Oasis"] },
            ],
            [
                { question: "What was the name of The Beatles before they became The Beatles?", answer: "The Quarrymen", wrong: ["The Cavern Boys", "The Mersey Kings", "The Iron Lads"] },
                { question: "Which band recorded \"Hotel California\" (1976)?", answer: "Eagles", wrong: ["Fleetwood Mac", "Journey", "Lynyrd Skynyrd"] },
            ],
        ],
        "Rock en Español": [
            [
                { question: "Soda Stereo was a rock band from which country?", answer: "Argentina", wrong: ["Chile", "Mexico", "Spain"] },
                { question: "Maná is a famous rock band from which country?", answer: "Mexico", wrong: ["Colombia", "Spain", "Argentina"] },
            ],
            [
                { question: "Who was the lead singer of Soda Stereo?", answer: "Gustavo Cerati", wrong: ["Charly García", "Fito Páez", "Andrés Calamaro"] },
                { question: "The band Jarabe de Palo, famous for \"La Flaca\", is from which country?", answer: "Spain", wrong: ["Mexico", "Argentina", "Chile"] },
            ],
            [
                { question: "Which Colombian rock band has Andrea Echeverri as its singer?", answer: "Aterciopelados", wrong: ["Doctor Krápula", "Bomba Estéreo", "Los Prisioneros"] },
                { question: "Which Mexican band recorded a famous rock version of \"La Negra Tomasa\"?", answer: "Caifanes", wrong: ["Café Tacvba", "Maná", "Molotov"] },
            ],
            [
                { question: "Before his solo career, which Colombian singer was in the metal band Ekhymosis?", answer: "Juanes", wrong: ["Fonseca", "Andrés Cepeda", "Cabas"] },
                { question: "Which Chilean band sang \"El Baile de los que Sobran\"?", answer: "Los Prisioneros", wrong: ["La Ley", "Los Bunkers", "Los Tres"] },
            ],
            [
                { question: "What was the name of Soda Stereo's 1997 farewell concert?", answer: "El Último Concierto", wrong: ["El Gran Adiós", "La Noche Final", "Hasta Siempre"] },
                { question: "Which Argentine rock musician was nicknamed \"El Flaco\"?", answer: "Luis Alberto Spinetta", wrong: ["Charly García", "Andrés Calamaro", "Gustavo Cerati"] },
            ],
        ],
        "Albums & Songs": [
            [
                { question: "\"We Will Rock You\" is a song by which band?", answer: "Queen", wrong: ["Kiss", "AC/DC", "The Who"] },
                { question: "Which band recorded the song \"Yellow Submarine\"?", answer: "The Beatles", wrong: ["The Who", "The Doors", "The Kinks"] },
            ],
            [
                { question: "\"Sweet Child O' Mine\" is a song by which band?", answer: "Guns N' Roses", wrong: ["Mötley Crüe", "Aerosmith", "Def Leppard"] },
                { question: "\"Livin' on a Prayer\" is a song by which band?", answer: "Bon Jovi", wrong: ["Def Leppard", "Journey", "Van Halen"] },
            ],
            [
                { question: "Which band recorded the album \"The Dark Side of the Moon\"?", answer: "Pink Floyd", wrong: ["Led Zeppelin", "The Doors", "Deep Purple"] },
                { question: "\"Stairway to Heaven\" is a song by which band?", answer: "Led Zeppelin", wrong: ["Deep Purple", "Black Sabbath", "The Eagles"] },
            ],
            [
                { question: "Which Metallica album is known as \"The Black Album\"?", answer: "Metallica", wrong: ["Master of Puppets", "Ride the Lightning", "Kill 'Em All"] },
                { question: "Which band released the album \"Back in Black\" (1980)?", answer: "AC/DC", wrong: ["Kiss", "Metallica", "Judas Priest"] },
            ],
            [
                { question: "Paul McCartney wrote \"Hey Jude\" for which boy?", answer: "Julian Lennon", wrong: ["Sean Lennon", "Zak Starkey", "Dhani Harrison"] },
                { question: "In which year was Pink Floyd's album \"The Wall\" released?", answer: "1979", wrong: ["1973", "1975", "1983"] },
            ],
        ],
        "Instruments & Subgenres": [
            [
                { question: "How many strings does a standard guitar have?", answer: "Six", wrong: ["Four", "Five", "Eight"] },
                { question: "Which instrument usually has four strings and plays the low notes in a rock band?", answer: "The bass guitar", wrong: ["The violin", "The ukulele", "The keyboard"] },
            ],
            [
                { question: "Metallica plays which type of rock?", answer: "Heavy metal", wrong: ["Punk rock", "Grunge", "Soft rock"] },
                { question: "Grunge music started in which US city?", answer: "Seattle", wrong: ["Los Angeles", "New York", "Chicago"] },
            ],
            [
                { question: "The Ramones and the Sex Pistols are famous bands of which genre?", answer: "Punk rock", wrong: ["Grunge", "Heavy metal", "Glam rock"] },
                { question: "What device makes an electric guitar sound loud?", answer: "An amplifier", wrong: ["A microphone", "A metronome", "A capo"] },
            ],
            [
                { question: "In rock music, what is a \"riff\"?", answer: "A repeated guitar phrase", wrong: ["A broken guitar string", "A song with no singing", "A loud scream at the end"] },
                { question: "Black Sabbath, pioneers of heavy metal, formed in which English city?", answer: "Birmingham", wrong: ["Manchester", "London", "Liverpool"] },
            ],
            [
                { question: "Which guitar brand makes the Stratocaster?", answer: "Fender", wrong: ["Gibson", "Ibanez", "Gretsch"] },
                { question: "Which guitar brand makes the Les Paul?", answer: "Gibson", wrong: ["Fender", "Yamaha", "Ibanez"] },
            ],
        ],
    },
};
