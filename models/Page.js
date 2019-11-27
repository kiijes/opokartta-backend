/**
 * This file contains the Mongoose schema for the Page document.
 * Page is the topmost parent document in the collection.
 * It translates into a top category in the application.
 * These categories could be "life situation", "mental health" etc.
 */

const mongoose = require('mongoose');
const PageContentSchema = require('./PageContent');

const PageSchema = new mongoose.Schema({
    pageName: {
        type: String,
        required: true
    },
    subtitle: String,
    pageContent: [PageContentSchema]
});

module.exports = PageSchema;