const db = require("../connection");
const format = require('pg-format');
const { 
  convertTimestampToDate,
  formatTopics,
  formatUsers,
  formatArticles,
  formatComments,
} = require('./utils.js');

const dropAllTables = () => {
  return db.query(`
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS articles;
    DROP TABLE IF EXISTS topics;
    DROP TABLE IF EXISTS users;
  `);
};

const createTopics = () => {
  return db.query(`
    CREATE TABLE topics (
      slug VARCHAR(1000) PRIMARY KEY,
      description VARCHAR(1000),
      img_url VARCHAR(1000)
    );
  `);
};

const createUsers = () => {
  return db.query(`
    CREATE TABLE users (
      username VARCHAR(1000) PRIMARY KEY,
      name VARCHAR(1000),
      avatar_url VARCHAR(1000)
    );
  `);
};

const createArticles = () => {
  return db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(1000),
      topic VARCHAR(1000) REFERENCES topics(slug),
      author VARCHAR(1000) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      votes INTEGER DEFAULT 0,
      article_img_url VARCHAR(1000)
    );
  `);
};

const createComments = () => {
  return db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT,
      votes INTEGER DEFAULT 0,
      author VARCHAR(1000) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

const insertTopics = (data) => {
  const newData = formatTopics(data);
  const sqlString = `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`
  const formattedString = format(sqlString, newData);
  return db.query(formattedString);
};

const insertUsers = (data) => {
  const newData = formatUsers(data);
  const sqlString = `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`;
  const formattedString = format(sqlString, newData);
  return db.query(formattedString);
};

const insertArticles = (data) => {
  const newData = formatArticles(data);
  const sqlString = `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`
  const formattedString = format(sqlString, newData);
  return db.query(formattedString);
};

const insertComments = (data) => {
  return db.query(`SELECT * FROM articles;`)
    .then((results) => {
      const articleTitleIdMap = {};
      results.rows.map((row) => {
        articleTitleIdMap[row.title] = row.article_id;
      })
      const newData = formatComments(data, articleTitleIdMap);
      const sqlString = `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`;
      const formattedString = format(sqlString, newData);
      return db.query(formattedString);
    });
};

const seed = ({ topicData, userData, articleData, commentData }) => {
  return dropAllTables()
    .then(() => {
      return createTopics();
    })
    .then(() => {
      return createUsers();
    })
    .then(() => {
      return createArticles();
    })
    .then(() => {
      return createComments(); 
    })
    .then(() => {
      return insertTopics(topicData);
    })
    .then(() => {
      return insertUsers(userData);
    })
    .then(() => {
      return insertArticles(articleData);
    })
    .then(() => {
      return insertComments(commentData);
    });
};

module.exports = seed;
