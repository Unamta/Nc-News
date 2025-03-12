const db = require("../db/connection.js");

function fetchArticles() {
  return db
    .query("SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC;")
    .then(({ rows }) => {
      return rows;
    })
}

function fetchArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      const myArticle = rows[0];
      if (!myArticle) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      return myArticle;
    });
}

module.exports = { fetchArticleById, fetchArticles };

