const endpoints = require("../endpoints.json")

function getEndpoints(request, response) {
  response
    .status(200)
    .send({ endpoints: endpoints })
}

module.exports = { getEndpoints };
