const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
} = require("../controllers/user.controller");

const { validateFields } = require("../middlewares/validar-campos.middleware");
const {
  isValidRole,
  mailRegistered,
  existUserId,
} = require("../helpers/db-validators.helper");

router.get("/", getUsers);

router.post(
  "/",
  [
    check("role_id").custom(isValidRole),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("surname", "El apellido es obligatorio").not().isEmpty(),
    check("mail", "El correo no tiene un formato de correo").isEmail(),
    check("mail").custom(mailRegistered),
    check(
      "password",
      "El password es obligatorio y debe contener más de 6 letras"
    ).isLength({ min: 6 }),
    validateFields,
  ],
  postUsers
);

router.put(
  "/:id",
  [
    check("id", "No es un ID váido").isMongoId(),
    check("id").custom(existUserId),
    check("role_id").custom(isValidRole),
    validateFields,
  ],
  putUsers
);

router.patch("/", patchUsers);

router.delete(
  "/:id",
  [
    check("id", "No es un ID váido").isMongoId(),
    check("id").custom(existUserId),
    validateFields,
  ],
  deleteUsers
);

module.exports = router;
