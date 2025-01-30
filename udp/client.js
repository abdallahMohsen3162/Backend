const dgram = require('dgram');



const client = dgram.createSocket('udp4');

const message = Buffer.from('Hello UDP');
client.send(message, 5500, '127.0.0.1', (err) => {
  if (err) console.error(err);
  else console.log('Message sent');
  client.close();
});