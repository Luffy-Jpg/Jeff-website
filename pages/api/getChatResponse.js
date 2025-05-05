import Together from "together-ai";

const together = new Together();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userInput } = req.body;

    try {
      const stream = await together.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages: [
          {
            role: "user",
            content: userInput,
          },
        ],
        stream: false,
      });

      let botResponse = "";
      for await (const chunk of stream) {
        botResponse += chunk.choices[0]?.delta?.content || "";
      }

      res.status(200).json({ botResponse });
    } catch (error) {
      console.error("Error from Together AI:", error);
      res.status(500).json({ error: "Something went wrong!" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
