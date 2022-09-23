import express from 'express';
import { loginForm, signupForm } from '../../controllers/auth/userController.js';
const router = express.Router();

router.get('/login', loginForm);
router.get('/signup', signupForm);

export default router;