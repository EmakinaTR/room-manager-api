const KioskService = require('../services/kiosk'),
	CalendarService = require('../services/calendar');

exports.list = function (req, res) {
	KioskService.getCalendarId(req.params.id, function (err, id) {
		if (err) {
			return res.status(400).json({ error: err });
		}

		CalendarService.getEventsByCalendarId(id, req.oauth2, function (error, events) {
			if (error) {
				return res.status(400).json({ error: error });
			}

			res.status(200).json(events);
		});
	});
};

exports.create = function (req, res) {
	KioskService.getCalendarId(req.params.roomId, function (err, id) {
		if (err) {
			return res.status(400).json({ error: err });
		}

		CalendarService.createMeeting(id, req.body.mins, req.oauth2, function (error, record) {
			if (error) {
				return res.status(400).json({ error: error });
			}

			res.status(200).json(record);
		});
	});
};