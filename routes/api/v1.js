var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'This is the version 1 of this api.'
    });
})

router.route('/schedule/:room_id').get((req, res) => {
    console.log('GET request.params:', req.params);
}).post((req, res) => {
    console.log('POST request.params:', req.params);
});

module.exports = router;
