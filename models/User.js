import {DataTypes} from 'sequelize';
import db from '../config/db.js';
import bcrypt from 'bcrypt';

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
        defaultValue: ""
    },
    confirm: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // valor por defecto
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
        }
    }
})

// metodos personalizados
User.prototype.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

export default User;