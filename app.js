var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
var passportLocalMongoose =require('passport-local-mongoose');
var User = require('./models/user');

mongoose.connect('mongodb://localhost/app-auth-demoapp');

app.set('view engine', 'ejs');
app.use(require('express-session')({
	secret: "Kingmhar is pogi",
	resave: false,
	saveUninitialized: false
}));
//setup passport
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
passport.use(new LocalStrategy(User.authenticate));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var port = process.env.PORT || 3000;

//===================
// ROUTES
//===================


app.get('/',function(req,res){
	res.render('home');
});

app.get('/secret',isLoggedIn,function(req,res){
	res.render('secret');
});

//auth routes
app.get('/register',function(req,res){
	res.render('register');
});

app.post('/register',function(req,res){
	User.register(new User({username: req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req,res,function(){
			res.redirect('/secret');
		});
	});
});

app.get('/login',passport.authenticate("local",{
	successRedirect:'/secret',
	failureRedirect: '/login'
}),function(req,res){
	res.render('login');
});
app.post('/login',function(req,res){
	req.logout();
	res.redirect('/');
});

app.get('/logout',function(req,res){
res.send("okay logging out");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(port, function(){
	console.log('running');
});

