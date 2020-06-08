/**
 * Main file of the application, sets up the application server.
 */

const https = require('https');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const crud = require('./routes/crud.routes');
const auth = require('./routes/auth.routes');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/db.config');

const privateKey = fs.readFileSync('ssl/pkey.key');
const certificate = fs.readFileSync('ssl/cert.crt');

const options = { key: privateKey, cert: certificate };

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.user}:${config.pass}@${config.host}:${config.port}/${config.db}?authSource=${config.authDb}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connection established");
}).catch((err) => {
    console.log('Error connecting to database, exiting');
    console.log(err);
    process.exit();
});

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 23342;

app.use('/api/v1', crud);
app.use('/api/v1', auth);
app.get('/', (req, res) => {
    res.send('<p>Opokartta REST API</p>');
});

https.createServer(options, app).listen(port, () => {
    console.log('Server listening on ' + port);
});

/* app.listen(port, () => {
    console.log('Server listening on port ' + port);
}); */