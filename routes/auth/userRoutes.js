import express from 'express';
import { loginForm, signupForm, recoverPasswordForm, register } from '../../controllers/auth/userController.js';
const router = express.Router();

// login
router.get('/login', loginForm);

// registro
router.get('/signup', signupForm);
router.post('/signup', register);

// recuperar contraseña
router.get('/recover-password', recoverPasswordForm);

export default router;