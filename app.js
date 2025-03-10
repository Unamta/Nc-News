const express = require("express");
const endpoints = require("./endpoints.json");

const { getEndpoints } = require("./controllers/api.controllers.js")

const app = express();

app.get("/api", getEndpoints);

app.use(express.json()); 

module.exports = app;

