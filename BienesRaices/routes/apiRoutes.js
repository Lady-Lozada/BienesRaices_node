import express from 'express';
import { propiedades } from '../controllers/apiController.js'

const router = express.Router();

// Pagina de Inicio
router.get('/propiedades', propiedades)

export default router;