const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

router.get("/profile", (req, res, next) => {
  res.render("profilepro", { user: req.user }); // shows current user information, can then be edited
});

router.post("/profile", (req, res, next) => {
  const { firstName, lastName, role, summary } = req.body;
  console.log(firstName);

  req.user.firstName = firstName
  req.user.lastName
  req.user.role = role
  req.user.summary = summary
  req.user.save().then((user) => {
    res.send('done') // what to do ?
  })

});

module.exports = router;
