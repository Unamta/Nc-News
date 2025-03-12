const express = require("express");
const endpoints = require("./endpoints.json");

const { getEndpoints, getTopics } = require("./controllers/api.controllers.js");
const { getArticleById, getArticles } = require("./controllers/articles.controllers.js");
const { 
  handleNonExistentEndpoint,
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers.js");

const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

app.all("/*", handleNonExistentEndpoint);

module.exports = app;

