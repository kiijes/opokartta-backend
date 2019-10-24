const express = require('express');
const router = express.Router();
const Controller = require('../controllers/crud.controller');

router.get('/pages', Controller.getAllPages);
router.post('/pages', Controller.createPage);

module.exports = router;