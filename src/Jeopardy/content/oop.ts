import type { TopicContent } from "./types";

// Object-oriented programming concepts, independent of any language.
export const oop: TopicContent = {
    id: "oop",
    name: "Object-Oriented Programming",
    categories: {
        "Classes & Objects": [
            [
                { question: "What is a class?", answer: "A blueprint for creating objects", wrong: ["A variable that holds text", "A loop that repeats code", "A file on disk"] },
                { question: "What is an object?", answer: "An instance of a class", wrong: ["A type of loop", "A function without a name", "A comment in the code"] },
            ],
            [
                { question: "What is a method?", answer: "A function that belongs to a class", wrong: ["A variable inside a class", "A class inside a class", "A type of comment"] },
                { question: "What do we call the variables that belong to an object?", answer: "Attributes (fields)", wrong: ["Parameters", "Constants", "Arguments"] },
            ],
            [
                { question: "What is a constructor?", answer: "A special method that runs when an object is created", wrong: ["A method that deletes an object", "A method that prints the object", "The first method written in the file"] },
                { question: "If Car is a class, what is myCar here?", code: "myCar = new Car()", answer: "An object (instance) of Car", wrong: ["A method of Car", "A copy of the class", "A subclass of Car"] },
            ],
            [
                { question: "What does \"this\" (or \"self\") refer to inside a method?", answer: "The object the method was called on", wrong: ["The class itself", "The parent class", "The last object created"] },
                { question: "What is the difference between a class and an object?", answer: "A class is the definition; an object is a concrete instance", wrong: ["There is none", "Objects are bigger than classes", "An object contains many classes"] },
            ],
            [
                { question: "What is a static (class) member?", answer: "A member shared by all instances, belonging to the class itself", wrong: ["A member that cannot change", "A member only the constructor can use", "A member stored on disk"] },
                { question: "Two objects created from the same class with the same values are…", answer: "Two different objects with equal state", wrong: ["The same object", "Impossible to create", "Automatically merged into one"] },
            ],
        ],
        "Encapsulation": [
            [
                { question: "Encapsulation means…", answer: "Hiding an object's data and exposing it through methods", wrong: ["Copying an object", "Deleting unused objects", "Writing all code in one file"] },
                { question: "Which access modifier hides a member from other classes?", answer: "private", wrong: ["public", "hidden", "secret"] },
            ],
            [
                { question: "What is a getter?", answer: "A method that returns the value of a private attribute", wrong: ["A method that deletes an attribute", "A loop that gets items", "A constructor"] },
                { question: "What is a setter?", answer: "A method that changes the value of a private attribute", wrong: ["A method that prints an attribute", "A method that creates objects", "A constant"] },
            ],
            [
                { question: "Why make attributes private?", answer: "To control how they are read and changed", wrong: ["To make the program faster", "To save memory", "Because public attributes cannot be strings"] },
                { question: "What is a benefit of validating inside a setter?", answer: "Invalid values can be rejected (e.g. a negative age)", wrong: ["The attribute becomes public", "The object is created faster", "The constructor is no longer needed"] },
            ],
            [
                { question: "A class whose state cannot change after creation is called…", answer: "Immutable", wrong: ["Static", "Abstract", "Volatile"] },
                { question: "What does \"public\" mean?", answer: "Accessible from any other class", wrong: ["Accessible only inside the class", "Accessible only by subclasses", "Visible only in the constructor"] },
            ],
            [
                { question: "Which access level usually allows subclasses but not unrelated classes?", answer: "protected", wrong: ["private", "public", "internal"] },
                { question: "What is information hiding?", answer: "Exposing only what other code needs and hiding the internal details", wrong: ["Encrypting the source code", "Deleting the comments", "Using short variable names"] },
            ],
        ],
        "Inheritance": [
            [
                { question: "Inheritance lets a class…", answer: "Reuse the attributes and methods of another class", wrong: ["Run faster", "Have two names", "Avoid using objects"] },
                { question: "If Dog inherits from Animal, Animal is the…", answer: "Parent (super) class", wrong: ["Child class", "Interface", "Object"] },
            ],
            [
                { question: "If Dog inherits from Animal, Dog is the…", answer: "Child (sub) class", wrong: ["Parent class", "Constructor", "Package"] },
                { question: "Which relationship describes inheritance?", answer: "\"is a\" (a Dog is an Animal)", wrong: ["\"has a\"", "\"uses a\"", "\"calls a\""] },
            ],
            [
                { question: "What does \"override\" mean?", answer: "A subclass provides its own version of an inherited method", wrong: ["Deleting a method", "Making a method private", "Calling a method twice"] },
                { question: "Which is a good use of inheritance?", answer: "Circle and Square inheriting from Shape", wrong: ["Car inheriting from Engine", "String inheriting from Integer", "Dog inheriting from Cat"] },
            ],
            [
                { question: "What is \"super\" (or \"base\") used for?", answer: "Accessing the parent class's constructor or methods", wrong: ["Creating a super object", "Making a method static", "Declaring a constant"] },
                { question: "What is a \"has a\" relationship called?", answer: "Composition", wrong: ["Inheritance", "Overloading", "Recursion"] },
            ],
            [
                { question: "Why do many languages forbid inheriting from two classes?", answer: "Conflicts when both parents define the same method (diamond problem)", wrong: ["Objects would be too big", "Constructors would run twice", "Compilers cannot read two files"] },
                { question: "What does \"favor composition over inheritance\" suggest?", answer: "Build objects from other objects instead of deep class hierarchies", wrong: ["Never use classes", "Put all code in the parent class", "Use inheritance only for strings"] },
            ],
        ],
        "Polymorphism": [
            [
                { question: "Polymorphism literally means…", answer: "Many forms", wrong: ["One form", "No form", "Fast form"] },
                { question: "If Dog and Cat both override speak(), calling speak() on each gives…", answer: "Different behavior for each animal", wrong: ["The same sound", "An error", "Nothing"] },
            ],
            [
                { question: "What is method overloading?", answer: "Several methods with the same name but different parameters", wrong: ["Replacing a parent method", "Calling a method many times", "A method with no parameters"] },
                { question: "What is method overriding?", answer: "A subclass redefines a method inherited from its parent", wrong: ["Two methods with the same name in one class", "Deleting a method", "Making a method static"] },
            ],
            [
                { question: "What does this show?", code: "Animal a = new Dog();", answer: "A subclass object used through a parent type", wrong: ["A compile error", "Two objects created", "Dog becomes Animal forever"] },
                { question: "Which speak() runs here?", code: "Animal a = new Dog();\na.speak();", answer: "Dog's version (runtime polymorphism)", wrong: ["Animal's version", "Both", "Neither"] },
            ],
            [
                { question: "Which kind of polymorphism is resolved at compile time?", answer: "Overloading", wrong: ["Overriding", "Inheritance", "Encapsulation"] },
                { question: "What is duck typing?", answer: "If it has the needed methods, it can be used, whatever its class", wrong: ["A class named Duck", "Inheritance between birds", "A compile-time check of types"] },
            ],
            [
                { question: "What is dynamic dispatch?", answer: "Choosing the method implementation from the object's real type at runtime", wrong: ["Loading classes from the internet", "Running methods in parallel", "Sorting methods by name"] },
                { question: "Why is polymorphism useful?", answer: "Code can work with many types through one common interface", wrong: ["It makes objects smaller", "It removes the need for methods", "It prevents inheritance"] },
            ],
        ],
        "Abstraction & Design": [
            [
                { question: "Abstraction means…", answer: "Showing only the essential features and hiding complexity", wrong: ["Making code longer", "Copying classes", "Removing all methods"] },
                { question: "What is an interface?", answer: "A contract listing methods a class must implement", wrong: ["A class with all methods implemented", "A graphical window", "A variable type"] },
            ],
            [
                { question: "Can you create an object directly from an abstract class?", answer: "No", wrong: ["Yes, always", "Only if it is public", "Only in Java"] },
                { question: "An abstract method…", answer: "Has no body and must be implemented by subclasses", wrong: ["Returns nothing", "Is always private", "Runs automatically"] },
            ],
            [
                { question: "Which is true about interfaces in most languages?", answer: "A class can implement many interfaces", wrong: ["A class can implement only one", "Interfaces have constructors", "Interfaces store data"] },
                { question: "What are the four pillars of OOP?", answer: "Encapsulation, inheritance, polymorphism, abstraction", wrong: ["Variables, loops, functions, classes", "Input, process, output, storage", "Create, read, update, delete"] },
            ],
            [
                { question: "What does the Single Responsibility Principle say?", answer: "A class should have one reason to change", wrong: ["Only one class per program", "A method can have one line", "One object per class"] },
                { question: "What is a UML class diagram used for?", answer: "Showing classes, their members and relationships", wrong: ["Running the program", "Testing performance", "Compiling code"] },
            ],
            [
                { question: "What is coupling?", answer: "How much one class depends on another", wrong: ["Joining two files", "The number of methods in a class", "Running two programs together"] },
                { question: "What is a design pattern?", answer: "A reusable solution to a common design problem", wrong: ["A color scheme for the IDE", "A sorting algorithm", "A type of variable"] },
            ],
        ],
    },
};
