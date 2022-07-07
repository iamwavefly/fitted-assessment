module.exports = function ensureAdmin(req, res, next) {
  if (req.user.role === "superAdmin") {
    return next();
  }
  res.status(403).json({
    statusCode: "02",
    message: "request denied",
  });
};
