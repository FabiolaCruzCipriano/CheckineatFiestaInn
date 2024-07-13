const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');

router.get('/diaria', asistenciaController.getAsistenciaDiaria);

module.exports = router;
