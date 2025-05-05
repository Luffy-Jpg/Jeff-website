export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userInput } = req.body;

    // Handle your logic here, e.g., sending the user input to an AI service.
    const botResponse = `You said: ${userInput}`;

    res.status(200).json({ botResponse });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
