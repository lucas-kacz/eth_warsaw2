const { Router } = require('express')
const { createRequest } = require('../controllers/create_request')
const { payUserRequest } = require('../controllers/pay_request')
const { retrieveRequest, retrievePendingRequest, retrievePaidRequests } = require('../controllers/retrieve_request')
const { getPaidTransactions } = require('../controllers/paid_transactions')
const { initSession } = require('../controllers/initKYBsession')

const router = Router()

module.exports = router


router.post('/create_request', function(req, res){
    createRequest(req, res)
})

router.post('/pay_request', function(req, res){
    payUserRequest(req, res)
})

router.get('/retrieve_requests/:address', retrieveRequest)

router.get('/retrieve_pending_requests/:address', retrievePendingRequest)

router.get('/retrieve_paid_requests/:address', retrievePaidRequests)

router.get('/get_paid_transactions/:address', getPaidTransactions)

router.post('/init_session', function(req, res){
    initSession(req, res)
})