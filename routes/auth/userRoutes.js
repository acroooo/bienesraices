import express from 'express';
import { loginForm, autenticate, signupForm, recoverPasswordForm, register, confirmAccount, resetPassword, validateToken, saveNewPassword} from '../../controllers/auth/userController.js';
const router = express.Router();

// login
router.get('/login', loginForm);
router.post('/login', autenticate);

// registro
router.get('/signup', signupForm);
router.post('/signup', register);

// confirmar cuenta
router.get('/confirm/:token', confirmAccount);

// recuperar contraseña
router.get('/reset-password', recoverPasswordForm);
router.post('/reset-password', resetPassword);

// save the new password
router.get('/reset-password/:token', validateToken);
router.post('/reset-password/:token', saveNewPassword);

export default router;