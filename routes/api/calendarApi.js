const express = require('express');
const router = express.Router({ mergeParams: true });
const calendarService = require('../../google-calendar-api/calendar_service');

router.post('/getCalendars', (req, res) => {

    calendarService.getCalendars(req.oauth2, function (serviceErr, serviceRes) {

        if (serviceErr) {
            res.status(400);
            res.send(serviceErr);
            return;
        }

        res.status(200);
        res.json(serviceRes);

    });

});

module.exports = router;