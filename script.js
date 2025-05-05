const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatContainer = document.getElementById("chatContainer");
const scrollBtn = document.getElementById("scrollDownBtn");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  userInput.value = "";
  scrollToBottom();

  appendMessage("Typing...", "bot", true);

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    const text = data.text || "Sorry, no response from server.";
    
    // Remove typing animation and update bot message
    updateLastBotMessage(text);
    scrollToBottom();
  } catch (error) {
    updateLastBotMessage("Error: " + error.message);
    scrollToBottom();
  }
});

function appendMessage(text, type, typing = false) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerText = text;
  
  if (typing) {
    div.classList.add("typing");
  }
  
  chatContainer.appendChild(div);
}

function updateLastBotMessage(text) {
  const messages = document.querySelectorAll(".message.bot");
  if (messages.length > 0) {
    messages[messages.length - 1].innerText = text;
    messages[messages.length - 1].classList.remove("typing");
  }
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

chatContainer.addEventListener("scroll", () => {
  const nearBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 100;
  scrollBtn.style.display = nearBottom ? "none" : "flex";
});

scrollBtn.addEventListener("click", scrollToBottom);
