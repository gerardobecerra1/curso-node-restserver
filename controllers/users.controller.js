const { response, request } = require("express");

const getUsers = (req = request, res = response) => {
  const { q, nombre = "No name", limit } = req.query;
  res.json({
    msg: "Get API - Controller",
    q,
    nombre,
    limit,
  });
};

const postUsers = (req = req, res = response) => {
  const body = req.body;

  res.json({
    msg: "Post API - Controller",
    body,
  });
};

const putUsers = (req, res = response) => {
  const { id } = req.params;
  res.json({
    msg: "Put API - Controller",
    id,
  });
};

const patchUsers = (req, res = response) => {
  res.json({
    msg: "Patch API - Controller",
  });
};

const deleteUsers = (req, res = response) => {
  res.json({
    msg: "Delete API - Controller",
  });
};

module.exports = { getUsers, postUsers, putUsers, patchUsers, deleteUsers };
