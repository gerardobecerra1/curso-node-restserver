const bcryptjs = require("bcryptjs");
const { response, request } = require("express");
const User = require("../models/user.model");

const getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { activated: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({ total, users });
  //131 borrando usuarios
};

const postUsers = async (req = req, res = response) => {
  const { role_id, name, surname, mail, password } = req.body;
  const user = new User({ role_id, name, surname, mail, password });

  //Encriptamos la contraseña
  const salt = bcryptjs.genSaltSync(10);
  user.password = bcryptjs.hashSync(password, salt);

  //Guardar en BD
  await user.save();

  res.json({
    msg: "Post User API - Controller",
    user,
  });
};

const putUsers = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, mail, ...rest } = req.body;

  //TODO Validar contra la base de datos
  if (password) {
    //Encriptamos la contraseña
    const salt = bcryptjs.genSaltSync(10);
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.json({
    user,
  });
};

const patchUsers = (req, res = response) => {
  res.json({
    msg: "Patch User API - Controller",
  });
};

const deleteUsers = async (req, res = response) => {
  const { id } = req.params;

  //Fisicamente lo borramos
  // const user = await User.findByIdAndDelete(id);

  const user = await User.findByIdAndUpdate(id, { activated: false });

  res.json({
    user,
  });
};

module.exports = { getUsers, postUsers, putUsers, patchUsers, deleteUsers };
