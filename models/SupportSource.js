const mongoose = require('mongoose');

const SupportSourceSchema = new mongoose.Schema({
    sourceName: {
        type: String,
        required: true
    },
    link: String,
    isOnline: {
        type: Boolean,
        required: true,
        default: false
    },
    isInPerson: {
        type: Boolean,
        required: true,
        default: false
    },
    isInBuilding: {
        type: Boolean,
        required: true,
        default: false
    },
    orderNumber: {
        type: Number,
        required: true
    }
});

module.exports = SupportSourceSchema;