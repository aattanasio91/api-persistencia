'use strict';
module.exports = (sequelize, DataTypes) => {
  const usuario = sequelize.define('usuario', {
    usuario: DataTypes.STRING,
    pass: DataTypes.STRING
  }, {});
  usuario.associate = function(models) {
  };
  return usuario;
};