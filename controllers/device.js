const KioskService = require('../services/kiosk');

exports.handshake = function (req, res) {
    KioskService.getCalendarInfo(req.params.mac, function (err, result) {
    	if (err) {
        	return res.status(400).send({ error: err });
    	}

    	res.status(200).json(result);
    });
};