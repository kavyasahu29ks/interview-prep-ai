import request from 'supertest';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import Question from '../models/Question.js';
import AIExplanation from '../models/AIExplanation.js';

describe('InterviewPrepAI API', () => {
  let token;
  let workspaceId = 'workspace-1';
  let questionId = 'question-1';

  beforeAll(async () => {
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
      topics: ['REST APIs', 'Bug Reporting', 'Test Strategy'],
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
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      deleteOne: jest.fn().mockResolvedValue(true)
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

    jest.spyOn(axios, 'post').mockImplementation(async (url, payload) => {
      const prompt = payload?.contents?.[0]?.parts?.[0]?.text || '';

      if (prompt.includes('Create 1 interview questions')) {
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
    });

    jest.spyOn(User, 'findOne').mockImplementation(async ({ email }) => (
      email === mockUser.email ? mockUser : null
    ));

    jest.spyOn(User, 'create').mockImplementation(async (data) => ({
      _id: mockUser._id,
      ...data,
      profile: '',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }));

    jest.spyOn(User, 'findById').mockImplementation((id) => ({
      select: jest.fn().mockResolvedValue(id === mockUser._id ? mockUser : null)
    }));

    jest.spyOn(Workspace, 'find').mockResolvedValue([mockWorkspace]);
    jest.spyOn(Workspace, 'create').mockImplementation(async (data) => ({
      _id: mockWorkspace._id,
      ...data,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }));
    jest.spyOn(Workspace, 'findById').mockImplementation((id) => (id === mockWorkspace._id ? mockWorkspace : null));

    jest.spyOn(Question, 'find').mockResolvedValue([mockQuestion]);
    jest.spyOn(Question, 'create').mockImplementation(async (data) => ({
      _id: mockQuestion._id,
      ...data,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }));
    jest.spyOn(Question, 'findById').mockImplementation((id) => (id === mockQuestion._id ? mockQuestion : null));
    jest.spyOn(Question, 'findByIdAndUpdate').mockImplementation(async (id, updates) => ({
      ...mockQuestion,
      ...updates,
      updatedAt: '2024-01-01'
    }));

    jest.spyOn(AIExplanation, 'findOne').mockResolvedValue(mockExplanation);
    jest.spyOn(AIExplanation, 'findOneAndUpdate').mockImplementation(async () => mockExplanation);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('registers a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Alice Tester',
        email: 'alice@test.com',
        password: 'Password123!'
      })
      .expect(201);

    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe('alice@test.com');
    expect(res.body.user.password).toBeUndefined();
  });

  it('logs in a user and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alice@test.com',
        password: 'Password123!'
      })
      .expect(200);

    token = res.body.token;
    expect(token).toBeTruthy();
  });

  it('gets the authenticated user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.user.email).toBe('alice@test.com');
  });

  it('creates a workspace', async () => {
    const res = await request(app)
      .post('/api/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'QA Engineer Prep',
        role: 'QA Engineer',
        experienceLevel: '3-5 years',
        skills: ['API Testing', 'SQL', 'Automation'],
        description: 'Focus on senior QA interviews.'
      })
      .expect(201);

    workspaceId = res.body.workspace._id;
    expect(res.body.workspace.role).toBe('QA Engineer');
  });

  it('lists workspaces for the user', async () => {
    const res = await request(app)
      .get('/api/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.workspaces)).toBe(true);
    expect(res.body.workspaces.length).toBeGreaterThan(0);
  });

  it('generates question batches through the AI generation endpoint', async () => {
    const res = await request(app)
      .post('/api/questions/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        workspaceId,
        count: 2,
        difficulty: 'Medium'
      })
      .expect(201);

    questionId = res.body.questions[0]._id;
    expect(Array.isArray(res.body.questions)).toBe(true);
    expect(res.body.questions.length).toBeGreaterThan(0);
    expect(res.body.questions[0].prompt).toBeTruthy();
  });

  it('generates a question for a workspace (legacy flow)', async () => {
    const res = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        workspaceId,
        category: 'Testing',
        difficulty: 'Medium',
        generate: true,
        role: 'QA Engineer',
        experienceLevel: '3-5 years',
        skills: ['API Testing', 'SQL', 'Automation']
      })
      .expect(201);

    questionId = res.body.question._id;
    expect(res.body.question.category).toBe('Testing');
    expect(res.body.question.prompt).toBeTruthy();
  });

  it('gets a question detail', async () => {
    const res = await request(app)
      .get(`/api/questions/${questionId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.question._id).toBe(questionId);
    expect(res.body.question.answer).toBeTruthy();
  });

  it('adds an AI explanation for the question', async () => {
    const res = await request(app)
      .post('/api/ai/explain')
      .set('Authorization', `Bearer ${token}`)
      .send({
        questionId,
        role: 'QA Engineer',
        experienceLevel: '3-5 years',
        question: 'Explain how you would test an API endpoint end-to-end.'
      })
      .expect(200);

    expect(res.body.explanation).toBeTruthy();
    expect(res.body.explanation.keyPoints).toBeTruthy();
  });

  it('marks a question as completed', async () => {
    const res = await request(app)
      .put(`/api/questions/${questionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        isCompleted: true
      })
      .expect(200);

    expect(res.body.question.isCompleted).toBe(true);
  });
});
