/**
 * CRUD operations for PageContent documents.
 */

const getPageQuery = require('./getPageQuery').getPageQuery;
const { PageModel, PageContentModel, SupportSourceModel } 
    = require('../models/Models');

/**
 * Create a new PageContent document into a Page document.
 * The request body should be JSON and have a "name" field.
 * The request parameter needs to be the ObjectID of the parent
 * document.
 */
exports.createPageContent = async (req, res) => {
    if (
        req.body.name === undefined ||
        req.params.id === undefined
        ) {
        return res.status(400).send({
            message: "Request body needs field 'name'."
        });
    }

    await getPageQuery(req.params.id).exec((err, doc) => {

        if (err || !doc) {
            return res.status(500).send({
                message: err ? err.message : 'Could not find Page found with ID ' + req.params.id
            });
        }

        let pageContent = new PageContentModel({
            name: req.body.name,
            supportSources: []
        });

        doc.pageContent.push(pageContent);

        doc.save((err, doc) => {
            if (err) res.status(500).send({ message: err.message });
            res.status(200).send(doc);
        });
    });

}

/**
 * Delete a PageContent document defined by the route parameter pid
 * inside a Page document defined by the router parameter id.
 */
exports.deletePageContent = async (req, res) => {
    if (
        req.params.id === undefined || 
        req.params.pid === undefined
    ) { 
        return res.status(400).send({ message: 'Undefined request parameters' });
    }

    await getPageQuery(req.params.id).exec((err, doc) => {

        if (err || !doc) {
            return res.status(500).send({
                message: err ? err.message : 'Could not find Page found with ID ' + req.params.id
            });
        }
        
        // Boolean variable for checking if anything was deleted
        let pageContentWasDeleted = false;

        // Find corresponding PageContent document and delete if exists
        for (let i = 0; i < doc.pageContent.length; i++) {
            if (doc.pageContent[i]._id == req.params.pid) {
                doc.pageContent.splice(i, 1);
                pageContentWasDeleted = true;
                break;
            }
        }

        // If nothing was deleted, return a message
        if (!pageContentWasDeleted) {
            return res.status(404).send({
                message: 'Could not find PageContent with ID ' + req.params.pid
            });
        }

        doc.save((err, doc) => {
            if (err) res.status(500).send({ message: err.message });
            res.status(200).send(doc);
        });
    });
}