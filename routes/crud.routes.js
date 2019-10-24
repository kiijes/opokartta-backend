/**
 * This file contains the routes for the CRUD operations.
 */

const express = require('express');
const router = express.Router();
const Controller = require('../controllers/crud.controller');

// Get all the Pages
router.get('/pages', Controller.getAllPages);

// Create a new Page
router.post('/pages', Controller.createPage);

// Create a new PageContent inside a Page
router.post('/pages/:id/page-contents', Controller.createPageContent);

// Create a new SupportSource inside a PageContent
router.post('/pages/:id/page-contents/:pid', Controller.createSupportSource);

module.exports = router;