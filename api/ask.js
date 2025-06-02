export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST allowed');
  }

  const question = req.body.q || '';

  if (!question.trim()) {
    return res.status(400).send('Missing question');
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-e95861d27ca743eeb3cb3a765f361421'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: question }
        ],
        stream: false
      })
    });

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || '[AI无返回]';
    res.status(200).send(text);
  } catch (err) {
    res.status(500).send('代理异常: ' + err.message);
  }
}
