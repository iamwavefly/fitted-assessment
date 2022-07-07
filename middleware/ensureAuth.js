const jwt = require("jsonwebtoken");

const ensureAuth = (req, res, next) => {
  const { authorization } = req.headers;
  const rawToken = authorization?.split(" ");
  try {
    jwt.verify(rawToken[1], "later", (error, data) => {
      if (error) {
        return res.status(400).json({
          statusCode: "02",
          message: "Invalid token",
        });
      }
      req.user = data.user;
      return next();
    });
  } catch (error) {
    if (error) {
      return res.status(400).json({
        statusCode: "02",
        message: "Invalid token",
      });
    }
  }
};

module.exports = ensureAuth;
