const authDb = require("./authDb")
const Hashes = require("jshashes");
const SHA256 = new Hashes.SHA256();
const jwt = require("jsonwebtoken");

const login = async ({email, password }) => {
    let encryptPassword = SHA256.hex(password);
    let result = await authDb.checkUserInfo(
        email,
        encryptPassword,
      );
        if(result.id !== undefined){
          let tokenData = {
            userId: result.id,
            permission: result.permission,
            email: result.email,
          }
          const token = generateToken(tokenData)
          return token
        }else {
          return result
        }  
      }
      


const generateToken = ({userId,permission,email}) => {
    const token = jwt.sign({userId,permission,email},`${process.env.TOKEN_SECRET_KEY}`);
    return token;
  };
  
module.exports = {
login
}