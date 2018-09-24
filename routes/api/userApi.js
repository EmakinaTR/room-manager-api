const express = require('express');
const router = express.Router({ mergeParams: true });
const userMapper = require('./../../mapper/userMapper');

router.get('/userList', (req, res) => {

    res.status(200);
    res.json(userMapper.getUserList());

});

module.exports = router;