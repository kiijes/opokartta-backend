/**
 * Template for an auth.config.js file which contains authorization
 * configuration data like secret keys.
 */

module.exports = {
    secret: 'SOME_SECRET_KEY', // String: used for JWT secret
    saltRounds: 10, // Integer: Amount of rounds for password salting
    user: '', // String: Username for user account. Also used to auth signup via req headers!
    pass: '', // String: Password for user account. Also used to auth signup via req headers!
    host: '', // IP/hostname of host
    port: '' // Port the backend is running on
}