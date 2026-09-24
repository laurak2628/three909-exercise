const express = require("express")

const app = express();
const port = 3000;

app.get ("/", (req, res) =>{
    res.status(200).send( "Hello, Express");
});

app.get('/api/getName', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({ name: "Laura's Website" });
});

 app.get('/api/getImage', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.sendFile('C:\Users\Laura\Documents\Adv Int Programing\Exersice\library_homepage.jpg');
});

server.listen(port, () =>{
    console.log (`Server running on https://three909-exercise.onrender.com/`);
});