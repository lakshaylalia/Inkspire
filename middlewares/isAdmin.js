module.exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    return res.status(403).send("Access Denied");
  }
};
