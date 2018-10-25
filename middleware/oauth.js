const { google } = require('googleapis');
const credentials = JSON.parse(process.env.CALENDAR);
const scopes = ['https://www.googleapis.com/auth/calendar'];

module.exports = (req, res, next) => {
	google.auth.getClient({ credentials, scopes })
		.then((auth) => {
			google.auth.getDefaultProjectId().then(project => {
				req.oauth2 = auth;
				req.oauth2_project = project;
				next();
			})
			.catch(err => {
				console.error('Could not fetch default project', err)
				next(err);
			});
		})
		.catch(err => {
			console.log('OAuth could not connect', err);
			next(err);
		});
};