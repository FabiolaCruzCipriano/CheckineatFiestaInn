const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Departamento = sequelize.define('Departamento', {
    id_departamento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_departamento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'departamento'
});

module.exports = Departamento;
