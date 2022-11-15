var express = require("express");
var router = express.Router();
const { getAlumnos, getAlumnoById, insertAlumno, updateAlumno, deleteAlumno } = require('../controllers/alumnosController');
const checkAuth = require('../middleware/auth');
const { validateCreate } = require('../validators/alumnosValidator')

router.get("/", checkAuth , getAlumnos);

router.get("/:id", checkAuth , getAlumnoById);

router.post("/", checkAuth , validateCreate , insertAlumno);

router.put("/:id", checkAuth , updateAlumno);

router.delete("/:id", checkAuth , deleteAlumno);

module.exports = router;
