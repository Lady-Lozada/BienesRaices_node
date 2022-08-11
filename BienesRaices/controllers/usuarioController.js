import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generarJWT, generarId } from '../helpers/tokens.js'
import { emailRegistro, emailRestore } from '../helpers/email.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken(),
        autenticado: false
    })
}

const autenticar = async (req, res) => {
    await check('correo').isEmail().withMessage('El correo es obligatorio').run(req)
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req)

    let result = validationResult(req)

    // Verificar que el resultado este vacio
    if(!result.isEmpty()){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: result.array()
        })
    }

    // Extraer los datos
    const { correo, password } = req.body

    // Verificar que el usuario no exista en BD
    const usuario = await Usuario.findOne({ where : { correo }})
    
    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}]
        })
    }

    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}]
        })
    }

    // revisar coincidencia de password
    if(!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'La contraseña no es correcta'}]
        })
    }

    // Autenticar al usuario
    const tokenJWT = generarJWT({id: usuario.id, name: usuario.nombre})

    // ALmacenar tokenJWT en un cookie en memoria
    return res.cookie('_token', tokenJWT, {
        httpOnly: true //Evita los ataques CRSF
        //expires: 9000
        //secure: true // se usa si hay certificados ssl
        //sameSite: // Requiere del secure
    }).redirect('/mis-propiedades')
    /*
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken(),
        autenticado: true
    })
    */
}

const formularioRegister = (req, res) => {
    //console.log(req.csrfToken())
    res.render('auth/register', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {
    console.log(req.body)
    //VALIDACIONES
    await check('nombre').notEmpty().withMessage('El nombre no puede estar vacío').run(req)
    await check('apellido').notEmpty().withMessage('El apellido no puede estar vacío').run(req)
    await check('correo').isEmail().withMessage('El correo no puede estar vacío o es incorrecto').run(req)
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener minimo 6 caracteres').run(req)
    //await check('rpassword').equals('password').withMessage('Las contraseñas no coinciden').run(req)
    
    let result = validationResult(req)

    // Verificar que el resultado este vacio
    if(!result.isEmpty()){
        return res.render('auth/register', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: result.array(),
            usuario: {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                correo: req.body.correo
            }
        })
    }

    // Extraer los datos
    const { nombre, apellido, correo, password } = req.body

    // Verificar que el usuario no exista en BD
    const existeUsuario = await Usuario.findOne({ where : { correo }})

    if(existeUsuario){
        return res.render('auth/register', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya se encuentra registrado'}],
            usuario: {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                correo: req.body.correo
            }
        })
    }

    // Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        apellido,
        correo,
        password,
        token: generarId()
    })

    // Enviar email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.correo,
        token: usuario.token
    })

    // Mostrar mensaje de confirmacion
    res.render('templates/message', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmación'
    })
}

// Funcion para comprobar una cuenta
const confirmAcount = async (req, res) => {
    // req.params.token
    let { token } = req.params

    // Veificar si el token es valido
    const usuario = await Usuario.findOne({ where : { token }})
    
    if(!usuario) {
        return res.render('auth/confirm', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            csrfToken: req.csrfToken(),
            error: true
        })
    }

    // Confrimar cuenta
    usuario.token = null
    usuario.confirmado = true
    await usuario.save();
    return res.render('auth/confirm', {
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta ha sido confirmada exitosamente'
    })
}

const formuRestoreRegister = (req, res) => {
    res.render('auth/restore', {
        pagina: 'Restaurar Contraseña',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {
    //VALIDACIONES
    await check('correo').isEmail().withMessage('El correo no puede estar vacío o es incorrecto').run(req)
        
    let result = validationResult(req)

    // Verificar que el resultado este vacio
    if(!result.isEmpty()){
        return res.render('auth/restore', {
            pagina: 'Restaurar Contraseña',
            csrfToken: req.csrfToken(),
            errores: result.array()
        })
    }

    // Extraer los datos
    const { correo } = req.body

    // Buscar que el usuario exista en BD
    const usuario = await Usuario.findOne({ where : { correo }})

    if(!usuario){
        return res.render('auth/restore', {
            pagina: 'Restaurar Contraseña',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no se encuentra registrado'}]
        })
    }

    // Actualizar nuevo token
    usuario.token= generarId()    
    await usuario.save();

    // Enviar email de confirmacion
    emailRestore({
        nombre: usuario.nombre,
        email: usuario.correo,
        token: usuario.token
    })

    // Mostrar mensaje de confirmacion
    res.render('templates/message', {
        pagina: 'Reestable tu contraseña',
        mensaje: 'Hemos enviado un email con las instruciones'
    })

}

const checkToken = async (req, res) => {
    //console.log(req.csrfToken())
     // req.params.token
     let { token } = req.params

     // Veificar si el token es valido
     const usuario = await Usuario.findOne({ where : { token }})
     
     if(!usuario) {
         return res.render('auth/reset-pass', {
             pagina: 'Reestablece tu contraseña',
             mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
             csrfToken: req.csrfToken(),
             error: true
         })
     }
 
     // Confrimar cuenta
     return res.render('auth/reset-pass', {
         pagina: 'Reestablece tu contraseña',
         csrfToken: req.csrfToken()
     })
}

const newPassword = async (req, res) => {
    //console.log(req.csrfToken())
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener minimo 6 caracteres').run(req)
    //await check('rpassword').equals('password').withMessage('Las contraseñas no coinciden').run(req)

    let result = validationResult(req)

    // Verificar que el resultado este vacio
    if(!result.isEmpty()){
        return res.render('auth/reset-pass', {
            pagina: 'Restaurar Contraseña',
            csrfToken: req.csrfToken(),
            errores: result.array()
        })
    }

    // Extraer params y body
    const { password } = req.body 
    const { token } = req.params

    // Buscar que el usuario exista en BD
    const usuario = await Usuario.findOne({ where : { token }})

    // Hashear lanueva contraseña
    let salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash( password, salt)
    usuario.token = null
    await usuario.save();

    res.render('auth/confirm', {
        pagina: 'Contraseña Reestablecida',
        mensaje: 'La contraseña se reestablecio correctamente',
        csrfToken: req.csrfToken()
    })
}

const cerrarSesion = async (req, res) => {
    // res.redirect('/')
    return res.clearCookie('_token').status(200).redirect('/mis-propiedades')
}

export {
    formularioLogin,
    autenticar,
    formularioRegister,
    registrar,
    confirmAcount,
    formuRestoreRegister,
    resetPassword,
    checkToken,
    newPassword,
    cerrarSesion
}