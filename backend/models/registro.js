const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registro = sequelize.define('Registro', {
    id_registro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numeroempleado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departamento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_asistencia: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_asistencia: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Registro',
    tableName: 'registro',
    timestamps: false
});

module.exports = Registro;
