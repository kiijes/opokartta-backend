/**
 * CRUD operations for Page documents.
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