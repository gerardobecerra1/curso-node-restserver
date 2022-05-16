const { Router } = require("express");
const { check } = require("express-validator");
const {
  loadFile,
  showImage,
  updateCloudinaryFile,
} = require("../controllers/upload.controller");
const { allowedCollections } = require("../helpers/db-validators.helper");
const { validateFields, validateUploadFile } = require("../middlewares");
const router = Router();

router.post("/", validateUploadFile, loadFile);

router.put(
  "/:collection/:id",
  [
    validateUploadFile,
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "plants"])
    ),
    validateFields,
  ],
  updateCloudinaryFile
);

//   ],
//   updateLocalFile
// );

router.get(
  "/:collection/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "plants"])
    ),
    validateFields,
  ],
  showImage
);

module.exports = router;
