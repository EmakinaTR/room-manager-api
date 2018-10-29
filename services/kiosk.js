const KioskData = JSON.parse(process.env.KIOSKS);

exports.getRoomByMacId = function (id, next) {
    var kiosk = KioskData.find(k => id && k.mac === id);

    if (!kiosk) {
        next('Device unknown');
    } else {
        next(null, {
            id: kiosk.id,
            title: kiosk.title
        });
    }
}

exports.getCalendarByRoomId = function (id, next) {
    var kiosk = KioskData.find(k => id && k.id === Number(id));

    if (!kiosk) {
        next("Room unknown");
    } else {
        next(null, kiosk.calendarId);
    }
}