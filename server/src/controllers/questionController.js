import Question from '../models/Question.js';
import Workspace from '../models/Workspace.js';
import AIExplanation from '../models/AIExplanation.js';
import { generateInterviewQuestions } from '../services/geminiService.js';

const normalizeDifficulty = (value) => {
  const safeValue = String(value || 'Medium').trim();
  return ['Easy', 'Medium', 'Hard'].includes(safeValue) ? safeValue : 'Medium';
};

const sendGenerationResponse = (res, status, body) => {
  console.info('[questions.generate] response', {
    status,
    message: body.message,
    questionCount: body.questions?.length || 0
  });
  return res.status(status).json(body);
};

export const generateQuestions = async (req, res, next) => {
  let stage = 'request validation';

  try {
    const { workspaceId, count = 10 } = req.body;

    console.info(`[questions.generate] ${stage}`);
    if (!workspaceId) {
      return sendGenerationResponse(res, 400, { message: 'Workspace ID is required.' });
    }

    stage = 'workspace lookup';
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      console.warn(`[questions.generate] ${stage}: not found`);
      return sendGenerationResponse(res, 404, { message: 'Workspace not found.' });
    }

    stage = 'workspace ownership check';
    if (workspace.user.toString() !== req.user._id.toString()) {
      console.warn(`[questions.generate] ${stage}: denied`);
      return sendGenerationResponse(res, 403, { message: 'Not authorized to generate questions for this workspace.' });
    }

    console.info('[questions.generate] workspace authorized');
    const skills = Array.isArray(workspace.skills) ? workspace.skills : [];
    const topics = Array.isArray(workspace.topics) ? workspace.topics : [];
    const difficulty = normalizeDifficulty(workspace.difficulty || req.body.difficulty || 'Medium');

    if (!workspace.role || !workspace.experienceLevel) {
      return sendGenerationResponse(res, 400, { message: 'Workspace is missing a role or experience level.' });
    }

    if (skills.length === 0 && topics.length === 0) {
      return sendGenerationResponse(res, 400, { message: 'Workspace must include at least one skill or topic before generating questions.' });
    }

    stage = 'Gemini generation';
    console.info(`[questions.generate] ${stage}: started`);
    const generatedItems = await generateInterviewQuestions({
      role: workspace.role,
      experienceLevel: workspace.experienceLevel,
      skills: skills.length ? skills : topics,
      topics,
      category: workspace.role,
      difficulty,
      count: Number(count) || 10
    });

    console.info(`[questions.generate] Gemini generation: received ${generatedItems.length} questions`);
    stage = 'MongoDB question save';
    const savedQuestions = await Promise.all(
      generatedItems.map(async (item) => {
        const normalizedQuestion = typeof item.question === 'string' ? item.question : item.prompt;
        const normalizedCategory = item.category || 'General';
        const normalizedDifficulty = normalizeDifficulty(item.difficulty || difficulty);

        if (!normalizedQuestion) {
          throw new Error('Invalid question payload returned by Gemini.');
        }

        return Question.create({
          user: req.user._id,
          workspace: workspace._id,
          category: normalizedCategory,
          difficulty: normalizedDifficulty,
          prompt: normalizedQuestion,
          answer: item.answer || '',
          type: item.type || 'Technical',
          isCompleted: false
        });
      })
    );

    console.info(`[questions.generate] ${stage}: saved ${savedQuestions.length} questions`);
    return sendGenerationResponse(res, 201, {
      message: `${savedQuestions.length} questions generated successfully.`,
      questions: savedQuestions
    });
  } catch (error) {
    const message = error.message || 'Unknown generation error.';
    const safeMessage = process.env.GEMINI_API_KEY
      ? message.replaceAll(process.env.GEMINI_API_KEY, '[redacted]')
      : message;
    console.error(`[questions.generate] ${stage} failed`, {
      status: error.statusCode || error.response?.status || null,
      code: error.code || null,
      message: safeMessage
    });

    if (message.includes('GEMINI_API_KEY')) {
      return sendGenerationResponse(res, 500, { message: 'Gemini service is not configured on the server.' });
    }

    const status = error.statusCode || (error.name === 'CastError' ? 400 : 500);
    return sendGenerationResponse(res, status, {
      message: safeMessage,
      upstreamStatus: error.upstreamStatus || null
    });
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    const { workspaceId } = req.query;
    const filter = { user: req.user._id };

    if (workspaceId) filter.workspace = workspaceId;

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ questions });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    const { workspaceId, category, difficulty, prompt, answer, isCompleted, generate, role, experienceLevel, skills } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found.' });
    }

    if (workspace.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add questions to this workspace.' });
    }

    if (generate) {
      const generated = await generateInterviewQuestions({
        role: role || workspace.role,
        experienceLevel: experienceLevel || workspace.experienceLevel,
        skills: skills?.length ? skills : workspace.skills,
        category: category || 'General',
        difficulty: difficulty || 'Medium',
        count: 1
      });

      const generatedQuestion = generated[0];

      const question = await Question.create({
        user: req.user._id,
        workspace: workspace._id,
        category: generatedQuestion.category || category || 'General',
        difficulty: generatedQuestion.difficulty || difficulty || 'Medium',
        prompt: generatedQuestion.prompt,
        answer: generatedQuestion.answer || '',
        isCompleted: !!isCompleted
      });

      return res.status(201).json({ question });
    }

    if (!prompt) {
      return res.status(400).json({ message: 'Question prompt is required.' });
    }

    const question = await Question.create({
      user: req.user._id,
      workspace: workspace._id,
      category: category || 'General',
      difficulty: difficulty || 'Medium',
      prompt,
      answer: answer || '',
      isCompleted: !!isCompleted
    });

    res.status(201).json({ question });
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    if (question.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this question.' });
    }

    const explanation = await AIExplanation.findOne({ question: question._id, user: req.user._id });

    res.status(200).json({ question, explanation });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    if (question.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this question.' });
    }

    const { answer, isCompleted, notes } = req.body;
    const updates = {};

    if (answer !== undefined) updates.answer = answer;
    if (isCompleted !== undefined) updates.isCompleted = isCompleted;
    if (notes !== undefined) updates.notes = notes;

    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    res.status(200).json({ question: updatedQuestion });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    if (question.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this question.' });
    }

    await AIExplanation.deleteMany({ question: question._id, user: req.user._id });
    await question.deleteOne();

    res.status(200).json({ message: 'Question deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
