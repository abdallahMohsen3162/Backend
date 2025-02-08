// https://glitch.com/edit/#!/muddy-florentine-celsius?path=server.js%3A27%3A17

const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*' // Allow CORS for testing
        });

        let counter = 0;
        const interval = setInterval(() => {
            counter++;
            res.write(`data: { "message": "Update ${counter}" }\n\n`);
        }, 200); // Send an update every 2 seconds

        req.on('close', () => {
            clearInterval(interval);
            console.log('Client disconnected');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => console.log('SSE server running on port 3000'));
