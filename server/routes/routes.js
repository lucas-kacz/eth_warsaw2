const { Router } = require('express')
const { createRequest } = require('../controllers/create_request')
const { payUserRequest } = require('../controllers/pay_request')

const router = Router()

module.exports = router


router.get('/create_request', createRequest)

router.get('/pay_request', payUserRequest)