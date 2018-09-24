const express = require('express');
const router = express.Router({ mergeParams: true });
const calendarApi = require('./calendarApi');
const scheduleApi = require('./scheduleApi');
const deviceApi = require('./deviceApi');

router.use("/", calendarApi);
router.use("/", scheduleApi);
router.use("/", deviceApi);

module.exports = router;
