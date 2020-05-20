/**
 * CRUD operations for SupportSource documents.
 */

const { PageModel, SupportSourceModel } = require('../models/Models');

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
                    description: req.body.description,
                    link: req.body.link,
                    phone: req.body.phone,
                    icon: req.body.icon
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
                        doc.pageContent[i].supportSources[j].description = !req.body.description ? null : req.body.description;
                        doc.pageContent[i].supportSources[j].link = !req.body.link ? [] : req.body.link;
                        doc.pageContent[i].supportSources[j].phone = !req.body.phone ? null : req.body.phone;
                        doc.pageContent[i].supportSources[j].icon = !req.body.icon ? [] : req.body.icon;
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

/**
 * Move a SupportSource document up or down in the array.
 * 
 * Note: refer to the note of PageContentController's
 * moveElementInArray function for a quick rundown on
 * how this function works and why it's crude.
 */
exports.moveElementInArray = async (req, res) => {
    let pageContentWasFound = false;
    let supportSourceWasFound = false;
    let supportSourceWasMoved = false;
    let pageContentIndex;

    // fetch the Page document that has to be modified
    const doc = await PageModel.findById(req.params.id);

    // Go through PageContent document array
    for (let i = 0; i < doc.pageContent.length; i++) {
        if (doc.pageContent[i]._id == req.params.pid) {
            pageContentWasFound = true;
            pageContentIndex = i;
            // Go through SupportSource document array
            for (let j = 0; j < doc.pageContent[i].supportSources.length; j++) {
                if (doc.pageContent[i].supportSources[j]._id == req.params.sid) {
                    supportSourceWasFound = true;

                    if (req.body.move == 'up' && j > 0) {
                        var tmp = doc.pageContent[i].supportSources[j-1];
                        doc.pageContent[i].supportSources[j-1] = doc.pageContent[i].supportSources[j];
                        doc.pageContent[i].supportSources[j] = tmp;
                        supportSourceWasMoved = true;
                        break;
                    }

                    if (req.body.move == 'down' && j < doc.pageContent[i].supportSources.length-1) {
                        var tmp = doc.pageContent[i].supportSources[j+1];
                        doc.pageContent[i].supportSources[j+1] = doc.pageContent[i].supportSources[j];
                        doc.pageContent[i].supportSources[j] = tmp;
                        supportSourceWasMoved = true;
                        break;
                    }
                }
            }
        }
    }

    // Checks and returns if a document was not found or moved
    if (!pageContentWasFound) {
        return res.status(404).send({
            message: 'Could not find PageContent with ID ' + req.params.pid
        });
    }
    if (!supportSourceWasFound) {
        return res.status(404).send({
            message: 'Could not find SupportSource with ID ' + req.params.sid
        });
    }
    if (!supportSourceWasMoved) {
        return res.status(500).send({
            message: 'Could not move SupportSource with ID ' + req.params.sid + ' ' + req.body.move
        });
    }

    // Update happens here, response includes info on
    // whether anything was modified or not
    const response = await PageModel.updateOne(
        { _id: req.params.id },
        { pageContent: doc.pageContent }
    );

    // If a document was modified, return OK, otherwise return an error
    if (response.nModified === 1) {
        return res.status(200).send({
            message: 'Moved SupportSource with ID ' + req.params.sid + ' ' + req.body.move
        });
    } else {
        return res.status(500).send({
            message: 'An unknown error occurred when moving SupportSource with ID ' + req.params.sid + ' ' + req.body.move
        });
    }
}