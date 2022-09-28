import {DataTypes} from 'sequelize';
import db from '../config/db.js';

// defino nuevo modelo
const User = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // es la clave primaria
        autoIncrement: true // es autoincremental
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false // no se permite que sea nulo
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true // valor por defecto
    },
    token: {
        type: DataTypes.STRING,
    },
    confirm: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // valor por defecto
    },
})

export default User;