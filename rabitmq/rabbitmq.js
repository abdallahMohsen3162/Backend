const amqp = require('amqplib');

const RABBITMQ_URL = "amqps://bwgikhwi:YV0l6Fn6FUdOfTWhJvBDouPW7zE6BXsR@possum.lmq.cloudamqp.com/bwgikhwi";

async function testRabbitMQ() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log("Connected to RabbitMQ");

    // Create a channel
    const channel = await connection.createChannel();

    // Declare a queue
    const queueName = 'testQueue';
    await channel.assertQueue(queueName, { durable: false });
    console.log(`Queue "${queueName}" is ready`);

    // Send a test message
    const testMessage = 'Hello, RabbitMQ!';
    channel.sendToQueue(queueName, Buffer.from(testMessage));
    console.log(`Sent message: "${testMessage}"`);

    // Consume the message
    channel.consume(
      queueName,
      (msg) => {
        if (msg) {
          console.log(`Received message: "${msg.content.toString()}"`);
          // Acknowledge the message
          channel.ack(msg);
        }
      },
      { noAck: false }
    );

    // Close the connection after a timeout
    setTimeout(() => {
      connection.close();
      console.log("Connection closed");
      process.exit(0);
    }, 5000); // Wait 5 seconds before closing
  } catch (error) {
    console.error("Error:", error);
  }
}






async function editMessage(queueName, targetKey, newValue) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Ensure the queue exists
    await channel.assertQueue(queueName, { durable: true });

    console.log(`Waiting for messages in queue: ${queueName}`);

    // Consume messages from the queue
    channel.consume(queueName, async (msg) => {
      if (msg) {
        const messageContent = JSON.parse(msg.content.toString());

        // Skip already processed messages
        if (messageContent.processed) {
          console.log(`Skipping already processed message: ${JSON.stringify(messageContent)}`);
          channel.ack(msg);
          return;
        }

        // Check if the target key exists in the message
        if (typeof messageContent[targetKey] !== 'undefined') {
          // Update the value of the target key
          messageContent[targetKey] = newValue;

          // Add a processed flag
          messageContent.processed = true;

          console.log(`Modified message: ${JSON.stringify(messageContent)}`);

          // Republish the updated message to the same queue
          try {
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messageContent)));
            console.log(`Updated message republished: ${JSON.stringify(messageContent)}`);
            channel.ack(msg); // Acknowledge the original message only after successful republish
          } catch (publishError) {
            console.error("Failed to republish message:", publishError);
            // Optionally requeue the original message for retry
          }
        } else {
          console.log(`Key "${targetKey}" not found in message: ${msg.content.toString()}`);
          await channel.ack(msg); // Acknowledge messages even if not modified
        }
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}



async function enqueueToQueue(queueName, key, value) {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Ensure the queue exists
    await channel.assertQueue(queueName, { durable: false });

    // Create a message in key-value format
    const message = JSON.stringify({ [key]: value });

    // Send the message to the queue
    await channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Message sent to queue "${queueName}": ${message}`);

    // Close the connection after sending the message
    setTimeout(() => {
      connection.close();
      console.log("Connection closed");
    }, 500);
  } catch (error) {
    console.error("Error:", error);
  }
}



// Example usage
// enqueueToQueue("testQueue", "key", "val");
editMessage("testQueue", "key", "val2");
// testRabbitMQ()

