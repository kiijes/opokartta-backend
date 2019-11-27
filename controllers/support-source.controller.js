/**
 * CRUD operations for SupportSource documents.
 */

const { PageModel, PageContentModel, SupportSourceModel } 
    = require('../models/Models');

/**
 * Create a new SupportSource document into a PageContent document.
 * The request body should be JSON and have at least a "sourceName" field.
 * req.params.id is the ID of the Page document.
 * req.params.pid is the ID of the PageContent document.
 */
exports.createSupportSource = (req, res) => {
    if (
        req.body.sourceName === undefined ||
        req.params.id === undefined ||
        req.params.pid === undefined
    ) {
        return res.status(400).send({
            message: "Request body needs field 'sourceName'."
        });
    }

    PageModel.findById(req.params.id, (err, doc) => {
        if (err || !doc) {
            return res.status(500).send({
                message: err ? err.message : 'Could not find Page with ID ' + req.params.id
            });
        }

        let pageContentIsFound = false;

        for (i = 0; i < doc.pageContent.length; i++) {
            if (doc.pageContent[i]._id == req.params.pid) {
                pageContentIsFound = true;

                let supportSource = new SupportSourceModel({
                    sourceName: req.body.sourceName,
                    link: req.body.link ? req.body.link : null,
                    isOnline: req.body.isOnline,
                    isInPerson: req.body.isInPerson,
                    isInBuilding: req.body.isInBuilding
                });

                doc.pageContent[i].supportSources.push(supportSource);
                break;
            }
        }

        if (!pageContentIsFound) {
            return res.status(404).send({
                message: 'Could not find pageDocument with ID ' + req.params.pid
            });
        }

        doc.save((err, doc) => {
            if (err) res.status(500).send({ message: err.message });
            res.status(200).send(doc);
        });

    });

}

/**
 * Delete a SupportSource document defined by the route parameter sid
 * inside a PageContent document defined by the router parameter pid
 * inside a Page document defined by the router parameter id.
 */
exports.deleteSupportSource = (req, res) => {
    if (
        req.params.sid === undefined ||
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

        let supportSourceWasDeleted = false;

        // Search loop for PageContent
        for (let i = 0; i < doc.pageContent.length; i++) {
            if (doc.pageContent[i]._id == req.params.pid) {
                // Search loop for SupportSource
                for (let j = 0; j < doc.pageContent[i].supportSources.length; j++) {
                    if (doc.pageContent[i].supportSources[j]._id == req.params.sid) {
                        doc.pageContent[i].supportSources.splice(j, 1);
                        supportSourceWasDeleted = true;
                    }
                    if (supportSourceWasDeleted) break;
                }
            }
            if (supportSourceWasDeleted) break;
        }

        // If nothing was deleted, return a message
        if (!supportSourceWasDeleted) {
            return res.status(404).send({
                message: 'Could not find SupportSource with ID ' + req.params.sid
            });
        }

        // Save document
        doc.save((err, doc) => {
            if (err) res.status(500).send({ message: err.message });
            res.status(200).send(doc);
        });

    });
}

/**
 * Modify a SupportSource document defined by the route parameter sid
 * inside a PageContent document defined by the router parameter pid
 * inside a Page document defined by the router parameter id.
 */
exports.modifySupportSource = (req, res) => {
    PageModel.findById(req.params.id, (err, doc) => {
        if (err || !doc) {
            return res.status(500).send({
                message: err ? err.message : 'Could not find Page with ID ' + req.params.id
            });
        }

        let supportSourceWasModified = false;

        // Search loop for PageContent
        for (let i = 0; i < doc.pageContent.length; i++) {
            if (doc.pageContent[i]._id == req.params.pid) {
                // Search loop for SupportSource
                for (let j = 0; j < doc.pageContent[i].supportSources.length; j++) {
                    if (doc.pageContent[i].supportSources[j]._id == req.params.sid) {
                        doc.pageContent[i].supportSources[j].sourceName = !req.body.sourceName ? doc.pageContent[i].supportSources[j].sourceName : req.body.sourceName;
                        doc.pageContent[i].supportSources[j].link = !req.body.link ? doc.pageContent[i].supportSources[j].link : req.body.link;
                        doc.pageContent[i].supportSources[j].isOnline = !req.body.isOnline ? doc.pageContent[i].supportSources[j].isOnline : req.body.isOnline;
                        doc.pageContent[i].supportSources[j].isInPerson = !req.body.isInPerson ? doc.pageContent[i].supportSources[j].isInPerson : req.body.isInPerson;
                        doc.pageContent[i].supportSources[j].isInBuilding = !req.body.isInBuilding ? doc.pageContent[i].supportSources[j].isInBuilding : req.body.isInBuilding;
                        supportSourceWasModified = true;
                    }
                    if (supportSourceWasModified) break;
                }
            }
            if (supportSourceWasModified) break;
        }

        // If nothing was deleted, return a message
        if (!supportSourceWasModified) {
            return res.status(404).send({
                message: 'Could not find SupportSource with ID ' + req.params.sid
            });
        }

        // Save document
        doc.save((err, doc) => {
            if (err) res.status(500).send({ message: err.message });
            res.status(200).send(doc);
        });
    });
}