// api/chat.js
const fetch = require('node-fetch'); // If you're using node-fetch for making API calls

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { userInput } = req.body; // Get user input from the request body
    
    try {
      // Make a request to the chatbot service (you can replace this with your chatbot API)
      const response = await fetch('https://your-chatbot-api-url.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
      });

      const data = await response.json(); // Parse the JSON response from your chatbot

      if (data.error) {
        return res.status(500).json({ error: 'Something went wrong with the chatbot.' });
      }

      // Send back the response from the chatbot
      return res.status(200).json({ botResponse: data.response });
      
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // If the method is not POST, send a 405 error (Method Not Allowed)
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};
