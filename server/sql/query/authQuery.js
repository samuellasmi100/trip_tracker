const getAll = () => {
  return `SELECT * FROM user WHERE email = ? and password = ?;`;
};
const getOne = () => {
  return "SELECT * FROM trader WHERE email = ?";
};
const getUser = (table) => {
  return `SELECT * FROM ${table} WHERE id = ?;`;
};
const getUserJoinVerificationCode = (table) => {
  return `SELECT *
  FROM ${table}
  INNER JOIN verification_code ON user.id = verification_code.user_id
  WHERE user.id = ?;`;
};
const addUser = (columnName) => {
  return `INSERT INTO user(email,password,${columnName}) VALUES(?,?,?)`;
};
const addSixDigitsToUser = (gotUserId, gotSixDigits) => {
  return `INSERT INTO verification_code (user_id, six_digits) VALUES(${gotUserId},${gotSixDigits}) ON DUPLICATE KEY UPDATE six_digits = ${gotSixDigits}`;
};
const updateUserLastLogin = () => {
  return `UPDATE user SET last_login=CURRENT_TIMESTAMP WHERE id = ?`;
};
const addTrader = () => {
  return `INSERT INTO trader(first_name,last_name,email,phone,company) VALUES(?,?,?,?,?)`;
};
const addClient = () => {
  return `INSERT INTO client(client_name,lei,trader_id) VALUES(?,?,?)`;
};
const addClientUser = () => {
  return `INSERT INTO client_user(first_name,last_name,email,phone,daily_limit,privileges,client_id) VALUES(?,?,?,?,?,?,?)`;
};
const addToken = () => {
  return `INSERT INTO user_token(user_id,token,type) VALUES(?,?,?)`;
};
const updateQrCode = (tableName) => {
  return `UPDATE ${tableName} set qr_code = ? WHERE id = ?`;
};
const updateQrImage = (tableName) => {
  return `UPDATE ${tableName} set qr_image = ? WHERE id = ?`;
};
const getQrCodeImage = (table) => {
  return `SELECT qr_image from ${table} WHERE id = ?`;
};
const getQrCode = (table) => {
  return `SELECT qr_code from ${table} WHERE id = ?`;
};

module.exports = {
  getAll,
  getUser,
  getUserJoinVerificationCode,
  addClient,
  addToken,
  addUser,
  addSixDigitsToUser,
  updateUserLastLogin,
  addClientUser,
  updateQrCode,
  updateQrImage,
  getQrCodeImage,
  getQrCode,
  addTrader,
  getOne,
};
