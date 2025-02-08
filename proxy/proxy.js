const http = require("http");
const httpProxy = require("http-proxy");
const WebSocket = require("ws");

const servers = ["ws://localhost:3000", "ws://localhost:3001"];
let index = 0;

const proxy = httpProxy.createProxyServer({ ws: true });

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket Load Balancer");
});

server.on("upgrade", (req, socket, head) => {
    const target = servers[index % servers.length];
    index++; // Round-robin balancing
    proxy.ws(req, socket, head, { target });
});

server.listen(8080, () => console.log("WebSocket Proxy running on ws://localhost:8080"));
