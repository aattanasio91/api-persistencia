var express = require("express");
var router = express.Router();
var models = require("../models");
const usuario = require("../models/usuario");

var app = express();

const jwt = require('jsonwebtoken');
const keys = require('../settings/keys');

app.set('key', keys.key);

router.post('/login', (req, res) => {
    findusuario(req.body.usuario, {
        onSuccess: usuario =>  validate(usuario, req, res),
        onNotFound: () => res.send('Usuario y/ password incorrecta.'),
        onError: () => res.sendStatus(500)
      });
});

const validate = (usuario, req, res) => {
    if(req.body.usuario == usuario.usuario && req.body.pass == usuario.pass){
        console.log(router)
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
    }else{
        res.json({
          message:'Usuario y/ password incorrecta.'
        });
    }
};

router.post("/altausuario", (req, res) => {
  models.usuario
    .create({ usuario: req.body.usuario, pass: req.body.pass })
    .then(usuario => res.status(201).send({ id: usuario.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra usuario con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findusuario = (usuario, { onSuccess, onNotFound, onError }) => {
  models.usuario
    .findOne({
      attributes: ["usuario", "pass"],
      where: { usuario }
    })
    .then(usuario => (usuario ? onSuccess(usuario) : onNotFound()))
    .catch(() => onError());
};

router.put("/:id", (req, res) => {
  const onSuccess = usuario =>
    usuario
      .update({ usuario: req.body.usuario, pass: req.body.pass }, { fields: ["usuario", "pass"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra usuario con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findusuario(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.get("/:usuario", (req, res) => {
    findusuario(req.params.usuario, {
      onSuccess: usuario => res.send(usuario),
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });

router.delete("/:id", (req, res) => {
  const onSuccess = usuario =>
    usuario
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findusuario(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
