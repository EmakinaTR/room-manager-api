const UserData = JSON.parse(process.env.USERS);

exports.getUserById = function (id, callback) {
	let user = UserData.find(u => id && u.id === id);

	if (!user) {
		callback('User unknown.');
	} else {
		callback(null, user);
	}
};

exports.getUserNameByEmail = function (email) {
	let user = UserData.find(item => email && item.email == email);

	return (!user) ? null : user.name;
};