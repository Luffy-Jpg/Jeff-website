const apiKey = "AIzaSyAlYwl8tgxT4do26w6LiuP18f75jU83dfQ";
const model = "models/gemini-pro";

const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatContainer = document.getElementById("chat-container");
const scrollBtn = document.getElementById("scroll-btn");
const themeToggle = document.getElementById("theme-toggle");

// Load chat history
window.addEventListener("DOMContentLoaded", () => {
  chatContainer.innerHTML = localStorage.getItem("chat-history") || "";
  document.body.classList.toggle("light", localStorage.getItem("theme") === "light");
});

// Scroll behavior
scrollBtn.addEventListener("click", () => {
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

chatContainer.addEventListener("scroll", () => {
  const nearBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 100;
  scrollBtn.style.display = nearBottom ? "none" : "block";
});

function saveHistory() {
  localStorage.setItem("chat-history", chatContainer.innerHTML);
}

function appendMessage(sender, text, markdown = false) {
  const msg = document.createElement("div");
  msg.className = `chat-message ${sender}`;
  msg.innerHTML = markdown ? marked.parse(text) : text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  saveHistory();
}

async function sendMessage(message) {
  appendMessage("user", message);
  userInput.value = "";

  const typingMsg = document.createElement("div");
  typingMsg.className = "chat-message bot";
  typingMsg.textContent = "Typing...";
  chatContainer.appendChild(typingMsg);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

    let i = 0;
    typingMsg.innerHTML = "";
    const interval = setInterval(() => {
      typingMsg.innerHTML = marked.parse(reply.slice(0, i));
      chatContainer.scrollTop = chatContainer.scrollHeight;
      if (i++ >= reply.length) {
        clearInterval(interval);
        saveHistory();
      }
    }, 10);
  } catch (err) {
    typingMsg.textContent = "Error fetching response.";
    console.error(err);
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (message) sendMessage(message);
});

// Theme toggle
themeToggle.addEventListener("change", () => {
  const isLight = themeToggle.checked;
  document.body.classList.toggle("light", isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");
});
