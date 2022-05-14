const { Classification, Plant, Role, User } = require("../models");
/* Role*/

const isValidRole = async (name = "") => {
  const existRole = await Role.findOne({ name });
  if (!existRole) {
    throw new Error(
      `El role: '${name}' no está registrado en la base de datos`
    );
  }
};
/* Role*/

/* User*/

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
/* User*/

/* Classifications*/
const existClassificationById = async (id) => {
  const existClassification = await Classification.findById(id);
  if (!existClassification) {
    throw new Error(`El id: '${id}' no existe`);
  }
};
/* Classifications*/

/* Plantas*/
const existPlantById = async (id) => {
  const existPlant = await Plant.findById(id);
  if (!existPlant) {
    throw new Error(`El id: '${id}' no existe`);
  }
};
/* Plantas*/

/*Validar colleciones permitidas*/
const allowedCollections = (collection = "", collections = []) => {
  const included = collections.includes(collection);
  if (!included) {
    throw new Error(
      `La colleción: "${collection}" no es permitida, solo se permiten las siguientes colleciones: "${collections}"`
    );
  }
  return true;
};

module.exports = {
  isValidRole,
  mailRegistered,
  existUserId,
  existClassificationById,
  existPlantById,
  allowedCollections,
};
