const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/auth");
const usuarioRoutes = require("./routes/usuario.routes");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/", authRoutes);
app.use("/", usuarioRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});