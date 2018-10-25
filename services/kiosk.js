const KioskData = JSON.parse(process.env.KIOSKS);

exports.getCalendarInfo = function (macId, callback) {
    var kiosk = KioskData.find(k => macId && k.mac === macId);

    if (!kiosk) {
        callback('Device unknown.');
    } else {
        callback(null, {
            id: kiosk.id,
            title: kiosk.title
        });
    }
}

exports.getCalendarId = function (id, callback) {
    var kiosk = KioskData.find(k => id && k.id === Number(id));

    if (!kiosk) {
        callback("Room unknown.");
    } else {
        callback(null, kiosk.calendarId);
    }
}