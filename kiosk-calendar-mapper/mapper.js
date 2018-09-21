const mappedList = JSON.parse(process.env.KIOSK_CALENDAR_MAP);

function getCalendarInfo(macId, callback) {

    var kiosk = mappedList.filter(item => item.mac == macId)[0];

    if (kiosk == undefined)
        callback("The room " + macId + " does not exist.");
    else
        callback(null, {
            id: kiosk.id,
            title: kiosk.title
        });

}

function getCalendarId(id, callback) {

    var kiosk = mappedList.filter(item => item.id == id)[0];

    if (kiosk == undefined)
        callback("The room " + id + " does not exist.");
    else
        callback(null, kiosk.calendarId);

}

module.exports = {
    getCalendarInfo,
    getCalendarId
}