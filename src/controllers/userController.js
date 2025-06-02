const postModel = require("../models/postModel.js");
const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const { post } = require("../routes/indexRoutes.js");

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
    
    const base64Image = user.image.toString('base64');
    const mimeType = req.file.mimetype;
   

    res.status(200).json({image: `data:${mimeType};base64,${base64Image}`});
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
  
    res.render("userProfile", { user, imageBase64 });
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

module.exports.displayUser = async (req, res) =>{
  try{
    let id = req.params.id;
    let user = await userModel.findOne({_id: id}).populate("following followers");
    let posts = await postModel.find({owner: id});
    
    let imageBase64 = null;
    if(user.image) {
      imageBase64 = user.image.toString("base64");
    }
    res.status(200).render("user", { user, imageBase64, posts });
  } catch(err) {
    return res.status(500).send({ message: "Something went wrong, Try again later" });
  }
}

module.exports.getAllUsers = async (req, res) => {
    try {
      let users = await userModel.find();
      users = users.map(user =>{
        const userObj = user.toObject();
        if(user.image){
          userObj.imageBase64 = userObj.image.toString('base64');
          delete userObj.image;
        }
        return userObj;
      })
  
      return res.status(200).json({users});
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
}

module.exports.handleFollow = async (req, res) => {
  try {
    let id = req.session.user.id;
    let user = await userModel.findOne({ _id: id });
    let actionId = req.params.id;
    let actionUser = await userModel.findOne({ _id: actionId });
    if (user.following.includes(actionId)) {
      // unfollow
      user.following = user.following.filter(followerId => String(followerId) !== String(actionId));
      actionUser.followers = actionUser.followers.filter(followerId => String(followerId) !== String(id));
    } else {
      // follow
      user.following.push(actionId);
      actionUser.followers.push(id);
    }

    await user.save();
    await actionUser.save();
    return res.status(200).json({ following: user.following });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Something went wrong, try again later." });
  }
};

