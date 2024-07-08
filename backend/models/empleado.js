const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Departamento = require('./departamento');

class Empleado extends Model { }

Empleado.init({
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    },
    nombre_departamento: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Departamento,
            key: 'nombre_departamento'
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Empleado',
    tableName: 'empleado',
    timestamps: false
});

Empleado.belongsTo(Departamento, { foreignKey: 'nombre_departamento', targetKey: 'nombre_departamento' });

module.exports = Empleado;
