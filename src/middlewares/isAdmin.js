module.exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    res.locals.User = req.session.user;
    next();
  } else {
     res.redirect("/login");
  }
};
