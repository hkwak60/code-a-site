import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

const openai = new OpenAIApi(configuration);

// ✨ 주(State) 설명 생성 endpoint
// ✨ 주(State) 설명 생성 endpoint
app.post('/state-description', async (req, res) => {
  const { stateName } = req.body;

  const prompt = `
Describe the U.S. state of ${stateName} in one or two short sentences.
Mention a scenic feature, landscape, or something it is known for.
Be vivid and elegant, but keep it very concise.
Do not include links, sources, or citations.
Avoid special formatting.
  `;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini-search-preview',
      messages: [
        { role: 'system', content: 'You are a travel assistant that writes short and poetic descriptions of U.S. states for a nature-focused app.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 150
    });

    const message = response.data.choices[0].message.content.trim();
    res.json({ description: message });
  } catch (error) {
    console.error('🛑 State description fetch failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'OpenAI API failed to generate description.' });
  }
});


// ✅ OpenAI 연결 확인용
app.get('/test-openai', async (req, res) => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello, are you working?' }]
    });

    const reply = response.data.choices[0].message.content;
    res.json({ ok: true, message: reply });
  } catch (error) {
    console.error('🛑 OpenAI test failed:', error.response?.data || error.message);
    res.status(500).json({ ok: false, error: error.response?.data || error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Wonders API Server running at http://localhost:${port}`);
});