// server.js
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/chat", async (req, res) => {
  const message = req.body.message;
  const apiKey = process.env.HUGGINGFACE_API_KEY;  // API Key stored in .env

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await response.json();
    res.json({ text: data.generated_text || "No response." });
  } catch (error) {
    res.status(500).json({ error: "API call failed: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
