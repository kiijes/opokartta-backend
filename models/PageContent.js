/**
 * This file contains the Mongoose schema for the PageContent document.
 * PageContent is a child document inside a Page document.
 * It translates into a subcategory of the top category in the application.
 * These categories are situations relating to the main topic,
 * these could be "depression", "relationship problems" etc.
 */

const mongoose = require('mongoose');
const SupportSourceSchema = require('./SupportSource');

const PageContentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    descriptionTitle: String,
    supportSources: [SupportSourceSchema]
});

module.exports = PageContentSchema;