import type { TopicContent } from "./types";

// Graphic design basics for beginners: principles, color, type, image formats, tools.
// Wrong options are kept close to the answer's length (see lengthGiveaway in the seed script).
export const graphicDesign: TopicContent = {
    id: "graphic-design",
    name: "Graphic Design",
    categories: {
        "Design Principles": [
            [
                { question: "Which principle says related items should be placed close together?", answer: "Proximity", wrong: ["Alignment", "Contrast", "Balance"] },
                { question: "Lining elements up along a common edge is called…", answer: "Alignment", wrong: ["Rotation", "Cropping", "Shadowing"] },
            ],
            [
                { question: "Repeating colors, shapes or fonts across a design creates…", answer: "Consistency (repetition)", wrong: ["Random variety everywhere", "Visual noise", "Empty space"] },
                { question: "What is 'white space'?", answer: "The empty area between elements", wrong: ["A white background color", "A printing error", "The page margins only"] },
            ],
            [
                { question: "A design is 'balanced' when…", answer: "Visual weight is distributed evenly", wrong: ["Both sides are identical copies", "It uses exactly two colors", "Every element is centered"] },
                { question: "Which principle makes the most important element stand out?", answer: "Emphasis (focal point)", wrong: ["Perfect symmetry", "Constant repetition", "Visual unity"] },
            ],
            [
                { question: "The rule of thirds suggests…", answer: "Placing key elements on the lines of a 3×3 grid", wrong: ["Using exactly three colors in a design", "Splitting every page into three columns", "Making every element one third smaller"] },
                { question: "What is visual hierarchy built with?", answer: "Size, color, contrast and position", wrong: ["Only the newest fonts", "Random placement of elements", "The number of images only"] },
            ],
            [
                { question: "Gestalt's 'closure' principle means…", answer: "We mentally complete shapes that are not fully drawn", wrong: ["Designs must end with a footer", "Every single shape needs a fully visible closed border", "Users close pages that load slowly"] },
                { question: "What is a 'mood board'?", answer: "A collage of images and colors that sets a visual direction", wrong: ["A chart that tracks the design team's emotions every week", "A board listing project deadlines", "A palette generated automatically by AI"] },
            ],
        ],
        "Color in Design": [
            [
                { question: "Which are the primary colors of paint?", answer: "Red, yellow and blue", wrong: ["Green, orange and purple", "Black, white and gray", "Red, green and blue"] },
                { question: "Mixing blue and yellow paint gives…", answer: "Green", wrong: ["Purple", "Orange", "Brown"] },
            ],
            [
                { question: "Which color model do screens use?", answer: "RGB", wrong: ["CMYK", "HSB", "CMY"] },
                { question: "Which color model is used for printing?", answer: "CMYK", wrong: ["RGB", "RGBA", "SRGB"] },
            ],
            [
                { question: "Complementary colors are…", answer: "Opposite each other on the color wheel", wrong: ["Next to each other on the color wheel", "Different shades of one color", "Colors that contain white"] },
                { question: "What is a 'tint' of a color?", answer: "The color mixed with white", wrong: ["The color mixed with black", "The color at full saturation", "The color seen in the dark"] },
            ],
            [
                { question: "What does saturation measure?", answer: "How intense or pure a color is", wrong: ["How light or dark a color is", "How transparent a color is", "How warm a color feels"] },
                { question: "What is a hex code like #FF6600?", answer: "A color written for the web", wrong: ["A password for design tools", "A font size in pixels", "A printer cartridge model"] },
            ],
            [
                { question: "Why test a palette in grayscale?", answer: "To check the contrast still works without color", wrong: ["To save colored ink while testing", "Because old monitors were gray", "To make the design load faster"] },
                { question: "What is color temperature?", answer: "How warm or cool a color feels", wrong: ["The heat a screen produces", "The brightness of a monitor", "The age of a color trend"] },
            ],
        ],
        "Type & Lettering": [
            [
                { question: "A font without the small end strokes is called…", answer: "Sans-serif", wrong: ["Serif", "Cursive", "Monospace"] },
                { question: "Which font style slants the letters?", answer: "Italic", wrong: ["Bold", "Underline", "Condensed"] },
            ],
            [
                { question: "What is font size usually measured in?", answer: "Points (pt)", wrong: ["Meters (m)", "Liters (L)", "Watts (W)"] },
                { question: "Which text is easiest to read in long paragraphs?", answer: "Regular weight with good spacing", wrong: ["All capital letters everywhere", "Decorative script fonts", "Very thin light gray text"] },
            ],
            [
                { question: "What is kerning?", answer: "The space between two letters", wrong: ["The height of a letter", "The thickness of a stroke", "The slant of a font"] },
                { question: "What is line height (leading)?", answer: "The vertical space between lines of text", wrong: ["The length of the longest line", "The number of lines per page", "The width of the text column"] },
            ],
            [
                { question: "Pairing fonts works best when…", answer: "They contrast clearly, like a serif with a sans-serif", wrong: ["They are two almost identical serifs", "Both come from the same year", "Both are decorative display fonts"] },
                { question: "What is a 'display' font for?", answer: "Big headlines, not long paragraphs", wrong: ["Screens instead of printed paper", "Long paragraphs of body text", "Numbers and tables only"] },
            ],
            [
                { question: "What are 'widows and orphans' in typography?", answer: "Single lines or words left alone at breaks", wrong: ["Fonts with no family variants", "Letters that overlap each other", "Pages without any headings"] },
                { question: "What does 'x-height' measure?", answer: "The height of lowercase letters like x", wrong: ["The width of the letter x", "The size of capital letters", "The space below the baseline"] },
            ],
        ],
        "Images & Formats": [
            [
                { question: "Which format supports a transparent background?", answer: "PNG", wrong: ["JPG", "BMP", "TXT"] },
                { question: "Which file is a photo most often saved as?", answer: "JPG", wrong: ["SVG", "EXE", "CSS"] },
            ],
            [
                { question: "What kind of image is an SVG?", answer: "A vector image", wrong: ["A photo format", "A video format", "A zipped image"] },
                { question: "What happens when you enlarge a small JPG a lot?", answer: "It becomes pixelated and blurry", wrong: ["It stays perfectly sharp", "It becomes a vector", "It loses its colors"] },
            ],
            [
                { question: "What are raster images made of?", answer: "Pixels", wrong: ["Paths", "Layers", "Vectors"] },
                { question: "Why do logos work best as vectors?", answer: "They scale to any size without losing quality", wrong: ["Vector files always show brighter colors on screens", "Vectors load without internet", "They weigh more than photos"] },
            ],
            [
                { question: "What does image resolution (DPI/PPI) affect?", answer: "How sharp the image prints or displays", wrong: ["How many colors the image can use", "How long the image lasts on disk", "Which programs can open the image"] },
                { question: "What is a 'mockup'?", answer: "A realistic preview of a design in context", wrong: ["The final files sent to the client", "A list of the project requirements", "An old version kept as backup"] },
            ],
            [
                { question: "Which format fits an animated sticker with few colors?", answer: "GIF", wrong: ["RAW", "PSD", "WAV"] },
                { question: "What is 'lossy' compression?", answer: "It shrinks files by discarding some detail", wrong: ["It shrinks files keeping every pixel intact", "It loses the file after compressing", "It only works on text documents"] },
            ],
        ],
        "Tools & Workflow": [
            [
                { question: "Which tool is popular for UI design and prototypes?", answer: "Figma", wrong: ["Excel", "WordPad", "OBS"] },
                { question: "What does 'export' do in a design tool?", answer: "Saves the design as a usable file", wrong: ["Deletes the current project", "Prints the design directly", "Sends the file to the trash"] },
            ],
            [
                { question: "What is a 'layer' in design software?", answer: "A level that stacks elements on top of each other", wrong: ["A backup copy of the whole project made every hour", "A folder on the desktop", "A type of color filter"] },
                { question: "Why name your layers and files clearly?", answer: "So you and the team find things fast later", wrong: ["The software requires unique names", "Unnamed layers get deleted automatically", "Short names make files lighter"] },
            ],
            [
                { question: "What is a design 'asset'?", answer: "A reusable piece like an icon, logo or photo", wrong: ["The money a design costs", "A finished and printed poster", "The computer used for designing"] },
                { question: "What is version history for?", answer: "Going back to earlier states of the file", wrong: ["Counting the hours worked", "Comparing your file with other teams", "Making the file open faster"] },
            ],
            [
                { question: "Before using a photo from the internet you should…", answer: "Check its license and give credit if required", wrong: ["Add a filter so it looks different", "Crop it so nobody recognizes it", "Lower its resolution to be safe"] },
                { question: "What is a 'style guide'?", answer: "Rules for colors, fonts and components of a brand", wrong: ["A magazine that reviews the latest fashion designs", "A tutorial for beginners", "The settings menu of Figma"] },
            ],
            [
                { question: "What is 'handoff' in a design workflow?", answer: "Passing the finished design to developers with specs", wrong: ["Deleting old files after a project", "Showing the design to the client's boss", "Switching from Figma to another tool"] },
                { question: "Raster editor vs vector editor: which pair is right?", answer: "Photoshop edits pixels, Illustrator edits paths", wrong: ["Photoshop edits paths, Illustrator edits pixels", "Both edit only photographs", "Neither can export images"] },
            ],
        ],
    },
};
