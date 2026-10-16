import type { TopicContent } from "./types";

// Computers, the Internet, phones, tech companies and tech history. Facts chosen to not go out of date.
export const technology: TopicContent = {
    id: "technology",
    name: "Technology",
    categories: {
        "Hardware": [
            [
                { question: "Which part of a computer do you use to type letters?", answer: "Keyboard", wrong: ["Mouse", "Monitor", "Speaker"] },
                { question: "Which device puts text and pictures on paper?", answer: "Printer", wrong: ["Scanner", "Projector", "Webcam"] },
            ],
            [
                { question: "What does CPU stand for?", answer: "Central Processing Unit", wrong: ["Computer Power Unit", "Central Program Utility", "Control Processing Unit"] },
                { question: "Which device do you move by hand to control the pointer on the screen?", answer: "Mouse", wrong: ["Keyboard", "Speaker", "Microphone"] },
            ],
            [
                { question: "What does RAM stand for?", answer: "Random Access Memory", wrong: ["Read Access Memory", "Rapid Action Memory", "Random Active Module"] },
                { question: "What is the main board that connects all the parts of a computer?", answer: "Motherboard", wrong: ["Power supply", "Heat sink", "Sound card"] },
            ],
            [
                { question: "How many bits are in one byte?", answer: "8", wrong: ["4", "10", "16"] },
                { question: "What does SSD stand for?", answer: "Solid State Drive", wrong: ["Super Speed Disk", "Solid Storage Device", "System State Drive"] },
            ],
            [
                { question: "What does USB stand for?", answer: "Universal Serial Bus", wrong: ["Universal System Bus", "United Serial Board", "Universal Storage Bus"] },
                { question: "What does BIOS stand for?", answer: "Basic Input/Output System", wrong: ["Binary Input/Output Software", "Basic Internal Operating System", "Built-In Operating Setup"] },
            ],
        ],
        "Internet & Web": [
            [
                { question: "What do you call a program like Chrome or Firefox, used to visit websites?", answer: "Web browser", wrong: ["Text editor", "Antivirus", "Spreadsheet"] },
                { question: "Which symbol is always part of an email address?", answer: "@", wrong: ["#", "&", "%"] },
            ],
            [
                { question: "What does WWW stand for?", answer: "World Wide Web", wrong: ["Wide World Web", "World Web Wide", "Web World Wide"] },
                { question: "What is a URL?", answer: "A web address", wrong: ["A type of virus", "A computer part", "A file format"] },
            ],
            [
                { question: "What does HTTP stand for?", answer: "HyperText Transfer Protocol", wrong: ["HyperText Transfer Program", "High Transfer Text Protocol", "HyperLink Text Protocol"] },
                { question: "What does the \"S\" in HTTPS mean?", answer: "Secure", wrong: ["Simple", "Speed", "Server"] },
            ],
            [
                { question: "Who invented the World Wide Web in 1989?", answer: "Tim Berners-Lee", wrong: ["Bill Gates", "Steve Jobs", "Vint Cerf"] },
                { question: "What does a DNS server do?", answer: "Turns domain names into IP addresses", wrong: ["Stores your saved passwords", "Blocks viruses from websites", "Speeds up your video calls"] },
            ],
            [
                { question: "What was the name of the early network that became the Internet?", answer: "ARPANET", wrong: ["BITNET", "USENET", "TELNET"] },
                { question: "What does \"IP\" in \"IP address\" stand for?", answer: "Internet Protocol", wrong: ["Internal Program", "Internet Provider", "Information Path"] },
            ],
        ],
        "Smartphones & Apps": [
            [
                { question: "Which company makes the iPhone?", answer: "Apple", wrong: ["Samsung", "Google", "Huawei"] },
                { question: "Which messaging app has a green logo with a white phone?", answer: "WhatsApp", wrong: ["Telegram", "Messenger", "Signal"] },
            ],
            [
                { question: "What is the name of Google's operating system for phones?", answer: "Android", wrong: ["iOS", "Symbian", "Windows"] },
                { question: "Which photo app owned by Meta is famous for its \"Stories\"?", answer: "Instagram", wrong: ["Snapchat", "Pinterest", "Flickr"] },
            ],
            [
                { question: "What is the name of Apple's voice assistant?", answer: "Siri", wrong: ["Alexa", "Cortana", "Bixby"] },
                { question: "What is the name of Google's app store for Android phones?", answer: "Google Play", wrong: ["App Store", "Galaxy Store", "Amazon Appstore"] },
            ],
            [
                { question: "In which year was the first iPhone presented?", answer: "2007", wrong: ["2004", "2010", "2001"] },
                { question: "What does SIM in \"SIM card\" stand for?", answer: "Subscriber Identity Module", wrong: ["System Identity Memory", "Secure Internet Module", "Signal Information Module"] },
            ],
            [
                { question: "What does GPS stand for?", answer: "Global Positioning System", wrong: ["General Position Service", "Global Phone Signal", "Ground Positioning Satellite"] },
                { question: "What does the \"G\" in 4G or 5G mean?", answer: "Generation", wrong: ["Gigabyte", "Gigahertz", "Global"] },
            ],
        ],
        "Tech Companies": [
            [
                { question: "Which company makes the Windows operating system?", answer: "Microsoft", wrong: ["Apple", "Google", "IBM"] },
                { question: "Which company makes the Galaxy phones?", answer: "Samsung", wrong: ["Apple", "Nokia", "Motorola"] },
            ],
            [
                { question: "Who founded Microsoft together with Paul Allen?", answer: "Bill Gates", wrong: ["Steve Jobs", "Mark Zuckerberg", "Elon Musk"] },
                { question: "Mark Zuckerberg created which social network in 2004?", answer: "Facebook", wrong: ["Twitter", "Instagram", "MySpace"] },
            ],
            [
                { question: "Who founded Apple together with Steve Wozniak in 1976?", answer: "Steve Jobs", wrong: ["Bill Gates", "Larry Page", "Jeff Bezos"] },
                { question: "Samsung is a company from which country?", answer: "South Korea", wrong: ["Japan", "Hong Kong", "Taiwan"] },
            ],
            [
                { question: "When Amazon started in 1994, what did it sell online?", answer: "Books", wrong: ["Music", "Shoes", "Toys"] },
                { question: "Google's founders met as students at which university?", answer: "Stanford", wrong: ["Harvard", "MIT", "Berkeley"] },
            ],
            [
                { question: "What was the original name of Google's search engine?", answer: "BackRub", wrong: ["PageRank", "SearchIt", "WebCrawler"] },
                { question: "What does IBM stand for?", answer: "International Business Machines", wrong: ["Internet Business Machines", "International Binary Machines", "Integrated Business Management"] },
            ],
        ],
        "Tech History": [
            [
                { question: "What did Alexander Graham Bell invent?", answer: "The telephone", wrong: ["The light bulb", "The radio", "The television"] },
                { question: "What were floppy disks used for?", answer: "Storing files", wrong: ["Charging phones", "Cooling computers", "Printing photos"] },
            ],
            [
                { question: "What was the Sony Walkman used for?", answer: "Listening to music", wrong: ["Taking photos", "Making calls", "Playing games"] },
                { question: "What did people use a dial-up modem for?", answer: "Connecting to the Internet", wrong: ["Printing documents", "Watching TV shows", "Charging batteries"] },
            ],
            [
                { question: "Who is known as the first computer programmer?", answer: "Ada Lovelace", wrong: ["Marie Curie", "Grace Hopper", "Alan Turing"] },
                { question: "Which company released the Game Boy in 1989?", answer: "Nintendo", wrong: ["Sega", "Sony", "Atari"] },
            ],
            [
                { question: "Which British scientist helped break the Enigma code and is called the father of computer science?", answer: "Alan Turing", wrong: ["Isaac Newton", "Charles Babbage", "Tim Berners-Lee"] },
                { question: "What was ENIAC, built in the 1940s?", answer: "An early electronic computer", wrong: ["The first video game", "The first mobile phone", "An early space rocket"] },
            ],
            [
                { question: "In which year did Ray Tomlinson send the first network email?", answer: "1971", wrong: ["1965", "1983", "1990"] },
                { question: "What was the first commercial microprocessor, released in 1971?", answer: "Intel 4004", wrong: ["Intel 8086", "Motorola 68000", "Zilog Z80"] },
            ],
        ],
    },
};
