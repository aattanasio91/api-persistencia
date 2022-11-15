var express = require('express');
const jwt = require('jsonwebtoken');
const keys = require('../settings/keys');
var app = express();

app.set('key', keys.key);

const checkAuth = express.Router();
checkAuth.use((req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(!token){
      res.status(401).send({
        error: 'Es necesario un token de autenticación'
      })
      return
    }
    if(token.startsWith('Bearer ')){
      token = token.slice(7, token.length);
    }
    jwt.verify(token, app.get('key'), (error, decoded) => {
      if(error){
        return res.json({
          message: 'El token no es valido'
        });
      }else{
        req.decoded = decoded;
        next();
      }
    })
  });

  module.exports = checkAuth;