const { request } = require("express");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //Leer el usuario que corresponde al uid
    const authUser = await User.findById(uid);

    if (!authUser) {
      return res.status(401).json({
        msg: "Usuario no existe en base de datos",
      });
    }

    //Verificar si el uid tiene estado en true
    if (!authUser.activated) {
      return res.status(401).json({
        msg: "Token no válida - usuario con activated: false",
      });
    }

    req.authUser = authUser;
    next();
  } catch (error) {
    console.log(token);
    return res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validateJWT,
};
