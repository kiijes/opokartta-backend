/**
 * This file turns the Mongoose schemas into usable models
 * and exports them.
 */

const mongoose = require('mongoose');
const SupportSourceSchema = require('./SupportSource');
const PageContentSchema = require('./PageContent');
const PageSchema = require('./Page');
const UserSchema = require('./User');

mongoose.model('Page', PageSchema);
mongoose.model('PageContent', PageContentSchema);
mongoose.model('SupportSource', SupportSourceSchema);
mongoose.model('User', UserSchema);

exports.PageModel = mongoose.model('Page');
exports.PageContentModel = mongoose.model('PageContent');
exports.SupportSourceModel = mongoose.model('SupportSource');
exports.UserModel = mongoose.model('User');