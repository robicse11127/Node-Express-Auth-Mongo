var express = require('express');
var router = express.Router();

/* GET home page. */
router.get( '/', ensureAuthenticated, function( req, res, next ) {
  res.render(
  	'index', { title: 'Node Auth', slogan: 'Node-Express Authentication with MongoDB', desc: 'A Basic Node-Express Authentication System' });
});

function ensureAuthenticated( req, res, next ) {
	if( req.isAuthenticated() ) {
		return next();
	}else {
		res.redirect( '/users/login' );
	}
}

module.exports = router;
