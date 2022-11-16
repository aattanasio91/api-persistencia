var models = require("../models");
const logger = require('../utils/logger');

const getAlumnos = (req, res) => {
    logger.info('Consultando usuarios');
    return models.alumno
    .findAll({
      attributes: ["id", "nombre", "dni","id_carrera"],
      include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}],
      offset: req.query.paginaActual, limit: req.query.cantidadAVer
    })
    .then(alumnos => res.send(alumnos))
    .catch(() => res.sendStatus(500));
};

const getAlumnoById = (req, res) => {
  return findAlumno(req.params.id, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const insertAlumno = (req, res) => {
  logger.info('Insertando usuario');
  models.alumno
    .create({ nombre: req.body.nombre, dni:req.body.dni, id_carrera: req.body.id_carrera })
    .then(alumno => res.status(201).send({ id: alumno.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra alumno con el mismo nombre')
        logger.error(`Bad request: existe otro alumno con el mismo nombre`)
      }
      else {
        logger.error(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
}

const updateAlumno = (req, res) => {
  logger.info('Actualizando usuario');
  const onSuccess = alumno =>
    alumno
      .update({ nombre: req.body.nombre, dni: req.body.dni, id_carrera: req.body.id_carrera }, { fields: ["nombre", "dni", "id_carrera"] })
      .then(() => res.sendStatus(200), logger.info('Alumno borrado'))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra alumno con el mismo nombre')
          logger.error(`Bad request: existe otro alumno con el mismo nombre`)
        }
        else {
          logger.error(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const deleteAlumno = (req, res) => {
  logger.info('Borrando usuario');
  const onSuccess = alumno =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200), logger.info('Alumno borrado'))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
}

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "nombre", "dni","id_carrera"],
      include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}],
      where: { id }
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

module.exports = {
    getAlumnos,
    getAlumnoById,
    insertAlumno,
    updateAlumno,
    deleteAlumno
}