import fetch from 'node-fetch';

async function testGroqAPI() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.log('No GROQ_API_KEY found');
    return;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'user', content: 'Say hello in one word' }
        ],
        max_tokens: 10
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('Groq API Error:', response.status);
      console.log('Error details:', error);
    } else {
      const data = await response.json();
      console.log('Groq API Success:', data.choices[0].message.content);
    }
  } catch (err) {
    console.log('Request failed:', err.message);
  }
}

testGroqAPI();