const Memcached = require('memcached');

// Create a new Memcached instance
const memcached = new Memcached('localhost:11211');

// Handle connection errors
memcached.on('failure', (details) => {
    console.log('Connection failed:', details.server + ':' + details.port);
});

// Handle reconnection
memcached.on('reconnecting', (details) => {
    console.log('Reconnecting to:', details.server + ':' + details.port);
});

// Simple function to set a key-value pair in Memcached
function setKey(key, value, expirationTime) {

  
    memcached.set(key, value, expirationTime, (err) => {
        if (err) {
            console.error('Error setting key:', err);
        } else {
            console.log(`Key "${key}" set with value "${value}"`);
        }
    });
}

// Simple function to get a value by key from Memcached
function getKey(key) {
    memcached.get(key, (err, data) => {
        if (err) {
            console.error('Error getting key:', err);
        } else {
            console.log(`Value for key "${key}":`, data);
        }
    });
}

// Example usage
setKey('myKey', 'myValue', 10); // Set a key with a 10-second expiration
getKey('myKey'); // Retrieve the value for the key

// Close the Memcached connection after a delay (for demonstration purposes)
setTimeout(() => {
    memcached.end();
    console.log('Memcached connection closed.');
}, 100); // Close after 15 seconds