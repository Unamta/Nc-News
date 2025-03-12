const { fetchArticleById, fetchArticles } = require("../models/articles.models.js");
const { fetchCommentsByArticleId } = require("../models/comments.models.js");

function getArticles(request, response, next) {
  fetchArticles()
    .then((articles) => {
      response
        .status(200)
        .send({ articles: articles });
    })
    .catch((error) => {
      next(error);
    });
}

function getArticleById(request, response, next) {
  const myId = request.params.article_id;
  fetchArticleById(myId)
    .then((article) => {
      response
        .status(200)
        .send({ article: article });
    })
    .catch((error) => {
      next(error);
    });
}

function getCommentsByArticleId(request, response, next) {
  const myId = request.params.article_id;
  fetchCommentsByArticleId(myId)
    .then((comments) => {
      response
        .status(200)
        .send({ comments: comments });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getArticleById, getArticles, getCommentsByArticleId };
