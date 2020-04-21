/**
 * Main file of the application, sets up the application server.
 */

const express = require('express');
const bodyParser = require('body-parser');
const crud = require('./routes/crud.routes');
const auth = require('./routes/auth.routes');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/db.config');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.host}:${config.port}/${config.db}`, {
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
const port = process.env.PORT || 3000;

app.use('/api/v1', crud);
app.use('/api/v1', auth);
app.get('/', (req, res) => {
    res.send('<p>Opokartta REST API</p>');
});

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});