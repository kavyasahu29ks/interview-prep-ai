import axios from 'axios';

const buildGeminiUrl = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Add it to your environment variables.');
  }

  return `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
};

const postToGemini = async (payload) => {
  try {
    return await axios.post(buildGeminiUrl(), payload);
  } catch (error) {
    const upstreamStatus = error.response?.status;
    const apiKey = process.env.GEMINI_API_KEY;
    const upstreamMessage = error.response?.data?.error?.message || error.message || 'Unknown Gemini API error.';
    const safeMessage = apiKey ? String(upstreamMessage).replaceAll(apiKey, '[redacted]') : String(upstreamMessage);

    console.error('[gemini] request failed', {
      upstreamStatus: upstreamStatus || null,
      code: error.code || null,
      message: safeMessage
    });

    const wrappedError = new Error(`Gemini API request failed${upstreamStatus ? ` (HTTP ${upstreamStatus})` : ''}: ${safeMessage}`);
    wrappedError.statusCode = 502;
    wrappedError.upstreamStatus = upstreamStatus;
    throw wrappedError;
  }
};

const extractTextFromGemini = (payload) => {
  const candidate = payload?.candidates?.[0];
  const text = candidate?.content?.parts?.map((part) => part?.text || '').join('');

  if (!text) {
    throw new Error('Gemini returned no usable content.');
  }

  return text;
};

const parseJsonResponse = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Gemini returned an empty response.');
  }

  const cleaned = rawText
    .replace(/```json\s*/gim, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error('Gemini returned malformed JSON.');
  }
};

const normalizeQuestionList = (payload) => {
  const candidate = Array.isArray(payload?.questions) ? payload.questions : payload;

  if (Array.isArray(candidate)) {
    return candidate;
  }

  if (candidate && Array.isArray(candidate.questions)) {
    return candidate.questions;
  }

  throw new Error('Gemini response did not include a valid questions array.');
};

export const generateInterviewQuestions = async ({
  role,
  experienceLevel,
  skills,
  topics = [],
  category,
  difficulty,
  count = 10
}) => {
  const skillList = Array.isArray(skills) ? skills.filter(Boolean) : [];
  const topicList = Array.isArray(topics) ? topics.filter(Boolean) : [];
  const focusAreas = [...skillList, ...topicList];

  const prompt = `You are an expert interview coach.
Generate ${count} interview questions for a ${role} candidate with ${experienceLevel} experience.
Role: ${role}
Experience: ${experienceLevel}
Skills: ${focusAreas.length ? focusAreas.join(', ') : 'general interview readiness'}
Topics: ${topicList.length ? topicList.join(', ') : 'core fundamentals'}
Difficulty: ${difficulty || 'Medium'}
Question category focus: ${category || role}
Return strict JSON in the exact shape below:
{
  "questions": [
    {
      "question": "Interview question text",
      "category": "Question category",
      "difficulty": "Easy|Medium|Hard",
      "type": "Technical|Behavioral|Situational"
    }
  ]
}
Do not include markdown fences, prose, or any extra text outside the JSON.`;

  const response = await postToGemini({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 3000
    }
  });

  const raw = extractTextFromGemini(response.data);
  const parsed = parseJsonResponse(raw);
  const questions = normalizeQuestionList(parsed).map((item) => ({
    question: item.question || item.prompt || 'Untitled interview question',
    category: item.category || category || role,
    difficulty: ['Easy', 'Medium', 'Hard'].includes(item.difficulty) ? item.difficulty : (difficulty || 'Medium'),
    type: item.type || 'Technical',
    answer: item.answer || ''
  }));

  return questions.slice(0, Number(count) || 10);
};

export const generateExplanation = async ({
  role,
  experienceLevel,
  question,
  answer
}) => {
  const prompt = `You are a senior interviewer and mentor.
Explain this interview question and answer for a ${role} candidate with ${experienceLevel} experience.
Question: ${question}
Candidate answer context: ${answer || 'General best-practice answer'}
Return valid JSON in this exact structure:
{
  "explanation": "<clear and concise explanation>",
  "realWorldExample": "<brief real-world example>",
  "interviewAnswer": "<strong polished interview response>",
  "keyPoints": ["point 1", "point 2", "point 3"]
}
Do not include markdown fences or explanatory text outside the JSON object.`;

  const response = await postToGemini({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1800
    }
  });

  const raw = extractTextFromGemini(response.data);
  const parsed = parseJsonResponse(raw);

  return {
    explanation: parsed.explanation || 'No explanation generated.',
    realWorldExample: parsed.realWorldExample || 'No example generated.',
    interviewAnswer: parsed.interviewAnswer || 'No answer generated.',
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [String(parsed.keyPoints || 'Key takeaway')]
  };
};
