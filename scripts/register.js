/**
 * Script for registering a user.
 * User and pass fields in auth.config
 * are used for both the user account
 * and for authorizing the signup!
 */

const querystring = require('querystring');
const http = require('http');
const config = require('../config/auth.config');

const postData = JSON.stringify({
    username: config.user,
    password: config.pass
});

const options = {
    host: config.host,
    port: config.port,
    path: '/api/v1/user/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'user': config.user,
        'pass': config.pass
    }
};

const postReq = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log('Response: ' + chunk);
    });
});

postReq.write(postData);
postReq.end();