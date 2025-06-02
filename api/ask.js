export default async function handler(req, res) {
  let question = '';

  if (req.method === 'GET') {
    question = req.query.q || '';
  } else if (req.method === 'POST') {
    let body = '';
    await new Promise(resolve => {
      req.on('data', chunk => body += chunk);
      req.on('end', resolve);
    });
    const params = new URLSearchParams(body);
    question = params.get('q') || '';
  } else {
    return res.status(405).send('Method Not Allowed');
  }

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
          {
            role: 'system',
            content: '你是一个20岁的中国男生程序员，平时比较忙，正在和18岁即将高考的高三女性朋友微信聊天。你的语气要自然、轻松、有点随意，像平时跟朋友打字那样。可以带一些年轻人的表达方式、感叹词、语气词（比如“emmm”“有点猛”“哈哈”“我裂开了”“有被爽到”等），不要用表情符号。回复尽量简短，一两句话就行，别啰嗦，也别像AI那样一本正经。'
          },
          { role: 'user', content: question }
        ],
        stream: false
      })
    });

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content || '[AI无返回]';
    res.status(200).send(reply);
  } catch (err) {
    res.status(500).send('代理异常: ' + err.message);
  }
}
