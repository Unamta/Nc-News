const { fetchArticleById } = require("../models/articles.models.js");

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

module.exports = { getArticleById };
