const db = require('./connection.js');
const seed = require('./seeds/seed.js');
const myDevData = require('./data/development-data/');

seed(myDevData);

db.query(`SELECT * FROM users;`)
  .then((results) => {
    console.log("Getting all of the users");
    console.log(results);
  });

console.log("Getting all of the articles where the topic is coding");
console.log("Getting all of the comments where the votes are less than zero");
console.log("Getting all of the topics");
console.log("Getting all of the articles by user grumpy19");
console.log("Getting all of the comments that have more than 10 votes");
