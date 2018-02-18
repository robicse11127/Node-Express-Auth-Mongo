var mongoose 	= require( 'mongoose' );
var bcrypt 		= require( 'bcryptjs' );

// User Schema
var UserSchema = mongoose.Schema({
	firstname: 	{ type: String },
	lastname: 	{ type: String },
	username: 	{ type: String, index: true },
	email: 		{ type: String },
	password: 	{ type: String },
});

var User = module.exports = mongoose.model( 'User', UserSchema );

// Create User
module.exports.createUser = function( newUser, callback ) {
	bcrypt.genSalt( 10, function( err, salt ) {
		bcrypt.hash( newUser.password, salt, function( err, hash ) {
			newUser.password = hash;
			newUser.save( callback );
		});
	});
}

// Get User By Username
module.exports.getUserByUsername = function( username, callback ) {
	var query = { username: username };
	User.findOne( query, callback );
}

// Get User By Id
module.exports.getUserById = function( id, callback ) {
	User.findById( id, callback );
}

// Compare Password
module.exports.comparePassword = function( candidatePassword, hash, callback ) {
	bcrypt.compare( candidatePassword, hash, function( err, isMatch ) {
		if( err ) throw err;
		callback( null, isMatch );
	});
}