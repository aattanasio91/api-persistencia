var express = require("express");
var router = express.Router();
const { getCarreras, getCarreraById, insertCarrera, updateCarrera, deleteCarrera } = require('../controllers/carrerasController');
const checkAuth = require('../middleware/auth');
const { validateCreate } = require('../validators/carreraValidator')

router.get("/", checkAuth , getCarreras);

router.get("/:id", checkAuth , getCarreraById);

router.post("/", checkAuth , validateCreate , insertCarrera);

router.put("/:id", checkAuth , updateCarrera);

router.delete("/:id", checkAuth , deleteCarrera);

module.exports = router;
