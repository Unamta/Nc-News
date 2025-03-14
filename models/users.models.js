const db = require("../db/connection.js");

function fetchUsers() {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
}

module.exports = {
  fetchUsers,
};
