const { google } = require('googleapis'),
    moment = require('moment'),
    UserService = require('./user'),
    tz = 'Europe/Istanbul';

exports.getEventsByCalendarId = function (id, auth, next) {
    let start = moment({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 }),
    	end = moment({ hour: 23, minute: 59, seconds: 59, milliseconds: 999 });

	google.calendar({ version: 'v3', auth })
		.events.get({
			calendarId: id,
			eventId: '', // Leave it empty to get all events
			timeMin: start.toDate(),
			timeMax: end.toDate(),
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
						title: (!item.summary) ? null : item.summary,
						contact: UserService.getUserNameByEmail(item.creator.email),
						start: item.start.dateTime,
						end: item.end.dateTime,
					});
				}

				next(null, events);
			}
		});
};

function isRoomAvailable (query, next) {
	google.calendar({ version: 'v3', auth: query.auth })
		.freebusy.query({
			headers: { 'content-type': 'application/json' },
			resource: {
				timeMin: query.start,
				timeMax: query.end,
				timeZone: tz,
				items: [{ "id": query.id }]
			}
		}, function (err, { data }) {
			if (err) {
				return next(false);
			}

			let busy = data.calendars[query.id].busy;

			next(busy.length < 1);
		});
}

exports.createNewMeeting = function (id, mins, auth, next) {
    let start = moment(),
    	end = moment(start).add(mins, 'minutes');

	isRoomAvailable({
        id: id,
        start: start.toDate(),
        end: end.toDate(),
        auth: auth
    }, function (result) {
        if (!result) {
			next('Room unavailable');
		}

		google.calendar({ version: 'v3', auth })
			.events.insert({
				calendarId: id,
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
					title: (!data.summary) ? null : data.summary,
					contact: UserService.getUserNameByEmail(data.creator.email),
					start: data.start.dateTime,
					end: data.end.dateTime,
				});
			});
    });
};