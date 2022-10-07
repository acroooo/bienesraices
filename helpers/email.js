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
            <h1>Confirmar cuenta</h1>
            <p>Hola ${name}</p>
            <p>Para confirmar tu cuenta, haz click en el siguiente enlace</p>
            <a href="">Confirmar Cuenta</a>

            <p>Si no has creado una cuenta, ignora este mensaje</p>
        `
    })
}


export {
    emailSignup,
}