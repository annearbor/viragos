const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/profiles", (req, res, next) => {
  res.render("user/profiles", { user: req.user });
  console.log(req.user);
});

// search and find users by location with their currentPosition
router.post("/results", (req, res) => {
  const location = req.body.search;
  console.log(location);

  if (location) {
    query = { currentPosition: location };
  } else {
    query = {};
  }
  console.log("query", query);

  User.find(query)
    .then(result => {
      res.render("search/results", { result });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;

// store all currentPosition in MONGO lowercase
// Ex: berlin, montreal,
