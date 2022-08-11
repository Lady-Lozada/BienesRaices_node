import Propiedad from './Propiedad.js'
import Usuario from './Usuario.js'
import Categoria from './Categoria.js'
import Precio from './Precio.js'
import Mensaje from './Mensaje.js'

// Se definen las relaciones o asociaciones entre tablas

// Relaciones 1:1 con hasOne y belongsTo
// Precio.hasOne(Propiedad)
Propiedad.belongsTo(Precio)
Propiedad.belongsTo(Categoria)
Propiedad.belongsTo(Usuario, { foreignKey: 'usuarioId'})

// Relacion 1:M
Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadId'})

Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId'})
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId'})


export {
    Propiedad,
    Usuario,
    Categoria,
    Precio,
    Mensaje
}