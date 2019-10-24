const mongoose = require('mongoose');
const SupportSourceSchema = require('./SupportSource');

const PageContentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    supportSources: [SupportSourceSchema],
    orderNumber: {
        type: Number,
        required: true
    }
});

module.exports = PageContentSchema;