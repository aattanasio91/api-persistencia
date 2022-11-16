var express = require("express");
var router = express.Router();
const { getMaterias, getMateriaById, insertMateria, updateMateria, deleteMateria } = require('../controllers/materiasController');
const checkAuth = require('../middleware/auth');
const { validateCreate } = require('../validators/materiasValidator')

router
    .get("/", checkAuth , getMaterias)
    .get("/:id", checkAuth , getMateriaById)
    .post("/", checkAuth , validateCreate , insertMateria)
    .put("/:id", checkAuth , updateMateria)
    .delete("/:id", checkAuth , deleteMateria);

module.exports = router;
