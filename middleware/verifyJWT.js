const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.user = decoded.firstName;
    req.roles = decoded.email;
    next();
  });
};

module.exports = verifyJWT;
