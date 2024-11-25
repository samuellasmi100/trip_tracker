const getAll = () => {
    return `SELECT * FROM user WHERE email = ? and password = ?;`;
  };
  module.exports = {
    getAll
  }