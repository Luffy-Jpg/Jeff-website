// Get elements from HTML
const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Function to display messages
function displayMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to send message and get response from backend
async function handleUserInput() {
    const userText = userInput.value.trim().toLowerCase();
    
    if (userText) {
        displayMessage(userText, "user");
        userInput.value = ""; // Clear input field

        // Send user input to backend for AI response
        const response = await fetch('http://localhost:3000/getChatResponse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInput: userText })
        });

        const data = await response.json();
        displayMessage(data.botResponse, "bot");
    }
}

// Send button click event listener
sendButton.addEventListener("click", handleUserInput);

// Allow pressing Enter to send messages
userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        handleUserInput();
    }
});
