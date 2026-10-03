import express from 'express';
import {
  getWorkspaces,
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace
} from '../controllers/workspaceController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getWorkspaces).post(createWorkspace);
router.route('/:id').get(getWorkspaceById).put(updateWorkspace).delete(deleteWorkspace);

export default router;
