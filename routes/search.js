const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/profiles", (req, res, next) => {
  User.find()
    .then(results => {
      res.render("user/users", { results, user: req.user });
    })
    .catch(error => {
      console.log(error);
    });

  console.log("REQ DOT USERSSSSSSS", req.user);
});

// search and find users by location with their currentPosition
router.post("/results", (req, res) => {
  let location = req.body.location;
  let role = req.body.role;
  let languages = req.body.languages;
  console.log("this is the roleeeeeeeeeee", role);
  console.log("this is the languagesssssss", languages);
  console.log(location);
  let query = {};

  if (languages) query.languages = languages;
  if (role) query.role = role;

  if (location) query.location = location;

  //location = "/" + location + "/i";
  // if (location && role && languages) {
  //   query = { currentLocation: location, mentor: mentor, languages: languages };
  // } else if (role) {
  //   query = { mentor: mentor };
  // } else if (languages) {
  //   query = { languages: languages };
  // } else {
  //   query = {};
  // }

  console.log("query", query);

  User.find(query)
    .then(results => {
      res.render("search/results", { results });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;

// store all currentPosition in MONGO lowercase
// Ex: berlin, montreal,

//currentIndustry: String,
//role: { type: String, enum: ["Mentor", "Mentee"] },
