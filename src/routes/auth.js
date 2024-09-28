const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../database/database");
const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  const { nombre, email, contrasenia, telefono, direccion } = req.body;
  const activo = true;

  if (!nombre || !email || !contrasenia) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      "SELECT * FROM taller.usuarios WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);
    const newUser = await pool.query(
      `INSERT INTO taller.usuarios (nombre, email, contrasenia, telefono, direccion, activo) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_usuario, nombre, email, telefono, direccion, activo`,
      [nombre, email, hashedPassword, telefono, direccion, activo]
    );

    const token = jwt.sign(
      { userId: newUser.rows[0].id_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ user: newUser.rows[0], token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  const { email, contrasenia } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM taller.usuarios WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(
      contrasenia,
      user.rows[0].contrasenia
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    if (!user.rows[0].activo) {
      return res.status(401).json({ error: "Usuario inactivo" });
    }

    const token = jwt.sign(
      { userId: user.rows[0].id_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id_usuario: user.rows[0].id_usuario,
        nombre: user.rows[0].nombre,
        email: user.rows[0].email,
        telefono: user.rows[0].telefono,
        direccion: user.rows[0].direccion,
        activo: user.rows[0].activo
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;