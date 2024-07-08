const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Departamento extends Model { }

Departamento.init({
    id_departamento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_departamento: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'Departamento',
    tableName: 'departamento',
    timestamps: false
});

module.exports = Departamento;
