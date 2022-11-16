var express = require("express");
var router = express.Router();
const { getUsuario, altaUsuario, updateUsuario, deleteUsuario } = require('../controllers/usuariosController');
const { validateCreate } = require('../validators/usuariosValidator');
const checkAuth = require('../middleware/auth');

router
  .post("/altausuario", checkAuth, validateCreate, altaUsuario)
  .put("/:id", checkAuth, updateUsuario)
  .get("/:usuario", checkAuth, getUsuario)
  .delete("/:id", checkAuth, deleteUsuario);

module.exports = router;
