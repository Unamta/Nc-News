const db = require("../db/connection.js");

function fetchCommentsByArticleId(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        console.log("<<< in if statement");
        return Promise.reject(
          {
            status: 404,
            msg: "Not Found",
          }
        );
      } else {
        return db
          .query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;", [article_id])
          .then(({ rows }) => {
            return rows;
          });
      }
    });
}

module.exports = { fetchCommentsByArticleId };

