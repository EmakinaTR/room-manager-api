const KioskService = require('../services/kiosk');

exports.handshake = function (req, res) {
    KioskService.getRoomByMacId(req.params.mac, function (err, result) {
    	if (err) {
        	return res.status(400).json({ error: err });
    	}

    	res.status(200).json(result);
    });
};