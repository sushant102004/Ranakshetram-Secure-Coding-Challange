// // Function to auto add tending data to DB.

// const { default: axios } = require('axios')
// const mongoose = require('mongoose')
// const KeywordInformation = require('./../models/informationModel')

// exports.updateTrendingData = async () => {
//     mongoose.set('strictQuery', false)
//     mongoose.connect(process.env.MONGODB_CLOUD, {useNewUrlParser: true}).then(
//         () => {
//             try {
//                 console.log('Connected To Database')
//             } catch(err){
//                 console.log(err)
//             }
//         }
//     )

//     const apiURL = 'https://newssource.pythonanywhere.com/trendingNews'

//     await axios.get(apiURL).then(function (response) {
//         const data = response.data
//         data.map(async el => {
//             const existingKeyword = await KeywordInformation.findOne({ title: el.title })
//             if(!existingKeyword){
//                 await KeywordInformation.create({
//                     title: el.title,
//                     description: el.description,
//                     imageUrl: el.imageUrl,
//                     dataSource: el.dataSource,
//                     sourceConfidence: el.sourceConfidence,
//                     category: el.category
//                 })
//                 console.log('Treding Data Updated')
//             } else {
//                 console.log('Data already present')
//             }
//         })
//     }).catch(function (err) {
//         console.log(err)
//         return next(err)
//     })
// }