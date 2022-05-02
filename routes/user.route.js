const { Router } = require("express");
const { check } = require("express-validator");
const {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
} = require("../controllers/users.controller");

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [check("mail", "El correo no tiene un formato de correo").isEmail()],
  postUsers
);

router.put("/:id", putUsers);

router.patch("/", patchUsers);

router.delete("/", deleteUsers);

module.exports = router;
