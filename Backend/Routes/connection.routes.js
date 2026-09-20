import { sendConnectionRequestController, cancelConnectionRequestController, acceptConnectionRequestController } from "../Controller/connection.controller.js";
import { authenticateToken } from '../Middleware/authMiddleware.js';
import express from 'express';

const { Router } = express;
const router = Router();

router.post("/sendConnection/:userId", authenticateToken, sendConnectionRequestController);
router.delete("/cancelConnection/:userId", authenticateToken, cancelConnectionRequestController);
router.patch("/acceptConnection/:userId", authenticateToken, acceptConnectionRequestController);


export default router;