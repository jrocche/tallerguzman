const Cliente = require('../model/cliente.model');

const clienteController = {
  getAllClientes: async (req, res) => {
    try {
      const clientes = await Cliente.getAll();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getClienteById: async (req, res) => {
    try {
      const cliente = await Cliente.getById(req.params.id);
      if (cliente) {
        res.json(cliente);
      } else {
        res.status(404).json({ message: 'Cliente no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createCliente: async (req, res) => {
    try {
      const nuevoCliente = await Cliente.create(req.body);
      res.status(201).json(nuevoCliente);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateCliente: async (req, res) => {
    try {
      const clienteActualizado = await Cliente.update(req.params.id, req.body);
      if (clienteActualizado) {
        res.json(clienteActualizado);
      } else {
        res.status(404).json({ message: 'Cliente no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteCliente: async (req, res) => {
    try {
      await Cliente.delete(req.params.id);
      res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = clienteController;