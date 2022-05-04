const validateFields = require("../middlewares/validate-fields.middleware");
const validateJWT = require("../middlewares/validate-jwt.middleware");
const validateRoles = require("../middlewares/validate-roles.middleware");

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRoles,
};
