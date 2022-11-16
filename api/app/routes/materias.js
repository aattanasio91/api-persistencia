var express = require("express");
var router = express.Router();
var models = require("../models");
const logger = require('../utils/logger');
const { getMaterias, getMateriaById, insertMateria, updateMateria, deleteMateria } = require('../controllers/materiasController');
const checkAuth = require('../middleware/auth');
const { validateCreate } = require('../validators/materiasValidator')

router.get("/", checkAuth , getMaterias);

router.get("/:id", checkAuth , getMateriaById);

router.post("/", checkAuth , validateCreate , insertMateria);

router.put("/:id", checkAuth , updateMateria);

router.delete("/:id", checkAuth , deleteMateria);

module.exports = router;
