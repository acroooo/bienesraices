import {check, validationResult} from 'express-validator'
import jwt from 'jsonwebtoken'
// import models
import User from '../../models/User.js';
// helpers
import { generateJWT, generateId } from '../../helpers/tokens.js';
import { emailSignup, resetPasswordEmail } from '../../helpers/email.js';

import bcrypt from 'bcrypt'

// LOGIN FORM
const loginForm = (req, res) => {
    res.render('./auth/login', {
        state: true,
        title: 'Iniciar sesión',
        csrfToken: req.csrfToken()
    });
};

// LOGIN
const autenticate = async (req, res) => {
    // validacion
    await check('email').isEmail().withMessage('El email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req)

    let result = validationResult(req)

    if(!result.isEmpty()){
        return res.render('auth/login', {
            title: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: result.array(),
        })
    }

    // primero encontrar si el usuario existe
    const {email, password} = req.body
    const user = await User.findOne({
        email: email,
    })

    if(!user){
        return res.render('auth/login', {
            title: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'El usuario no existe'}],
        })
    }

    // comprobar usuario confirmado
    if(!user.confirm){
        return res.render('auth/login', {
            title: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'Tu cuenta no ha sido confirmada'}],
        })
    }

    // revisar password
    if(!user.verifyPassword(password)){
        return res.render('auth/login', {
            title: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'La contraseña es incorrecta'}],
        })
    }

    // autenticar usuario
    const token = generateJWT({id: user.id, name: user.name})

    // almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        // samesite
        // secure -> para certificado https
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }).redirect('/properties')
}


// SIGNUP FORM
const signupForm = (req, res) => {
    res.render('./auth/signup', {
        state: true,
        title: 'Crear cuenta',
        csrfToken: req.csrfToken(),
    });
};

// SIGNUP
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

// FORM RESET PASSWORD
const recoverPasswordForm = (req, res) => {
    res.render('./auth/recoverPassword', {
        title: 'Recupera el acceso a tu cuenta',
        csrfToken: req.csrfToken(),
    })
}


// RESET PASSWORD
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
        return res.render('auth/reset-password', {
            title: 'Reestablece tu contraseña',
            csrfToken: req.csrfToken(),
            errors: result.array(),
        })
    }

    const {token} = req.params
    const {password} = req.body

    // who change the password
    const user = await User.findOne({where:{token}})

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    usuario.token = null

    await user.save()

    res.render('auth/reset-password', {
        title: 'Se ha reestablecido tu contraseña',
        message: 'La contraseña se guardo correctamente'
    })

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
    autenticate,
    signupForm,
    recoverPasswordForm,
    register,
    confirmAccount,
    resetPassword,
    validateToken,
    saveNewPassword,
};

