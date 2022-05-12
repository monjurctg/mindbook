
const jwt = require("jsonwebtoken");


module.exports = function (req, res, next) {
  // get token
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};