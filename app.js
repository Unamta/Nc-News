const express = require("express");
const endpoints = require("./endpoints.json");

const { getEndpoints, getTopics } = require("./controllers/api.controllers.js");
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("./controllers/articles.controllers.js");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");
const {
  handleNonExistentEndpoint,
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers.js");

const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

app.all("/*", handleNonExistentEndpoint);

module.exports = app;
