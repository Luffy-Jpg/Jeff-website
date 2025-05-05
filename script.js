const res = await fetch("https://gemini-proxy.vercel.app/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message }),
});

if (!res.ok) {
  updateLastBotMessage("Error: Unable to fetch response.");
  return;
}

const data = await res.json();
const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

if (!text) {
  updateLastBotMessage("No response received.");
  return;
}

updateLastBotMessage(text);
