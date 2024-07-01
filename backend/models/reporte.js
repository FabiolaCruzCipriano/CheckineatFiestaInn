// models/reporte.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reporte = sequelize.define('Reporte', {
    id_reporte: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_registro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'registro',
            key: 'id_registro'
        }
    },
    id_administrador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'administrador',
            key: 'id_administrador'
        }
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tipo_reporte: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'reporte',
    timestamps: false
});

module.exports = Reporte;

