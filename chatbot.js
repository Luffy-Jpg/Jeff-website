// chatbot.js

async function sendMessageToBot(userInput) {
  const chatWindow = document.getElementById('chatWindow');
  
  // Display user message
  displayMessage(userInput, 'user');
  
  try {
    // Send the user input to the backend (API call)
    const response = await fetch('/api/getChatResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: userInput }),
    });
    
    const data = await response.json();
    const botResponse = data.botResponse;
    
    // Display bot response
    displayMessage(botResponse, 'bot');
  } catch (error) {
    console.error('Error:', error);
    displayMessage('Sorry, something went wrong!', 'bot');
  }
}

// Function to display messages in the chat window
function displayMessage(message, sender) {
  const chatWindow = document.getElementById('chatWindow');
  
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  
  // Add sender-specific class for alignment and styling
  messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
  
  messageElement.innerHTML = `
    <div class="${sender}-message">${message}</div>
    <div class="timestamp">${new Date().toLocaleTimeString()}</div>
  `;
  
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;  // Scroll to the bottom of the chat
}

// Event listener for the send button
document.getElementById('sendButton').addEventListener('click', async () => {
  const userInput = document.getElementById('userInput').value.trim();
  if (userInput !== '') {
    await sendMessageToBot(userInput);
    document.getElementById('userInput').value = '';  // Clear input field
  }
});
