const adminModel = require("../models/adminModel");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

module.exports.renderAdminDashboard = async (req, res) => {
  try {
    let adminId = req.session.user.id;

    let admin = await adminModel.findOne({ _id: adminId });
    let posts = await postModel.find();
    let users = await userModel.find();
    res.render("adminDashboard", { admin, posts, users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.displayAllUsers = async (req, res) => {
  try {
    let users = await userModel.find();
    return res.status(200).render("allUsers", { users });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    console.log("called delete user");
    const id = req.params.id;
    await userModel.findByIdAndDelete(id);

    await postModel.deleteMany({ owner: id });
 
    return res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: "Something went wrong, Try again later" });
  }
};
