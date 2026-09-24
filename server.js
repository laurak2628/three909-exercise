const express = require("express")

const app = express();
const port = 3000;

app.get ("/", (req, res) =>{
    res.status(200).send( "Hello, Express");
});

app.get('/api/getName', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({ name: "Library Website" });
});


server.listen(port, () =>{
    console.log (`Server running on https://three909-exercise.onrender.com/`);
});