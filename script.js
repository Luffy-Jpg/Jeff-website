// Function to display messages in the chat window
function displayMessage(message, sender) {
  const chatWindow = document.getElementById('chatWindow');
  const newMessage = document.createElement('div');
  newMessage.classList.add(sender);
  newMessage.textContent = message;
  chatWindow.appendChild(newMessage);
  chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
}

// Function to send a message to the bot and handle the response
async function sendMessageToBot(userInput) {
  const chatWindow = document.getElementById('chatWindow');

  // Display user message
  displayMessage(userInput, 'user');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: userInput }),
    });

    const data = await response.json();

    if (data.error) {
      displayMessage('Sorry, something went wrong!', 'bot');
    } else {
      const botResponse = data.botResponse;
      displayMessage(botResponse, 'bot');
    }
  } catch (error) {
    console.error('Error:', error);
    displayMessage('Sorry, something went wrong!', 'bot');
  }
}

// Event listener for the "Send" button
const sendButton = document.getElementById('sendButton');
const userInputField = document.getElementById('userInputField');

sendButton.addEventListener('click', () => {
  const userInput = userInputField.value;
  if (userInput.trim() !== '') {
    sendMessageToBot(userInput);
    userInputField.value = '';  // Clear the input field after sending
  }
});

// Optional: Allow pressing Enter to send the message
userInputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});
