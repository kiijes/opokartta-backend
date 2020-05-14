/**
 * Template for an auth.config.js file which contains authorization
 * configuration data like secret keys.
 */

module.exports = {
    secret: 'SOME_SECRET_KEY', // String: used for JWT
    saltRounds: 10, // Integer: Amount of rounds for password salting
    user: '', // String: Username for authorizing signup
    pass: '' // String: Password for authorizing signup
}