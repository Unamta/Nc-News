const express = require("express");
const endpoints = require("./endpoints.json");

const { getEndpoints, getTopics } = require("./controllers/api.controllers.js");
const { handleNonExistentEndpoint } = require("./controllers/errors.controllers.js");

const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);

app.all("/*", handleNonExistentEndpoint);

app.use((err, request, response, next) => {
  response
    .status(500)
    .send({
      status: 500,
      msg: "Internal server error",
    });
});

module.exports = app;

