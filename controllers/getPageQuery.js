const { PageModel } = require('../models/Models');

function getPageQuery(id) {
    let query = PageModel.findById(id);
    return query;
}
module.exports = { getPageQuery }