import express from 'express';
import {
  generateQuestions,
  getQuestions,
  createQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} from '../controllers/questionController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post('/generate', generateQuestions);
router.route('/').get(getQuestions).post(createQuestion);
router.route('/:id').get(getQuestionById).put(updateQuestion).delete(deleteQuestion);

export default router;
