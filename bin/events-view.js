#!/usr/bin/env node
var debug = require('debug')('yirga');
var app = require('../app/server');
var pckge = require('../package');

app.set('port', process.env.PORT || pckge.config.port);

var server = app.listen(app.get('port'), function() {
  debug('Yirga server listening on port %s.', server.address().port);
});
