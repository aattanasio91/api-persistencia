var express = require("express");
var router = express.Router();
const { getCarreras, getCarreraById, insertCarrera, updateCarrera, deleteCarrera } = require('../controllers/carrerasController');
const checkAuth = require('../middleware/auth');
const { validateCreate } = require('../validators/carreraValidator')

router
    .get("/", checkAuth , getCarreras)
    .get("/:id", checkAuth , getCarreraById)
    .post("/", checkAuth , validateCreate , insertCarrera)
    .put("/:id", checkAuth , updateCarrera)
    .delete("/:id", checkAuth , deleteCarrera);

module.exports = router;
