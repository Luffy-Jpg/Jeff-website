// Get references to the chat elements
const chatTab = document.getElementById('chatbot-tab'); // You'll need to create this HTML element
const chatWindow = document.getElementById('chat-window'); // You'll need to create this HTML element
const messageInput = document.getElementById('message-input'); // You'll need to create this HTML element
const sendButton = document.getElementById('send-button'); // You might create this

// Function to open/close the chatbot
function toggleChatbot() {
    chatWindow.classList.toggle('open'); // You'll need CSS to control the 'open' class
}

// Event listener for the chat tab
chatTab.addEventListener('click', toggleChatbot);

// Function to send a message
function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (userMessage) {
        displayUserMessage(userMessage);
        messageInput.value = ''; // Clear the input

        // Here you would typically send the userMessage to your server-side endpoint
        // which would then call the Gemini API.
        fetch('/api/gemini', { // Example API endpoint on your server
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            displayBotMessage(data.response); // Assuming the server returns a 'response' field
        })
        .catch(error => {
            console.error('Error sending message to Gemini:', error);
            displayBotMessage('Sorry, I encountered an error.');
        });
    }
}

// Function to display user messages in the chat window
function displayUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('user-message'); // Add CSS for styling
    messageDiv.textContent = message;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the latest message
}

// Function to display bot messages in the chat window
function displayBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('bot-message'); // Add CSS for styling
    messageDiv.textContent = message;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the latest message
}

// Event listener for the send button (if you have one)
if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

// Handle sending message on Enter key press in the input field
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
