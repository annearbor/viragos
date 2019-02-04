const bcrypt = require("bcrypt");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const LINKEDIN_API_KEY = process.env.LINKEDIN_API_KEY;
const LINKEDIN_SECRET_KEY = process.env.LINKEDIN_SECRET_KEY;

const User = require("../models/user");

function createLinkedInStrategy() {
  return new LinkedInStrategy(
    {
      clientID: LINKEDIN_API_KEY,
      clientSecret: LINKEDIN_SECRET_KEY,
      callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
      state: true,
      scope: ["r_emailaddress", "r_basicprofile"]
    },
    (token, tokenSecret, profile, done) => {
      process.nextTick(function() {
        console.log(
          "inside linkedinstrategyfunction",
          profile,
          token,
          tokenSecret
        );

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
              picture: profile._json.pictureUrls.values,
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
  );
}

function createLocalStrategy() {
  return new LocalStrategy(
    { usernameField: "email" },
    (param1, password, next) => {
      User.findOne({ email: param1 }, (err, user) => {
        console.log(">>>>>>> YES 1 <<<<<<<<<<<<<<<<<<<<<<<<<<<");
        if (err) {
          return next(err);
        }

        if (!user) {
          return next(null, false, { message: "Incorrect username" });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return next(null, false, { message: "Incorrect password" });
        }

        return next(null, user);
      });
    }
  );
}

module.exports = createLocalStrategy;
module.exports = createLinkedInStrategy;
