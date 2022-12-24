const express = require('express')
const keywordsController = require('../controllers/keywordsController')


const router = express.Router()

router.route('/').get(keywordsController.getAllKeywordsData).post(keywordsController.addNewKeyword)
router.route('/:keyword').get(keywordsController.searchNewKeyword)

module.exports = router