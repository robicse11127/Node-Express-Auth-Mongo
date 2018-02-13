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
	console.log( password );
	console.log( repassword );

	// Validation
	req.checkBody( 'firstname', 'Firstname is required' ).notEmpty();
	req.checkBody( 'lastname', 'Lastname is required' ).notEmpty();
	req.checkBody( 'username', 'Username is required' ).notEmpty();
	req.checkBody( 'email', 'Email is required' ).isEmail();
	req.checkBody( 'password', 'Password is required' ).notEmpty();
	// req.checkBody( 'repassword', 'Password do not match' ).equals( password );

	var errors = req.validationErrors();
	if( errors ) {
		res.render( 'register', { errors: errors } );
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

module.exports = router;
