const { Router } = require("express");
const { check } = require("express-validator");
const {
  getRoles,
  postRoles,
  putRoles,
  patchRoles,
  deleteRoles,
} = require("../controllers/role.controller");
const { validateFields } = require("../middlewares/validar-campos.middleware");

const router = Router();

router.get("/", getRoles);

router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("description", "La descripción es obligatorio").not().isEmpty(),
    validateFields,
  ],
  postRoles
);

router.put("/:id", putRoles);

router.delete("/:id", deleteRoles);

module.exports = router;
