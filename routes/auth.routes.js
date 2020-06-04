/**
 * This file contains the routes for authorization.
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// SIGNUP
/**
 * This route is used for registering a user account. Due to the nature of the software,
 * this is not intended to be kept available - consider making it unavailable later
 * in production by commenting it, removing it or something else.
 */
router.post('/user/signup', AuthController.authorizeSignup, AuthController.signUp);

// LOGIN
router.post('/user/signin', AuthController.signIn);

// GRANT ACCESS
router.get('/user/auth', AuthController.verifyToken, AuthController.grantAccess);

module.exports = router;