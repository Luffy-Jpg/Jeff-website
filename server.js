// Import required packages
require('dotenv').config();  // For loading environment variables
const express = require('express');
const { Client } = require('pg');  // PostgreSQL client
const fetch = require('node-fetch');  // To make API requests to Together.ai
const app = express();
const port = 3000;  // The server will run on this port

// Connect to PostgreSQL database (using your previous database setup)
const client = new Client({
    connectionString: process.env.DATABASE_URL,  // PostgreSQL connection string from your .env file
    ssl: { rejectUnauthorized: false }  // For SSL security
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Database connection error', err.stack));

// Middleware to handle JSON requests
app.use(express.json());

// API route to handle chat messages and get response from Together.ai
app.post('/getChatResponse', async (req, res) => {
    const userInput = req.body.userInput;
    console.log('User Input:', userInput);  // Debugging log to check input

    try {
        // Get AI response from Together.ai API
        const aiResponse = await getAIResponse(userInput);
        console.log('AI Response:', aiResponse);  // Debugging log to check the AI response

        // Save the conversation in PostgreSQL database (same previous logic)
        await saveChatToDB(userInput, aiResponse);

        // Send the AI response back to the frontend
        res.json({ botResponse: aiResponse });
    } catch (error) {
        console.error('Error getting AI response:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

// Function to interact with the Together.ai API and get AI response
async function getAIResponse(userText) {
    const response = await fetch('https://api.together.ai/v1/ask', {  // Replace with the correct Together.ai endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`  // Your Together.ai API key from .env file
        },
        body: JSON.stringify({ question: userText })
    });

    const data = await response.json();
    console.log('Together.ai Response:', data);  // Debugging log to check the API response

    if (data && data.answer) {
        return data.answer;
    } else {
        throw new Error('No response from Together.ai');
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
