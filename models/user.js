const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String },
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
  headline: String,
  location: String,
  interests: [String],
  linkedinProfile: Object,
  likes: [mongoose.Schema.Types.ObjectId]
});

const User = mongoose.model("User", UserSchema);

// you can also export single functions from a model usw.

//makes the model available:; then you can use it with require from another file
module.exports = User;
