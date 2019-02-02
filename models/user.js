const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  password: String,
  linkedinId: String,
  currentPosition: String,
  currentCompany: String,
  currentIndustry: String,
  role: { type: String, enum: ["Mentor", "Mentee"] },
  // university: String,
  // gradYear: Number,
  languages: [String],
  picture: String,
  summary: String,
  interests: [String],
  headline: String,
  location: String,
  interests: [String],
  linkedinProfile: Object
});

const User = mongoose.model("User", UserSchema);

//makes the model available:; then you can use it with require from another file
module.exports = User;

// you can also export single functions from a model usw.
