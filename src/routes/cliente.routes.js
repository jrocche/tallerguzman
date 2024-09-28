const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const authenticateToken = require('../middleware/Auth.middleware');

router.get('/clientes', authenticateToken, clienteController.getAllClientes);
router.get('/clientes/:id', authenticateToken, clienteController.getClienteById);
router.post('/clientes', authenticateToken, clienteController.createCliente);
router.put('/clientes/:id', authenticateToken, clienteController.updateCliente);
router.delete('/clientes/:id', authenticateToken, clienteController.deleteCliente);

module.exports = router;