//jshint esversion:
// require dotenv access to config method
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// require encrytpion
const encrypt = require("mongoose-encryption");

const app = express();

// data come from .env by access use process.env.Key name;
console.log(process.env.API_KEY);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));


// mongoose
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});




// create userSchema with ENCRYTPION
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true,
    }


});

// from secret
// move to .env
// const secret = "thisisoutlittlesecret."

// encritpion connect to throuught plugin and secret become encrypt
// name of schema.plugin(encrypt(mongoose-encryption),{ new variable name: variavle})
// encryptedFiled: [key] is for only encrypted some filed
//  userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"] });

// add process.env.SECRET to secret
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });



// // create userSchema
// const userSchema = {
//     email:{
//         type: String,
//         required: true
//     },
//     password:{
//         type:String,
//         required: true,
//     }


// };


// create user model throught mongoose
const User = mongoose.model("User", userSchema);



// =====Get HOME
app.get("/",function(req,res){
    res.render("home");
  });



// ====login  
app.route("/login")
// ---- get
.get(function(req,res){
    res.render("login");
})
// create
.post(function(req,res){

    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email:userName},function(err,foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === password){
                    console.log(foundUser.password);
                    res.render("secrets");
                }
            }
        }
    });


});
  



// ==== register
app.route("/register")
// ---- get
.get(function(req,res){
    res.render("register");
})

// create post
.post(function(req,res){
    const userName = req.body.username;
    const password = req.body.password;

    // console.log(userName,password);

    // create document/object
    const newUser = new User({
        email: userName,
        password: password,
    });

    // save to database
    newUser.save(function(err){
        if(err){
            console.log(err);
        } else {
           res.render("secrets"); 
        }
    });
});
  
  

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });