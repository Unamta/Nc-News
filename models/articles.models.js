const db = require("../db/connection.js");

function fetchArticles(sortColumn, sortOrder, filterTopic) {
  const sortGreenlist = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];
  const orderGreenlist = ["asc", "desc"];

  if (!sortGreenlist.includes(sortColumn)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }

  if (!orderGreenlist.includes(sortOrder)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }

  if (filterTopic !== undefined) {
    const queryString = `SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles WHERE topic = $1 ORDER BY ${sortColumn} ${sortOrder};`;
    return db.query(queryString, [filterTopic]).then(({ rows }) => {
      return rows;
    });
  }

  const queryString = `SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY ${sortColumn} ${sortOrder};`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
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

function updateArticleVotesById(article_id, inc_votes) {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (typeof inc_votes != "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
      [article_id, inc_votes],
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
}

module.exports = { fetchArticleById, fetchArticles, updateArticleVotesById };
