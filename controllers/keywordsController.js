const KeywordInformation = require('../models/informationModel')
const {ErrorClass} = require('./errorController')
const axios = require('axios')

exports.addNewKeyword = async (req, res, next) => {
    const title = req.body.title
    const description = req.body.description
    const imageUrl = req.body.imageUrl
    const dataSources = req.body.dataSources
    const sourceConfidence = req.body.sourceConfidence
    const category = req.body.category

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
            category
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
    // const redis = appModule.redis
    try {
        // const cachedKeywords = await redis.get('keywords')

        // if(cachedKeywords){
        //     console.log('Showing data from cache')
        //     res.status(200).json({
        //         status: 'success',
        //         keywords: JSON.parse(cachedKeywords)
        //     })
        //     return
        // }

        const keywords = await KeywordInformation.find()

        if(!keywords){
            return next(new ErrorClass('There are no keywords in database', 404))
        }

        // await redis.set('keywords', JSON.stringify(keywords))
        // console.log('Keywords saved in cache')

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


exports.searchNewKeyword = async (req, res, next) => {
    try {

        const keyword = req.params.keyword
        await axios.get(`https://newssource.pythonanywhere.com/query/${keyword}`)
        .then((response) => {
            if(!response.data){
                return next(new ErrorClass('No results found', 404))
            }
            const data = response.data
            data.map(async el => {
                const existingKeyword = await KeywordInformation.findOne({ title: el.title })
                if(!existingKeyword){
                    await KeywordInformation.create({
                        title: el.title,
                        description: el.description,
                        imageUrl: el.imageUrl,
                        dataSource: el.dataSource,
                        sourceConfidence: el.sourceConfidence,
                        category: el.category
                    })
                    console.log('Search Data Updated')
                } else {
                    console.log('Data already present')
                }
            })
            return res.status(200).json({
                status: 'success',
                result: data
            })
        }).catch(function(err) {
            res.status(500).json({
                status: 'error',
                message: err.message
            })
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}