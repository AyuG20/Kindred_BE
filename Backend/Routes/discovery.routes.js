import { discoverUsersController } from "../Controller/discovery.controller.js";
import { authenticateToken } from '../Middleware/authMiddleware.js';
import express from 'express';

const { Router } = express;
const router = Router();

router.get('/discoveredUsers',authenticateToken, discoverUsersController);

export default router;