const db = require("../db/connection.js");

function insertCommentByArticleId(article_id, username, body) {
  const votes = 0;
  return db
    .query(
      "INSERT INTO comments (article_id, body, votes, author) VALUES ($1, $2, $3, $4) RETURNING *",
      [article_id, body, votes, username],
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = { insertCommentByArticleId };
function fetchCommentsByArticleId(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
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
