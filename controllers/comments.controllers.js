const { insertCommentByArticleId } = require("../models/comments.models.js");

function postCommentByArticleId(request, response, next) {
  const myId = request.params.article_id;
  const username = request.body.username;
  const body = request.body.body;
  insertCommentByArticleId(myId, username, body)
    .then((comment) => {
      console.log("inserted properly");
      response.status(201).send({ comment: comment });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { postCommentByArticleId };
