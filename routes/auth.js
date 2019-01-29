console.log("I am loaded, auth");

//holds all the routes that have to do with authentication
require("dotenv").config();
//adding passport and linkedin strategy from passport
const passport = require("passport");
const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/login", (req, res) => {
  res.render("auth/login");
});

//post route from login REDIRECT TO PROFILE WITH REQ.USER
router.post("/login", (req, res) => {
  res.redirect("/profile", { user: req.user });
});
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/auth/linkedin", passport.authenticate("linkedin"));

router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }),
  function(req, res) {
    console.log("success");
    // Successful authentication, redirect to profile.

    res.redirect("/profile");
  }
);

// function ensureAuthenicated >> ensureLoggedin

module.exports = router;
