const path = require('path');
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const {ErrorClass, ErrorController} = require('./controllers/errorController')
const keywordRoute = require('./routes/keywordRoutes');
const responseTime = require('response-time');
const cors = require('cors');
const cron = require('node-cron')
const utils = require('./utils/trendingData')
const axios = require('axios')
const KeywordInformation = require('./models/informationModel')

dotenv.config({path: path.join(__dirname, 'config.env')})

const app = express()

app.use(express.json())
app.use(responseTime())
app.use(cors())

mongoose.set('strictQuery', true)

mongoose.connect(process.env.MONGODB_CLOUD, {useNewUrlParser: true}).then(
    () => {
        try {
            console.log('Connected To Database')
            app.listen(process.env.PORT || 3000, () => console.log('Listening on port: ' + process.env.PORT))
        } catch(err){
            console.log(err)
        }
    }
)


// const redis = new Redis({
//     // host: 'redis-14267.c264.ap-south-1-1.ec2.cloud.redislabs.com',
//     // port: 14267,
//     // password: process.env.REDIS_PASSWORD,
//     host: '127.0.0.1',
//     port: 6379,
//     connectionTimeout: 10000
// })
// console.log('Connected To Redis')

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Endpoint Working'
    })
})

app.use('/api/v1/keyword', keywordRoute)

// cron.schedule('* * * * *', () => {
//     utils.updateTrendingData()
// })

app.get('/api/v1/updateTrendingData', async (req, res, next) => {
    const apiURL = 'https://newssource.pythonanywhere.com/trendingNews'

    await axios.get(apiURL).then(function (response) {
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
                console.log('Treding Data Updated')
            } else {
                console.log('Data already present')
            }
        })

        return res.status(200).json({
            status: 'success',
            message: 'Data updated successfully'
        })
    }).catch(function (err) {
        console.log(err)
        return next(err)
    })
})

app.all('*', (req, res, next) => {
    next(new ErrorClass(`Route not found: ${req.originalUrl}`, 404))
})


app.use(ErrorController)

// exports.redis = redis