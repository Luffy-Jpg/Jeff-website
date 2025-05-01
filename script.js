document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.getElementById('chatBody');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const apiKeyModal = document.getElementById('apiKeyModal');
    const openApiKeyModal = document.getElementById('openApiKeyModal');
    const closeModal = document.getElementById('closeModal');
    const saveApiKeyButton = document.getElementById('saveApiKey');
    const geminiApiKeyInput = document.getElementById('geminiApiKey');
    const apiKeyStatus = document.getElementById('apiKeyStatus');

    let storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
        geminiApiKeyInput.value = storedApiKey;
    } else {
        apiKeyModal.style.display = 'flex'; // Show modal on first load
    }

    openApiKeyModal.addEventListener('click', () => {
        apiKeyModal.style.display = 'flex';
        apiKeyStatus.style.display = 'none';
    });

    closeModal.addEventListener('click', () => {
        apiKeyModal.style.display = 'none';
    });

    saveApiKeyButton.addEventListener('click', () => {
        const apiKey = geminiApiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('geminiApiKey', apiKey);
            storedApiKey = apiKey;
            apiKeyStatus.style.display = 'block';
            setTimeout(() => {
                apiKeyModal.style.display = 'none';
            }, 1500);
        } else {
            alert('Please enter your Gemini API key.');
        }
    });

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText) {
            displayMessage('user', messageText);
            messageInput.value = '';
            // Call Gemini API here (implementation will be more complex)
            getBotResponse(messageText);
        }
    }

    async function getBotResponse(userMessage) {
        if (!storedApiKey) {
            displayMessage('bot', 'Please enter and save your Gemini API key to get a response.');
            apiKeyModal.style.display = 'flex';
            return;
        }

        displayMessage('bot', 'Thinking...'); // Show a "thinking" message

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${storedApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: userMessage }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API Error:', errorData);
                displayMessage('bot', `Sorry, I encountered an error: ${errorData.error?.message || response.statusText}`);
                return;
            }

            const data = await response.json();
            const botResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            // Remove the "thinking" message
            const thinkingMessage = chatBody.lastElementChild;
            if (thinkingMessage && thinkingMessage.classList.contains('bot-message') && thinkingMessage.textContent === 'Thinking...') {
                chatBody.removeChild(thinkingMessage);
            }

            if (botResponseText) {
                displayMessage('bot', botResponseText);
            } else {
                displayMessage('bot', 'Sorry, I didn\'t get a valid response.');
            }

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            displayMessage('bot', 'Sorry, something went wrong while trying to get a response.');
        }
    }

    function displayMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = message;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom
    }
});
