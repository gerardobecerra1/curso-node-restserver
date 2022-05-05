const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth.controller");
const { validateFields } = require("../middlewares/validate-fields.middleware");
const router = Router();

router.post(
  "/login",
  [
    check("mail", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  "/google",
  [
    check("id_token", "Se necesita el id_token de Google").not().isEmpty(),
    validateFields,
  ],
  googleSignIn
);

module.exports = router;
