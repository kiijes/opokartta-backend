const { PageModel, PageContentModel, SupportSourceModel } 
    = require('../models/Models');

exports.getAllPages = (req, res) => {
    PageModel.find()
        .then(doc => {
            return res.status(200).send(doc);
        }).catch(err => {
            res.status(500).send({
                message: 'Some error occurred when fetching students'
            });
        });
};

exports.createPage = (req, res) => {
    let count;
    let page = new PageModel({
        pageName: req.body.pageName,

    })
}