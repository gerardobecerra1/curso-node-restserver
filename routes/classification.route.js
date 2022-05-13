const { Router } = require("express");
const { check } = require("express-validator");
const {
  createClassification,
  getClassifications,
  getClassificationById,
  updateClassification,
  deleteClassification,
} = require("../controllers/classification.controller");
const { existClassificationById } = require("../helpers/db-validators.helper");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");

const router = Router();

//Obtener todas las clasificaciones - publico
router.get("/", getClassifications);

//Obtener todas las clasificaciones - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existClassificationById),
    validateFields,
  ],
  getClassificationById
);

//Crear clasificación - privado - Cualquier persona con un token válido
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("description", "La descripción es obligatoria").not().isEmpty(),
    validateFields,
  ],
  createClassification
);

//Actualizar clasificación por id- privado - Cualquier persona con un token válido
router.put(
  "/:id",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existClassificationById),
    validateFields,
  ],
  updateClassification
);

//Borrar clasificación por id- privado - Solo el Administrador puede Borrar
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existClassificationById),
    validateFields,
  ],
  deleteClassification
);

module.exports = router;
