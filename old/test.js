const http = require("http");

const app = express();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Course Server</title>
            </head>
            <body>
                <h1>Hello from Laura Katsman's server!</h1>
                <p>This page is being served by Node.js and Express.</p>
            </body>
            </html>
        `);
    }
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
});