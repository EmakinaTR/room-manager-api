const fs = require('fs')
const {
  google
} = require('googleapis')
const CREDENTIALS_PATH = './google-calendar-api/GOOGLE_APPLICATION_CREDENTIALS.json'
const SCOPES = ['https://www.googleapis.com/auth/calendar']
const PROJECT_ID = 'crested-sentry-208712'

module.exports = (app, express) => {
  app.use((req, res, next) => {
    google.auth.getClient({
      keyFilename: CREDENTIALS_PATH,
      scopes: ['https://www.googleapis.com/auth/calendar']
    }).then((auth) => {
      google.auth.getDefaultProjectId().then(project => {
        req.oauth2 = auth
        req.oauth2_project = project
        next();
      }).catch(err => {
        console.error('Error occured while trying to fetch default project id.', err)
        req.oauth2 = auth
        req.oauth2_project = PROJECT_ID
        next()
      })
    }).catch(err => {
      console.log('Error occured while trying to create oauth client.', err)
      next()
    })
  })
}