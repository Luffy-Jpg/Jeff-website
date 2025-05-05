const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatContainer = document.getElementById("chatContainer");
const scrollBtn = document.getElementById("scrollDownBtn");
const themeToggle = document.getElementById("themeToggle");

// Theme toggle
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("light-mode");
});

// Form submission
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevents page refresh

  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  userInput.value = "";
  scrollToBottom();

  appendMessage("Typing...", "bot");

  try {
    const res = await fetch("https://jeff-xd-gemini-proxy.vercel.app/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from Gemini.";
    updateLastBotMessage(text);
  } catch (error) {
    updateLastBotMessage("An error occurred: " + error.message);
  }

  scrollToBottom();
});

// Add message to chat
function appendMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerText = text;
  chatContainer.appendChild(div);
}

// Update last bot message
function updateLastBotMessage(text) {
  const messages = document.querySelectorAll(".message.bot");
  if (messages.length > 0) {
    messages[messages.length - 1].innerText = text;
  }
}

// Scroll to bottom
function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show/hide scroll button
chatContainer.addEventListener("scroll", () => {
  const nearBottom =
    chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 100;
  scrollBtn.style.display = nearBottom ? "none" : "flex";
});

scrollBtn.addEventListener("click", scrollToBottom);
