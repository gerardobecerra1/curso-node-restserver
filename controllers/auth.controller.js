const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { json } = require("express/lib/response");
const { generateJWT } = require("../helpers/generate-jwt.helper");
const { googleVerify } = require("../helpers/google-verify.helper");
const User = require("../models/user.model");

const login = async (req, res = response) => {
  const { mail, password } = req.body;

  try {
    //Verificar si el email existe
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    //Si el usuario está activo
    if (!user.activated) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    //Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    //Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, surname, mail, image } = await googleVerify(id_token);

    let user = await User.findOne({ mail });
    if (!user) {
      //Creamos el usuario
      const data = {
        role_id: "Lector",
        name,
        surname,
        mail,
        password: "123456",
        image,
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    //si el usuario en DB
    if (!user.activated) {
      return res.status(401).json({
        msg: "Hable con el administrado, usuario bloqueado",
      });
    }

    //Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    json.status(401),
      json({
        ok: false,
        msg: "El Token no se pudo verificar",
      });
  }
};

module.exports = {
  login,
  googleSignIn,
};
