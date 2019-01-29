const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

router.get("/:userid/profile", (req, res, next) => {
  const user = User.findById(req.params.userid);
  res.render("profileshow", { user: user });
  console.log(req.user);
});

router.get("/profile", (req, res, next) => {
  res.render("profilepro", { user: req.user }); // shows current user information, can then be edited
  console.log(req.user);
});

router.post("/profile", (req, res, next) => {
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
        summary: summary,
        currentPosition: currentPosition
      }
    }
  ).then(user => {
    console.log("user", user);
    res.redirect("/profile"); // what to do ?
  });
});

module.exports = router;
