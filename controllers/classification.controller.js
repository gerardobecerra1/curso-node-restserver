const { response } = require("express");
const { Classification } = require("../models");

//Obtener Classifications - paginado - total - populate
const getClassifications = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { activated: true };

  const [total, classifications] = await Promise.all([
    Classification.countDocuments(query),
    Classification.find(query)
      .populate("user", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({ total, classifications });
};

//Obtener Classification - populate {}
const getClassificationById = async (req, res = response) => {
  const { id } = req.params;
  const classification = await Classification.findById(id).populate(
    "user",
    "name"
  );
  res.json(classification);
};

const createClassification = async (req, res = response) => {
  const { name, description } = req.body;

  const classificationDB = await Classification.findOne({ name });
  if (classificationDB) {
    return res.status(400).json({
      msg: `La clasificación: '${classificationDB.name}', ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    name,
    description,
    user: req.authUser._id,
  };

  const classification = new Classification(data);

  //Guardar en DB
  await classification.save();

  res.json(classification);
};

//Actualizar Classification
const updateClassification = async (req, res = response) => {
  const { id } = req.params;
  const { activated, user, ...data } = req.body;

  data.user = req.authUser._id;
  const classification = await Classification.findByIdAndUpdate(id, data, {
    new: true,
  });

  res.json(classification);
};

//Borrar Classification - activated: false
const deleteClassification = async (req, res = response) => {
  const { id } = req.params;

  const classificationDeleted = await Classification.findByIdAndUpdate(
    id,
    { activated: false },
    { new: true }
  );

  res.json(classificationDeleted);
};

module.exports = {
  createClassification,
  getClassifications,
  getClassificationById,
  updateClassification,
  deleteClassification,
};
