const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config/db.config');
const { PageModel } = require('../models/Models');

const pages = fs.readFileSync(path.resolve(__dirname, "../db/backup.json"), 'utf8');
const parsedPages = JSON.parse(pages);

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.user}:${config.pass}@${config.host}:${config.port}/${config.db}?authSource=${config.authDb}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connection established");

    const saveDocument = (document) => {
        return new Promise(resolve => {
            const pageDoc = new PageModel(document);
            pageDoc.save().then(() => resolve());
        });
    }

    const savePages = async () => {
        for (let page of parsedPages) {
            await saveDocument(page);
            console.log('saved');
        }
        process.exit();
    }

    savePages();
}).catch((err) => {
    console.log('Error connecting to database, exiting');
    console.log(err);
    process.exit();
});
