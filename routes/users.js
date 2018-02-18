var express 		= require('express');
var router 			= express.Router();
var passport 		= require( 'passport' );
var LocalStrategy 	= require( 'passport-local' ).Strategy;

var User 			= require( '../models/users-model' );

/* Render User List */
router.get( '/', function( req, res, next ) {
  res.render( 'index', { title: '' } );
});

/* Render Register Page */
router.get( '/register', function( req, res, next ) {
  res.render( 'register', { title: 'Register' } );
});

/* Register a user */
router.post( '/register', function( req, res ) {
	var firstname 	= req.body.firstname;
	var lastname 	= req.body.lastname;
	var username 	= req.body.username;
	var email 		= req.body.email;
	var password 	= req.body.password;
	var repassword 	= req.body.re_password;

	// Validation
	req.checkBody( 'firstname', 'Firstname is required' ).notEmpty();
	req.checkBody( 'lastname', 'Lastname is required' ).notEmpty();
	req.checkBody( 'username', 'Username is required' ).notEmpty();
	req.checkBody( 'email', 'Email is required' ).notEmpty();
	req.checkBody( 'email', 'Enter valid email address' ).isEmail();
	req.checkBody( 'password', 'Password is required' ).notEmpty();
	req.checkBody( 're_password', 'Password do not match' ).equals( password );

	var errors = req.validationErrors();
	if( errors ) {
		var formData = {
			firstname: firstname,
			lastname: lastname,
			username: username,
			email: email
		}
		res.render( 'register', { errors: errors, formData: formData } );
	}else {
		var addUser = new User({
			firstname: firstname,
			lastname: lastname,
			username: username,
			email: email,
			password: password
		});
		User.createUser( addUser, function( err, user ) {
			if( err ) throw err;
			console.log( user );
		});
		req.flash( 'success_msg', 'You have been successfully registerd and now you can login!' );
		res.redirect( '/users/login' );
	}

});

/* Render Login Page */
router.get( '/login', function( req, res, next ) {
  res.render( 'login', { title: 'Login' } );
});

/* Passport Authentications */
passport.use( new LocalStrategy(
	function( username, password, done ) {
		User.getUserByUsername( username, function( err, user ) {
			if( err ) throw err;
			if( !user ) {
				return done( null, false, { message: 'Unknown User!' } );
			}
			User.comparePassword( password, user.password, function( err, isMatch ) {
				if( err ) throw err;
				if( isMatch ) {
					return done( null, user );
				}else {
					return done( null, false, { message: 'Invalid Password!' } );
				}
			});
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  	User.getUserById(id, function(err, user) {
    	done(err, user);
  	});
});

/* Login a user */
router.post( '/login', passport.authenticate( 'local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true } ), function( req, res ) {
	res.redirect( '/' );
});

/* Logout a user */
router.get( '/logout', function( req, res ) {
	req.logout();
	req.flash( 'success_msg', 'You are logged out!' );
	res.redirect( '/users/login' );
});

/* User Profile */
router.get( '/profile', ensureAuthenticated, function( req, res, next ) {
	res.render( 'profile', { title: 'User Information' } );
});

function ensureAuthenticated( req, res, next ) {
	if( req.isAuthenticated() ) {
		return next();
	}else {
		res.redirect( '/users/login' );
	}
}

module.exports = router;
