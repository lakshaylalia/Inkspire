const postModel = require("../models/postModel.js");
const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");

module.exports.renderEditProfile = async (req, res) => {
  try {
    const email = req.session.user.email;

    const user = await userModel.findOne({ email });

    if (!user) return res.status(401).send({ messaage: "Invalid Request" });

    res.render("editProfile", { user });
  } catch (err) {
    return res.status(500).send("Soemthing went wrong");
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const id = req.session.user.id;

    let user = await userModel.findById(id);
    if (!user) return res.status(401).send({ message: "Invalid Request" });

    const { name, username, email, password } = req.body;

    let updateData = {
      name,
      username,
      email,
    };

    if (req.file && req.file.buffer) {
      updateData.image = req.file.buffer;
    }

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      updateData.password = hash;
    }

    await userModel.findByIdAndUpdate(id, { $set: updateData });
    req.session.user.name = updateData.name;
    req.session.user.email = updateData.email;
    res.redirect("/user/profile");
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).send("Something went wrong, Try again later");
  }
};

module.exports.updateImage = async (req, res) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { email: req.session.user.email },
      { $set: { image: req.file.buffer } },
      { new: true, runValidators: true }
    );

    await user.save();

    res.status(200).redirect("/user/profile");
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    let user = await userModel
      .findOne({ email: req.session.user.email })
      .populate("posts");
    let imageBase64 = null;
    if (user.image) {
      imageBase64 = user.image.toString("base64");
    }
    const posts = await userModel
      .findOne({ email: req.session.user.email })
      .populate("posts");
    // res.json(user)
    res.render("UserProfile", { user, imageBase64 });
  } catch (err) {
    res.redirect("/login");
  }
};

module.exports.deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;

    await userModel.findByIdAndDelete(id);

    await postModel.deleteMany({ owner: id });

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({ message: "Error ending session." });
      }

      res.redirect("/login");
    });

  } catch (err) {
    return res.status(500).send({ message: "Something went wrong, Try again later" });
  }
};


