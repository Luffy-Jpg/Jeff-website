const express = require('express');
const Together = require('together-ai'); // Import Together.ai
const app = express();
const together = new Together(); // Initialize the Together instance

app.use(express.json());

// Define the API endpoint to interact with the chatbot
app.post('/api/chat', async (req, res) => {
  const { userInput } = req.body; // Get user input from request

  try {
    // Create chat completion request
    const stream = await together.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      messages: [
        { role: 'user', content: userInput }, // Use user input in message
      ],
      stream: true,
    });

    let responseContent = '';
    
    // Process stream chunks
    for await (const chunk of stream) {
      responseContent += chunk.choices[0]?.delta?.content || '';
    }

    res.json({ botResponse: responseContent }); // Return bot response
  } catch (error) {
    console.error('Error with AI API:', error);
    res.status(500).json({ error: 'Something went wrong with the chatbot API' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
