// chatbot.js

// Function to send message to the bot
async function sendMessageToBot(userInput) {
  try {
    const response = await fetch('/api/getChatResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: userInput }),  // Send user input to the backend
    });

    const data = await response.json();
    return data.botResponse;  // The bot's response is returned
  } catch (error) {
    console.error('Error:', error);
    return 'Sorry, something went wrong!';
  }
}

// Example of how you would handle sending messages
document.getElementById('sendButton').addEventListener('click', async () => {
  const userInput = document.getElementById('userInput').value;  // Get user input from input field
  const botResponse = await sendMessageToBot(userInput);  // Get the bot's response

  // Add the bot's response to the chat UI
  const chatWindow = document.getElementById('chatWindow');
  const botMessageElement = document.createElement('div');
  botMessageElement.textContent = `Bot: ${botResponse}`;
  chatWindow.appendChild(botMessageElement);
});
