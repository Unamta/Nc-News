const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
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
  console.log("In controller");
  const myId = request.params.article_id;
  const username = request.body.username;
  const body = request.body.body;
  console.log(myId, username, body);
  return insertCommentByArticleId(myId, username, body)
    .then((comment) => {
      console.log("inserted properly");
      response.status(201).send({ comment: comment });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getCommentsByArticleId, postCommentByArticleId };
