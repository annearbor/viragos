console.log("I am loaded, auth");

//holds all the routes that have to do with authentication
require("dotenv").config();
//adding passport and linkedin strategy from passport
const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin").Strategy;
const express = require("express");
const router = express.Router();

const User = require("../models/user");

const LINKEDIN_API_KEY = process.env.LINKEDIN_API_KEY;
const LINKEDIN_SECRET_KEY = process.env.LINKEDIN_SECRET_KEY;

// from strategy serializuser receives a full user object
//using the session cookie and stores user inside for us
//the paramters could be named anything
passport.serializeUser(function(user, callback) {
  callback(null, user);
});
passport.deserializeUser(function(user, callback) {
  callback(null, user);
});
router.get("/1", (req, res) => {
  res.render("auth/login");
});

console.log(LINKEDIN_API_KEY, LINKEDIN_SECRET_KEY);
passport.use(
  new LinkedInStrategy(
    {
      consumerKey: LINKEDIN_API_KEY,
      consumerSecret: LINKEDIN_SECRET_KEY,
      callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback"
    },
    (token, tokenSecret, profile, done) => {
      console.log("inside function");
      User.findOne({ linkedinId: profile.id }).then(user => {
        console.log("user", user);
        if (user === null) {
          User.create({ linkedinId: profile.id }).then(user => {
            return done(null, user);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);

module.exports = router;
