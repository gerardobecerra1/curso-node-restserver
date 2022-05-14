const validateFields = require("../middlewares/validate-fields.middleware");
const validateJWT = require("../middlewares/validate-jwt.middleware");
const validateRoles = require("../middlewares/validate-roles.middleware");
const validateFile = require("../middlewares/validate-file.middleware");

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRoles,
  ...validateFile,
};
