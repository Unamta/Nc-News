const db = require("../../db/connection");
const format = require('pg-format');

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

const formatTopics = (data) => {
  //console.log(data, '<<< data'); 
  return data.map((row) => {
    return [row.slug, row.description, row.img_url];
  });
  //console.log(newData, '<<< newData');
};

const formatUsers = (data) => {
  //console.log(data, '<<< users data');
  return data.map((row) => {
    return [row.username, row.name, row.avatar_url];
  });
};

const formatArticles = (data) => {
  //console.log(data, '<<< articles data');
  return data.map((row) => {
    const newRow = convertTimestampToDate(row);
    return [newRow.title, newRow.topic, newRow.author, newRow.body, newRow.created_at, newRow.votes, newRow.article_img_url];
  })
};

const formatComments = (data, dataMap) => {
  //console.log(data, '<<< comments data');
  return data.map((row) => {
    const newRow = convertTimestampToDate(row);
    return [dataMap[newRow.article_title], newRow.body, newRow.votes, newRow.author, newRow.created_at];
  });
};

module.exports = {
  convertTimestampToDate,
  formatTopics,
  formatUsers,
  formatArticles,
  formatComments,
};


