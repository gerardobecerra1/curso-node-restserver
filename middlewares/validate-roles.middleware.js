const { response } = require("express");
const { request } = require("express");

const isAdminRole = (req = request, res = response, next) => {
  if (!req.authUser) {
    return res.status(500).json({
      msg: "Se quiere verificar el role sin validar el token primero",
    });
  }

  const { role_id, name } = req.authUser;
  if (role_id !== "Administrador") {
    return res.status(401).json({
      msg: `${name} no es Administrador - No puede ejecutar esta acción`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.authUser) {
      return res.status(500).json({
        msg: "Se quiere verificar el role sin validar el token primero",
      });
    }

    if (!roles.includes(req.authUser.role_id)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole,
};
