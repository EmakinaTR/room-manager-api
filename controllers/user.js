const UserService = require('../services/user');

exports.peopleList = function (req, res) {
    UserService.getAllPeople( req.oauth, 
        function (error, people) {
			if (error) {
				return res.status(400).json({ error: error });
			}
			console.log(users);
			res.status(200).json(people);
	});
};
