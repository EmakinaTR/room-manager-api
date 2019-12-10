const KioskService = require('../services/kiosk'),
	CalendarService = require('../services/calendar');

exports.list = function (req, res) {
	KioskService.getCalendarByRoomId(req.params.id, function (err, id) {
		if (err) {
			return res.status(400).json({ error: err });
		}

		CalendarService.getEventsByCalendarId(id, req.oauth, function (error, events) {
			if (error) {
				return res.status(400).json({ error: error });
			}
			console.log(events);
			res.status(200).json(events);
		});
	});
};

exports.create = function (req, res) {
	KioskService.getCalendarByRoomId(req.params.id, function (err, id) {
		if (err) {
			return res.status(400).json({ error: err });
		}

		CalendarService.createNewMeeting(id, req.body.mins, req.oauth, function (error, record) {
			if (error) {
				return res.status(400).json({ error: error });
			}

			res.status(200).json(record);
		});
	});
};

exports.calendars = function( req, res ){
	CalendarService.getCalendars(req.oauth, function (err, record) {
		if (err) {
			return res.status(400).json({ error: err });
		}
			res.status(200).json(record);
	});
	
}

exports.getAllCalendarIds = function( req, res ){
	CalendarService.getAllCalendarIds(req.oauth, function (err, record) {
		if (err) {
			return res.status(400).json({ error: err });
		}
			res.status(200).json(record);
	});
	
}