import express from 'express';
import { loginForm, signupForm, recoverPasswordForm, register, confirmAccount } from '../../controllers/auth/userController.js';
const router = express.Router();

// login
router.get('/login', loginForm);

// registro
router.get('/signup', signupForm);
router.post('/signup', register);

// confirmar cuenta
router.get('/confirm/:token', confirmAccount);

// recuperar contraseña
router.get('/recover-password', recoverPasswordForm);

export default router;