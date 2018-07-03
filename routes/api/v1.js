var express = require('express');
var router = express.Router({ mergeParams: true });
const { google } = require('googleapis');

router.route('/schedule/:room_id').get((req, res) => {
  console.log('GET request.params:', req.params);
  res.json([{
    id: 1,
    title: "HR & Technical Interview",
    contact: "Alper Tunga Gülbahar",
    start: "2018-06-20T10:00:00.000Z",
    end: "2018-06-20T11:00:00.000Z"
  }])
}).post((req, res) => {
  console.log('POST request.params:', req.params);
});

router.post('/getCalenders', (req, res) => {

  const auth = req.oauth2

  google.calendar({ version: 'v3', auth }).calendarList.list((err, { data }) => {

    if (err) {
      res.status = err.status || 500
      res.json({
        message: err.message,
        error: err
      })
    } else {
      res.json(data)
    }

  });

});

router.post('/getEvents', (req, res) => {

  const calendarId = req.body.calendarId;
  const startTime = new Date(req.body.startTime);
  const endTime = new Date(req.body.endTime);
  const auth = req.oauth2;

  google.calendar({ version: 'v3', auth }).events.get({
    calendarId: calendarId,
    eventId: '',//it must be empty to get all events.
    timeMin: startTime,
    timeMax: endTime,
    singleEvents: true,
    orderBy: 'startTime'
  }, (err, { data }) => {

    if (err) {
      res.status = err.status || 500
      res.json({
        message: err.message,
        error: err
      })
    } else {
      res.json(data)
    }

  });

});

router.post('/createEvent', (req, res) => {

  const calendarId = req.body.calendarId;
  const startTime = new Date(req.body.startTime);
  const endTime = new Date(req.body.endTime);
  const auth = req.oauth2

  google.calendar({ version: 'v3', auth }).events.insert({
    calendarId: calendarId,
    resource: {
      start: {
        dateTime: startTime,
        timeZone: "Europe/Istanbul"
      },
      end: {
        dateTime: endTime,
        timeZone: "Europe/Istanbul"
      },
      summary: "Test Summary",
      description: "Test description"
    }
  }, (err, { data }) => {

    if (err) {
      res.status = err.status || 500
      res.json({
        message: err.message,
        error: err
      })
    } else {
      res.json(data)
    }

  });

});

module.exports = router;