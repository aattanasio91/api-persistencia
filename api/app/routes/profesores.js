var express = require("express");
var router = express.Router();
var models = require("../models");
const logger = require('../utils/logger');
const { getProfesores, getProfesorById, insertProfesor, updateProfesor, deleteProfesor } = require('../controllers/profesoresController');
const checkAuth = require('../middleware/auth');
const { validateCreate } = require('../validators/alumnosValidator')

router
    .get("/", checkAuth , getProfesores)
    .get("/:id", checkAuth , getProfesorById)
    .post("/", checkAuth , validateCreate , insertProfesor)
    .put("/:id", checkAuth , updateProfesor)
    .delete("/:id", checkAuth , deleteProfesor);

module.exports = router;
