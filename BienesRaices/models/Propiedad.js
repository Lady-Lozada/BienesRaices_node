import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const Propiedad = db.define('propiedades', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    habitacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estacionamiento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    calle: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    longitud: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitud: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publicado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

export default Propiedad;