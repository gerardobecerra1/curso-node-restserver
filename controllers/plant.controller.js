const { response } = require("express");
const { Plant } = require("../models");

//Obtener Plants - paginado - total - populate
const getPlants = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { activated: true };

  const [total, foundPlants] = await Promise.all([
    Plant.countDocuments(query),
    Plant.find(query)
      .populate("user", "name")
      .populate("classification", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({ total, foundPlants });
};

//Obtener Plants - populate {}
const getPlantById = async (req, res = response) => {
  const { id } = req.params;
  const foundPlant = await Plant.findById(id)
    .populate("user", "name")
    .populate("classification", "name");
  res.json({ foundPlant });
};

const createPlant = async (req, res = response) => {
  const { activated, user, ...body } = req.body;

  const plantDB = await Plant.findOne({ name: body.name });
  if (plantDB) {
    return res.status(400).json({
      msg: `La planta: '${plantDB.name}', ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    ...body,
    user: req.authUser._id,
  };

  const createdPlant = new Plant(data);

  //Guardar en DB
  await createdPlant.save();

  res.status(201).json({ createdPlant });
};

//Actualizar Plant
const updatePlant = async (req, res = response) => {
  const { id } = req.params;
  const { activated, user, ...data } = req.body;

  data.user = req.authUser._id;
  const upgradedPlant = await Plant.findByIdAndUpdate(id, data, {
    new: true,
  });

  res.json({ upgradedPlant });
};

//Borrar Plant - activated: false
const deletePlant = async (req, res = response) => {
  const { id } = req.params;

  const removedPlant = await Plant.findByIdAndUpdate(
    id,
    { activated: false },
    { new: true }
  );

  res.json({ removedPlant });
};

module.exports = {
  createPlant,
  getPlants,
  getPlantById,
  updatePlant,
  deletePlant,
};
