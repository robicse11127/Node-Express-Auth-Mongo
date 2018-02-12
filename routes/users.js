var express = require('express');
var router = express.Router();

/* Render User List */
router.get( '/', function( req, res, next ) {
  res.render( 'index', { title: '' } );
});

/* Render Register Page */
router.get( '/register', function( req, res, next ) {
  res.render( 'register', { title: 'Register' } );
});

/* Render Login Page */
router.get( '/login', function( req, res, next ) {
  res.render( 'login', { title: 'Login' } );
});

module.exports = router;
