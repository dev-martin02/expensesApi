const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      throw new Error("Missing authentication token");
    }
    const token = req.cookies.jwt;

    const validateToken = jwt.verify(token, "secretKey");
    if (!validateToken) {
      throw Error("Your not authenticated!");
    }
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { requireAuth };
