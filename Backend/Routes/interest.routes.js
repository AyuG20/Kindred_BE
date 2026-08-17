import express from 'express';
import {
  createInterestController,
  listInterestsController,
  selectInterestsController,
  getUserInterestsController,
  getUsersForInterestController,
} from '../Controller/interest.controller.js';
import { authenticateToken } from '../Middleware/authMiddleware.js';

const { Router } = express;
const router = Router();

router.get('/', listInterestsController);
router.post('/', authenticateToken, createInterestController);
router.put('/select', authenticateToken, selectInterestsController);
router.get('/me', authenticateToken, getUserInterestsController);
router.get('/:interestId/users', authenticateToken, getUsersForInterestController);

export default router;
