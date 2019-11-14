/**
 * Controller for the CRUD operations of the application.
 */

const { PageModel, PageContentModel, SupportSourceModel } 
    = require('../models/Models');


// Get and return all the Page documents.
exports.getAllPages = (req, res) => {
    PageModel.find()
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(500).send({message: err.message}));
};

/**
 * Create a new Page document.
 * The request body should be JSON and have a "pageName" field.
 */
exports.createPage = async (req, res) => {
    if (req.body.pageName === undefined) {
        return res.status(400).send({
            message: "Request body needs field 'pageName'."
        });
    }

    // Create a new Page document from the model.
    let page = new PageModel({
        pageName: req.body.pageName,
        pageContent: !req.body.pageContent ? [] : req.body.pageContent
    });

    // Save the new document.
    page.save()
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(500)
            .send({message: err.message || "Some error occurred when saving data"})
        );
}

/**
 * Delete a Page with the id defined in the route parameter 'id'.
 */
exports.deletePage = (req, res) => {
    PageModel.findByIdAndDelete(req.params.id, (err, doc) => {
        if (err || !doc) {
            return res.status(500).send({
                message: err ? err.message : 'No document found'
            });
        }

        return res.status(200).send({
            message: 'Page id ' + req.params.id + ' deleted'
        });
    });
}

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

/**
 * Create a new SupportSource document into a PageContent document.
 * The request body should be JSON and have at least a "sourceName" field.
 * req.params.id is the ID of the Page document.
 * req.params.pid is the ID of the PageContent document.
 */
exports.createSupportSource = async (req, res) => {
    if (
        req.body.sourceName === undefined ||
        req.params.id === undefined ||
        req.params.pid === undefined
    ) {
        return res.status(400).send({
            message: "Request body needs field 'sourceName'."
        });
    }

    await getPageQuery(req.params.id).exec((err, doc) => {
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

exports.deleteSupportSource = async (req, res) => {
    if (
        req.params.sid === undefined ||
        req.params.id === undefined ||
        req.params.pid === undefined
    ) {
        return res.status(400).send({ message: 'Undefined request parameters' });
    }

    await getPageQuery(req.params.id).exec((err, doc) => {
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

function getPageQuery(id) {
    let query = PageModel.findById(id);
    return query;
}