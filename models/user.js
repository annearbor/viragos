const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String
  // currentPosition: String,
  // currentCompany: String,
  //role
  //   university: String,
  //   gradYear: Number,
  //   phone: Number,
  //   languages: [String],
  //   picture: String,
  //   summary: String,
  // interests: [String],
});

const User = mongoose.model("User", UserSchema);

//makes the model available:; then you can use it with require from another file
module.exports = User;

// you can also export single functions from a model usw.
