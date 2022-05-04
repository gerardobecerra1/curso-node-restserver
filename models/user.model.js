const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  role_id: {
    type: String,
    required: true,
    enum: ["Administrador", "Colaborador", "Lector"],
  },
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  surname: {
    type: String,
    required: [true, "El apellido es obligatorio"],
  },
  mail: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  image: {
    type: String,
  },
  activated: {
    type: Boolean,
    default: true,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);
