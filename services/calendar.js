const { google } = require('googleapis'),
    moment = require('moment'),
    UserService = require('./user'),
    tz = 'Europe/Istanbul';

exports.getEventsByCalendarId = function (id, auth, next) {
    let start = moment({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 }),
    	end = moment({ hour: 23, minute: 59, seconds: 59, milliseconds: 999 });

	google.calendar({ version: 'v3', auth })
		.events.get({
			calendarId: id,
			eventId: '', // Leave it empty to get all events
			timeMin: start.toDate(),
			timeMax: end.toDate(),
			timeZone: tz,
			singleEvents: true,
			orderBy: 'startTime'
		}, function (err, { data }) {
			if (err) {
				next(err);
			} else {
				let events = [];

				for (var item of data.items) {
					let attendees = item.attendees
						.map(attendee => {
							// fix hardcoded
							return UserService.getUserNameByEmail(attendee)
						})
						.filter(e => e);

					events.push({
						id: item.id,
						title: (!item.summary) ? null : item.summary,
						contact: UserService.getUserNameByEmail(item.creator.email),
						attendees,
						start: item.start.dateTime,
						end: item.end.dateTime,
					});
				}

				next(null, events);
			}
		});
};

function isRoomAvailable (query, next) {
	google.calendar({ version: 'v3', auth: query.auth })
		.freebusy.query({
			headers: { 'content-type': 'application/json' },
			resource: {
				timeMin: query.start,
				timeMax: query.end,
				timeZone: tz,
				items: [{ "id": query.id }]
			}
		}, function (err, { data }) {
			if (err) {
				return next(false);
			}

			let busy = data.calendars[query.id].busy;

			next(busy.length < 1);
		});
}

exports.createNewMeeting = function (id, mins, auth, next) {
    let start = moment(),
    	end = moment(start).add(mins, 'minutes');

	isRoomAvailable({
        id: id,
        start: start.toDate(),
        end: end.toDate(),
        auth: auth
    }, function (result) {
        if (!result) {
			next('Room unavailable');
		}

		google.calendar({ version: 'v3', auth })
			.events.insert({
				calendarId: id,
				resource: {
					start: {
						dateTime: start,
						timeZone: tz
					},
					end: {
						dateTime: end,
						timeZone: tz
					},
					summary: 'Meeting',
					description: 'Booked via kiosk app.'
				}
			}, function (err, { data }) {
				if (err) {
					return next(err);
				}

				// Return new event
				next(null, {
					id: data.id,
					title: (!data.summary) ? null : data.summary,
					contact: UserService.getUserNameByEmail(data.creator.email),
					start: data.start.dateTime,
					end: data.end.dateTime,
				});
			});
    });
};

function room_details( room ){
	
	const { id , summary , backgroundColor , foregroundColor } = room;
    const format = {
        room_size : /\((\d+)\)/,
        lifesize_type : /\[(Lifesize(?:[\scloud]+)?)\]/ 
    };
	let room_info = {}; 
	let s = summary;
    for (const key in format) {
        if (format.hasOwnProperty(key)) {
            let m;
            const regex = format[key];
            if( (m = s.match(regex)) !== null ) {          
                room_info[key] = (m[m.length-1]);
                s = s.replace(regex , "");
            }
        }
	}
	room_info["full_name"] = s.trim();
	room_info["name"] = room_info["full_name"].split("-").pop(); 
	room_info = {...room_info , backgroundColor , foregroundColor };
	return room_info;
}

exports.getCalendars = function (auth , next) {
	const Calender_ids = JSON.parse(process.env.CALENDAR_IDS);
	//console.log( Calender_ids );
	//let calendars1 = google.calendar({ version: 'v3', auth });
	let cals = google.calendar({ version: 'v3', auth }).calendarList.list({},(req,res)=>{
		//console.log(res.data.items);
		for( var item of res.data.items){
			
			if( Calender_ids.indexOf(item.id) !== -1 ){
				const room_info = room_details(item)
				const {full_name , name , room_size, lifesize_type } = room_info;
				console.log( room_info );
				console.log( `${full_name}`)
				console.log( `${name} , ${room_size}, ${lifesize_type }` );	
			}else{
				console.log('room yok ', item.id);
			}
		}
	});

	next("calendars");
}

/*
	Get all calendar ids for config

 */
exports.getAllCalendarIds = function (auth , next) {
	let result = [];
	let cals = google.calendar({ version: 'v3', auth }).calendarList.list({},(req,res)=>{
		for( var item of res.data.items){
			result.push({id:item.id, name:item.summary})
		}
		if (!result) {
			next('Calendars unavailable');
		}
		next( null , {result} );
	});
}