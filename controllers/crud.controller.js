/**
 * Controller for the CRUD operations of the application.
 */

const { PageModel, PageContentModel, SupportSourceModel } 
    = require('../models/Models');


// Get and return all the Page documents.
exports.getAllPages = (req, res) => {
    PageModel.find()
        .then(doc => {
            return res.status(200).send(doc);
        }).catch(err => {
            return res.status(500).send({
                message: err.message
            });
        });
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

    // Set the order number depending on the number of existing documents.
    let count;
    await PageModel.estimatedDocumentCount((err, docCount) => {
        if (err) {
            return res.status(500).send({
                message: err.message
            });
        }
        count = docCount + 1;
    });

    // Create a new Page document from the model.
    let page = new PageModel({
        pageName: req.body.pageName,
        pageContent: [],
        orderNumber: count !== undefined ? count : 1
    });

    // Save the new document.
    page.save()
        .then(doc => {
            return res.status(200).send(doc);
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Some error occurred when saving data"
            });
        });
}

/**
 * Create a new PageContent document inside a Page document.
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

    let pageDoc;
    await PageModel.findById(req.params.id)
        .then(doc => {
            pageDoc = doc;
        }).catch(err => {
            return res.status(500).send({
                message: err.message
            });
        });

    let count = pageDoc.pageContent.length + 1;

    let pageContent = new PageContentModel({
        name: req.body.name,
        supportSources: [],
        orderNumber: count !== undefined ? count : 1
    });

    pageDoc.pageContent.push(pageContent);
    pageDoc.save()
        .then(doc => {
            return res.status(200).send(doc);
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Some error occurred when saving data"
            });
        });

}