var models = require("../models");
const logger = require('../utils/logger');

const getProfesores = (req, res) => {
  return models.profesor
    .findAll({
      attributes: ["id", "nombre", "id_materia"],
      include: [{ as: 'Materia-Relacionada', model: models.materia, attributes: ["id", "nombre"] }]
    })
    .then(profesores => res.send(profesores))
    .catch(() => res.sendStatus(500));
};

const getProfesorById = (req, res) => {
  return findProfesor(req.params.id, {
    onSuccess: profesor => res.send(profesor),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const insertProfesor = (req, res) => {
  models.profesor
    .create({ nombre: req.body.nombre, id_materia: req.body.id_materia })
    .then(profesor => res.status(201).send({ id: profesor.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra profesor con el mismo nombre')
        logger.error(`Bad request: existe otro profesor con el mismo nombre`)
      }
      else {
        logger.error(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
}

const updateProfesor = (req, res) => {
  const onSuccess = profesor =>
    profesor
      .update({ nombre: req.body.nombre, id_carrera: req.body.id_carrera }, { fields: ["nombre", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra profesor con el mismo nombre')
          logger.error(`Bad request: existe otro profesor con el mismo nombre`)
        }
        else {
          logger.error(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const deleteProfesor = (req, res) => {
  logger.info('Borrando usuario');
  const onSuccess = profesor =>
  profesor
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const findProfesor = (id, { onSuccess, onNotFound, onError }) => {
  models.profesor
    .findOne({
      attributes: ["id", "nombre", "id_materia"],
      include: [{ as: 'Materia-Relacionada', model: models.materia, attributes: ["id", "nombre"] }],
      where: { id }
    })
    .then(profesor => (profesor ? onSuccess(profesor) : onNotFound()))
    .catch(() => onError());
};

module.exports = {
  getProfesores,
  getProfesorById,
  insertProfesor,
  updateProfesor,
  deleteProfesor
}