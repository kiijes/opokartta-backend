/**
 * This file contains the routes for the CRUD operations.
 */

const express = require('express');
const router = express.Router();
const PageController = require('../controllers/page.controller');
const PageContentController = require('../controllers/page-content.controller');
const SupportSourceController = require('../controllers/support-source.controller');
const AuthController = require('../controllers/auth.controller');

// PAGE ROUTES
// Get all the Pages
router.get('/pages', PageController.getAllPages);
// Get all the Pages with no subdocuments
router.get('/pages-nosub', PageController.getAllPagesWithNoSubdocuments);
// Get a single Page
router.get('/pages/:id', PageController.getPageWithId);
// Create a new Page
router.post('/pages', AuthController.verifyToken, PageController.createPage);
// Delete a Page
router.delete('/pages/:id', AuthController.verifyToken, PageController.deletePage);
// Modify a Page
router.put('/pages/:id', AuthController.verifyToken, PageController.modifyPage);

// PAGECONTENT ROUTES
// Get a PageContent
router.get('/pages/:id/page-contents/:pid', PageContentController.getPageContent);
// Create a new PageContent inside a Page
router.post('/pages/:id/page-contents', AuthController.verifyToken, PageContentController.createPageContent);
// Delete a PageContent
router.delete('/pages/:id/page-contents/:pid', AuthController.verifyToken, PageContentController.deletePageContent);
// Modify a PageContent
router.put('/pages/:id/page-contents/:pid', AuthController.verifyToken, PageContentController.modifyPageContent);
// Move a PageContent element in array
router.put('/pages/:id/page-contents/:pid/move', AuthController.verifyToken, PageContentController.moveElementInArray);

// SUPPORTSOURCE ROUTES
// Create a new SupportSource inside a PageContent
router.post('/pages/:id/page-contents/:pid', AuthController.verifyToken, SupportSourceController.createSupportSource);
// Delete a SupportSource
router.delete('/pages/:id/page-contents/:pid/support-sources/:sid', AuthController.verifyToken, SupportSourceController.deleteSupportSource);
// Modify a SupportSource
router.put('/pages/:id/page-contents/:pid/support-sources/:sid', AuthController.verifyToken, SupportSourceController.modifySupportSource);
// Move a SupportSource element in array
router.put('/pages/:id/page-contents/:pid/support-sources/:sid/move', AuthController.verifyToken, SupportSourceController.moveElementInArray);

module.exports = router;