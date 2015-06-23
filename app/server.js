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
  // res.render('shold', {
  //   title: 'Hello'
  // });
  var view = new View({
    request: req,
    response: res,
    bodyClass: 'home'
  });

  view.render('hold');
});

/**
 * __EXAMPLE DATA PIPES__
 *
 * This is an example response from the web service
 */
// app.get('/examples/map', function(req, res) {
//   res.setHeader('Content-Type', 'application/json; charset=utf-8');
//
//   fs.readFile(__dirname + '/data/sample-shops.json', 'utf-8', function(err, data){
//     res.json(JSON.parse(data));
//   });
// });
//
// app.get('/examples/shops/:path', function(req, res) {
//   res.setHeader('Content-Type', 'application/json; charset=utf-8');
//
//   fs.readFile(__dirname + '/data/sample-shops.json', 'utf-8', function(err, data){
//     var viewData = _.find(JSON.parse(data), function(item){
//       return item['url'] === '/discover/shops/'+req.param('path');
//     });
//
//     res.json(viewData);
//   });
// });
//
//
// /**
//  * Serve the map
//  */
// app.get('/discover', function(req, res) {
//   var view = new View({
//     request: req,
//     response: res,
//
//     footer: false,
//     bodyClass: 'discover',
//     include: {
//       signUpForm: false
//     }
//   });
//
//   view.render('discover');
// });
//
// /** Search query **/
// app.get('/discover/search', function(req, res) {
//   res.setHeader('Content-Type', 'application/json; charset=utf-8');
//   // Retrieve data from the web service
//   request.get('http://localhost:4001/examples/map', {
//     params: req.body,
//     headers: {
//       'X-Requested-With': 'XMLHttpRequest'
//     }
//   }, function(err, response, body){
//     var bodyData = JSON.parse(body);
//
//     var today = new Date();
//     var todayIndex = today.getDay();
//
//     /**
//      * Append additional data
//      */
//     _.each(bodyData, function(item, index){
//       item['today-hours'] = item['opening-hours'][todayIndex];
//     });
//
//     return res.json(bodyData);
//   });
// });
//
// /**
//  * Coffee Shops
//  */
// app.get('/discover/shops', function(req, res){
//   return res.redirect('/discover');
// });
//
// app.get('/discover/shops/:path', function(req, res){
//   var view = new View({
//     request: req,
//     response: res,
//
//     bodyClass: 'shop',
//   });
//
//   request.get('http://localhost:4001/examples/shops/'+req.param('path'), {
//     params: req.body,
//     headers: {
//       'X-Requested-With': 'XMLHttpRequest'
//     }
//   }, function(err, response, body){
//     var viewData = JSON.parse(body);
//
//     /**
//      * Pre-render media template
//      */
//     var mediaView = new MediaView({
//       images: viewData.media
//     });
//
//     mediaView.render(function(err, imageTemplateHTML){
//
//       viewData.imageTemplate = imageTemplateHTML;
//
//       view.add({
//         shop: viewData
//       });
//
//       view.render('shop');
//
//     });
//   });
// });
//
// // Responding to submission of email
// app.post('/submit', function(req, res) {
//
//   // Do data hand-over to the web service here (JSON object)
//   console.log(req.body);
//
//   res.render('hold', { layout: true, 'form_success-message': 'Thanks! we\'ll be in touch.' });
// });
//
// // 404s: Not found
// app.get('*', function(req, res) {
//   res.setHeader('Content-Type', 'application/xhtml+xml; charset=utf-8');
//   res.status(404).render('error', { layout: true, footer: true, error: {
//     title: 'Whoops, we couldn\'t find that.',
//     description: 'Perhaps it\'s time for a coffee.'
//   } });
// });
//
// // Catch all exceptions
// app.use(function(err, req, res, next) {
//   res.setHeader('Content-Type', 'application/xhtml+xml; charset=utf-8');
//
//   // If it's a XHR request then respond with JSON
//   if(req.xhr){
//     res.setHeader('Content-Type', 'application/json; charset=utf-8');
//     res.status(500).send({ error: 'A problem has occurred with the server.'});
//
//   // Otherwise render standard error page
//   }else{
//     res.status(500).render('error', { layout: true, footer: true, error: {
//       title: 'Whoops, the server has had a problem.',
//       description: 'A problem has occurred with the server and we\'re looking into that.'
//     } });
//   }
// });
//
// if ('production' == process.env.NODE_ENV) {
//   // Catch all exceptions into Winston logger, both file and the console
//   app.use(expressWinston.errorLogger({
//     transports: [
//       new (winston.transports.Console)({
//         json: false,
//         colorize: true,
//       }),
//       new (winston.transports.File)({
//         filename: path.join(ROOT_DIR, 'logs/error.log'),
//         level: 'error',
//         json: false
//       })
//     ]
//   }));
// }

module.exports = app;
