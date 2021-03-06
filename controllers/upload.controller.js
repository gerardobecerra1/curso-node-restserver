const { response } = require("express");
const { uploadLocalFile } = require("../helpers/upload-file.helper");
const { User, Plant } = require("../models");
const path = require("path");
const fs = require("fs");

//Configuración para subir imagenes a la nube
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

this.folderPaths = {
  imgFolder: "images",
  txtFolder: "texts",
};

this.validExt = {
  imgExts: ["jpg", "png", "jpeg"],
  txtExts: ["txt", "md"],
};

const loadFile = async (req, res = response) => {
  try {
    //txt, md
    // const fileName = await uploadLocalFile(req.files, this.validExt.txtExts,  this.folderPaths.txtFolder);

    //imagenes
    const fileName = await uploadLocalFile(
      req.files,
      this.validExt.imgExts,
      this.folderPaths.imgFolder
    );

    res.json({ fileName });
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateLocalFile = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el ID: "${id}"`,
        });
      }
      break;
    case "plants":
      model = await Plant.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe una planta con el ID: "${id}"`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //Limpiar imagenes previas
  if (model.image) {
    //Borrar imagen del servidor
    const pathFolder = path.join(
      __dirname,
      "../uploads",
      collection,
      model.image
    );
    if (fs.existsSync(pathFolder)) {
      fs.unlinkSync(pathFolder);
    }
  }

  const name = await uploadLocalFile(req.files, undefined, collection);
  model.image = name;

  await model.save();

  res.json(model);
};

const updateCloudinaryFile = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el ID: "${id}"`,
        });
      }
      break;
    case "plants":
      model = await Plant.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe una planta con el ID: "${id}"`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //Limpiar imagenes previas
  if (model.image) {
    const nameArr = model.image.split("/");

    const pathImg = [
      nameArr[nameArr.length - 3],
      nameArr[nameArr.length - 2],
      nameArr[nameArr.length - 1],
    ];
    const name = pathImg.join("/");
    const [public_id] = name.split(".");

    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
    folder: `${this.folderPaths.imgFolder}/${collection}`,
  });

  model.image = secure_url;

  await model.save();

  res.json(model);
};

const showImage = async (req, res = response) => {
  const { id, collection } = req.params;
  const pathNoImage = path.join(__dirname, "../assets", "no-image.jpg");

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.sendFile(pathNoImage);
      }
      break;
    case "plants":
      model = await Plant.findById(id);
      if (!model) {
        return res.sendFile(pathNoImage);
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  if (model.image) {
    const pathFolder = path.join(
      __dirname,
      "../uploads",
      collection,
      model.image
    );

    if (fs.existsSync(pathFolder)) {
      return res.sendFile(pathFolder);
    }
  }

  return res.sendFile(pathNoImage);
};

module.exports = {
  loadFile,
  updateLocalFile,
  updateCloudinaryFile,
  showImage,
};
