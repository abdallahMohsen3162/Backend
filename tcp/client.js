const net = require('net');


const client = new net.Socket();
const url = process.env.URL;
client.connect(8800, url, () => {
  console.log('Connected to server');
  client.write('handShake');
});


client.on('data', (data) => {
  console.log('Received data from server:', data.toString());
  client.end();
});


client.on('error', (err) => {
  console.error('Error:', err);
});