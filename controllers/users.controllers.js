const { fetchUsers } = require("../models/users.models.js");

function getUsers(request, response) {
  fetchUsers().then((users) => {
    response.status(200).send({ users: users });
  });
}

module.exports = {
  getUsers,
};
