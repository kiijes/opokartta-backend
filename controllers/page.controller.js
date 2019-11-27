/**
 * CRUD operations for Page documents.
 */

const { PageModel } = require('../models/Models');

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
exports.createPage = (req, res) => {
    if (req.body.pageName === undefined) {
        return res.status(400).send({
            message: "Request body needs field 'pageName'."
        });
    }

    // Create a new Page document from the model.
    let page = new PageModel({
        pageName: req.body.pageName,
        subtitle: !req.body.subtitle ? null : req.body.subtitle,
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
                message: err ? err.message : 'Could not find Page with ID ' + req.params.id
            });
        }

        return res.status(200).send({
            message: 'Page id ' + req.params.id + ' deleted'
        });
    });
}

/**
 * Modify a Page with the id defined in the route parameter 'id'.
 */
exports.modifyPage = (req, res) => {
    PageModel.findById(req.params.id, (err, doc) => {
        if (err || !doc) {
            return res.status(500).send({
                message: err ? err.message : 'Could not find Page with ID ' + req.params.id
            });
        }

        doc.pageName = !req.body.pageName ? doc.pageName : req.body.pageName;
        doc.subtitle = !req.body.subtitle ? 
            (!doc.subtitle ? null : doc.subtitle) : req.body.subtitle;
        doc.save((err, doc) => {
            if (err) res.status(500).send({ message: err.message });
            res.status(200).send(doc);
        });
    });
}