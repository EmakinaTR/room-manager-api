const fs = require('fs')
const {google} = require('googleapis')
const CREDENTIALS_PATH = './google-calendar-api/credentials.json'
const CLIENT_SECRET_PATH = './google-calendar-api/client_secret.json'
const SCOPES = ['https://www.googleapis.com/auth/calendar']
const oAuth2Client = createOAuth2Client(readClientSecret())

oAuth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in my database!
    console.log('refresh_token', tokens.refresh_token);
  }
  console.log('access_token', tokens.access_token);
});

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

function createOAuth2Client (client_secret_file) {
  const {client_secret, client_id, redirect_uris} = client_secret_file.web
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
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
    if (req.path !== '/oauth/callback') {
      let token = readCredentials()
      if (token === undefined) {
        redirectToAuthentication(oAuth2Client, res)
      } else {
        oAuth2Client.setCredentials(token);
        next();
      }
    } else {
      next();
    }
  })

  oauth.get('/callback', (req, res) => {
    console.log('oauth2callback request:', req.query.code)
    oAuth2Client.getToken(req.query.code, (err, token) => {
      console.log('err', err, 'token', token)
      if (err) {
        res.status = 500
        res.json({
          error: err.data
        })
        return
      }

      oAuth2Client.setCredentials(token);
      console.log('callback token:', token)
      res.status = 200
      res.json({
        success: true
      })
      // Store the token to disk for later program executions
      // try {
      //   fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(token));
      //   console.log('Token stored to', CREDENTIALS_PATH);
      // } catch (err) {
      //   console.error(err);
      //   res.status = 500
      //   res.json({
      //     error: err
      //   })
      // }
    });
  })

  return oauth
}
