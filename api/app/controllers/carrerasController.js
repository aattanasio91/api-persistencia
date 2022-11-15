var models = require("../models");
const logger = require('../utils/logger');

const getCarreras = (req, res) => {
    return models.carrera
    .findAll({
      attributes: ["id", "nombre"]
    })
    .then(carreras => res.send(carreras))
    .catch(() => res.sendStatus(500));
};

const getCarreraById = (req, res) => {
  return findCarrera(req.params.id, {
    onSuccess: carrera => res.send(carrera),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const insertCarrera = (req, res) => {
    models.carrera
    .create({ nombre: req.body.nombre })
    .then(carrera => res.status(201).send({ id: carrera.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
        logger.error(`Bad request: existe otra carrera con el mismo nombre`)
      }
      else {
        logger.error(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
}

const updateCarrera = (req, res) => {
    const onSuccess = carrera =>
    carrera
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
          logger.error(`Bad request: existe otra carrera con el mismo nombre`)
        }
        else {
          logger.error(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const deleteCarrera = (req, res) => {
    const onSuccess = carrera =>
    carrera
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
    models.carrera
      .findOne({
        attributes: ["id", "nombre"],
        where: { id }
      })
      .then(carrera => (carrera ? onSuccess(carrera) : onNotFound()))
      .catch(() => onError());
};

module.exports = {
    getCarreras,
    getCarreraById,
    insertCarrera,
    updateCarrera,
    deleteCarrera
}