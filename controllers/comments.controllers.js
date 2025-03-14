const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  deleteFromComments,
} = require("../models/comments.models.js");

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

function postCommentByArticleId(request, response, next) {
  const myId = request.params.article_id;
  const username = request.body.username;
  const body = request.body.body;
  return insertCommentByArticleId(myId, username, body)
    .then((comment) => {
      response.status(201).send({ comment: comment });
    })
    .catch((error) => {
      next(error);
    });
}

function deleteCommentById(request, response, next) {
  const myId = request.params.comment_id;
  return deleteFromComments(myId)
    .then(() => {
      response.status(204).send({});
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
};
