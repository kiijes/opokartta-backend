/**
 * This file contains the routes for the CRUD operations.
 */

const express = require('express');
const router = express.Router();
const Controller = require('../controllers/crud.controller');

// Get all the pages
router.get('/pages', Controller.getAllPages);

// Create a new page
router.post('/pages', Controller.createPage);

module.exports = router;