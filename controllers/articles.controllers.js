const {
  fetchArticleById,
  fetchArticles,
  updateArticleVotesById,
} = require("../models/articles.models.js");
const { fetchCommentsByArticleId } = require("../models/comments.models.js");

function getArticles(request, response, next) {
  const sortColumn = request.query.sort_by ?? "created_at";
  const sortOrder = request.query.order ?? "desc";
  const filterTopic = request.query.topic;

  fetchArticles(sortColumn, sortOrder, filterTopic)
    .then((articles) => {
      response.status(200).send({ articles: articles });
    })
    .catch((error) => {
      next(error);
    });
}

function getArticleById(request, response, next) {
  const myId = request.params.article_id;
  fetchArticleById(myId)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch((error) => {
      next(error);
    });
}

function getCommentsByArticleId(request, response, next) {
  const myId = request.params.article_id;
  fetchCommentsByArticleId(myId)
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch((error) => {
      next(error);
    });
}

function patchArticleById(request, response, next) {
  const myId = request.params.article_id;
  const amount = request.body.inc_votes;
  updateArticleVotesById(myId, amount)
    .then((article) => {
      response.status(200).send({
        article: article,
      });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  patchArticleById,
};
