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

const User = require("./models/user");

mongoose
  .connect(
    "mongodb://localhost/project2-viragos",
    { useNewUrlParser: true }
  )
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
passport.serializeUser(function (user, callback) {
  callback(null, user);
});
passport.deserializeUser(function (user, callback) {
  callback(null, user);
});

console.log(LINKEDIN_API_KEY, LINKEDIN_SECRET_KEY);
passport.use(
  new LinkedInStrategy(
    {
      clientID: LINKEDIN_API_KEY,
      clientSecret: LINKEDIN_SECRET_KEY,
      callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
      state: true
    },
    (token, tokenSecret, profile, done) => {
      process.nextTick(function () {
        console.log("inside function", token, tokenSecret);
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
      });
    }
  )
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
app.use("/user", user);

module.exports = app;
