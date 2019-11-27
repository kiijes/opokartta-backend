/**
 * This file contains the routes for the CRUD operations.
 */

const express = require('express');
const router = express.Router();
const PageController = require('../controllers/page.controller');
const PageContentController = require('../controllers/page-content.controller');
const SupportSourceController = require('../controllers/support-source.controller');

// Get all the Pages
router.get('/pages', PageController.getAllPages);

// Create a new Page
router.post('/pages', PageController.createPage);

// Create a new PageContent inside a Page
router.post('/pages/:id/page-contents', PageContentController.createPageContent);

// Create a new SupportSource inside a PageContent
router.post('/pages/:id/page-contents/:pid', SupportSourceController.createSupportSource);

// Delete a Page
router.delete('/pages/:id', PageController.deletePage);

// Delete a PageContent
router.delete('/pages/:id/page-contents/:pid', PageContentController.deletePageContent);

// Delete a SupportSource
router.delete('/pages/:id/page-contents/:pid/support-sources/:sid', SupportSourceController.deleteSupportSource);

module.exports = router;