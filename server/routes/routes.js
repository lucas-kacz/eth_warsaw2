const { Router } = require('express')
const { createRequest } = require('../controllers/create_request')
const { payUserRequest } = require('../controllers/pay_request')
const { retrieveRequest, retrievePendingRequest, retrievePaidRequests } = require('../controllers/retrieve_request')
const { getPaidTransactions } = require('../controllers/paid_transactions')

const router = Router()

module.exports = router


router.post('/create_request', createRequest)

router.post('/pay_request', payUserRequest)

router.get('/retrieve_requests/:address', retrieveRequest)

router.get('/retrieve_pending_requests/:address', retrievePendingRequest)

router.get('/retrieve_paid_requests/:address', retrievePaidRequests)

router.get('/get_paid_transactions/:address', getPaidTransactions)
