import express from 'express';
import { formularioLogin, formularioRegister, registrar, confirmAcount, formuRestoreRegister,
    resetPassword, checkToken, newPassword, autenticar, cerrarSesion } from '../controllers/usuarioController.js'

const router = express.Router();

router.get('/', (req, res) => {
    res.json({msg: 'Hola mundo en express'})
});

router.post('/', (req, res) => {
    res.json({msg: 'Respuesta de Tipo Post'})
});

router.get('/login', formularioLogin)
router.post('/login', autenticar)

router.get('/register', formularioRegister)
router.post('/register', registrar)

router.get('/restore', formuRestoreRegister)
router.post('/restore', resetPassword)

router.get('/confirm/:token', confirmAcount)

//Almacenar una nueva contraseña
router.get('/restore/:token', checkToken)
router.post('/restore/:token', newPassword)

// Cerrar sesión
router.post('/cerrar-sesion', cerrarSesion )

export default router;