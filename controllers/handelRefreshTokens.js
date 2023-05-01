const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
 
 try {
   jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_PRIVATE_KEY,
   async (err, decoded) => {
      const foundUser = await User.find({email:decoded.email})
      if (err)
        return res.sendStatus(403);
      // const roles = Object.values(foundUser.roles);
      const payload = {
        firstName: decoded.firstName,
        email: decoded.email,
      };
      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "365d" }
      );
      res.json({ accessToken, userId: foundUser[0]._id});
    }
  );
 } catch (error) {
    res.send(error.message)
 }
};

module.exports = { handleRefreshToken };
