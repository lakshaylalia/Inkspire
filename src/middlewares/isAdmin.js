const jwt = require("jsonwebtoken");

module.exports.isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.redirect("/login");
    }
    req.user = decoded;
    req.session = req.session || {};
    req.session.user = decoded;
    res.locals.User = decoded;
    next();
  } catch (err) {
    res.clearCookie("token");
    res.redirect("/login");
  }
};
