import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    // Для проверки в браузере GET отдаём 405, чтобы видеть, что функция жива
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY on server' });
  }

    try {
    const { message } = req.body as { message?: string };

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'No message provided' });
    }

    const openAiMessages = [
      {
        role: 'system' as const,
        content:
          "You are a portfolio assistant for a product & UX designer. " +
          "Answer briefly and clearly, focusing on fintech expertise, case studies and design decisions.",
      },
      {
        role: 'user' as const,
        content: message,
      },
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // можно поменять модель
        messages: openAiMessages,
        temperature: 0.4,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI error:', errorText);
      return res.status(500).json({ error: 'OpenAI error', details: errorText });
    }

    const data = await openaiResponse.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I'm sorry, I couldn't generate a response.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Assistant proxy error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}