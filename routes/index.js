var express = require('express');
var router = express.Router();

/* GET home page. */
router.get( '/', function( req, res, next ) {
  res.render(
  	'index', { title: 'Node Auth', slogan: 'Node-Express Authentication with MongoDB', desc: 'A Basic Node-Express Authentication System' });
});

module.exports = router;
