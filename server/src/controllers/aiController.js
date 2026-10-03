import AIExplanation from '../models/AIExplanation.js';
import Question from '../models/Question.js';
import { generateExplanation } from '../services/geminiService.js';

export const explainQuestion = async (req, res, next) => {
  try {
    const { questionId, role, experienceLevel, question } = req.body;

    if (!questionId) {
      return res.status(400).json({ message: 'Question ID is required.' });
    }

    const targetQuestion = await Question.findById(questionId);

    if (!targetQuestion) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    if (targetQuestion.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to explain this question.' });
    }

    const answer = targetQuestion.answer || req.body.answer || 'No answer provided yet';
    const explanationData = await generateExplanation({
      role: role || 'Candidate',
      experienceLevel: experienceLevel || 'Fresher',
      question: question || targetQuestion.prompt,
      answer
    });

    const explanationDoc = await AIExplanation.findOneAndUpdate(
      { question: targetQuestion._id, user: req.user._id },
      {
        question: targetQuestion._id,
        user: req.user._id,
        explanation: explanationData.explanation,
        realWorldExample: explanationData.realWorldExample,
        interviewAnswer: explanationData.interviewAnswer,
        keyPoints: explanationData.keyPoints
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      explanation: explanationDoc
    });
  } catch (error) {
    next(error);
  }
};
