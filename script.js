document.getElementById('start-chat').addEventListener('click', function() {
    document.getElementById('chatbox').style.display = 'block';
});

document.getElementById('send-message').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
        const userMessage = document.createElement('p');
        userMessage.innerHTML = `<strong>You:</strong> ${userInput}`;
        document.getElementById('chat-content').appendChild(userMessage);

        const botReply = document.createElement('p');
        botReply.innerHTML = `<strong>Jeff-AI:</strong> I am processing your request...`;
        document.getElementById('chat-content').appendChild(botReply);

        document.getElementById('user-input').value = '';  // Clear the input field

        // Simulate bot response (you can replace this with actual bot logic)
        setTimeout(function() {
            botReply.innerHTML = `<strong>Jeff-AI:</strong> How can I assist you further?`;
        }, 1500);
    }
});
