const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config.database");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      search: "/api/search",
      classifications: "/api/classifications",
      plants: "/api/plants",
      users: "/api/users",
      uploads: "/api/uploads",
    };

    //Conectar a DB
    this.connectDB();

    //Middlewares
    this.middlewares();

    //Rutas de mi aplicación
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //Lectura y Parseo del Body
    this.app.use(express.json());

    //Directorio público
    this.app.use(express.static("public"));

    //Fileupload - Carga de archivos

    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.route"));
    this.app.use(this.paths.search, require("../routes/search.route"));
    this.app.use(
      this.paths.classifications,
      require("../routes/classification.route")
    );
    this.app.use(this.paths.plants, require("../routes/plant.route"));
    this.app.use(this.paths.users, require("../routes/user.route"));
    this.app.use(this.paths.uploads, require("../routes/upload.route"));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Servidor corriendo en puerto: ${this.port}`)
    );
  }
}

module.exports = Server;
