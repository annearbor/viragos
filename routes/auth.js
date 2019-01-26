console.log("I am loaded, auth");

//holds all the routes that have to do with authentication
require("dotenv").config();
//adding passport and linkedin strategy from passport
const passport = require("passport");
const express = require("express");
const router = express.Router();

const User = require("../models/user");

const ensureLogin = require("connect-ensure-login");

router.get("/login", (req, res) => {
  res.render("auth/login");
});
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/auth/linkedin", passport.authenticate("linkedin"));

router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }),
  function(req, res) {
    console.log("success");
    // Successful authentication, redirect to profile.

    res.redirect("/user/profile");
  }
);

// function ensureAuthenicated >> ensureLoggedin

// router.get("/signup", ensureLogin.ensureLoggedIn(), (req, res, next) => {
//   res.render("priv");
// });

// router.get("/profile", (req, res, next) => {
//   res.render("profilepro");
// });

module.exports = router;
