// Topic cards shown in the host setup, organized in groups (the tab row). Kept separate
// from content/ so the app bundle doesn't ship the questions; the app loads them from
// Firestore by id.
export type TopicGroup = { id: string; name: string };
export type TopicInfo = { id: string; name: string; tagline: string; group: string };

export const GROUPS: TopicGroup[] = [
    { id: "coding", name: "💻 Coding" },
    { id: "design", name: "🎨 Design" },
    { id: "ai", name: "🤖 Tech & AI" },
    { id: "english", name: "🇬🇧 English" },
    { id: "culture", name: "🎉 Popular Culture" },
    { id: "music", name: "🎵 Music" },
    { id: "sports", name: "⚽ Sports" },
];

export const TOPICS: TopicInfo[] = [
    { id: "java", name: "Java Fundamentals", tagline: "Variables to methods, for beginners", group: "coding" },
    { id: "csharp", name: "C# Fundamentals", tagline: "Variables to methods, for beginners", group: "coding" },
    { id: "javascript", name: "JavaScript Fundamentals", tagline: "Variables, functions, arrays and objects", group: "coding" },
    { id: "html-css", name: "HTML & CSS", tagline: "Tags, selectors, colors and layout", group: "coding" },
    { id: "oop", name: "Object-Oriented Programming", tagline: "Classes, objects, inheritance — any language", group: "coding" },
    { id: "ux-ui", name: "UX/UI Design", tagline: "Users, layout, color and accessibility", group: "design" },
    { id: "graphic-design", name: "Graphic Design", tagline: "Principles, color, type and formats", group: "design" },
    { id: "ai", name: "Artificial Intelligence", tagline: "ML, prompts, data and safe use", group: "ai" },
    { id: "technology", name: "Technology", tagline: "Gadgets, internet and tech history", group: "ai" },
    { id: "english-a1", name: "English A1", tagline: "Beginner English", group: "english" },
    { id: "english-b1", name: "English B1", tagline: "Intermediate English", group: "english" },
    { id: "pop-culture", name: "Popular Culture", tagline: "Games, music, movies and series", group: "culture" },
    { id: "video-games", name: "Video Games", tagline: "Consoles, characters and classics", group: "culture" },
    { id: "books", name: "Books", tagline: "Classics, sagas and famous authors", group: "culture" },
    { id: "rap", name: "Rap & Hip-Hop", tagline: "Legends, albums and history", group: "music" },
    { id: "reggaeton", name: "Reggaeton", tagline: "Perreo, artists and hits", group: "music" },
    { id: "pop", name: "Pop Music", tagline: "Pop stars and chart hits", group: "music" },
    { id: "rock", name: "Rock", tagline: "Legends, bands and guitar riffs", group: "music" },
    { id: "sports", name: "Sports", tagline: "Soccer, basketball and famous teams", group: "sports" },
];
