import type { TopicContent } from "./types";

// Reggaeton: its origins, pioneers, Colombian stars, big hits and artist nicknames. Fixed historical facts only.
export const reggaeton: TopicContent = {
    id: "reggaeton",
    name: "Reggaeton",
    categories: {
        "Origins": [
            [
                { question: "Reggaeton became popular in the 1990s on which Caribbean island?", answer: "Puerto Rico", wrong: ["Cuba", "Jamaica", "Trinidad"] },
                { question: "In which language is most reggaeton sung?", answer: "Spanish", wrong: ["English", "Portuguese", "French"] },
            ],
            [
                { question: "What is the name of the famous rhythm used in reggaeton?", answer: "Dembow", wrong: ["Bachata", "Cumbia", "Champeta"] },
                { question: "Reggaeton has roots in which Jamaican music genre?", answer: "Dancehall", wrong: ["Calypso", "Flamenco", "Salsa"] },
            ],
            [
                { question: "\"Reggae en español\", an early form of reggaeton, started in which Central American country?", answer: "Panama", wrong: ["Costa Rica", "Honduras", "Guatemala"] },
                { question: "The \"Dembow\" beat takes its name from a 1990 song by which Jamaican artist?", answer: "Shabba Ranks", wrong: ["Bob Marley", "Sean Paul", "Shaggy"] },
            ],
            [
                { question: "Which Panamanian artist is called a father of \"reggae en español\"?", answer: "El General", wrong: ["El Alfa", "El Chombo", "Tito El Bambino"] },
                { question: "In 1990s Puerto Rico, early reggaeton was often simply called what?", answer: "Underground", wrong: ["Tropical", "Nueva ola", "Salsa dura"] },
            ],
            [
                { question: "Which Puerto Rican DJ made famous 1990s mixtapes where a young Daddy Yankee appeared?", answer: "DJ Playero", wrong: ["DJ Snake", "DJ Khaled", "DJ Luian"] },
                { question: "In which decade did people start using the word \"reggaeton\"?", answer: "The 1990s", wrong: ["The 1970s", "The 1980s", "The 2000s"] },
            ],
        ],
        "Pioneers": [
            [
                { question: "Who sang the 2004 hit \"Gasolina\"?", answer: "Daddy Yankee", wrong: ["Don Omar", "Wisin", "Tego Calderón"] },
                { question: "Daddy Yankee is from which country?", answer: "Puerto Rico", wrong: ["Panama", "Colombia", "Cuba"] },
            ],
            [
                { question: "Which duo is known as \"El Dúo de la Historia\"?", answer: "Wisin & Yandel", wrong: ["Zion & Lennox", "Jowell & Randy", "Alexis & Fido"] },
                { question: "Which artist sang the 2003 hit \"Dale Don Dale\"?", answer: "Don Omar", wrong: ["Daddy Yankee", "Tego Calderón", "Ivy Queen"] },
            ],
            [
                { question: "Which female artist is known as the \"Queen of Reggaeton\"?", answer: "Ivy Queen", wrong: ["Karol G", "Natti Natasha", "Becky G"] },
                { question: "Which artist released the 2002 album \"El Abayarde\"?", answer: "Tego Calderón", wrong: ["Don Omar", "Vico C", "Tito El Bambino"] },
            ],
            [
                { question: "Which Puerto Rican pioneer is known as \"El Filósofo\" (The Philosopher)?", answer: "Vico C", wrong: ["Tego Calderón", "Arcángel", "Héctor el Father"] },
                { question: "What is Daddy Yankee's real name?", answer: "Ramón Ayala", wrong: ["Ramón Ortiz", "Rafael Ayala", "Rubén Torres"] },
            ],
            [
                { question: "Which 2004 Daddy Yankee album includes \"Gasolina\"?", answer: "Barrio Fino", wrong: ["El Cartel", "Mundial", "Prestige"] },
                { question: "What is Don Omar's real name?", answer: "William Omar Landrón", wrong: ["William Omar Rivera", "Wilfredo Omar Díaz", "Omar Luis Torres"] },
            ],
        ],
        "Colombian Reggaeton": [
            [
                { question: "J Balvin is from which Colombian city?", answer: "Medellín", wrong: ["Bogotá", "Cali", "Barranquilla"] },
                { question: "The singer Karol G is from which country?", answer: "Colombia", wrong: ["Mexico", "Spain", "Venezuela"] },
            ],
            [
                { question: "Feid, also called \"Ferxxo\", is famous for which color?", answer: "Green", wrong: ["Pink", "Blue", "Orange"] },
                { question: "Which Colombian artist sang \"Mi Gente\" (2017) with Willy William?", answer: "J Balvin", wrong: ["Maluma", "Feid", "Sebastián Yatra"] },
            ],
            [
                { question: "Maluma's stage name comes from the names of whom?", answer: "His mother, father and sister", wrong: ["His three best friends", "His two grandparents", "His first band"] },
                { question: "What is Karol G's real name?", answer: "Carolina Giraldo Navarro", wrong: ["Carolina Gómez Navarro", "Karla Giraldo Ruiz", "Catalina García Navarro"] },
            ],
            [
                { question: "What is J Balvin's real name?", answer: "José Álvaro Osorio Balvín", wrong: ["José Andrés Ortiz Balvín", "Juan Álvaro Ospina Balvín", "Jorge Alberto Osorio Bernal"] },
                { question: "What is Feid's real name?", answer: "Salomón Villada Hoyos", wrong: ["Samuel Villada Hoyos", "Salomón Vargas Ruiz", "Sebastián Villa Ortiz"] },
            ],
            [
                { question: "Which Colombian artist is known as \"El Cantante del Ghetto\"?", answer: "Ryan Castro", wrong: ["Blessd", "Feid", "J Balvin"] },
                { question: "What was the name of Maluma's first album, from 2012?", answer: "Magia", wrong: ["Pretty Boy, Dirty Boy", "F.A.M.E.", "Papi Juancho"] },
            ],
        ],
        "Hits & Collabs": [
            [
                { question: "Which Puerto Rican singer sang \"Tití Me Preguntó\"?", answer: "Bad Bunny", wrong: ["J Balvin", "Ozuna", "Anuel AA"] },
                { question: "\"Danza Kuduro\" is a hit by which artist?", answer: "Don Omar", wrong: ["Daddy Yankee", "Pitbull", "Wisin"] },
            ],
            [
                { question: "\"Tusa\" (2019) is a song by Karol G and which rapper?", answer: "Nicki Minaj", wrong: ["Cardi B", "Doja Cat", "Megan Thee Stallion"] },
                { question: "\"I Like It\" (2018) is by Cardi B, Bad Bunny and which Colombian singer?", answer: "J Balvin", wrong: ["Maluma", "Feid", "Karol G"] },
            ],
            [
                { question: "Which DJ made \"Taki Taki\" with Selena Gomez, Ozuna and Cardi B?", answer: "DJ Snake", wrong: ["DJ Khaled", "Major Lazer", "Marshmello"] },
                { question: "Which Colombian singer released \"Hawái\" in 2020?", answer: "Maluma", wrong: ["J Balvin", "Feid", "Camilo"] },
            ],
            [
                { question: "Don Omar's \"Danza Kuduro\" (2010) featured which singer?", answer: "Lucenzo", wrong: ["Pitbull", "Prince Royce", "Romeo Santos"] },
                { question: "\"Con Calma\" (2019) by Daddy Yankee featured which Canadian artist?", answer: "Snow", wrong: ["Drake", "Tory Lanez", "Justin Bieber"] },
            ],
            [
                { question: "\"Con Calma\" is based on which 1992 song by Snow?", answer: "Informer", wrong: ["Lonely", "Ice Ice Baby", "Mr. Boombastic"] },
                { question: "What was the name of the 2019 joint album by Bad Bunny and J Balvin?", answer: "Oasis", wrong: ["Desierto", "Paraíso", "Vibras"] },
            ],
        ],
        "Artists & Nicknames": [
            [
                { question: "What is Bad Bunny's name in Spanish?", answer: "El Conejo Malo", wrong: ["El Gato Negro", "El Perro Malo", "El Lobo Feroz"] },
                { question: "Which Latin artist is nicknamed \"Mr. Worldwide\"?", answer: "Pitbull", wrong: ["Daddy Yankee", "Don Omar", "Nicky Jam"] },
            ],
            [
                { question: "Which Puerto Rican singer is nicknamed \"El Negrito Ojos Claros\"?", answer: "Ozuna", wrong: ["Anuel AA", "Myke Towers", "Arcángel"] },
                { question: "Which artist released the 2022 album \"Un Verano Sin Ti\"?", answer: "Bad Bunny", wrong: ["Rauw Alejandro", "Ozuna", "Myke Towers"] },
            ],
            [
                { question: "What is Bad Bunny's real name?", answer: "Benito Antonio Martínez Ocasio", wrong: ["Benito Andrés Martínez Ortiz", "Bernardo Antonio Marín Ocasio", "Benjamín Alberto Martínez Ruiz"] },
                { question: "Nicky Jam was born in which US city?", answer: "Boston", wrong: ["Miami", "New York", "Chicago"] },
            ],
            [
                { question: "Before he was famous, Bad Bunny worked bagging groceries where?", answer: "In a supermarket", wrong: ["In a restaurant", "In a bank", "In a gym"] },
                { question: "What was the name of Daddy Yankee's 2022 farewell tour?", answer: "La Última Vuelta", wrong: ["El Último Baile", "La Gira Final", "Adiós Mundial"] },
            ],
            [
                { question: "What is Ozuna's real name?", answer: "Juan Carlos Ozuna Rosado", wrong: ["Juan Pablo Ozuna Ruiz", "José Carlos Ortiz Rosado", "Juan Carlos Rivera Colón"] },
                { question: "What is Nicky Jam's real name?", answer: "Nick Rivera Caminero", wrong: ["Nick Rivera Montes", "Nicolás Ramos Caminero", "Nick Romero Castillo"] },
            ],
        ],
    },
};
