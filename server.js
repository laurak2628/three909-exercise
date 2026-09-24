const express = require("express")
const path = require("path")

const app = express();
const port = 3000;

app.get ("/", (req, res) =>{
    res.status(200).send( "Welcome to my Library site...more content to follow");
});

app.get('/api/getName', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({ name: "Library Website" });
});

app.get('/api/getImage', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(__dirname,"library_homepage.jpg"));
});

app.listen(port, () =>{
    console.log (`Server running on https://three909-exercise.onrender.com/`);
});