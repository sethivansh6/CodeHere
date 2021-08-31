const isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render("login", { error: "You need to Sign In first!"});
};

module.exports = isLoggedIn;
