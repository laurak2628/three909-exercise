//loads express and path mod to use
const express = require("express")
const path = require("path")
//use special charcters in title, character info and pargraph, needed a way make these  character to html entities so when placed in the 200 response they display correctly 
//found the lodash libaraby which has an escape function which so i dont manually have to make a list using escapeHTML 
//https://lodash.com/docs/4.18.1#escape
const _ = require("lodash");
//creating my express app and assign a port 
const app = express();
const port = process.env.PORT || 3000;

//extracts and loads my data from storyData file to use through object destructuring
const {
    pronounOptions,
    storyOpenings, 
    storyTitles
} = require("./data/storyData");

//registering all my middle ware
//serving files needed, parse my character info and parse any reqest vodies sent as json
// creating a absolute path so express can serve all files form the public folder.
app.use(express.static(path.join(__dirname, "public")));

//telling the server to installl files from node_modules & swiper to allow for my carosuel in the broswer 
app.use( "/swiper", express.static(path.join(__dirname, "node_modules", "swiper")));

// middleware used to parse the data for my character form 
app.use(express.urlencoded({ extended: true }));

// converts requesys sent as json to js to be reable through req.body
app.use(express.json());

// using route parameter to get the the genere and validate to determine the next step in the story gathering 
app.get("/story/:genre", (req, res) => {
    // pull the genre from the url 
    const genre = req.params.genre.toLowerCase();

    // sets default setting per genre  
    const defaultSettings = {
        romance: "Coffee Shop",
        mystery: "Abandoned Carnival",
        dystopian: "Underground City", 
        fantasy: "Enchanted Forest"
    };

    // validate whether the selected genre exists
    if (!defaultSettings[genre]) {
        return res.status(400).send("That genre is not available.");
    }

    // if validation passed auto select the pre-defined setting for this genre.
    const setting = defaultSettings[genre];

    //since setting it predefined go straight to buidling the character 
    res.redirect(
        `/character?genre=${encodeURIComponent(genre)}&setting=${encodeURIComponent(setting)}`
    );
});


//determine the details of the character 
app.get("/character", (req, res) => {
    //reads and trims genre & setting  to compare in validation
    const genre = String(req.query.genre || "").trim().toLowerCase();
    const setting = String(req.query.setting || "").trim();

    //list allowed setting options 
    const allowedSettings = {
        romance: ["Coffee Shop"],
        mystery: ["Abandoned Carnival"],
        dystopian: ["Underground City"],
        fantasy: ["Enchanted Forest"]
    };

    //if genre doesnt matach allowed options show error message 
    if (!allowedSettings[genre]) {
        return res.status(400).send(
            'We could not identify your genre. <a href="/genres.html">Choose a genre again</a>.'
        );
    }

    //checking that based on the genre that minium 1 match is found in the array
    //rn i only have 1 setting per genre but my next update is going to be able to choose your setting 
    //i put this in place to account for the future change
    const validSetting = allowedSettings[genre].some(
        option => option.toLowerCase() === setting.toLowerCase()
    );

    //if validation failed show error message 
    if (!validSetting) {
        return res.status(400).send(
            'Please select a valid setting. <a href="/genres.html">Start again</a>.'
        );
    }

    //if validation succeded server file character.html from public to display the page 
    res.status(200).sendFile(
        path.join(__dirname, "public", "character.html")
    );
});

//set name for class server
app.get('/api/getName', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({ name: "Story Maker Machine (Laura K)" });
});

// created ajax endpoint that returns a random title from my set of pre defined titles based on the selected genre and setting
app.get("/api/story-title", (req, res) => {
    // get the genre and setting from the url 
    const genre = String(req.query.genre || "").trim().toLowerCase();
    const setting = String(req.query.setting || "").trim().toLowerCase();

    // check if the combo genre & setting have title options, if not give error
    if (!storyTitles[genre] || !storyTitles[genre][setting]) {
        return res.status(400).json({
            error: "Invalid genre or setting."
        });
    }

    //get the available titles for the selected combo
    const titles = storyTitles[genre][setting];

    //choose one title randomly
    const randomIndex = Math.floor(Math.random() * titles.length);
    const title = titles[randomIndex];

    // return the title as json
    res.status(200).json({ title: title });
});

//set image for class server
app.get('/api/getImage', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(__dirname,"library_homepage.jpg"));
});

///generate the story using the character details from the form, then display chapter one with an option to download it
app.post("/generate-story", (req, res) => {
    //get the info submitted by the character form, including the title chosen on the previous page
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

    //check that the submitted pronouns match an option from the list, since users could change the form data before submitting
    if (!pronounOptions[pronouns]) {
        return res.status(400).send("Please select valid pronouns.");
    }

    //get the pronoun details that the story opening functions will use when writing about the character
    const selectedPronouns = pronounOptions[pronouns];

    //group the character's details together so they can be passed to the story opening function as one object
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

    //clean up the selected genre and setting so differences in capital letters or extra spaces don't cause a valid choice to fail
    const selectedGenre = String(genre || "").trim().toLowerCase();
    const selectedSetting = String(setting || "").trim().toLowerCase();

    //check that the submitted genre and setting have a matching story opening before trying to generate the chapter
    if (
        !storyOpenings[selectedGenre] ||
        !storyOpenings[selectedGenre][selectedSetting]
    ) {
        return res.status(400).send("Invalid genre or setting.");
    }

    //find the story opening that matches the user's choices, since each genre and setting combination has its own opening
    const selectedStory = storyOpenings[selectedGenre][selectedSetting];
    //run the selected opening function with the character details so the chapter can include the user's character
    const paragraphs = selectedStory(character);

    //prepare a plain text version of the story with the character info and chapter paragraphs for the download button
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

    //send back an html page showing the finished story instead of sending the user back to the form
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
            <main>
                <h2>${_.escape(storyTitle)}</h2>

                <p><strong>Main Character: </strong>${_.escape(character.name)}</p>

                <p><strong>Genre:</strong> ${_.escape(genre)} | <strong>Setting:</strong> ${_.escape(setting)}</p>

                <p><strong>Appearance:</strong> ${_.escape(hairLength)} ${_.escape(hairStyle)}, ${_.escape(hairColour)} hair, ${_.escape(eyeColour)} eyes</p>

                <p><strong>Clothing:</strong> ${_.escape(clothing)}</p>

                ${paragraphs.map(paragraph => `<p>${_.escape(paragraph)}</p>`).join("")}

                <p><em>What happens next is up to you...</em></p>

                <form action="/download-story" method="POST">
                    <textarea name="storyText" hidden>${_.escape(downloadText)}</textarea>
                    <button type="submit">Download Your Story</button>
                    <a href="/">Return to the Library</a>
                </form>
            </main>
        </body>
        </html>
    `);
});

//handle the download button by sending the finished story back as a text file
app.post("/download-story", (req, res) => {
    //get the plain text story sent by the hidden form on the chapter page
    const storyText = req.body.storyText;

    //check that a story was actually provided before trying to send a download
    if (typeof storyText !== "string" || storyText.length === 0) {
        return res.status(400).send("No story was provided to download.");
    }

    //tell the browser to treat the response as a text file and use utf-8 to support text characters
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    //tell the browser to download the response as a file with this name instead of displaying it as a normal page
    res.setHeader("Content-Disposition", 'attachment; filename="StoryMaker.txt"');
    //send the story text as the file contents
    res.send(storyText);
});

////show a custom message when the user visits a url that doesn't match any of the available routes
app.use( (req, res) => {
    res.status(404).send("You have wandered too far from your quest. " + "Return to the library and find your path again.");
})

//catch unexpected errors passed through express so the user gets a message instead of an unhandled server error
app.use((err, req, res, next) => {
    //log the error details in the server terminal to help find and fix the problem
    console.error(err);

    //show a simple message to the user without displaying the technical error details
    res.status(500).send("Something went wrong in your story. Please try again.");
});

app.listen(port, () =>{
    console.log(`Server running at http://localhost:${port}`);
});