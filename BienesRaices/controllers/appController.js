import { Sequelize } from 'sequelize'
import { Propiedad, Precio, Categoria } from '../models/index.js'

const inicio = async (req,res) => {

    const [categorias, precios, casas, aptos] = await Promise.all([
        Categoria.findAll({raw:true}),
        Precio.findAll({raw:true}),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                {model:Precio, as: 'precio'}
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include: [
                {model:Precio, as: 'precio'}
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ])

    res.render('inicio', {
        pagina: 'Inicio',
        csrfToken: req.csrfToken(),
        categorias,
        precios, 
        casas,
        aptos
    })
}

const categoria = async (req,res) => {
    const { id } = req.params

    //comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)
    if(!categoria) {
        return res.redirect('/404')
    }

    // Obtener las propiedades de la cateoria
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        },
        include: [
            {model:Precio, as: 'precio'}
        ]
    })

    res.render('categoria', {
        pagina: `${categoria.nombre}s en Venta`,
        csrfToken: req.csrfToken(),
        propiedades
    })
}

const notFound = (req,res) => {
    res.render('404', {
        csrfToken: req.csrfToken(),
        pagina: 'No Encontrada'
    })
}

const buscador = async (req,res) => {
    const { termino } = req.body

    // validar que el termino de busqueda no esté vacio
    if(!termino.trim()){
        return res.redirect('back')
    }

    // Consultar las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            [Sequelize.Op.or]: [
                {
                    descripcion: {
                        [Sequelize.Op.like] : '%' + termino + '%'
                    }
                },  
                {          
                    titulo: {
                        [Sequelize.Op.like] : '%' + termino + '%'
                    }
                }
            ]
        },
        include: [
            {model:Precio, as: 'precio'}
        ]
    })

    res.render('busqueda', {
        pagina: 'Resultados de la Búsqueda',
        csrfToken: req.csrfToken(),
        propiedades
    })
}

export {
    inicio,
    categoria,
    notFound,
    buscador
}