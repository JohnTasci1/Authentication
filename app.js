//jshint esversion:6
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express();

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
const userSchema = {
  email: String,
  password: String
};

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
