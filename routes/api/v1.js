var express = require('express');
var router = express.Router({
  mergeParams: true
});
const {
  google
} = require('googleapis');

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'This is the version 1 of this api.'
  });
})

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

router.get('/test', (req, res) => {

  const auth = req.oauth2
  const calendar = google.calendar({
    version: 'v3',
    auth
  });
  const project = req.oauth2_project
  calendar.calendarList.list((err, { data }) => {
    if (err) {
      res.status = err.status || 500
      res.json({
        message: err.message,
        error: err
      })
    } else {
      res.json(data)
    }
  })
})

module.exports = router;