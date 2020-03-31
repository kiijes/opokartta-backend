/**
 * This file contains the routes for authorization.
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// SIGNUP
router.post('/user/signup', AuthController.authorizeSignup, AuthController.signUp);

// LOGIN
router.post('/user/signin', AuthController.signIn);

// TOKEN VERIFICATION TESTING
router.get('/user/tokentest', AuthController.verifyToken);

module.exports = router;