function handleNonExistentEndpoint(request, response, next) {
  response
    .status(404)
    .send({
      status: 404,
      msg: "Not Found",
    });
}

function handlePSQLErrors(error, request, response, next) {
  if (error.code === "22P02") {
    response
      .status(400)
      .send({ msg: "Bad Request" });
  } else {
    next(error);
  }
}

function handleCustomErrors(error, request, response, next) {
  if (error.status) {
    response
      .status(error.status)
      .send({ msg: error.msg });
  } else {
    next(error);
  }
}

function handleServerErrors(error, request, response, next) {
    response
      .status(500)
      .send({ msg: "Internal Server Error" });
}

module.exports = { handleNonExistentEndpoint, handlePSQLErrors, handleCustomErrors, handleServerErrors };

