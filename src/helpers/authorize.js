const jwt = require("jsonwebtoken");
const users = require("../models/userAuth");
const { JWT_KEY } = require("./environment");

function authorize(req, res, next) {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization, JWT_KEY, async (err, decoded) => {
      if (decoded != undefined) {
        if (await users.findOne({ email: decoded.email })) next();
        else res.status(401).json({ message: "Un-authorized" });
      } else {
        res.status(404).json({
          message: "Forbidden",
        });
      }
    });
  } else {
    res.status(401).json({
      message: "No Token Found",
    });
  }
}

module.exports = authorize;
