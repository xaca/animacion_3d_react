// Topic cards shown in the host lobby. Kept separate from content/ so the app
// bundle doesn't ship the questions; the app loads them from Firestore by id.
export type TopicInfo = { id: string; name: string; tagline: string };

export const TOPICS: TopicInfo[] = [
    { id: "java", name: "Java Fundamentals", tagline: "Variables to methods, for beginners" },
    { id: "csharp", name: "C# Fundamentals", tagline: "Variables to methods, for beginners" },
    { id: "javascript", name: "JavaScript Fundamentals", tagline: "Variables, functions, arrays and objects" },
    { id: "html-css", name: "HTML & CSS", tagline: "Tags, selectors, colors and layout" },
    { id: "oop", name: "Object-Oriented Programming", tagline: "Classes, objects, inheritance — any language" },
    { id: "pop-culture", name: "Popular Culture", tagline: "Games, music, movies and series" },
    { id: "english-a1", name: "English A1", tagline: "Beginner English" },
    { id: "english-b1", name: "English B1", tagline: "Intermediate English" },
];
