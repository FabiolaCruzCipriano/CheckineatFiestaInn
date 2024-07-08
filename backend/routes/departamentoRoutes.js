const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamentoController');

router.get('/', departamentoController.getDepartamentos);
router.post('/', departamentoController.createDepartamento);
router.get('/:id', departamentoController.getDepartamentoById);
router.put('/:id', departamentoController.updateDepartamento);
router.delete('/:id', departamentoController.deleteDepartamento);

module.exports = router;
