//jshint esversion:6
require('dotenv').config();
const express= require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
//========database connection =======
mongoose.connect(process.env.DB_URL)

// ========== user Schema ===
const userSchema = new mongoose.Schema({
    email: String, 
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedField: ["password"] })
const User = new mongoose.model("User", userSchema)
//Home Route
app.get('/', function(req, res){
    res.render('home')
})
// Log in Route
app.get('/login', function(req, res){
    res.render("login")
})

//     log in POST Route
app.post('/login', function(req, res){
    const userName = req.body.username;
    const passWord = req.body.password;

 User.findOne({email: userName}).then((result)=>{
    if(result.email === userName && result.password === passWord){
        res.render("secrets")
    }
    else{
        console.log(result.email + result.password + userName  + passWord);
    }
 }).catch((err)=>{
    console.log(err);
 })
  
})

// Register Route
app.get('/register', function(req, res){
    res.render('register')
})
app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save()
    res.render("secrets")
})

//=========Port The app is listening for ==========
app.listen(3000, function(){
    console.log('The server started on port 3000');
})