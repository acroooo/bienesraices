import {check, validationResult} from 'express-validator'
// import models
import User from '../../models/User.js';
// helpers
import { generateId } from '../../helpers/tokens.js';
import { emailSignup, resetPasswordEmail } from '../../helpers/email.js';

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
        title: 'Crear cuenta',
        csrfToken: req.csrfToken(),
    });
};

// Registrar usuario
const register = async (req, res) => {
    //validation
    await check('name').notEmpty().withMessage('El campo nombre no puede estar vacío').run(req)
    await check('email').isEmail().notEmpty().withMessage('Coloque un email del tipo email@ejemplo.com').run(req)
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe contener 8 carácteres como mínimo').custom((value, { req }) => {
        if (value !== req.body.password_confirmation) {
            throw new Error('Las contraseñas no coinciden')
        } else {
            return value
        }
    }).run(req)

    
    let result = validationResult(req)

    // verify empty result
    if (!result.isEmpty()) {
        return res.render('./auth/signup', {
            title: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errors: result.array(),
            user: {
                name: req.body.name,
                email: req.body.email,
            }
        })
    }
    
    // extract data
    const { name, email, password } = req.body

    // verify if user exists
    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
        return res.render('./auth/signup', {
            title: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'El usuario se encuentra registrado' }],
            user: {
                name: name,
                email: req.body.email,
            }
        })
    }

    // save user data
    const user = await User.create({
        name,
        email,
        password,
        token: generateId(),
    })

    // send confirmation email
    emailSignup({
        name: user.name,
        email: user.email,
        token: user.token,
    })


    // message success confirmation
    res.render('messages/message', {
        title: "Cuenta creada correctamente",
        message: "Se ha enviado un correo de confirmación a su e-mail. Presiona en el enlace para completar el proceso.",
    })
}

// Form Recuperar contraseña
const recoverPasswordForm = (req, res) => {
    res.render('./auth/recoverPassword', {
        title: 'Recupera el acceso a tu cuenta',
        csrfToken: req.csrfToken(),
    })
}

const resetPassword = async(req, res) => {
    // validation
    console.log(req.body)
    await check('email').isEmail().withMessage('Ingrese un email válido')
    let resultado = validationResult(req)
    console.log(resultado)
    // verify empty result
    if (!resultado.isEmpty()) {
        // errors
        return res.render('auth/recoverPassword', {
            title: 'Recupera el acceso a tu cuenta',
            csrfToken: req.csrfToken(),
            errors: resultado.array(),
        })
    }

    // search for the user
    const { email } = req.body

    const user = await User.findOne({ where: { email } })
    
    // user doesnt exists
    if (!user) {
        return res.render('auth/recoverPassword', {
            title: 'Recupera el acceso a tu cuenta',
            csrfToken: req.csrfToken(),
            errors: [{ message: 'El usuario no se encuentra registrado en el sistema'}]
        })
    }

    // generate token and send email
    user.token = generateId()
    await user.save()
    
    // send email
    resetPasswordEmail({
        name: user.name,
        email: user.email,
        token: user.token,
    })

    // message success
    res.render('messages/message', {
        title: "Reestablece tu contraseña",
        message: "Se ha enviado un email con las instrucciones para generar una nueva contraseña.",
    })
}

// Validar un token
const validateToken = async (req, res, next) => {

    const {token} = req.params

    const user = await User.findOne({
        where: {token}
    })

    if(!user) {
        return res.render('auth/confirmAccount', {
            title: 'Reestablece tu contraseña',
            message: 'Hubo un error al validar tu información, por favor, intentelo nuevamente',
            error: true,
    })
    }

    // user with token
    // Form for modify password
    res.render('auth/reset-password', {
        title: 'Reestablece tu contraseña',
        csrfToken: req.csrfToken()
    })
}

// Guarda la nueva contraseña
const saveNewPassword = async (req, res) => {
    // validate password
    await check('password').isLength({min: 8}).withMessage('La contraseña debe ser de mínimo 8 carácteres').run(req)
    let result = validationResult(req)

    // verify empty result
    if(!result.isEmpty()){
        // error
        return res.render('auth/signup', {
            title: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errors: result.array(),
            user: {
                name: req.body.name,
                email: req.body.email,
            }
        })
    }
}





// Confirmar email cuenta
const confirmAccount = async (req, res) => {
    console.log(req.params)
    const { token } = req.params

    // verify token

    const user = await User.findOne({ where: { token } })

    if (!user) {
        return res.render('./auth/confirmAccount', {
            title: 'Error en la confirmación de tu cuenta',
            message: 'El token no es válido o ha expirado',
            error: true,
    })
    }
    // confirm account
    user.token = null
    user.confirm = true

    await user.save()

    res.render('./auth/confirmAccount', {
        title: 'Cuenta confirmada',
        message: 'Tu cuenta ha sido confirmada correctamente',
    })
}


export {
    loginForm,
    signupForm,
    recoverPasswordForm,
    register,
    confirmAccount,
    resetPassword,
    validateToken,
    saveNewPassword,
};

