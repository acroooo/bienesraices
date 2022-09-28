const loginForm = (req, res) => {
    res.render('./auth/login', {
        state: true,
        title: 'Iniciar sesión',
    });
};

const signupForm = (req, res) => {
    res.render('./auth/signup', {
        state: true,
        title: 'Crear cuenta'
    });
};

const recoverPasswordForm = (req, res) => {
    res.render('./auth/recoverPassword', {
        title: 'Recuperar acceso',
    })
}

export {
    loginForm,
    signupForm,
    recoverPasswordForm
};