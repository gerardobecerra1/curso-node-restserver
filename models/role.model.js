const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatorio"],
  },
  activated: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("Role", RoleSchema);
