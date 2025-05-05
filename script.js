// script.js
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatContainer = document.getElementById("chatContainer");
const scrollBtn = document.getElementById("scrollDownBtn");
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("light-mode");
});

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  userInput.value = "";
  scrollToBottom();

  appendMessage("Typing...", "bot");

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    const text = data.text || "No response.";
    updateLastBotMessage(text);
    scrollToBottom();
  } catch (error) {
    updateLastBotMessage("Error: " + error.message);
    scrollToBottom();
  }
});

function appendMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerText = text;
  chatContainer.appendChild(div);
}

function updateLastBotMessage(text) {
  const messages = document.querySelectorAll(".message.bot");
  if (messages.length > 0) {
    messages[messages.length - 1].innerText = text;
  }
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

chatContainer.addEventListener("scroll", () => {
  const nearBottom =
    chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 100;
  scrollBtn.style.display = nearBottom ? "none" : "flex";
});

scrollBtn.addEventListener("click", scrollToBottom);
