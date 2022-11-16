var models = require("../models");
var express = require("express");
var router = express.Router();
//const usuario = require("../models/usuario");
const logger = require('../utils/logger');
var app = express();

const keys = require('../settings/keys');

app.set('key', keys.key);

const altaUsuario = (req, res) => {
    findUsuarioByName(req.body.usuario, {
        onSuccess: () => res.send('El usuario ya existe'),
        onNotFound: () => models.usuario
            .create({ usuario: req.body.usuario, pass: req.body.pass })
            .then(usuario => res.status(201).send({ id: usuario.id }))
            .catch(error => {
                if (error == "SequelizeUniqueConstraintError: Validation error") {
                    res.status(400).send('Bad request: existe otra usuario con el mismo nombre')
                    logger.error(`Bad request: existe otro usuario con el mismo nombre`)
                }
                else {
                    logger.error(`Error al intentar insertar en la base de datos: ${error}`)
                    res.sendStatus(500)
                }
            }),
        onError: () => res.sendStatus(500)
    });
}

const getUsuario = (req, res) => {
    findUsuarioById(req.params.usuario, {
        onSuccess: usuario => res.send(usuario),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    });
}

const deleteUsuario = (req, res) => {
    const onSuccess = usuario =>
        usuario
            .destroy()
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500));
    findUsuarioById(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    });
}

const updateUsuario = (req, res) => {
    const onSuccess = usuario =>
        usuario
            .update({ usuario: req.body.usuario, pass: req.body.pass }, { fields: ["usuario", "pass"] })
            .then(() => res.sendStatus(200))
            .catch(error => {
                if (error == "SequelizeUniqueConstraintError: Validation error") {
                    res.status(400).send('Bad request: existe otra usuario con el mismo nombre')
                    logger.error(`Bad request: existe otro usuario con el mismo nombre`)
                }
                else {
                    logger.error(`Error al intentar actualizar la base de datos: ${error}`)
                    res.sendStatus(500)
                }
            });
    findUsuarioById(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    });
}

const findUsuarioByName = (usuario, { onSuccess, onNotFound, onError }) => {
    models.usuario
        .findOne({
            attributes: ["usuario", "pass"],
            where: { usuario }
        })
        .then(usuario => (usuario ? onSuccess(usuario) : onNotFound()))
        .catch(() => onError());
};

const findUsuarioById = (id, { onSuccess, onNotFound, onError }) => {
    models.usuario
        .findOne({
            attributes: ["id", "usuario", "pass"],
            where: { id }
        })
        .then(usuario => (usuario ? onSuccess(usuario) : onNotFound()))
        .catch(() => onError());
};

module.exports = {
    altaUsuario,
    getUsuario,
    updateUsuario,
    deleteUsuario
}