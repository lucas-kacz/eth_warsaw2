const { Router } = require('express')
const { createRequest } = require('../controllers/create_request')

const router = Router()

module.exports = router

router.post('/create_request', createRequest)