const endpoints = require("../endpoints.json");

const { fetchTopics } = require("../models/topics.models.js");

function getEndpoints(request, response) {
  response
    .status(200)
    .send({ endpoints: endpoints })
}

function getTopics(request, response) {
  fetchTopics()
    .then((topics) => {
      response
        .status(200)
        .send({ topics: topics });
    });
}

module.exports = { getEndpoints, getTopics };
