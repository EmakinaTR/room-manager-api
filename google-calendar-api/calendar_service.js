const { google } = require('googleapis');
const moment = require('moment');

const timeZone = "Europe/Istanbul";
const summary = "Test Summary";
const description = "Test description";

var getEventsByCalendarId = function getEventsByCalendarId(calendarId, auth, callback) {

    const dayStartTime = moment({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 });
    const dayEndTime = moment({ hour: 23, minute: 59, seconds: 59, milliseconds: 999 });

    google.calendar({ version: 'v3', auth }).events.get({
        calendarId: calendarId,
        eventId: '',//it must be empty to get all events.
        timeMin: dayStartTime.toDate(),
        timeMax: dayEndTime.toDate(),
        timeZone: timeZone,
        singleEvents: true,
        orderBy: 'startTime'
    }, (err, { data }) => {

        if (err) {

            callback({
                message: err.message,
                error: err
            });

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

            callback(null, eventArr);
        }

    });

};

var getCalendars = function getCalendars(auth, callback) {

    google.calendar({ version: 'v3', auth }).calendarList.list((err, { data }) => {

        if (err) {

            callback({
                message: err.message,
                error: err
            });

        } else {
            callback(null, data);
        }

    });

};

var createMeeting = function createMeeting(calendarId, minutesBooked, auth, callback) {

    var startTime = moment();
    var endTime = moment(startTime).add(minutesBooked, "minutes");

    isRoomAvailable({
        calendarId: calendarId,
        startTime: startTime.toDate(),
        endTime: endTime.toDate(),
        auth: auth
    }, function (result) {

        if (result) {
            google.calendar({ version: 'v3', auth }).events.insert({
                calendarId: calendarId,
                resource: {
                    start: {
                        dateTime: startTime,
                        timeZone: timeZone
                    },
                    end: {
                        dateTime: endTime,
                        timeZone: timeZone
                    },
                    summary: summary,
                    description: description
                }
            }, (err, { data }) => {

                if (err) {

                    callback({
                        message: err.message,
                        error: err
                    });

                } else {

                    callback(null, {
                        id: data.id,
                        title: data.summary == undefined ? null : data.summary,
                        contact: data.organizer.displayName == undefined ? null : data.organizer.displayName,
                        start: data.start.dateTime,
                        end: data.end.dateTime,
                    });

                }

            });
        } else {
      
            callback({
                message: "The room is not available.",
            });
     
        }

    });

};

function isRoomAvailable(query, callback) {

    var auth = query.auth;

    google.calendar({ version: 'v3', auth }).freebusy.query({
        headers: { "content-type": "application/json" },
        resource: {
            timeMin: query.startTime,
            timeMax: query.endTime,
            timeZone: timeZone,
            items: [{ "id": query.calendarId }]
        }
    }, (err, { data }) => {

        console.log(data);

        if (err) {
            console.log(err.message);
            callback(false);
        } else {
            var busyArray = data.calendars[query.calendarId].busy;
            if (busyArray.length == 0) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });

}

module.exports = {
    getEventsByCalendarId: getEventsByCalendarId,
    getCalendars: getCalendars,
    createMeeting: createMeeting
}