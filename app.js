const express = require("express");
const endpoints = require("./endpoints.json");

const { getEndpoints, getTopics } = require("./controllers/api.controllers.js");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers.js");
const {
  postCommentByArticleId,
} = require("./controllers/comments.controllers.js");
const {

  handleNonExistentEndpoint,
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers.js");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

app.all("/*", handleNonExistentEndpoint);

module.exports = app;
