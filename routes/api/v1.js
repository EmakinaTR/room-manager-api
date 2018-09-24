const express = require('express');
const router = express.Router({ mergeParams: true });
const calendarApi = require('./calendarApi');
const scheduleApi = require('./scheduleApi');
const deviceApi = require('./deviceApi');
const userApi = require('./userApi');

router.use("/", calendarApi);
router.use("/", scheduleApi);
router.use("/", deviceApi);
router.use("/", userApi);

module.exports = router;
