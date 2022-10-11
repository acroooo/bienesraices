import nodemailer from 'nodemailer';
// env
import dotenv from 'dotenv';

dotenv.config({path:'./config/.env'})

const emailSignup = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { name, email, token } = data;

    // send email
    await transport.sendMail({
        from: 'InmobiliariaSoldati.com',
        to: email,
        subject: 'Confirmar cuenta | Inmobiliaria Soldati',
        text: 'Confirmar cuenta | Inmobiliaria Soldati',
        html: `
            <p>Hola ${name}, confirma tu cuenta de inmobiliariasoldati.com</p>
            <p>Tu cuenta ya esta lista. Por favor, accede con el siguiente enlace para confirmar tu cuenta.</p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirmar Cuenta</a>

            <p>Si no has creado una cuenta, ignora este mensaje</p>
            <p>Atentamente, Grupo Soldati</p>
        `
    })
}


export {
    emailSignup,
}