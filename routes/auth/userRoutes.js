import express from 'express';
import { loginForm, signupForm, recoverPasswordForm, register, confirmAccount, resetPassword} from '../../controllers/auth/userController.js';
const router = express.Router();

// login
router.get('/login', loginForm);

// registro
router.get('/signup', signupForm);
router.post('/signup', register);

// confirmar cuenta
router.get('/confirm/:token', confirmAccount);

// recuperar contraseña
router.get('/reset-password', recoverPasswordForm);
router.post('/reset-password', resetPassword);

export default router;