const { google } = require('googleapis'),
    moment = require('moment'),
    UserService = require('./user'),
    tz = 'Europe/Istanbul';

function checkRoomAvailability (query, next) {
	google.calendar({ version: 'v3', auth: query.auth })
		.freebusy.query({
			headers: { 'content-type': 'application/json' },
			resource: {
				timeMin: query.startTime,
				timeMax: query.endTime,
				timeZone: tz,
				items: [{ "id": query.calendarId }]
			}
		}, function (err, { data }) {
			if (err) {
				return next(false);
			}

			next(data.calendars[query.calendarId].busy.length < 1);
		});
}

exports.getEventsByCalendarId = function (calendarId, auth, next) {
    const dayStart = moment({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 }),
    	dayEnd = moment({ hour: 23, minute: 59, seconds: 59, milliseconds: 999 });

	google.calendar({ version: 'v3', auth })
		.events.get({
			calendarId: calendarId,
			eventId: '', // Leave it empty to get all events
			timeMin: dayStart.toDate(),
			timeMax: dayEnd.toDate(),
			timeZone: tz,
			singleEvents: true,
			orderBy: 'startTime'
		}, function (err, { data }) {
			if (err) {
				next(err);
			} else {
				let events = [];

				for (var item of data.items) {
					events.push({
						id: item.id,
						title: (item.summary == undefined) ? null : item.summary,
						contact: UserService.getUserNameByEmail(item.creator.email),
						start: item.start.dateTime,
						end: item.end.dateTime,
					});
				}

				next(null, events);
			}
		});
};

exports.getCalendars = function (auth, next) {
	google.calendar({ version: 'v3', auth }).calendarList
		.list(function (err, { data }) {
			if (err) {
				next(err);
			} else {
				next(null, data);
			}
		});
};

exports.createMeeting = function (calendarId, mins, auth, next) {
    let start = moment(),
    	end = moment(start).add(mins, 'minutes');

	checkRoomAvailability({
        calendarId: calendarId,
        startTime: start.toDate(),
        endTime: end.toDate(),
        auth: auth
    }, function (result) {
        if (!result) {
			next('Room unavailable.');
		}

		google.calendar({ version: 'v3', auth })
			.events.insert({
				calendarId: calendarId,
				resource: {
					start: {
						dateTime: start,
						timeZone: tz
					},
					end: {
						dateTime: end,
						timeZone: tz
					},
					summary: 'Meeting',
					description: 'Booked via kiosk app.'
				}
			}, function (err, { data }) {
				if (err) {
					return next(err);
				}

				// Return new event
				next(null, {
					id: data.id,
					title: (data.summary == undefined) ? null : data.summary,
					contact: UserService.getUserNameByEmail(data.creator.email),
					start: data.start.dateTime,
					end: data.end.dateTime,
				});
			});
    });
};