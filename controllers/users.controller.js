const bcryptjs = require("bcryptjs");
const { response, request } = require("express");
const { validationResult } = require("express-validator");

const User = require("../models/user.model");

const getUsers = (req = request, res = response) => {
  const { q, nombre = "No name", limit } = req.query;
  res.json({
    msg: "Get API - Controller",
    q,
    nombre,
    limit,
  });
};

const postUsers = async (req = req, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  //Video 123-validar todos los campos necesarios

  const { role_id, name, surname, mail, password } = req.body;
  const user = new User({ role_id, name, surname, mail, password });
  //Verficar si el correo existe
  const mailExist = await User.findOne({ mail });
  if (mailExist) {
    return res.status(400).json({
      msg: "El correo ya se encuentra registrado",
    });
  }

  //Encriptar la contraseña
  const salt = bcryptjs.genSaltSync(10);
  user.password = bcryptjs.hashSync(password, salt);

  //Guardar en BD
  await user.save();

  res.json({
    msg: "Post API - Controller",
    user,
  });
};

const putUsers = (req, res = response) => {
  const { id } = req.params;
  res.json({
    msg: "Put API - Controller",
    id,
  });
};

const patchUsers = (req, res = response) => {
  res.json({
    msg: "Patch API - Controller",
  });
};

const deleteUsers = (req, res = response) => {
  res.json({
    msg: "Delete API - Controller",
  });
};

module.exports = { getUsers, postUsers, putUsers, patchUsers, deleteUsers };
