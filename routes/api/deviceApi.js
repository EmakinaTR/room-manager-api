const express = require('express');
const router = express.Router({ mergeParams: true });
const calendarMapper = require('./../../mapper/calendarMapper');

router.get('/device/:macId', (req, res) => {

    calendarMapper.getCalendarInfo(req.params.macId, function (error, result) {

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