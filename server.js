// Import required packages
require('dotenv').config();  // For loading environment variables
const express = require('express');
const { Client } = require('pg');  // PostgreSQL client
const fetch = require('node-fetch');  // To make API requests to XAI
const app = express();
const port = 3000;  // The server will run on this port

// Connect to PostgreSQL database
const client = new Client({
    connectionString: process.env.DATABASE_URL,  // PostgreSQL connection string from your .env file
    ssl: { rejectUnauthorized: false }  // For SSL security
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Database connection error', err.stack));

// Middleware to handle JSON requests
app.use(express.json());

// API route to handle chat messages and get response from XAI
app.post('/getChatResponse', async (req, res) => {
    const userInput = req.body.userInput;
    console.log('User Input:', userInput);  // Debugging log to check input

    try {
        // Get AI response from XAI API
        const aiResponse = await getAIResponse(userInput);
        console.log('AI Response:', aiResponse);  // Debugging log to check the AI response

        // Save the conversation in PostgreSQL database
        await saveChatToDB(userInput, aiResponse);

        // Send the AI response back to the frontend
        res.json({ botResponse: aiResponse });
    } catch (error) {
        console.error('Error getting AI response:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

// Function to interact with the XAI API and get AI response
async function getAIResponse(userText) {
    const response = await fetch('https://api.xai.com/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XAI_API_KEY}`  // Your XAI API key from .env file
        },
        body: JSON.stringify({ prompt: userText })
    });

    const data = await response.json();
    console.log('XAI API Response:', data);  // Debugging log to check the API response

    if (data && data.botResponse) {
        return data.botResponse;
    } else {
        throw new Error('No response from XAI API');
    }
}

// Function to save the chat history in PostgreSQL
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
