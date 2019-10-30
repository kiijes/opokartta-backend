/**
 * This file contains the Mongoose schema for the SupportSource document.
 * SupportSource is a child document inside a PageContent document.
 * It translates into a list of support sources for the situations.
 * These sources are helpful support sources or services for a certain situation,
 * these could be a mental health clinic, an online support source etc.
 */

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
    }
});

module.exports = SupportSourceSchema;