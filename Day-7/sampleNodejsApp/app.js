// This requires 'express' and 'redis' npm packages
const express = require('express');
const redis = require('redis');
const app = express();
const port = 80; // Container port

// Get Redis host and port from environment variables
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT) || 6379;

// Create Redis client
const client = redis.createClient({
    socket: {
        host: redisHost,
        port: redisPort
    }
    // Removed legacyMode: true to use the modern redis@4 API directly for clarity
});

// Event listener for Redis connection errors
client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

// Middleware to parse JSON bodies
app.use(express.json());

// --- Define Routes First ---
app.post('/add', async (req, res) => {
    const item = req.body.item;
    if (!item) {
        return res.status(400).send('Item is required');
    }
    try {
        // Correct redis@4 client method for LPUSH
        await client.lPush('myitems', item);
        console.log(`Added "${item}" to Redis.`);
        res.status(200).send(`Added: ${item}`);
    } catch (err) {
        console.error('Error adding item to Redis:', err);
        res.status(500).send('Error adding item to Redis: ' + err.message);
    }
});

app.get('/items', async (req, res) => {
    try {
        // Correct redis@4 client method for LRANGE
        const items = await client.lRange('myitems', 0, -1);
        // Explicitly check if items is undefined or null, though it should be an empty array if empty
        if (!items) { // This handles unexpected undefined/null returns
            console.warn('lRange returned undefined/null. Sending empty array.');
            return res.status(200).json([]);
        }
        console.log('Retrieved items from Redis:', items);
        res.status(200).json(items);
    } catch (err) {
        console.error('Error retrieving items from Redis:', err);
        res.status(500).send('Error retrieving items from Redis: ' + err.message);
    }
});

app.get('/healthz', async (req, res) => {
    try {
        // Correct redis@4 client method for PING
        await client.ping();
        res.status(200).send('OK (Redis connected)');
    } catch (err) {
        res.status(500).send('NOT OK (Redis connection failed): ' + err.message);
    }
});

// --- Connect to Redis and then Start the Server ---
async function startServer() {
    try {
        await client.connect(); // Ensure connection before starting the server
        console.log('Redis client successfully connected!');

        app.listen(port, () => {
            console.log(`Node.js app listening on port ${port}`);
            console.log(`Connecting to Redis at ${redisHost}:${redisPort}`);
        });
    } catch (err) {
        console.error('Failed to start server due to Redis connection error:', err);
        process.exit(1); // Exit if cannot connect to Redis
    }
}

startServer(); // Call the async function to start