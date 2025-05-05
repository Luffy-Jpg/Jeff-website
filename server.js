// Function to interact with the Together.ai API and get AI response
async function getAIResponse(userText) {
    try {
        const response = await fetch('https://api.together.ai/v1/ask', {  // Replace with correct Together.ai endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`  // Your Together.ai API key
            },
            body: JSON.stringify({ question: userText })
        });

        const data = await response.json();
        console.log('Together.ai API Response:', data);  // Log the entire API response

        if (data && data.answer) {
            return data.answer;
        } else {
            console.error('No answer field in the response.');
            throw new Error('No response from Together.ai');
        }
    } catch (error) {
        console.error('Error calling Together.ai API:', error);
        throw new Error('Failed to get AI response');
    }
}
