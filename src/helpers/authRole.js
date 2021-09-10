const { JWT_KEY } = require("./environment");
const jwt = require("jsonwebtoken");
const users = require("../models/userAuth");

async function authRole(req, res, next) {
  let decoded = jwt.verify(req.headers.authorization, JWT_KEY);
  let data = await users.findOne({ email: decoded.email });
  if (data.role === "Admin") {
    next();
  } else {
    res.status(401).json({
      message:
        "You do not have access for deleting the invoice. Please contact administrator.",
    });
  }
}

module.exports = authRole;
