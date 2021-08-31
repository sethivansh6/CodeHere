const mongoose = require("mongoose");
const passwordHash = require("password-hash");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  hash: String,
  salt: String,
  facebookId: String,
});

userSchema.methods.setPassword = function (password) {
  this.hash = passwordHash.generate(password);
};

userSchema.methods.validPassword = function (password) {
  return passwordHash.verify(password, this.hash);
};

module.exports = mongoose.model("User", userSchema);
