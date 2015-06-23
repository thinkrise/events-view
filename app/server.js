'use strict';
// # Bootup

// Module dependencies.
var express         = require('express'),
    hbs             = require('express-hbs'),
    fs              = require('graceful-fs'),
    _               = require('lodash'),

    http            = require('http'),
    path            = require('path'),

    request         = require('request'),
    bodyParser      = require('body-parser'),
    winston         = require('winston'),
    expressWinston  = require('express-winston'),

    pckge = require('../package');

var app = express(),
    View = require(__dirname + '/lib/view'),
    MediaView = require(__dirname + '/lib/media-view'),

    ROOT_DIR = path.join(__dirname, '../');

function relative(relPath) {
  return path.join(__dirname, relPath);
}

app.engine('xhtml', hbs.express4({
  partialsDir: [relative('views/partials')],
  layoutsDir: relative('views/layouts'),
  defaultLayout: relative('views/layouts/default.xhtml')
}));

app.engine('svg', hbs.express4({
  partialsDir: relative('views/partials')
}));

app.set('port', process.env.PORT || pckge.config.port);
app.set('view engine', 'xhtml');
app.set('views', relative('views'));
app.set('x-powered-by', 'Coffee');
app.set('Content-Type', 'application/xhtml+xml; charset=utf-8');

if ('production' == process.env.NODE_ENV) {
  // Catch all exceptions into Winston logger, both file and the console
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: false,
        colorize: true
      }),
      new (winston.transports.File)({
        filename: path.join(ROOT_DIR, 'logs/access.log'),
        json: false
      })
    ]
  }));
}

// Parse form's input
app.use(bodyParser.urlencoded({ extended: false }));

// Serving the static directory
app.use(express.static(path.join(ROOT_DIR, 'app/static')));

/**
 * Standard middleware to set the correct Content Type of the documents rendered
 *
 * Use res.setHeader for JSON-specific end-points
 */
app.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/xhtml+xml; charset=utf-8');
  next();
});

// Serving the root
app.get('/', function(req, res) {
  var view = new View({
    request: req,
    response: res,
    bodyClass: 'home'
  });

  view.render('hold');
});

module.exports = app;
