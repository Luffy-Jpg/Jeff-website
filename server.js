// server.js
require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const fetch = require('node-fetch'); // To interact with the XAI API
const app = express();
const port = 3000;

// Database connection
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Database connection error', err.stack));

// Set up Express and JSON parsing
app.use(express.json());

// Endpoint to interact with the chatbot
app.post('/getChatResponse', async (req, res) => {
    const userInput = req.body.userInput;

    // Get AI response from XAI API
    const aiResponse = await getAIResponse(userInput);

    // Save the conversation to PostgreSQL
    await saveChatToDB(userInput, aiResponse);

    // Send AI response back
    res.json({ botResponse: aiResponse });
});

// Function to call XAI API
async function getAIResponse(userText) {
    const response = await fetch('https://api.xai.com/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XAI_API_KEY}`
        },
        body: JSON.stringify({ prompt: userText })
    });

    const data = await response.json();
    return data.botResponse; // Assuming `botResponse` is the field in the API response
}

// Function to save chat history in PostgreSQL
async function saveChatToDB(userMessage, botMessage) {
    try {
        const query = 'INSERT INTO chats(user_message, bot_message, timestamp) VALUES($1, $2, NOW())';
        await client.query(query, [userMessage, botMessage]);
        console.log('Chat saved to database');
    } catch (err) {
        console.error('Error saving chat to database:', err);
    }
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
