import nodemailer from 'nodemailer'

const emailSend = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
}

const emailRegistro = async (datos) => {
    /*var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });*/

    const { email, nombre, token } = datos

    // Enviar el email
    await emailSend().sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
            <p> Hola ${nombre}, comprueba tu cuenta en BienesRaices.com </p>

            <p> Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}"> 
                    Confirmar cuenta </a>
            </p>

            <p> Si no creaste esta cuenta, puedes ignorar el mensaje </p>
        `
    })
}

const emailRestore = async (datos) => {
    /*var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });*/

    const { email, nombre, token } = datos

    // Enviar el email
    await emailSend().sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Restablece tu contraseña en BienesRaices.com',
        text: 'Restablece tu contraseña en BienesRaices.com',
        html: `
            <p> Hola ${nombre}, has solciitado reestablecer tu contraseña en BienesRaices.com </p>

            <p> Genera una contraseña nueva en el siguiente enlace:
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/restore/${token}"> 
                    Reestablecer contraseña </a>
            </p>

            <p> Si no solcitaste el cambio de contraseña, puedes ignorar el mensaje </p>
        `
    })
}

export {
    emailRegistro,
    emailRestore
}