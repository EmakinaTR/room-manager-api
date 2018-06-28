const fs = require('fs');

function readCredentials() {
    try {
        return fs.readFileSync('./google-calendar-api/credentials.json');
    } catch (err) {
        console.log(err)
        console.error('Error while trying to read credentials file.');
        return undefined
    }
}

module.exports = (app, express) => {
    app.use((req, res, next) => {
        console.log('Request interceptor to check expiration for calendar token.')
        let credentials = readCredentials();
        console.log('Credientials:', credentials);
        next();
    })
}