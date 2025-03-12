const express = require("express");
const endpoints = require("./endpoints.json");

const { 
  getEndpoints,
  getTopics
} = require("./controllers/api.controllers.js");
const { 
  getArticleById,
  getArticles,
  getCommentsByArticleId
} = require("./controllers/articles.controllers.js");
//const { getCommentsByArticleId } = require("./controllers/comments.controllers.js");
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
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

app.all("/*", handleNonExistentEndpoint);

module.exports = app;

