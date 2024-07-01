const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Departamento = require('./departamento');
const Empleado = sequelize.define('Empleado', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_departamento: {
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
    estatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numeroempleado: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'empleado',
    timestamps: false
});
Empleado.belongsTo(Departamento, { foreignKey: 'id_departamento' });
module.exports = Empleado;