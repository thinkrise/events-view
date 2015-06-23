'use strict'

var express = require('express');

var frontend = require('../controllers/frontend');

var frontendRoutes;

frontendRoutes = function () {
  var router = express.Router();
  var indexRouter = express.Router();
  var privateRouter = express.Router();

  // password-protected front-end route.
  privateRouter.route('/')
    .get(

    )
    .post(

    );

  // Index router.
  indexRouter.route('/').get(frontend.homepage);
}
