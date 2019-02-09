const mongoose = require("mongoose");
const User = require("../models/user");

const dbName = "project2-viragos";
mongoose.connect(`mongodb://localhost/${dbName}`);

const users = [
  {
    firstName: "Camille",
    lastName: "Chapleau",
    email: "camille@test.com",
    currentPosition: "Customer Success Manager",
    currentCompany: "Nosto",
    currentIndustry: " ",
    role: "mentor",
    languages: "English",
    picture: "",
    summary: "I am French",
    headline: "Hello",
    location: "Paris",
    interests: ""
  },

  {
    firstName: "Marie",
    lastName: "Kurz",
    email: "marie@test.com",
    currentPosition: "Digital arketing Manager",
    currentCompany: "Zalando",
    currentIndustry: " ",
    role: "mentor",
    languages: "English",
    picture: "",
    summary: "Hello",
    headline: "Hello",
    location: "Berlin",
    interests: ""
  },

  {
    firstName: "Sandra",
    lastName: "Nichts",
    email: "sandra@test.com",
    currentPosition: "Student",
    currentCompany: "",
    currentIndustry: " ",
    role: "mentee",
    languages: "German",
    picture: "",
    summary: "Hello",
    headline: "Hello",
    location: "Hamburg",
    interests: ""
  },

  {
    firstName: "Janine",
    lastName: "Rauch",
    email: "janine@test.com",
    currentPosition: "Student",
    currentCompany: "",
    currentIndustry: " ",
    role: "mentee",
    languages: "Italian",
    picture: "",
    summary: "Hello",
    headline: "Hello",
    location: "London",
    interests: ""
  }
];

User.create(users);
