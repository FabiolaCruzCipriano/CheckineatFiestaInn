const express = require('express');
const { getAsistenciaDiaria, getAsistenciaMensual } = require('../controllers/asistenciaController');

const router = express.Router();

router.get('/diaria', getAsistenciaDiaria);
router.get('/mensual', getAsistenciaMensual);

module.exports = router;
