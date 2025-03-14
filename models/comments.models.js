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
