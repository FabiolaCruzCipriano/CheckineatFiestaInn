// routes/registroRoutes.js
const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');

// Asegúrate de que la ruta coincide con la definida en server.js
router.post('/', registroController.createRegistro);

module.exports = router;
