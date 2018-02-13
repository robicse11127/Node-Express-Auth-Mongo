/**
 * Required Modules
 */
var express           = require( 'express' );
var path 			        = require( 'path' );
var cookieParser 	    = require( 'cookie-parser' );
var bodyParser 		    = require( 'body-parser' );
var hbs               = require( 'express-handlebars' );
var expressValidator  = require( 'express-validator' );
var flash             = require( 'connect-flash' );
var session           = require( 'express-session' );
var passport          = require( 'passport' );
var LocalStrategy     = require( 'passport-local' ).Strategy;
var mongo             = require( 'mongodb' );
var mongoose          = require( 'mongoose' );
var favicon           = require( 'serve-favicon' );
var logger            = require( 'morgan' );

/**
 * Database Connection
 */
mongoose.connect( 'mongodb://localhost/nodeauth' );
var db = mongoose.connection;

/**
 * Routers
 */
var index = require('./routes/index');
var users = require('./routes/users');

/**
 * Init App
 */
var app = express();

/**
 * View Engine Setup
 */
app.engine( 'hbs', hbs({
	extname: 'hbs',
	defaultLayout: 'layout',
	layoutsDir: __dirname + '/views/layouts/',
	partialsDir: __dirname + '/views/layouts/partials/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/**
 * Bodyparser Middleware
 */
app.use( logger('dev') );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( cookieParser() );

/**
 * Set Static Folder
 */
app.use( express.static(path.join(__dirname, 'public')) );

/**
 * Express Session
 */
app.use( session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

/**
 * Passport Init
 */
app.use( passport.initialize() );
app.use( passport.session() );

/**
 * Express Validator
 */
app.use( expressValidator({
  errorFormatter: function( param, msg, value ) {
      var namespace = param.split( '.' )
      , root        = namespace.shift()
      , formParam   = root;

    while( namespace.length ) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

/**
 * Connect Flash
 */
app.use( flash() );

/**
 * Global Vars
 */
app.use( function ( req, res, next ) {
  res.locals.success_msg  = req.flash( 'success_msg' );
  res.locals.error_msg    = req.flash( 'error_msg' );
  res.locals.error        = req.flash( 'error' );
  res.locals.user         = req.user || null;
  next();
});


/**
 * App Favicon ( Uncomment if required )
 */
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/**
 * Using Routes
 */
app.use( '/', index );
app.use( '/users', users );

/**
 * 404 Handler
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error Handler
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
