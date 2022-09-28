// import models
import User from '../../models/User.js';

// Form Login
const loginForm = (req, res) => {
    res.render('./auth/login', {
        state: true,
        title: 'Iniciar sesión',
    });
};

// Form Registro
const signupForm = (req, res) => {
    res.render('./auth/signup', {
        state: true,
        title: 'Crear cuenta'
    });
};

// Registrar usuario
const register = async (req, res) => {
    const user = await User.create(req.body)

    res.json(user)
}

// Form Recuperar contraseña
const recoverPasswordForm = (req, res) => {
    res.render('./auth/recoverPassword', {
        title: 'Recuperar acceso',
    })
}

export {
    loginForm,
    signupForm,
    recoverPasswordForm,
    register,
};