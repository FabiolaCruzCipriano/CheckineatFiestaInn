const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Administrador extends Model { }

Administrador.init({
    id_administrador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo_electronico: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Administrador',
    tableName: 'administrador',
    timestamps: false,
    hooks: {
        beforeCreate: async (administrador) => {
            if (administrador.contrasena) {
                administrador.contrasena = await bcrypt.hash(administrador.contrasena, 10);
            }
        },
        beforeUpdate: async (administrador) => {
            if (administrador.changed('contrasena')) {
                administrador.contrasena = await bcrypt.hash(administrador.contrasena, 10);
            }
        }
    }
});

module.exports = Administrador;
