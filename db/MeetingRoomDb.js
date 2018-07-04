const pgp = require('pg-promise')({
    error(error, e) {
        if (e.cn) {
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    },
    disconnect(client, dc) {
        const cp = client.connectionParameters;
        console.log('Disconnecting from database:', cp.database);
    },
    connect(client, dc, useCount) {
        const cp = client.connectionParameters;
        console.log('Connected to database:', cp.database);
    }
});

var credentials = {
    user: 'ravawvkonfirwo',
    password: '72071cbd7fee3dc9d0fb37442fc07443eb8ee979a94bcf9bf9668609ed1c2d02',
    database: 'dc4m2if5l3ha3d',
    port: 5432,
    host: 'ec2-54-217-250-0.eu-west-1.compute.amazonaws.com',
    ssl: true
};

var databaseClient = pgp(credentials);

var saveCalendars = function SaveCalendars(query, callback) {

    var db = pgp(credentials);

    db.one('INSERT INTO kiosks(id, label, last_ip_address) VALUES($1, $2, $3) RETURNING id', ['64-00-6A-20-22-EC', 'test_1', '10.230.12.193'])
        .then(data => {
            console.log(data.id);
        })
        .catch(error => {
            console.log('ERROR:', error);
        });

    db.one('INSERT INTO calendars(id, calendar_id, kiosk_id) VALUES($1, $2, $3) RETURNING id', [1, 'relephant.nl_hha1u9iq1vn2p3u46isloi59l0@group.calendar.google.com', '64-00-6A-20-22-EC'])
        .then(data => {
            console.log(data.id);
        })
        .catch(error => {
            console.log('ERROR:', error);
        });
}

var getCalendarIdByRoomId = function getCalendarIdByRoomId(roomId, callback) {

    databaseClient.one('SELECT * FROM calendars WHERE id = $1', [roomId])
        .then(function (data) {
            callback(null, data.calendar_id);
        })
        .catch(function (error) {
            return callback("The room " + roomId + " does not exist.");
        });

}

module.exports = {
    SaveCalendars: saveCalendars,
    getCalendarIdByRoomId: getCalendarIdByRoomId,
};