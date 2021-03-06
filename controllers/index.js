var express = require('express'),
    router = express.Router(),
    device = require('./device'),
    schedule = require('./schedule');

router
    .get('/device/:mac', device.handshake);

router
    .get('/schedule/:id', schedule.list)
    .post('/schedule/:id', schedule.create);

module.exports = router;