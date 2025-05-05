// api/getChatResponse.js

const { Client } = require('pg');  // PostgreSQL client
const fetch = require('node-fetch');  // For making API requests to Together.ai

// Connect to PostgreSQL database (using your existing database setup)
const client = new Client({
    connectionString: process.env.DATABASE_URL,  // Your PostgreSQL connection string from .env
    ssl: { rejectUnauthorized: false }  // For SSL security
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Database connection error', err.stack));

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const userInput = req.body.userInput;

        try {
            // Get AI response from your chosen AI service (e.g., Together.ai)
            const aiResponse = await getAIResponse(userInput);
            console.log('AI Response:', aiResponse);  // Debugging log to check the AI response

            // Save the conversation in PostgreSQL database
            await saveChatToDB(userInput, aiResponse);

            // Send the AI response back to the frontend
            res.status(200).json({ botResponse: aiResponse });
        } catch (error) {
            console.error('Error getting AI response:', error);
            res.status(500).json({ error: 'Failed to get AI response' });
        }
    } else {
        // If the method is not POST, return an error
        res.status(405).json({ error: 'Method not allowed' });
    }
};

// Function to interact with the AI service and get AI response
async function getAIResponse(userText) {
    const response = await fetch('https://api.together.ai/v1/ask', {  // Replace with the correct endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`  // Your AI API key from .env
        },
        body: JSON.stringify({ question: userText })
    });

    const data = await response.json();
    if (data && data.answer) {
        return data.answer;
    } else {
        throw new Error('No response from AI API');
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
