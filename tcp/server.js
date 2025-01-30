const net = require('net');

const url = process.env.URL;

const server = net.createServer((socket) => {

  console.log(`TCP handshake successful with ${socket.remoteAddress}:${socket.remotePort}`);


  socket.write('Hello client!\n');

  socket.on('data', (data) => {
    console.log(`Received data: ${data.toString()}`);
  });
});


server.listen(8800, url, () => {
  console.log('Server listening on port 8800...');
});