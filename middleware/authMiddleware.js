const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.jwt_secret_key;

// Verify JWT token middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }
  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
}

module.exports = { verifyToken };
