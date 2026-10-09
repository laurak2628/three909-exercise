//require gets the express and path library and store them in a variable to be used throughout the code
const express = require("express")
const path = require("path")
const app = express();
const port = process.env.PORT || 3000;

// Allow Express to serve files from the public folder.
// This includes HTML, CSS, client-side JavaScript and images.
app.use(express.static(path.join(__dirname, "public")));

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
    const genre = req.params.genre.toLowerCase();

    const allowedGenres = ["romance", "mystery", "dystopian"];

    if (!allowedGenres.includes(genre)) {
        return res.status(400).send("That genre is not available.");
    }

    res.status(200).send(`You selected the ${genre} genre.`);
});

app.get('/api/getName', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({ name: "Story Maker Machine (Laura K)" });
});

app.get('/api/getImage', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(__dirname,"library_homepage.jpg"));
});

app.use( (req, res) => {
    res.status(404).send("You have wandered too far from your quest. " + "Return to the library and find your path again.");
})

// Custom 500 error handler.
// This handles errors passed to Express.
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).send(
        "Something went wrong in your story. Please try again."
    );
});

app.listen(port, () =>{
    console.log(`Server running at https://three909-exercise.onrender.com/`);
});


//require("dotenv").config()
//const{ S3Client, PutObjectCommand,} = require("@aws-sdk/client-s3")
//const s3 =newS3Client({ endpoint: process.env.B2_ENDPOINT, region:process.env.B2_REGION, 
// credentials:{accessKeyId:process.env.B2_KEY_ID, secretAccessKey: process.env.B2_APPLICATION_KEY}})

//const bucket = process.env.B2_BUCKET

//asunc function uploadFile(key, body, contentType){
//const command = new PutObjectCommand({
//Bucket: bucket, Key: key contentType: contentType})

//await s3.send(command)}


//*****************************MId term ideas ****************************************************** */
//Custom 404- and 500-handlers
    // 404 arelready added
        //add an image showing bath like in wozard of oz
        // one path saying: your here 
        // other path says: get back on the right path to contiune your journey
        //505 working on
//Serving of static files from a directory
    //will create html, css and javascript files to make the site appealing and will have lots of images aswell
//Handle at least one of:
    //Route parameters
        // idea: want to have different route options based on the answers to a quiz 
        //example i will have 3 genres (romance, mystry, dysopian), once you make a selection it will go to a nre route to decide the settings 
    //Querystring parameters
        //not sure what to add 

//Handle information from http-bodies (url-encoded, or general form-data through a body-parser)
    //not sure of an idea to implement 

//Serve at least one HTML form
    //will have a form to get character info 
    //if i have time and think possible will create a doll with the characterisrtic asnswered in the form (hair color, length, skin color, styke of clothing)
        //have to see if possible to do 

//extra deatils: 
    // want each answer of quiz (after selecting start,next, finish) to flip like a page in book
    //have options that have an image describing it and you slide the cursor to view different options
    //must store answers and will have basic starting of a story and the setting, genere and charcter inof must be inputted to the generic 
    //example: "on cold autumm day "character name" enters "setting"...
    //create a file that can be downloaded with the starting text that they can add to 
    //area to work on the story (SPA???) 
        // add log in and then can use url encoding 