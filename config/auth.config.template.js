/**
 * Template for an auth.config.js file which contains authorization
 * configuration data like secret keys.
 */

module.exports = {
    secret: 'SOME_SECRET_KEY', // used for JWT
    saltRounds: 10, // Some integer
    user: '', // Username for authorizing signup
    pass: '' // Password for authorizing signup
}