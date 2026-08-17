import express from 'express';
import { registerController, loginController, updateProfileController } from '../Controller/auth.controller.js';
import { authenticateToken } from '../Middleware/authMiddleware.js';
import { upload } from '../Middleware/multerMiddleware.js';

const { Router } = express;
const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);

router.put(
  "/user/profile",  
  authenticateToken,
  upload.single("profilePicture"),
  updateProfileController
);
export default router;
