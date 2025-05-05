import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    const response = await fetch("/api/getChatResponse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput: input }),
    });

    const data = await response.json();
    const botResponse = data.botResponse || "Sorry, something went wrong!";
    setMessages([...newMessages, { sender: "bot", text: botResponse }]);
  };

  return (
    <div className={styles.container}>
      <h1>AI Chatbot</h1>
      <div className={styles.chatContainer}>
        {messages.map((msg, index) => (
          <div key={index} className={styles[msg.sender]}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
