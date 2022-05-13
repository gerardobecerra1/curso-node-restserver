const { Schema, model } = require("mongoose");

const ClassificationSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
  },
  activated: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

ClassificationSchema.methods.toJSON = function () {
  const { __v, activated, ...data } = this.toObject();
  return data;
};

module.exports = model("Classification", ClassificationSchema);
