const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const LINKEDIN_API_KEY = process.env.LINKEDIN_API_KEY;
const LINKEDIN_SECRET_KEY = process.env.LINKEDIN_SECRET_KEY;
const bcrypt = require("bcrypt");

const User = require("../models/user");

//passport.session acts as a middleware to alter the req object and change the 'user' value that
// is currently the session id (from the client cookie) into the true deserialized user object.
//persistent login sessions

passport.serializeUser(function(user, callback) {
  callback(null, user);
});
passport.deserializeUser(function(user, callback) {
  User.findById(user).then(u => {
    callback(null, u);
  });
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: LINKEDIN_API_KEY,
      clientSecret: LINKEDIN_SECRET_KEY,
      callbackURL: "/auth/linkedin/callback",
      state: true,
      scope: ["r_emailaddress", "r_basicprofile"]
    },
    (token, tokenSecret, profile, done) => {
      process.nextTick(function() {
        console.log("inside function", profile, token, tokenSecret);

        User.findOne({ linkedinId: profile.id }).then(user => {
          console.log("user", user);

          if (user === null) {
            User.create({
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile._json.emailAddress,
              currentPosition: profile._json.positions.values[0].title,
              currentCompany: profile._json.positions.values[0].company.name,
              currentIndustry:
                profile._json.positions.values[0].company.industry,
              summary: profile._json.positions.values[0].summary,
              picture: profile._json.pictureUrl,
              location: profile._json.location.name,
              headline: profile._json.headline,
              linkedinId: profile.id,
              linkedinProfile: profile
            }).then(user => {
              return done(null, user);
            });
          } else {
            return done(null, user);
          }
        });
      });
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, next) => {
      User.findOne({ email }, (err, user) => {
        if (err) {
          next(err);
          return;
        }

        if (!user) {
          next(null, false, { message: "Incorrect email" });
          return;
        }

        if (!bcrypt.compareSync(password, user.password)) {
          next(null, false, { message: "Incorrect password" });
          return;
        }

        next(null, user);
      });
    }
  )
);

module.exports = passport;
