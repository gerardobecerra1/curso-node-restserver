const { Router } = require("express");
const { check } = require("express-validator");
const {
  createPlant,
  getPlants,
  getPlantById,
  updatePlant,
  deletePlant,
} = require("../controllers/plant.controller");
const {
  existClassificationById,
  isValidRole,
} = require("../helpers/db-validators.helper");
const { existPlantById } = require("../helpers/db-validators.helper");
const { validateJWT, validateFields, hasRole } = require("../middlewares");

const router = Router();

//Obtener todas las plantas - publico
router.get("/", getPlants);

//Obtener todas las plantas - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existPlantById),
    validateFields,
  ],
  getPlantById
);

//Crear planta - privado - Cualquier persona con un token válido
router.post(
  "/",
  [
    validateJWT,
    check("classification", "La clasificiación es obligatoria").not().isEmpty(),
    check("classification", "No es un id de Mongo válido").isMongoId(),
    check("classification").custom(existClassificationById),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("scientificName", "El nombre científco es obligatorio")
      .not()
      .isEmpty(),
    check("description", "La descripción es obligatoria").not().isEmpty(),
    validateFields,
  ],
  createPlant
);

//Actualizar planta por id- privado - Cualquier persona con un token válido
router.put(
  "/:id",
  [
    validateJWT,
    hasRole("Administrador", "Colaborador"),
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existPlantById),
    validateFields,
  ],
  updatePlant
);

//Borrar planta por id- privado - Solo el Administrador puede Borrar
router.delete(
  "/:id",
  [
    validateJWT,
    hasRole("Administrador", "Colaborador"),
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existPlantById),
    validateFields,
  ],
  deletePlant
);

module.exports = router;
