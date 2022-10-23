const jwt = require("jsonwebtoken");

function signJWT(id) {
  const token = jwt.sign(id, process.env.JWT_SIGNATURE, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
}

module.exports = signJWT;
