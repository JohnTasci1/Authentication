//jshint esversion:6
require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express();

console.log(process.env.SECRET)

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
//creating the user schema
//new mongoose.Schema is needed for encrypt to work
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//encrypts the password to not show the same password as they have
//it gives a binary code
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema)

//Home Page
app.route("/")
.get(function(req, res){
  //brings to home page
  res.render("home");
});
//Register Page
app.route("/register")
.get(function(req, res){
  //brings to register page
  res.render("register");
})
.post(function(req, res){
  //getting the username and the password of the registered user
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  //brings you to secrets page after
  newUser.save(function(err){
  if(err){
      console.log(err)
    } else {
      res.render("secrets")
    }
  });
})
//Log in Page
app.route("/login")
.get(function(req, res){
  //brings to log in page
  res.render("login");
})
//process the login page to remember the username and passswords from registered
.post(function(req, res){
  //links from ejs
  const username = req.body.username;
  const password = req.body.password;
  //if the email and password match bring them to secrets
  User.findOne({email: username, password: password}, function(err, foundUser){
    if (err){
      console.log(err)
    } else {
      if(foundUser) {
        if(foundUser.password === password)
          res.render("secrets")
      } else {
        res.render("login")
      }
    }
  })
})


app.listen(1000, function(req, res){
  console.log("Server has started on port 1000")
})
