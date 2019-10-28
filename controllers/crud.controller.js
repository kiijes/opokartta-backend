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
        pageContent: !req.body.pageContent ? [] : req.body.pageContent,
        orderNumber: count ? count : 1
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

    let pageDoc;
    try {
        pageDoc = await getPageQuery(req.params.id).exec();
    } catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }

    let count = pageDoc.pageContent.length + 1;

    let pageContent = new PageContentModel({
        name: req.body.name,
        supportSources: [],
        orderNumber: count !== undefined ? count : 1
    });

    pageDoc.pageContent.push(pageContent);
    pageDoc.save()
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(500)
            .send({ message: err.message || "Some error occurred when saving data" })
        );

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

    let pageDoc;
    try {
        pageDoc = await getPageQuery(req.params.id).exec();
    } catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }

    let pageContentIsFound = false;
    pageDoc.pageContent.forEach(pageContent => {
        console.log(pageContent._id === req.params.pid);
        if (pageContent._id == req.params.pid) {
            pageContentIsFound = true;
            let count = pageContent.supportSources.length + 1;

            let supportSource = new SupportSourceModel({
                sourceName: req.body.sourceName,
                link: req.body.link ? req.body.link : null,
                isOnline: req.body.isOnline,
                isInPerson: req.body.isInPerson,
                isInBuilding: req.body.isInBuilding,
                orderNumber: count !== undefined ? count : 1
            });

            pageContent.supportSources.push(supportSource);
        }
    });

    if (!pageContentIsFound) {
        return res.status(404).send({
            message: 'Could not find pageDocument with ID ' + req.params.pid
        });
    }

    pageDoc.save()
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(500)
            .send({ message: err.message || "Some error occurred when saving data" })
        );

}

function getPageQuery(id) {
    let query = PageModel.findById(id);
    return query;
}