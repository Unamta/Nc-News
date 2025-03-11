function handleNonExistentEndpoint(request, response, next) {
  response
    .status(404)
    .send({
      status: 404,
      msg: "Not Found",
    });
}

module.exports = { handleNonExistentEndpoint };

