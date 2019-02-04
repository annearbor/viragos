require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const passport = require("passport");
const createLinkedInStrategy = require("./routes/passport_strategies.js");
const createLocalStrategy = require("./routes/passport_strategies.js");

const flash = require("connect-flash");
const session = require("express-session");

const MongoStore = require("connect-mongo")(session);

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
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

passport.use(createLinkedInStrategy());
passport.use(createLocalStrategy());

// from strategies serializuser receives a full user object
//using the session cookie and stores user
//Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session.
//In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
passport.serializeUser(function(user, callback) {
  callback(null, user);
});
passport.deserializeUser(function(user, callback) {
  callback(null, user);
});

//required in Express/ Connect to initialize passport
app.use(passport.initialize());
//persistent login sessions
app.use(passport.session());
app.use(flash());

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
//const users = require....

module.exports = app;
