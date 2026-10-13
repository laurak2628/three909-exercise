//require gets the express and path library and store them in a variable to be used throughout the code
const express = require("express")
const path = require("path")
const app = express();
const port = process.env.PORT || 3000;

const {
    pronounOptions,
    storyOpenings, 
    storyTitles
} = require("./data/storyData");

// Allow Express to serve files from the public folder.
// This includes HTML, CSS, client-side JavaScript and images.
app.use(express.static(path.join(__dirname, "public")));

app.use( "/swiper", express.static(path.join(__dirname, "node_modules", "swiper")));

// Read form data sent using application/x-www-form-urlencoded.
// This will be useful for the character creation form.
app.use(express.urlencoded({ extended: true }));

// Read JSON request bodies if needed by a future feature.
app.use(express.json());

// Homepage
app.get("/", (req, res) => {
    res.status(200).sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

// Example route using a route parameter.
// Example URL: /story/romance
app.get("/story/:genre", (req, res) => {
    // Get the genre selected from the URL.
    const genre = req.params.genre.toLowerCase();

    // List the genres available in the story builder.
    const defaultSettings = {
        romance: "Coffee Shop",
        mystery: "Abandoned Carnival",
        dystopian: "Underground City", 
        fantasy: "Enchanted Forest"
    };

    // Check whether the selected genre exists.
    if (!defaultSettings[genre]) {
        return res.status(400).send("That genre is not available.");
    }

    // Automatically select the default setting for this genre.
    const setting = defaultSettings[genre];

    // Go directly to character creation with both choices in the URL.
    res.redirect(
        `/character?genre=${encodeURIComponent(genre)}&setting=${encodeURIComponent(setting)}`
    );
});


app.get("/character", (req, res) => {
    const genre = String(req.query.genre || "").trim().toLowerCase();
    const setting = String(req.query.setting || "").trim();

    const allowedSettings = {
        romance: ["Coffee Shop"],
        mystery: ["Abandoned Carnival"],
        dystopian: ["Underground City"],
        fantasy: ["Enchanted Forest"]
    };

    if (!allowedSettings[genre]) {
        return res.status(400).send(
            'We could not identify your genre. <a href="/genres.html">Choose a genre again</a>.'
        );
    }

    const validSetting = allowedSettings[genre].some(
        option => option.toLowerCase() === setting.toLowerCase()
    );

    if (!validSetting) {
        return res.status(400).send(
            'Please select a valid setting. <a href="/genres.html">Start again</a>.'
        );
    }

    res.status(200).sendFile(
        path.join(__dirname, "public", "character.html")
    );
});


app.get('/api/getName', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({ name: "Story Maker Machine (Laura K)" });
});

// AJAX endpoint that returns a random title for the selected genre and setting.
app.get("/api/story-title", (req, res) => {
    // Get the genre and setting from the URL query parameters.
    const genre = String(req.query.genre || "").trim().toLowerCase();
    const setting = String(req.query.setting || "").trim().toLowerCase();

    // Check whether this genre and setting have title options.
    if (!storyTitles[genre] || !storyTitles[genre][setting]) {
        return res.status(400).json({
            error: "Invalid genre or setting."
        });
    }

    // Get the available titles for the selected combination.
    const titles = storyTitles[genre][setting];

    // Choose one title randomly.
    const randomIndex = Math.floor(Math.random() * titles.length);
    const title = titles[randomIndex];

    // Return the title as JSON for the browser to use.
    res.status(200).json({ title: title });
});

app.get('/api/getImage', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(__dirname,"library_homepage.jpg"));
});

app.post("/generate-story", (req, res) => {
    // Get the information submitted by the character form.
    const {
        genre,
        setting,
        name,
        pronouns,
        hairColour,
        hairStyle,
        hairLength,
        eyeColour,
        clothing,
        storyTitle
    } = req.body;

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    // Check that the submitted pronouns are valid.
    if (!pronounOptions[pronouns]) {
    return res.status(400).send("Please select valid pronouns.");
    }
    const selectedPronouns = pronounOptions[pronouns];

    // Collect the character details in one object.
    const character = {
        name: name.trim(),
        pronouns,
        selectedPronouns: selectedPronouns,
        hairColour,
        hairStyle,
        hairLength,
        eyeColour,
        clothing
    };
  
    // Find the correct story using the submitted genre and setting.
    const selectedGenre = String(genre || "").trim().toLowerCase();
    const selectedSetting = String(setting || "").trim().toLowerCase();

    // Check that the genre and setting match an existing story.
    if (
        !storyOpenings[selectedGenre] ||
        !storyOpenings[selectedGenre][selectedSetting]
    ) {
        return res.status(400).send("Invalid genre or setting.");
    }

    // Get the matching story opening function.
    const selectedStory = storyOpenings[selectedGenre][selectedSetting];

    // Generate the opening paragraphs using the character's details.
    const paragraphs = selectedStory(character);

    const downloadText = `
        ${storyTitle}

        Character: ${character.name}
        Pronouns: ${character.pronouns}
        Genre: ${genre}
        Setting: ${setting}
        Appearance: ${hairLength} ${hairStyle}, ${hairColour} hair, ${eyeColour} eyes
        Clothing: ${clothing}

        ${paragraphs.join("\n\n")}

        What happens next is up to you...`;
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0">
            <title>Your Story Begins</title>
            <link rel="stylesheet" href="/style.css">
        </head>

        <body>
            <header>
                <h1>Your Story Begins...</h1>
            </header>

            <main>
                <article>
                    <h2><strong>Title: </strong>${escapeHTML(storyTitle)}</h2>

                    <p><strong>Main Chracter: </strong>${escapeHTML(character.name)}</p>

                    <p><strong>Genre:</strong> ${escapeHTML(genre)} | <strong>Setting:</strong> ${escapeHTML(setting)}</p>

                    <p><strong>Appearance:</strong> ${escapeHTML(hairLength)} ${escapeHTML(hairStyle)}, ${escapeHTML(hairColour)} hair, ${escapeHTML(eyeColour)} eyes</p>

                    <p><strong>Clothing:</strong> ${escapeHTML(clothing)}</p>
      
                </article>

                <article>
                    <h2>Chapter One</h2>

                    ${paragraphs.map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join("")}

                    <p><em>What happens next is up to you...</em></p>

                    <form action="/download-story" method="POST">
                        <textarea name="storyText" hidden>${escapeHTML(downloadText)}</textarea>
                        <button type="submit">Download Your Story</button>
                    </form>
                </article>

                <a href="/">Return to the Library</a>
            </main>
        </body>
        </html>
    `);
});

app.post("/download-story", (req, res) => {
    const storyText = req.body.storyText;

    // Make sure the story text was provided.
    if (typeof storyText !== "string" || storyText.length === 0) {
        return res.status(400).send("No story was provided to download.");
    }

    // Tell the browser to download the response as a text file.
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader( "Content-Disposition", 'attachment; filename="StoryMaker.txt"');
    res.send(storyText);
});

app.use( (req, res) => {
    res.status(404).send("You have wandered too far from your quest. " + "Return to the library and find your path again.");
})

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send( "Something went wrong in your story. Please try again.");
});

app.listen(port, () =>{
    console.log(`Server running at https://three909-exercise.onrender.com/`);
});