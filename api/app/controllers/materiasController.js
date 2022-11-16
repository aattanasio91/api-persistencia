var models = require("../models");
const logger = require('../utils/logger');

const getMaterias = (req, res) => {
  return models.materia
    .findAll({
      attributes: ["id", "nombre", "id_carrera"],
      include: [{ as: 'Carrera-Relacionada', model: models.carrera, attributes: ["id", "nombre"] }]
    })
    .then(materias => res.send(materias))
    .catch(() => res.sendStatus(500));
};

const getMateriaById = (req, res) => {
  return findMateria(req.params.id, {
    onSuccess: materia => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const insertMateria = (req, res) => {
  logger.info('Insertando materia');
  models.materia
    .create({ nombre: req.body.nombre, id_carrera: req.body.id_carrera })
    .then(materia => res.status(201).send({ id: materia.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra materia con el mismo nombre')
        logger.error(`Bad request: existe otra materia con el mismo nombre`)
      }
      else {
        logger.error(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
}

const updateMateria = (req, res) => {
  const onSuccess = materia =>
    materia
      .update({ nombre: req.body.nombre, id_carrera: req.body.id_carrera }, { fields: ["nombre", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra materia con el mismo nombre')
          logger.error(`Bad request: existe otra materia con el mismo nombre`)
        }
        else {
          logger.error(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const deleteMateria = (req, res) => {
  const onSuccess = materia =>
    materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre", "id_carrera"],
      include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}],
      where: { id }
    })
    .then(materia => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

module.exports = {
  getMaterias,
  getMateriaById,
  insertMateria,
  updateMateria,
  deleteMateria
}