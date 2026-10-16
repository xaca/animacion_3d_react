import type { TopicContent } from "./types";

// Soccer, basketball, US leagues and FIFA. Historical facts chosen to not go out of date.
export const sports: TopicContent = {
    id: "sports",
    name: "Sports",
    categories: {
        "Soccer": [
            [
                { question: "How many players does each soccer team have on the field?", answer: "11", wrong: ["9", "10", "12"] },
                { question: "Which player can use his hands inside his own penalty area?", answer: "Goalkeeper", wrong: ["Defender", "Striker", "Midfielder"] },
            ],
            [
                { question: "What color card does the referee show to send a player off?", answer: "Red", wrong: ["Yellow", "Green", "Blue"] },
                { question: "Cristiano Ronaldo was born in which country?", answer: "Portugal", wrong: ["Spain", "Brazil", "Italy"] },
            ],
            [
                { question: "How long is a normal soccer match, without extra time?", answer: "90 minutes", wrong: ["60 minutes", "80 minutes", "100 minutes"] },
                { question: "Which Spanish club plays at the Santiago Bernabéu stadium?", answer: "Real Madrid", wrong: ["Barcelona", "Atlético Madrid", "Sevilla"] },
            ],
            [
                { question: "Which Colombian player won the Golden Boot at the 2014 World Cup?", answer: "James Rodríguez", wrong: ["Radamel Falcao", "Juan Cuadrado", "Carlos Valderrama"] },
                { question: "Which Brazilian legend won three World Cups as a player?", answer: "Pelé", wrong: ["Ronaldo", "Zico", "Romário"] },
            ],
            [
                { question: "Which English club is nicknamed \"The Red Devils\"?", answer: "Manchester United", wrong: ["Liverpool", "Arsenal", "Manchester City"] },
                { question: "Which player scored the famous \"Hand of God\" goal in 1986?", answer: "Diego Maradona", wrong: ["Gary Lineker", "Michel Platini", "Mario Kempes"] },
            ],
        ],
        "Basketball": [
            [
                { question: "How many players does each basketball team have on the court?", answer: "5", wrong: ["4", "6", "7"] },
                { question: "Which player wore number 23 for the Chicago Bulls in the 1990s?", answer: "Michael Jordan", wrong: ["Kobe Bryant", "LeBron James", "Magic Johnson"] },
            ],
            [
                { question: "How many points is a free throw worth?", answer: "1", wrong: ["2", "3", "4"] },
                { question: "How many points does a basket from behind the long arc line give?", answer: "3", wrong: ["2", "4", "5"] },
            ],
            [
                { question: "Who invented basketball in 1891?", answer: "James Naismith", wrong: ["Walter Camp", "Abner Doubleday", "William Morgan"] },
                { question: "What is it called when a player walks with the ball without bouncing it?", answer: "Traveling", wrong: ["Dribbling", "Blocking", "Charging"] },
            ],
            [
                { question: "Which NBA player was nicknamed \"The Black Mamba\"?", answer: "Kobe Bryant", wrong: ["Shaquille O'Neal", "Tim Duncan", "Allen Iverson"] },
                { question: "How many seconds does an NBA team have to take a shot (shot clock)?", answer: "24", wrong: ["20", "30", "35"] },
            ],
            [
                { question: "What was used as the first basketball hoop?", answer: "A peach basket", wrong: ["A metal ring", "A fishing net", "A wooden box"] },
                { question: "What was the famous name of the 1992 USA Olympic basketball team?", answer: "The Dream Team", wrong: ["The Super Team", "The Gold Team", "The Magic Team"] },
            ],
        ],
        "NBA & NCAA Teams": [
            [
                { question: "The Lakers are an NBA team from which city?", answer: "Los Angeles", wrong: ["Chicago", "New York", "Boston"] },
                { question: "Michael Jordan won six NBA titles with which team?", answer: "Chicago Bulls", wrong: ["Boston Celtics", "Detroit Pistons", "New York Knicks"] },
            ],
            [
                { question: "The Celtics are an NBA team from which city?", answer: "Boston", wrong: ["Miami", "Denver", "Dallas"] },
                { question: "What is March Madness?", answer: "A college basketball tournament", wrong: ["A pro football playoff", "A baseball world series", "A spring soccer league"] },
            ],
            [
                { question: "The Golden State Warriors are from which US state?", answer: "California", wrong: ["Texas", "Florida", "Ohio"] },
                { question: "In the NCAA tournament, what is the \"Final Four\"?", answer: "The last four teams left", wrong: ["The four best players", "The four final minutes", "The four top coaches"] },
            ],
            [
                { question: "What is the name of the NBA team from Miami?", answer: "Miami Heat", wrong: ["Miami Sun", "Miami Fire", "Miami Waves"] },
                { question: "The Utah Jazz first played in which city?", answer: "New Orleans", wrong: ["Kansas City", "Chicago", "Atlanta"] },
            ],
            [
                { question: "Duke University sports teams are called the Blue what?", answer: "Blue Devils", wrong: ["Blue Jays", "Blue Knights", "Blue Hawks"] },
                { question: "What is the nickname of the University of North Carolina teams?", answer: "Tar Heels", wrong: ["Wildcats", "Bulldogs", "Hurricanes"] },
            ],
        ],
        "NFL & NHL Teams": [
            [
                { question: "What is the championship game of the NFL called?", answer: "Super Bowl", wrong: ["World Series", "Stanley Cup", "Final Four"] },
                { question: "What trophy does the NHL champion win?", answer: "Stanley Cup", wrong: ["Davis Cup", "Ryder Cup", "America's Cup"] },
            ],
            [
                { question: "Which sport do the New England Patriots play?", answer: "American football", wrong: ["Ice hockey", "Baseball", "Basketball"] },
                { question: "Which sport do the Montreal Canadiens play?", answer: "Ice hockey", wrong: ["Baseball", "Soccer", "Rugby"] },
            ],
            [
                { question: "The Steelers are an NFL team from which city?", answer: "Pittsburgh", wrong: ["Cleveland", "Detroit", "Baltimore"] },
                { question: "What is the name of the NFL team from Dallas?", answer: "Cowboys", wrong: ["Texans", "Broncos", "Raiders"] },
            ],
            [
                { question: "Super Bowl games are usually numbered with what?", answer: "Roman numerals", wrong: ["Greek letters", "Binary numbers", "Arabic letters"] },
                { question: "What is the name of the NHL team from Chicago?", answer: "Blackhawks", wrong: ["Bruins", "Rangers", "Flyers"] },
            ],
            [
                { question: "Which team won the first Super Bowl in 1967?", answer: "Green Bay Packers", wrong: ["Dallas Cowboys", "Kansas City Chiefs", "Miami Dolphins"] },
                { question: "Which team was NOT one of the NHL's \"Original Six\"?", answer: "Philadelphia Flyers", wrong: ["Boston Bruins", "Detroit Red Wings", "Toronto Maple Leafs"] },
            ],
        ],
        "Leagues & FIFA": [
            [
                { question: "Which sport does FIFA organize?", answer: "Soccer", wrong: ["Basketball", "Tennis", "Baseball"] },
                { question: "What does NBA stand for?", answer: "National Basketball Association", wrong: ["National Baseball Alliance", "North Basketball Association", "National Ball Athletes"] },
            ],
            [
                { question: "What does NFL stand for?", answer: "National Football League", wrong: ["National Field League", "North Football League", "National Fans League"] },
                { question: "How often is the FIFA World Cup played?", answer: "Every four years", wrong: ["Every two years", "Every year", "Every five years"] },
            ],
            [
                { question: "What does NHL stand for?", answer: "National Hockey League", wrong: ["National Hockey Legion", "North Hockey League", "National Hockey Lineup"] },
                { question: "What does MLS stand for, the US soccer league?", answer: "Major League Soccer", wrong: ["Major League Sports", "Main League Soccer", "Modern League Soccer"] },
            ],
            [
                { question: "What does NCAA stand for?", answer: "National Collegiate Athletic Association", wrong: ["National College Athletes Alliance", "North Collegiate Athletic Association", "National Campus Athletic Association"] },
                { question: "Which teams play in the UEFA Champions League?", answer: "Europe's best club teams", wrong: ["Europe's national teams", "South America's top clubs", "The world's youth teams"] },
            ],
            [
                { question: "What does FIFA stand for, in English?", answer: "International Federation of Association Football", wrong: ["International Football Federation of America", "Federation of International Football Athletes", "Football International Federation of Asia"] },
                { question: "Which country hosted the first FIFA World Cup in 1930?", answer: "Uruguay", wrong: ["Brazil", "Italy", "Argentina"] },
            ],
        ],
    },
};
