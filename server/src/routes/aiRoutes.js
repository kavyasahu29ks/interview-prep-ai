import express from 'express';
import protect from '../middleware/auth.js';
import { explainQuestion } from '../controllers/aiController.js';

const router = express.Router();

router.use(protect);
router.post('/explain', explainQuestion);

export default router;
