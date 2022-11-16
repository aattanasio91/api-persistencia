var express = require("express");
var router = express.Router();
const { getAlumnos, getAlumnoById, insertAlumno, updateAlumno, deleteAlumno } = require('../controllers/alumnosController');
const checkAuth = require('../middleware/auth');
const { validateCreate } = require('../validators/alumnosValidator')


router
    .get("/", checkAuth , getAlumnos)
    .get("/:id", checkAuth , getAlumnoById)
    .post("/", checkAuth , validateCreate , insertAlumno)
    .put("/:id", checkAuth , updateAlumno)
    .delete("/:id", checkAuth , deleteAlumno);

module.exports = router;
