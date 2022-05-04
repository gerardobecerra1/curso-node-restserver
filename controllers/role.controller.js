const { response, request } = require("express");

const Role = require("../models/role.model");
const User = require("../models/user.model");

const getRoles = (req = request, res = response) => {
  const { q, nombre = "No name", limit } = req.query;
  res.json({
    msg: "Get Role API - Controller",
    q,
    nombre,
    limit,
  });
};

const postRoles = async (req = req, res = response) => {
  const { name, description } = req.body;
  const role = new User({ name, description });

  //Verficar si el correo existe
  const roleExist = await Role.findOne({ name });
  if (roleExist) {
    return res.status(400).json({
      msg: "El nombre ya se encuentra registrado",
    });
  }

  //Guardar en BD
  await role.save();

  res.json({
    msg: "Post Role API - Controller",
    role,
  });
};

const putRoles = (req, res = response) => {
  const { id } = req.params;
  res.json({
    msg: "Put Role API - Controller",
    id,
  });
};

const patchRoles = (req, res = response) => {
  res.json({
    msg: "Patch Role API - Controller",
  });
};

const deleteRoles = (req, res = response) => {
  res.json({
    msg: "Delete Role API - Controller",
  });
};

module.exports = { getRoles, postRoles, putRoles, patchRoles, deleteRoles };
