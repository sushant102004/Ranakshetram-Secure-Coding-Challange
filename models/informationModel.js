const mongoose = require('mongoose');

const keywordInformationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    
    description: {
        type: String,
        required: [true, 'Description is required']
    },

    imageUrl: {
        type: String,
    },

    dataSources: {
        type: [String],
        required: [true, 'Data Sources are required']
    },

    sourceConfidence: {
        type: Number,
        required: [true, 'Source confidence is required']
    },

    dateCreated: {
        type: Date,
        default:  Date.now(),
    }
})

const KeywordInformation = new mongoose.model('Keywords', keywordInformationSchema)

module.exports = KeywordInformation