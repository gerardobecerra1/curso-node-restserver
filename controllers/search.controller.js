const { response } = require("express");
const { Classification, Plant, Role, User } = require("../models");
const { ObjectId } = require("mongoose").Types;

const allowedCollections = [
  "classifications",
  "plants",
  "plantsByClassification",
  "roles",
  "users",
];

const searchClassififcation = async (term = "", res = response) => {
  try {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
      const classififcation = await Classification.findById(term).populate(
        "user",
        "name"
      );
      res.json({ results: classififcation ? [classififcation] : [] });
    } else {
      const regex = new RegExp(term, "i");

      const classififcations = await Classification.find({
        $or: [{ name: regex }, { description: regex }],
        $and: [{ activated: true }],
      }).populate("user", "name");
      res.json({ results: classififcations });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const searchPlantByClassification = async (term = "", res = response) => {
  try {
    const isMongoId = ObjectId.isValid(term);
    const query = { classification: ObjectId(term) };
    if (isMongoId) {
      const plantByClassification = await Plant.find(query)
        .populate("user", "name")
        .populate("classification", "name");
      res.json({
        results: plantByClassification ? [plantByClassification] : [],
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "No es un ID válido",
    });
  }
};

const searchPlant = async (term = "", res = response) => {
  try {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
      const plant = await Plant.findById(term)
        .populate("user", "name")
        .populate("classification", "name");
      res.json({ results: plant ? [plant] : [] });
    } else {
      const regex = new RegExp(term, "i");

      const plants = await Plant.find({
        $or: [
          { name: regex },
          { scientificName: regex },
          { description: regex },
        ],
        $and: [{ activated: true }],
      })
        .populate("user", "name")
        .populate("classification", "name");
      res.json({ results: plants });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const searchRole = async (term = "", res = response) => {
  try {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
      const role = await Role.findById(term);
      res.json({ results: role ? [role] : [] });
    } else {
      const regex = new RegExp(term, "i");

      const roles = await Role.find({
        $or: [{ name: regex }, { description: regex }],
        $and: [{ activated: true }],
      });
      res.json({ results: roles });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const searchUser = async (term = "", res = response) => {
  try {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
      const user = await User.findById(term);
      res.json({ results: user ? [user] : [] });
    } else {
      const regex = new RegExp(term, "i");

      const users = await User.find({
        $or: [{ name: regex }, { surname: regex }, { mail: regex }],
        $and: [{ activated: true }],
      });
      res.json({ results: users });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const search = (req, res = response) => {
  const { collection, term } = req.params;
  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `'${collection}' no se ecuentra dentro de las coleciones perimitidas son: ${allowedCollections}`,
    });
  }

  switch (collection) {
    case "classifications":
      searchClassififcation(term, res);
      break;
    case "plants":
      searchPlant(term, res);
      break;
    case "plantsByClassification":
      searchPlantByClassification(term, res);
      break;
    case "roles":
      searchRole(term, res);
      break;
    case "users":
      searchUser(term, res);
      break;

    default:
      res.status(500).json({
        msg: "Se le olvido hacer esta búsqueda",
      });
      break;
  }
};

module.exports = {
  search,
};
