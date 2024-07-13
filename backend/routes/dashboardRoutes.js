const express = require('express');
const router = express.Router();
const { getTotalEmpleados } = require('../controllers/empleadoController');
const { countDepartamentos } = require('../controllers/departamentoController');
const { getAsistenciaDiaria } = require('../controllers/asistenciaController');

router.get('/total-empleados', getTotalEmpleados);
router.get('/total-departamentos', countDepartamentos);
router.get('/asistencia-diaria', getAsistenciaDiaria);

module.exports = router;
