import type { TopicContent } from "./types";

// Pop music: icons, divas, bands, K-pop and famous hits. Facts chosen to not go out of date.
export const pop: TopicContent = {
    id: "pop",
    name: "Pop Music",
    categories: {
        "Pop Icons": [
            [
                { question: "Which singer is known as the Queen of Pop?", answer: "Madonna", wrong: ["Britney Spears", "Lady Gaga", "Cher"] },
                { question: "Taylor Swift started her career in which music genre?", answer: "Country", wrong: ["Rap", "Reggaeton", "Jazz"] },
            ],
            [
                { question: "Which singer calls her fans \"Little Monsters\"?", answer: "Lady Gaga", wrong: ["Katy Perry", "Rihanna", "Ariana Grande"] },
                { question: "Justin Bieber was born in which country?", answer: "Canada", wrong: ["United States", "England", "Australia"] },
            ],
            [
                { question: "Ed Sheeran was born in which country?", answer: "England", wrong: ["Ireland", "Scotland", "Australia"] },
                { question: "Which singer is famous for the song and movie \"Purple Rain\"?", answer: "Prince", wrong: ["Stevie Wonder", "Usher", "Lionel Richie"] },
            ],
            [
                { question: "What is Lady Gaga's real first name?", answer: "Stefani", wrong: ["Stephanie", "Gabriela", "Angela"] },
                { question: "Bruno Mars was born in which US state?", answer: "Hawaii", wrong: ["California", "Florida", "Texas"] },
            ],
            [
                { question: "What was Madonna's first single, released in 1982?", answer: "\"Everybody\"", wrong: ["\"Holiday\"", "\"Lucky Star\"", "\"Borderline\""] },
                { question: "What is Elton John's real name?", answer: "Reginald Dwight", wrong: ["Richard Starkey", "Gordon Sumner", "David Jones"] },
            ],
        ],
        "Divas": [
            [
                { question: "Which singer had the hit song \"Halo\"?", answer: "Beyoncé", wrong: ["Rihanna", "Alicia Keys", "Adele"] },
                { question: "Who sings the Christmas song \"All I Want for Christmas Is You\"?", answer: "Mariah Carey", wrong: ["Whitney Houston", "Celine Dion", "Ariana Grande"] },
            ],
            [
                { question: "Rihanna was born on which Caribbean island?", answer: "Barbados", wrong: ["Jamaica", "Bahamas", "Cuba"] },
                { question: "Celine Dion sang \"My Heart Will Go On\" for which movie?", answer: "Titanic", wrong: ["Avatar", "Pearl Harbor", "Ghost"] },
            ],
            [
                { question: "Adele was born in which city?", answer: "London", wrong: ["Manchester", "Liverpool", "Dublin"] },
                { question: "Whitney Houston starred with Kevin Costner in which 1992 movie?", answer: "The Bodyguard", wrong: ["Pretty Woman", "Dirty Dancing", "Top Gun"] },
            ],
            [
                { question: "Celine Dion was born in which Canadian province?", answer: "Quebec", wrong: ["Ontario", "Alberta", "Nova Scotia"] },
                { question: "Adele's albums \"19\", \"21\", \"25\" and \"30\" are named after what?", answer: "Her age", wrong: ["Her birthday", "Her lucky number", "Her house number"] },
            ],
            [
                { question: "Which character did Ariana Grande play on the TV show Victorious?", answer: "Cat Valentine", wrong: ["Tori Vega", "Sam Puckett", "Jade West"] },
                { question: "What was Beyoncé's first solo studio album (2003)?", answer: "Dangerously in Love", wrong: ["B'Day", "I Am... Sasha Fierce", "Lemonade"] },
            ],
        ],
        "Boy & Girl Bands": [
            [
                { question: "Harry Styles was a member of which band?", answer: "One Direction", wrong: ["Backstreet Boys", "Jonas Brothers", "Take That"] },
                { question: "How many members did the Spice Girls have?", answer: "Five", wrong: ["Three", "Four", "Six"] },
            ],
            [
                { question: "Which boy band sang \"I Want It That Way\"?", answer: "Backstreet Boys", wrong: ["NSYNC", "Westlife", "Boyz II Men"] },
                { question: "One Direction was formed on which TV show?", answer: "The X Factor", wrong: ["American Idol", "The Voice", "Britain's Got Talent"] },
            ],
            [
                { question: "Beyoncé was the lead singer of which girl group?", answer: "Destiny's Child", wrong: ["TLC", "The Pussycat Dolls", "En Vogue"] },
                { question: "Justin Timberlake started his career in which boy band?", answer: "NSYNC", wrong: ["Westlife", "Boyzone", "98 Degrees"] },
            ],
            [
                { question: "The band ABBA came from which country?", answer: "Sweden", wrong: ["Norway", "Denmark", "Finland"] },
                { question: "Who is the youngest of the three Jonas Brothers in the band?", answer: "Nick Jonas", wrong: ["Joe Jonas", "Kevin Jonas", "Frankie Jonas"] },
            ],
            [
                { question: "What was the title of One Direction's first single?", answer: "\"What Makes You Beautiful\"", wrong: ["\"Story of My Life\"", "\"Best Song Ever\"", "\"Little Things\""] },
                { question: "Which Spice Girl was known as \"Posh Spice\"?", answer: "Victoria Beckham", wrong: ["Geri Halliwell", "Mel B", "Emma Bunton"] },
            ],
        ],
        "K-Pop": [
            [
                { question: "What does the \"K\" in K-Pop stand for?", answer: "Korean", wrong: ["Kids", "King", "Karaoke"] },
                { question: "Which singer had the 2012 viral hit \"Gangnam Style\"?", answer: "PSY", wrong: ["Rain", "G-Dragon", "Jungkook"] },
            ],
            [
                { question: "How many members are in BLACKPINK?", answer: "Four", wrong: ["Three", "Five", "Seven"] },
                { question: "What are fans of BTS called?", answer: "ARMY", wrong: ["BLINK", "ONCE", "EXO-L"] },
            ],
            [
                { question: "Which BLACKPINK member is from Thailand?", answer: "Lisa", wrong: ["Jennie", "Jisoo", "Rosé"] },
                { question: "Rosé from BLACKPINK grew up in which country?", answer: "Australia", wrong: ["Canada", "England", "United States"] },
            ],
            [
                { question: "Which BTS member is the leader of the group?", answer: "RM", wrong: ["Jin", "Suga", "V"] },
                { question: "In which year did BTS make their debut?", answer: "2013", wrong: ["2010", "2015", "2017"] },
            ],
            [
                { question: "What was BTS's first song fully in English (2020)?", answer: "\"Dynamite\"", wrong: ["\"Butter\"", "\"Permission to Dance\"", "\"Life Goes On\""] },
                { question: "Which K-pop girl group had the 2009 hit \"Gee\"?", answer: "Girls' Generation", wrong: ["Wonder Girls", "2NE1", "Red Velvet"] },
            ],
        ],
        "Hits & Videos": [
            [
                { question: "Which singer had the 2017 hit \"Shape of You\"?", answer: "Ed Sheeran", wrong: ["Sam Smith", "Shawn Mendes", "Harry Styles"] },
                { question: "Which singer sang \"Uptown Funk\" with Mark Ronson?", answer: "Bruno Mars", wrong: ["Pharrell Williams", "The Weeknd", "Usher"] },
            ],
            [
                { question: "Pharrell Williams' song \"Happy\" was made for which animated movie?", answer: "Despicable Me 2", wrong: ["Minions", "Shrek 2", "Toy Story 3"] },
                { question: "Which British singer had the 2015 hit \"Hello\"?", answer: "Adele", wrong: ["Dua Lipa", "Duffy", "Ellie Goulding"] },
            ],
            [
                { question: "Michael Jackson made which dance move famous?", answer: "The moonwalk", wrong: ["The robot", "The twist", "The floss"] },
                { question: "Which Taylor Swift album has the hit \"Shake It Off\"?", answer: "1989", wrong: ["Red", "Fearless", "Reputation"] },
            ],
            [
                { question: "In the music video for \"Thriller\", Michael Jackson dances with what?", answer: "Zombies", wrong: ["Vampires", "Robots", "Pirates"] },
                { question: "Which singer had the 2007 hit \"Umbrella\"?", answer: "Rihanna", wrong: ["Beyoncé", "Ciara", "Kelly Rowland"] },
            ],
            [
                { question: "What was the first music video ever played on MTV (1981)?", answer: "\"Video Killed the Radio Star\"", wrong: ["\"Money for Nothing\"", "\"Girls Just Want to Have Fun\"", "\"Hungry Like the Wolf\""] },
                { question: "Which band made the famous pencil-sketch video for \"Take On Me\"?", answer: "a-ha", wrong: ["Europe", "Roxette", "Duran Duran"] },
            ],
        ],
    },
};
