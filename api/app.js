var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var carrerasRouter = require('./routes/carreras');
var materiasRouter = require('./routes/materias');
var alumnosRouter = require('./routes/alumnos');
var profesoresRouter = require('./routes/profesores');
var usuariosRouter = require('./routes/usuarios');
var loginRouter = require('./routes/login');
var app = express();

const jwt = require('jsonwebtoken');
const keys = require('./settings/keys');

app.set('key', keys.key);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const verificacion = express.Router();

verificacion.use((req, res, next) => {
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
})

app.use('/car', verificacion, carrerasRouter);
app.use('/mat', verificacion, materiasRouter);
app.use('/alu', verificacion, alumnosRouter);
app.use('/pro', verificacion, profesoresRouter);
app.use('/user', verificacion, usuariosRouter);
app.use('/login', loginRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
