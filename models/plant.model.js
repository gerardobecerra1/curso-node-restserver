const { Schema, model } = require("mongoose");

const PlantSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  scientificName: {
    type: String,
    required: [true, "El nombre científico es obligatorio"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
  },
  image: {
    type: String,
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
  classification: {
    type: Schema.Types.ObjectId,
    ref: "Classification",
    require: true,
  },
});

PlantSchema.methods.toJSON = function () {
  const { __v, activated, ...data } = this.toObject();
  return data;
};

module.exports = model("Plant", PlantSchema);
