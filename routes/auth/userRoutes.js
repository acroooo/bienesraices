import express from 'express';
import { loginForm, signupForm, recoverPasswordForm } from '../../controllers/auth/userController.js';
const router = express.Router();

router.get('/login', loginForm);
router.get('/signup', signupForm);
router.get('/recover-password', recoverPasswordForm);

export default router;