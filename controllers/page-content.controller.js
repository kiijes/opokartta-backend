/**
 * CRUD operations for PageContent documents.
 */

const { PageModel, PageContentModel, SupportSourceModel } 
    = require('../models/Models');

/**
 * Create a new PageContent document into a Page document.
 * The request body should be JSON and have a "name" field.
 * The request parameter needs to be the ObjectID of the parent
 * document.
 */
exports.createPageContent = (req, res) => {
    if (
        req.body.name === undefined ||
        req.params.id === undefined
        ) {
        return res.status(400).send({
            message: "Request body needs field 'name'."
        });
    }

    PageModel.findById(req.params.id, (err, doc) => {

        if (err || !doc) {
            return res.status(500).send({
                message: err ? err.message : 'Could not find Page with ID ' + req.params.id
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
exports.deletePageContent = (req, res) => {
    if (
        req.params.id === undefined || 
        req.params.pid === undefined
    ) { 
        return res.status(400).send({ message: 'Undefined request parameters' });
    }

    PageModel.findById(req.params.id, (err, doc) => {

        if (err || !doc) {
            return res.status(500).send({
                message: err ? err.message : 'Could not find Page with ID ' + req.params.id
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

/**
 * Modify a PageContent document defined by the route parameter pid
 * inside a Page document defined by the router parameter id.
 */
exports.modifyPageContent = (req, res) => {
    PageModel.findById(req.params.id, (err, doc) => {
        if (err || !doc) {
            return res.status(500).send({
                message: err ? err.message : 'Could not find Page with ID ' + req.params.id
            });
        }

        // Boolean variable for checking if anything was modified
        let pageContentWasModified = false;

        // Find corresponding PageContent document and modify if exists
        for (let i = 0; i < doc.pageContent.length; i++) {
            if (doc.pageContent[i]._id == req.params.pid) {
                doc.pageContent[i].name = req.body.name;
                pageContentWasModified = true;
                break;
            }
        }

        // If nothing was deleted, return a message
        if (!pageContentWasModified) {
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