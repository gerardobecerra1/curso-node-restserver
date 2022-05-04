const { default: mongoose } = require("mongoose");
const Role = require("../models/role.model");
const User = require("../models/user.model");

const isValidRole = async (name = "") => {
  const existRole = await Role.findOne({ name });
  if (!existRole) {
    throw new Error(
      `El role: '${name}' no está registrado en la base de datos`
    );
  }
};

const mailRegistered = async (mail = "") => {
  const mailExist = await User.findOne({ mail });
  if (mailExist) {
    throw new Error(`El correo: '${mail}' ya se encuentra registrado`);
  }
};

const existUserId = async (id = "") => {
  const idExist = await User.findById(id);
  if (!idExist) {
    throw new Error(`El ID: '${id}' no existe`);
  }
};

module.exports = {
  isValidRole,
  mailRegistered,
  existUserId,
};
