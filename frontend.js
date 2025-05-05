// frontend.js (your existing code)
async function sendMessageToBot(userInput) {
  const chatWindow = document.getElementById('chatWindow');
  // Display user message
  displayMessage(userInput, 'user');
  try {
    const response = await fetch('/api/chat', { // Request to serverless function
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
