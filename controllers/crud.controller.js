const { PageModel, PageContentModel, SupportSourceModel } 
    = require('../models/Models');

exports.getAllPages = (req, res) => {
    PageModel.find()
        .then(doc => {
            return res.status(200).send(doc);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

exports.createPage = async (req, res) => {
    if (req.body.pageName === undefined) {
        return res.status(400).send({
            message: 'Request body needs field \'pageName\''
        });
    }

    let count;
    await PageModel.estimatedDocumentCount((err, docCount) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        }
        count = docCount;
    });

    let page = new PageModel({
        pageName: req.body.pageName,
        pageContent: [],
        orderNumber: count !== undefined ? count : 1
    });

    page.save()
        .then(doc => {
            return res.status(200).send(doc);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred when saving data'
            });
        });
}