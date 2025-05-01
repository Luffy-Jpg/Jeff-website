const apiKey = "AIzaSyCWYu7Kr9Tp1dHY0kXtaTiRZr3-hGxObg4";
const model = "models/gemini-pro";

const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatContainer = document.getElementById("chat-container");
const scrollBtn = document.getElementById("scroll-btn");
const themeToggle = document.getElementById("theme-toggle");

// Load chat and theme
window.addEventListener("DOMContentLoaded", () => {
  chatContainer.innerHTML = localStorage.getItem("chat-history") || "";
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.checked = true;
  }
  scrollBtn.style.display = "none";
});

chatContainer.addEventListener("scroll", () => {
  const nearBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 100;
  scrollBtn.style.display = nearBottom ? "none" : "block";
});

scrollBtn.addEventListener("click", () => {
  chatContainer.scrollTop = chatContainer.scrollHeight;
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

  const typing = document.createElement("div");
  typing.className = "chat-message bot";
  typing.textContent = "Typing...";
  chatContainer.appendChild(typing);
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
    typing.innerHTML = "";
    const interval = setInterval(() => {
      typing.innerHTML = marked.parse(reply.slice(0, i));
      chatContainer.scrollTop = chatContainer.scrollHeight;
      if (i++ >= reply.length) {
        clearInterval(interval);
        saveHistory();
      }
    }, 10);
  } catch (err) {
    typing.textContent = "Error fetching response.";
    console.error(err);
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = userInput.value.trim();
  if (msg) sendMessage(msg);
});

themeToggle.addEventListener("change", () => {
  const isLight = themeToggle.checked;
  document.body.classList.toggle("light", isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");
});
