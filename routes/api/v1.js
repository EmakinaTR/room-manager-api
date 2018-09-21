var express = require('express');
var router = express.Router({ mergeParams: true });

const mapper = require('./../../kiosk-calendar-mapper/mapper');
const calendarService = require('./../../google-calendar-api/calendar_service');

router.route('/schedule/:roomId')
  .get((req, res) => {

    mapper.getCalendarId(req.params.roomId, function (error, result) {

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

    mapper.getCalendarId(req.params.roomId, function (error, result) {

      if (error) {
        res.status(400);
        res.send(error);
        return;
      }

      calendarService.createMeeting(result, req.body.mins, req.oauth2, function (serviceErr, serviceRes) {

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

router.get('/device/:macId', (req, res) => {

  mapper.getCalendarInfo(req.params.macId, function (error, result) {

    if (error) {
      res.status(400);
      res.send(error);
      return;
    }

    res.status(200);
    res.json(result);
    
  });

});

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