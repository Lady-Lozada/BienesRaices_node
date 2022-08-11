import express from 'express';
import { inicio, categoria, notFound, buscador } from '../controllers/appController.js'

const router = express.Router();

// Pagina de Inicio
router.get('/', inicio)

// Categorias
router.get('/categorias/:id', categoria)

// Página 404
router.get('/404', notFound)

// Buscador
router.post('/buscador', buscador)

export default router