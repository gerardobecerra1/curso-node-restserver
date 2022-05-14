const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFile = (
  files,
  validExtensions = ["jpg", "png", "jpeg"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const cutName = file.name.split(".");
    const extension = cutName[cutName.length - 1];

    if (!validExtensions.includes(extension)) {
      return reject(
        `La extensión "${extension}" no es permitida, solo se permiten extensiones "${validExtensions}"`
      );
    }

    //Creamos un nuevo nombre único
    const finalName = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, finalName);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(finalName);
    });
  });
};

module.exports = {
  uploadFile,
};
