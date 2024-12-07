const getAll = () => {
    return `SELECT * FROM trip_tracker.user WHERE email = ? and password = ?;`;
  };
  module.exports = {
    getAll
  }