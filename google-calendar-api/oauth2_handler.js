const fs = require('fs')
const readline = require('readline')
const {google} = require('googleapis')
const CREDENTIALS_PATH = './google-calendar-api/credentials.json'
const CLIENT_SECRET_PATH = './google-calendar-api/client_secret.json'
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
var oAuth2Client = undefined

function readFile(path) {
  try {
    return JSON.parse(fs.readFileSync(path))
  } catch (err) {
    console.log(err)
    console.error('Error while trying to read file.')
    return undefined
  }
}

function readCredentials() {
  return readFile(CREDENTIALS_PATH)
}

function readClientSecret() {
  return readFile(CLIENT_SECRET_PATH)
}

function createOAuth2Client (client_secret) {
  const {secret, client_id, redirect_uris} = client_secret.web
  return new google.auth.OAuth2(client_id, secret, redirect_uris[0])
}

function redirectToAuthentication(oAuth2Client, res) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('User will be redirected to:', authUrl);
  res.redirect(authUrl);
}


module.exports = (app, express) => {
  let oauth = express.Router()

  app.use((req, res, next) => {
    //TODO: check thar request is not for callback url
    let token = readCredentials()
    if (oAuth2Client === undefined) {
      oAuth2Client = createOAuth2Client(readClientSecret())      
    }
    
    if (token === undefined) {
      redirectToAuthentication(oAuth2Client, res)
    } else {
      oAuth2Client.setCredentials(token);
      next();
    }
  })

  oauth.get('/oauth2callback', (req, res) => {
    console.log('oauth2callback request:', req.params)
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        res.status = 500
        reS.json({
          error: err
        })
        return
      }

      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      try {
        fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(token));
        console.log('Token stored to', CREDENTIALS_PATH);
      } catch (err) {
        console.error(err);
        res.status = 500
        res.json({
          error: err
        })
      }
    });
  })

  return oauth
}
