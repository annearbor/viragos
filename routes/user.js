const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const axios = require("axios");

// const ensureLogin = require("connect-ensure-login");

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     res.redirect("/login");
//   }

//add function call here
router.get("/profile", (req, res, next) => {
  res.render("user/show", { user: req.user }); // shows current user information, can then be edited
  console.log(req.user);
});

router.get("/profile/edit", (req, res, next) => {
  console.log(req.user);
  res.render("user/edit", { user: req.user }); // shows current user information, can then be edited
});

router.post("/profile/edit", (req, res, next) => {
  const { firstName, lastName, role, summary } = req.body;
  console.log(req.body);
  console.log("THIS IS THE REQ USER", req.user);
  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        firstName: firstName,
        lastName: lastName,
        role: role,
        summary: summary
      }
    }
  ).then(user => {
    console.log("user", user);
    res.redirect("/profile"); // what to do ?
  });
});

module.exports = router;
