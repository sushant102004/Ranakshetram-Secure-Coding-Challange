const KeywordInformation = require('../models/informationModel')
const {ErrorClass} = require('./errorController')

exports.addNewKeyword = async (req, res, next) => {
    const title = req.body.title
    const description = req.body.description
    const imageUrl = req.body.imageUrl
    const dataSources = req.body.dataSources
    const sourceConfidence = req.body.sourceConfidence

    if(!title || !description || !imageUrl || !dataSources || !sourceConfidence){
        return next(new ErrorClass('Invalid input provided', 404))
    }

    try {
        const newKeyword = await KeywordInformation.create({
            title,
            description,
            imageUrl,
            dataSources,
            sourceConfidence,
        });
        res.status(200).json({
            status: 'success',
            data: {
                newKeyword
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err
        })
    }
}

exports.getAllKeywordsData = async (req, res, next) => {
    try {
        const keywords = await KeywordInformation.find()

        if(!keywords){
            return next(new ErrorClass('There are no keywords in database', 404))
        }

        res.status(200).json({
            status: 'success',
            keywords: keywords
        })
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err
        })
    }

}