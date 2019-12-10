const { google } = require('googleapis');

const UserData = JSON.parse(process.env.USERS);

exports.getUserById = function (id, next) {
	let user = UserData.find(u => id && u.id === id);

	if (!user) {
		next('User unknown');
	} else {
		next(null, user);
	}
};

exports.getUserNameByEmail = function (email) {
	let user = UserData.find(u => email && u.email == email);

	return (!user)
		? null
		: user.name;
};


exports.getAllPeople = (auth , next ) => {
	let people = [];

	// todo: Check error list 
	//google.people({ version: 'v3', auth })

	return next(null, people);
};