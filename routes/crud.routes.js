/**
 * This file contains the routes for the CRUD operations.
 */

const express = require('express');
const router = express.Router();
const PageController = require('../controllers/page.controller');
const PageContentController = require('../controllers/page-content.controller');
const SupportSourceController = require('../controllers/support-source.controller');

// PAGE ROUTES
// Get all the Pages
router.get('/pages', PageController.getAllPages);
// Create a new Page
router.post('/pages', PageController.createPage);
// Delete a Page
router.delete('/pages/:id', PageController.deletePage);
// Modify a Page
router.put('/pages/:id', PageController.modifyPage);

// PAGECONTENT ROUTES
// Create a new PageContent inside a Page
router.post('/pages/:id/page-contents', PageContentController.createPageContent);
// Delete a PageContent
router.delete('/pages/:id/page-contents/:pid', PageContentController.deletePageContent);

// SUPPORTSOURCE ROUTES
// Create a new SupportSource inside a PageContent
router.post('/pages/:id/page-contents/:pid', SupportSourceController.createSupportSource);
// Delete a SupportSource
router.delete('/pages/:id/page-contents/:pid/support-sources/:sid', SupportSourceController.deleteSupportSource);

module.exports = router;