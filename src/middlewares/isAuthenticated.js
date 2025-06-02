module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    res.locals.User = req.session.user;
    next();
  } else {
    res.redirect("/login");
  }
};
