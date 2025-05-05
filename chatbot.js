async function sendMessageToBot(userInput) {
  try {
    console.log("User Input: ", userInput);  // Debugging log
    const response = await fetch('/api/getChatResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: userInput }),
    });

    const data = await response.json();
    console.log("Bot Response: ", data);  // Check the bot response
    return data.botResponse;
  } catch (error) {
    console.error('Error:', error);
    return 'Sorry, something went wrong!';
  }
}
