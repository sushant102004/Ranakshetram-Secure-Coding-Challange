const path = require('path');
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const {ErrorClass, ErrorController} = require('./controllers/errorController')
const keywordRoute = require('./routes/keywordRoutes')

dotenv.config({path: path.join(__dirname, 'config.env')})

const app = express()
app.use(express.json())

mongoose.set('strictQuery', true)

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}).then(
    () => {
        try {
            console.log('Connected To Database')
            app.listen(process.env.PORT || 3000, () => console.log('Listening on port: ' + process.env.PORT))
        } catch(err){
            console.log(err)
        }
    }
)

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Route Working'
    })
})

app.use('/api/v1/keyword', keywordRoute)

app.all('*', (req, res, next) => {
    next(new ErrorClass(`Route not found: ${req.originalUrl}`, 404))
})

app.use(ErrorController)