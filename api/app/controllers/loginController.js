var express = require("express");
var router = express.Router();
var models = require("../models");
var app = express();

const jwt = require('jsonwebtoken');
const keys = require('../settings/keys');
const logger = require("../utils/logger");

app.set('key', keys.key);
const login = (req, res) => {
    findusuario(req.body.Username, {
        onSuccess: Username => validateUserAndPass(Username, req, res),
        onNotFound: () => {
          res.send('Usuario y/o password incorrecta.')
        },
        onError: () => res.sendStatus(500)
    });
}

const validateUserAndPass = (usuario, req, res) => {
    if(req.body.Username == usuario.usuario && req.body.Password == usuario.pass){
        const payload = {
          check: true
        };
        const token = jwt.sign(payload, app.get('key'), {
          expiresIn:'5m'
        });
        res.json({
          message:'¡AUTENTICACION EXITOSA',
          token: token
        });
        logger.info('Autenticación exitosa');
    }else{
        res.json({
          message:'Usuario y/ password incorrecta.'
        });
        logger.error('Usuario y/ password incorrecta.');
    }
};

const findusuario = (usuario, { onSuccess, onNotFound, onError }) => {
    models.usuario
      .findOne({
        attributes: ["usuario", "pass"],
        where: { usuario }
      })
      .then(usuario => (usuario ? onSuccess(usuario) : onNotFound()))
      .catch(() => onError());
  };

  module.exports = {
    login
  }