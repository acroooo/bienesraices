const loginForm = (req, res) => {
    res.render('./auth/login', {
        state: true,
    });
};

const signupForm = (req, res) => {
    res.render('./auth/signup', {
        state: true,
    });
};

export {
        loginForm,
        signupForm,
};