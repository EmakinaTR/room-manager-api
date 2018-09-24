const express = require('express');
const router = express.Router({ mergeParams: true });
const calendarMapper = require('./../../mapper/calendarMapper');
const calendarService = require('./../../google-calendar-api/calendar_service');

router.route('/schedule/:roomId')
    .get((req, res) => {

        calendarMapper.getCalendarId(req.params.roomId, function (error, result) {

            if (error) {
                res.status(400);
                res.send(error);
                return;
            }

            calendarService.getEventsByCalendarId(result, req.oauth2, function (serviceErr, serviceRes) {

                if (serviceErr) {
                    res.status(400);
                    res.send(serviceRes);
                    return;
                }

                res.status(200);
                res.json(serviceRes);

            });

        });

    })
    .post((req, res) => {

        calendarMapper.getCalendarId(req.params.roomId, function (error, result) {

            if (error) {
                res.status(400);
                res.send(error);
                return;
            }

            calendarService.createMeeting(result, req.body.mins, req.body.userId, req.oauth2, function (serviceErr, serviceRes) {

                if (serviceErr) {
                    res.status(400);
                    res.send(serviceErr);
                    return;
                }

                res.status(200);
                res.json(serviceRes);

            });

        });

    });

module.exports = router;