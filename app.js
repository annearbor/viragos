require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const passport = require("passport");
const session = require("express-session");

const MongoStore = require("connect-mongo")(session);

const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");
const axios = require("axios");

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

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

passport.use(
  new LinkedInStrategy(
    {
      clientID: LINKEDIN_API_KEY,
      clientSecret: LINKEDIN_SECRET_KEY,
      callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
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
  new LocalStrategy({ usernameField: "email" }, (giraffe, password, next) => {
    console.log(">>>>>>> YES 0 <<<<<<<<<<<<<<<<<<<<<<<<<<<");
    User.findOne({ email: giraffe }, (err, user) => {
      console.log(">>>>>>> YES 1 <<<<<<<<<<<<<<<<<<<<<<<<<<<");
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      //if (!bcrypt.compareSync(password, user.password)) {
      if (password !== user.password) {
        return next(null, false, { message: "Incorrect password" });
      }

      console.log(">>>>>>> YES <<<<<<<<<<<<<<<<<<<<<<<<<<<");
      return next(null, user);
    });
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index");
app.use("/", index);
const auth = require("./routes/auth");
app.use("/", auth);
const user = require("./routes/user");
app.use("/", user);

module.exports = app;
