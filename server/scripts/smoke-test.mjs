import request from 'supertest';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Workspace from '../src/models/Workspace.js';
import Question from '../src/models/Question.js';
import AIExplanation from '../src/models/AIExplanation.js';

const run = async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.GEMINI_API_KEY = 'test-key';

  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const mockUser = {
    _id: 'user-1',
    name: 'Alice Tester',
    email: 'alice@test.com',
    password: hashedPassword,
    profile: '',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  const mockWorkspace = {
    _id: 'workspace-1',
    user: mockUser._id,
    name: 'QA Engineer Prep',
    role: 'QA Engineer',
    experienceLevel: '3-5 years',
    skills: ['API Testing', 'SQL', 'Automation'],
    topics: ['REST APIs', 'Test Strategy', 'Bug Reporting'],
    difficulty: 'Medium',
    description: 'Focus on senior QA interviews.',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  const mockQuestion = {
    _id: 'question-1',
    user: mockUser._id,
    workspace: mockWorkspace._id,
    category: 'Testing',
    difficulty: 'Medium',
    prompt: 'How would you test a REST API endpoint end-to-end?',
    answer: 'I would validate the contract, test the happy path, and verify the response contract.',
    isCompleted: false,
    notes: '',
    deleteOne: async () => true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  const mockExplanation = {
    _id: 'explanation-1',
    user: mockUser._id,
    question: mockQuestion._id,
    explanation: 'This validates the API contract and checks edge cases.',
    realWorldExample: 'In a payment API, you ensure validation and response consistency.',
    interviewAnswer: 'I would start with the happy path and then cover boundary conditions.',
    keyPoints: ['Validate input', 'Test edge cases', 'Verify contract'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  const fakeGeminiResponse = (payload) => {
    const prompt = payload?.contents?.[0]?.parts?.[0]?.text || '';

    if (prompt.includes('Generate 1 interview questions')) {
      return {
        data: {
          candidates: [{
            content: {
              parts: [{
                text: JSON.stringify([
                  {
                    category: 'Testing',
                    difficulty: 'Medium',
                    prompt: 'How would you test a REST API endpoint end-to-end?',
                    answer: 'I would validate the contract, test the happy path, and verify the response contract.'
                  }
                ])
              }]
            }
          }]
        }
      };
    }

    return {
      data: {
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                explanation: 'This validates the API contract and checks edge cases.',
                realWorldExample: 'In a payment API, you ensure validation and response consistency.',
                interviewAnswer: 'I would start with the happy path and then cover boundary conditions.',
                keyPoints: ['Validate input', 'Test edge cases', 'Verify contract']
              })
            }]
          }
        }]
      }
    };
  };

  axios.post = async (url, payload) => fakeGeminiResponse(payload);

  User.findOne = async ({ email }) => (email === mockUser.email ? mockUser : null);
  User.create = async (data) => ({
    _id: mockUser._id,
    ...data,
    profile: '',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  });
  User.findById = () => ({ select: async () => mockUser });

  Workspace.find = async () => [mockWorkspace];
  Workspace.create = async (data) => ({
    _id: mockWorkspace._id,
    ...data,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  });
  Workspace.findById = async (id) => (id === mockWorkspace._id ? mockWorkspace : null);

  Question.find = async () => [mockQuestion];
  Question.create = async (data) => ({
    _id: mockQuestion._id,
    ...data,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  });
  Question.findById = async (id) => (id === mockQuestion._id ? mockQuestion : null);
  Question.findByIdAndUpdate = async (id, updates) => ({ ...mockQuestion, ...updates, updatedAt: '2024-01-01' });

  AIExplanation.findOne = async () => mockExplanation;
  AIExplanation.findOneAndUpdate = async () => mockExplanation;

  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Alice Tester', email: 'alice@test.com', password: 'Password123!' });

  if (registerRes.status !== 201) throw new Error(`Register failed: ${registerRes.status}`);
  if (!registerRes.body.token) throw new Error('Register did not return a token');

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'alice@test.com', password: 'Password123!' });

  if (loginRes.status !== 200) throw new Error(`Login failed: ${loginRes.status}`);

  const token = loginRes.body.token;

  const meRes = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${token}`);

  if (meRes.status !== 200) throw new Error(`Me failed: ${meRes.status}`);

  const workspaceRes = await request(app)
    .post('/api/workspaces')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'QA Engineer Prep',
      role: 'QA Engineer',
      experienceLevel: '3-5 years',
      skills: ['API Testing', 'SQL', 'Automation'],
      topics: ['REST APIs', 'Test Strategy', 'Bug Reporting'],
      difficulty: 'Medium',
      description: 'Focus on senior QA interviews.'
    });

  if (workspaceRes.status !== 201) throw new Error(`Workspace creation failed: ${workspaceRes.status}`);
  const workspaceId = workspaceRes.body.workspace._id;

  const listRes = await request(app)
    .get('/api/workspaces')
    .set('Authorization', `Bearer ${token}`);

  if (listRes.status !== 200) throw new Error(`Workspace list failed: ${listRes.status}`);

  const generateRes = await request(app)
    .post('/api/questions/generate')
    .set('Authorization', `Bearer ${token}`)
    .send({
      workspaceId,
      count: 1,
      difficulty: 'Medium'
    });

  if (generateRes.status !== 201) throw new Error(`Question generation failed: ${generateRes.status}`);
  if (!Array.isArray(generateRes.body.questions) || generateRes.body.questions.length === 0) {
    throw new Error('AI generation did not return any saved questions');
  }

  const questionId = generateRes.body.questions[0]._id;

  const detailRes = await request(app)
    .get(`/api/questions/${questionId}`)
    .set('Authorization', `Bearer ${token}`);

  if (detailRes.status !== 200) throw new Error(`Question detail failed: ${detailRes.status}`);

  const explainRes = await request(app)
    .post('/api/ai/explain')
    .set('Authorization', `Bearer ${token}`)
    .send({
      questionId,
      role: 'QA Engineer',
      experienceLevel: '3-5 years',
      question: 'Explain how you would test an API endpoint end-to-end.'
    });

  if (explainRes.status !== 200) throw new Error(`AI explanation failed: ${explainRes.status}`);
  if (!explainRes.body.explanation || !Array.isArray(explainRes.body.explanation.keyPoints)) {
    throw new Error('AI explanation response missing structured content');
  }

  const updateRes = await request(app)
    .put(`/api/questions/${questionId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ isCompleted: true });

  if (updateRes.status !== 200) throw new Error(`Question update failed: ${updateRes.status}`);
  if (!updateRes.body.question.isCompleted) throw new Error('Question completion flag was not updated');

  console.log('All backend API smoke tests passed.');
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
