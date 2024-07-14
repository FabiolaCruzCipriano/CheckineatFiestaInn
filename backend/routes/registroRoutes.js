const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');

router.post('/crear', registroController.createRegistro);
router.get('/', registroController.getRegistros);

module.exports = router;
