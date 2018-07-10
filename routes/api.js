var express = require('express');
var router = express.Router();
var v1 = require('./api/v1');

router.get('/', function(req, res, next) {
  res.json({
      success: true,
      message: 'Hi guys bro!! Welcome to our shiny api.'
  });
});

router.use('/v1', v1);

module.exports = router;
