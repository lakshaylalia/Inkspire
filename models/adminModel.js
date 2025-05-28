const mongoose = require("mongoose");

const adminModel = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name : {
      type : String,
      required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", adminModel);
