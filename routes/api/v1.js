var util = require('util')

var express = require('express');
var router = express.Router({ mergeParams: true });
const { google } = require('googleapis');

router.route('/dailyMeetingRoomSchedule').post((req, res) => {

  const calendarId = req.body.roomId;

  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0);

  const endTime = new Date();
  endTime.setHours(23, 59, 59, 999);

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

      var eventArr = [];

      for (var item of data.items) {
        eventArr.push({
          id: item.id,
          title: item.summary == undefined ? null : item.summary,
          contact: item.organizer.displayName == undefined ? null : item.organizer.displayName,
          start: item.start.dateTime,
          end: item.end.dateTime,
        });
      }

      res.json(eventArr)
    }

  });

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

router.post('/createEvent', (req, res) => {

  const calendarId = req.body.roomId;
  const timeInterval = req.body.timeInterval;

  var startTime = new Date();
  var endTime = new Date(startTime);
  endTime.setMinutes(startTime.getMinutes() + 30);

  const auth = req.oauth2

  checkEventAvailable({
    calendarId: calendarId,
    startTime: startTime,
    endTime: endTime,
    auth: auth
  }, function (result) {

    if(result){
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
    }else{
      res.json({
        message : "The room is not available"
      })
    }

  });

});

function checkEventAvailable(query, callback) {

  var auth = query.auth;

  google.calendar({ version: 'v3', auth }).freebusy.query({
    headers: { "content-type": "application/json" },
    resource: {
      timeMin: query.startTime,
      timeMax: query.endTime,
      timeZone: "Europe/Istanbul",
      items: [{ "id": query.calendarId }]
    }
  }, (err, { data }) => {

    console.log(data);

    if (err) {
      console.log(err.message);
      callback(false);
    } else {
      var busyArray = data.calendars[query.calendarId].busy;
      if(busyArray.length == 0){
        callback(true);
      }else{
        callback(false);
      }
    }
  });
}

module.exports = router;