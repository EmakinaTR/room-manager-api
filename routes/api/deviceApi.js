const express = require('express');
const router = express.Router({ mergeParams: true });
const mapper = require('./../../kiosk-calendar-mapper/mapper');

router.get('/device/:macId', (req, res) => {

    mapper.getCalendarInfo(req.params.macId, function (error, result) {

        if (error) {
            res.status(400);
            res.send(error);
            return;
        }

        res.status(200);
        res.json(result);

    });

});

module.exports = router;