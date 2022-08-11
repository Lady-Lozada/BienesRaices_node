import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Precio, Categoria, Propiedad, Mensaje, Usuario } from '../models/index.js'
import { esVendedor, formatFecha } from '../helpers/index.js'

const admin = async (req,res) => {

    // Leer QueryString
    const { pagina: paginaActual } = req.query
    const expReg = /^[0-9]$/

    if(!expReg.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {        
        const { id } = req.usuario

        //Limites y Offset para el paginador
        const limit = 5;
        const offset = ((paginaActual * limit) - limit);
        
        const [propiedadesPorUsuario, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                },
                include: [
                    {model: Categoria, as: 'categoria'},
                    {model: Precio, as: 'precio'},
                    {model: Mensaje, as: 'mensajes'}
                ]
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                }
            })
        ])

        res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            csrfToken: req.csrfToken(),
            propiedadesPorUsuario,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            limit,
            offset,
        })
    } catch (error) {
        console.log(error)
    }

}

const crear = async (req,res) => {
    // Consultar modelo de Precio y Categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    // const [categorias, precios] = consultarPrecioCategoria()

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req,res) => {

    let result = validationResult(req);

    if(!result.isEmpty()){
        // Consultar modelo de Precio y Categoria
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: result.array(),
            datos: req.body
        })
    }

    // Crear un registro
    const { titulo, descripcion, habitacion, estacionamiento, wc, calle, longitud, latitud, 
        categoria: categoriaId, precio: precioId } = req.body

    const { id: usuarioId } = req.usuario

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitacion, 
            estacionamiento, 
            wc, 
            calle, 
            longitud, 
            latitud,
            categoriaId,
            precioId,
            usuarioId,
            imagen: ''
        })

        const { id } = propiedadGuardada

        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error)
    }
}

const agregarImagen = async (req,res) => {
    
    const { id } = req.params

    // validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    // validar que la propiedad pertenece a quien visita la pagina
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

const guardarImagen = async (req,res, next) => {
    const { id } = req.params

    // validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    // validar que la propiedad pertenece a quien visita la pagina
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    try {
        // Almacenar la imagen y publicar propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1
        await propiedad.save()
        next()
    } catch (error) {
        console.log(error)
    }
}

// Editar formulario
const editar = async (req,res) => {

    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // validar que la propiedad pertenece a quien visita la pagina
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    // Consultar modelo de Precio y Categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar', {
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

const guardarCambios = async (req,res) => {

    let result = validationResult(req);

    if(!result.isEmpty()){
        // Consultar modelo de Precio y Categoria
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: result.array(),
            datos: req.body
        })
    }
    
    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // validar que la propiedad pertenece a quien visita la pagina
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    // Reescribir el objeto y actualizarlo
    try {
        const { titulo, descripcion, habitacion, estacionamiento, wc, calle, longitud, latitud, 
            categoria: categoriaId, precio: precioId } = req.body
        
        propiedad.set({
            titulo,
            descripcion,
            habitacion, 
            estacionamiento, 
            wc, 
            calle, 
            longitud, 
            latitud,
            categoriaId,
            precioId
        })

        await propiedad.save()
        res.redirect('/mis-propiedades')

    } catch (error) {
        console.log(error)
    }
}

const eliminar = async (req,res) => {
    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // validar que la propiedad pertenece a quien visita la pagina
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    // Eliminar la imagen asociada
    await unlink(`public/uploads/${propiedad.imagen}`)
    console.log(`Se eliminó la imagen ${propiedad.imagen}`)

    // Eliminar la propiedad
    await propiedad.destroy()
    res.redirect('/mis-propiedades')
}

// Modificar el estado de la propiedad
const cambiarEstado = async (req,res) => {
    const { id } = req.params
    
    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // validar que la propiedad pertenece a quien visita la pagina
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    // Actualizar
    propiedad.publicado = !propiedad.publicado

    await propiedad.save()

    res.json({
        resultado: 'ok'
    })
}

// Muestra una propiedad
const mostrarPropiedad = async (req,res) => {
    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model: Categoria, as: 'categoria'},
            {model: Precio, as: 'precio'}
        ]
    })
    
    if(!propiedad || !propiedad.publicado){
        return res.redirect('/404')
    }

    res.render('propiedades/mostrar', {
        csrfToken: req.csrfToken(),
        pagina: propiedad.titulo,
        propiedad,
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    })
}

const enviarMensaje = async (req, res) => {
    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model: Categoria, as: 'categoria'},
            {model: Precio, as: 'precio'}
        ]
    })
    
    if(!propiedad){
        return res.redirect('/404')
    }

    // Renderizar los errores en caso de que existan
    let result = validationResult(req);

    if(!result.isEmpty()){
        
        return res.render('propiedades/mostrar', {
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            propiedad,
            usuario: req.usuario,
            errores: result.array(),
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
        })
    }

    const { mensaje } = req.body
    const { id: propiedadId } = req.params
    const { id: usuarioId } = req.usuario

    // Almacenar el mensaje
    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })

    res.redirect('/')
    // res.render('propiedades/mostrar', {
    //     csrfToken: req.csrfToken(),
    //     pagina: propiedad.titulo,
    //     propiedad,
    //     usuario: req.usuario,
    //     esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
    //     enviado: true
    // })
}

const verMensajes = async (req, res) => {
    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            // {model: Usuario, as: 'usuario'},
            {model: Mensaje, as: 'mensajes', 
                include: [
                    {model: Usuario.scope('eliminarPassword'), as: 'usuario'}
                ]
            }
        ]
    })

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // validar que la propiedad pertenece a quien visita la pagina
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        csrfToken: req.csrfToken(),
        mensajes: propiedad.mensajes,
        formatFecha
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    guardarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
}