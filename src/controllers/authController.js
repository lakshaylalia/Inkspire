const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel.js");
const adminModel = require("../models/adminModel.js");

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const admin = await adminModel.findOne({ email });
    if (admin) {
      const isMatch = password === admin.password;

      if (isMatch) {
        const token = jwt.sign(
          { email: admin.email, id: admin._id, isAdmin: true },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        res.cookie("token", token, { httpOnly: true, secure: false });
        return res.redirect("/admin");
      }
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.redirect("/login");
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error, Try again later");
      }

      if (!result) {
        return res.status(401).send("Invalid Credentials");
      }

      const token = jwt.sign(
        { email: user.email, id: user._id, isAdmin: false },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.cookie("token", token, { httpOnly: true, secure: false });

      return res.status(200).redirect("/user/posts/all-posts");
    });
  } catch (err) {
    return res.status(500).send("Internal Server Error, Try again later");
  }
};

module.exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password)
      return res.status(400).send("All fields are required");

    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).send("Email already exists");
    }

    user = await userModel.findOne({ username });

    if (user) {
      return res.status(400).send("Username already exists");
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err)
        return res.status(500).send("Internal Server Error, Try again later");

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err)
          return res.status(500).send("Internal Server Error, Try again later");

        user = await userModel.create({
          name,
          username,
          email,
          password: hash,
        });

        const token = jwt.sign(
          { email: user.email, id: user._id, isAdmin: false },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        res.cookie("token", token, { httpOnly: true, secure: false });
        res.status(200).redirect("/user/profile");
      });
    });
  } catch (err) {
    return res.status(500).send("Internal Server Error, Try again later");
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).redirect("/login");
};
