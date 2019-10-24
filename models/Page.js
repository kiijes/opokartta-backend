const mongoose = require('mongoose');
const PageContentSchema = require('./PageContent');

const PageSchema = new mongoose.Schema({
    pageName: {
        type: String,
        required: true
    },
    pageContent: [PageContentSchema],
    orderNumber: {
        type: Number,
        required: true
    }
});

module.exports = PageSchema;