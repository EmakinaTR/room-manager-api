const fs = require('fs')
const { google } = require('googleapis')

const CREDENTIALS = JSON.parse(process.env.GOOGLE_CALENDAR_CREDENTIALS);
const SCOPES = ['https://www.googleapis.com/auth/calendar']

module.exports = (app, express) => {
  app.use((req, res, next) => {
    google.auth.getClient({
      credentials: CREDENTIALS,
      scopes: SCOPES
    }).then((auth) => {
      google.auth.getDefaultProjectId().then(project => {
        req.oauth2 = auth
        req.oauth2_project = project
        next();
      }).catch(err => {
        console.error('Error occured while trying to fetch default project id.', err)
        req.oauth2 = auth
        req.oauth2_project = CREDENTIALS.project_id
        next()
      })
    }).catch(err => {
      console.log('Error occured while trying to create oauth client.', err)
      next()
    })
  })
}