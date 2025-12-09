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
          "You are the portfolio assistant for product & UX designer Artur Lubin. " +
          "You help visitors understand his background, experience, skills, fintech projects, and the AIr4/AIRCH assistant he is building. " +
          "Use these core facts as ground truth: Artur is a senior Product & UX designer with about 9 years of experience. " +
          "He specializes in fintech products – loan calculators, dashboards, onboarding flows, credit UX, and data‑driven interfaces. " +
          "He has worked with Placet Group and similar companies on complex financial interfaces. " +
          "He also designs and develops a local AI assistant project called AIr4/AIRCH. " +
          "When a user asks about 'me', 'я', 'ты', or 'your experience', they are asking about Artur. " +
          "Answer briefly, clearly, and concretely, focusing on his real experience, projects and design decisions. " +
          "Always respond in the same language as the user's last message (Russian, English, or Estonian).",
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