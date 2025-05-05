export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'User input is required' });
    }

    // Sample response logic for testing
    const mockBotResponse = (input) => {
      if (input.toLowerCase().includes('hello')) {
        return "Hi, how can I help you today?";
      } else {
        return "I'm sorry, I didn't understand that.";
      }
    };

    const botResponse = mockBotResponse(userInput);

    return res.status(200).json({ botResponse });
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
