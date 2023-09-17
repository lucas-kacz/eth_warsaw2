// const providerURL = process.env.INFURA_API_KEY
var { Web3 } = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/3af4e458905a4581879f74b2239a5852"));

const { ERC20ABI } = require('../constants/abi');

const { RequestNetwork, Types } = require("@requestnetwork/request-client.js");
const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
    baseURL: "https://goerli.gateway.request.network/",
    },
});

async function sortAll(data){
    var list = []

    for(var i = 0; i<data.length; i++){
        try{
            var currencyContract = new web3.eth.Contract(ERC20ABI, data[i].currencyInfo.value)

            const tokenName = await currencyContract.methods.name().call()
            const tokenSymbol = await currencyContract.methods.symbol().call()

            console.log(tokenName)

            var requestData = Object()
            requestData.requestId = data[i].requestId
            requestData.currencyAddress = data[i].currencyInfo.value
            requestData.tokenName = tokenName
            requestData.tokenSymbol = tokenSymbol
            requestData.expectedAmount = data[i].expectedAmount
            requestData.payeeAddress = data[i].payee.value
            requestData.payerAddress = data[i].payer.value
            requestData.timestamp = data[i].timestamp
            requestData.balance = data[i].balance.balance

            list.push(requestData)
        } catch(error){
            console.log(error)
            continue;
        }
    }

    return list
}

async function sortPending(data){
    var list = []

   for(var i = 0; i<data.length; i++){
        if(parseInt(data[i].balance.balance) === 0){    
            try{
                var currencyContract = new web3.eth.Contract(ERC20ABI, data[i].currencyInfo.value)

                const tokenName = await currencyContract.methods.name().call()
                const tokenSymbol = await currencyContract.methods.symbol().call()

                console.log(tokenName)

                var requestData = Object()
                requestData.requestId = data[i].requestId
                requestData.currencyAddress = data[i].currencyInfo.value
                requestData.tokenName = tokenName
                requestData.tokenSymbol = tokenSymbol
                requestData.expectedAmount = data[i].expectedAmount
                requestData.payeeAddress = data[i].payee.value
                requestData.payerAddress = data[i].payer.value
                requestData.timestamp = data[i].timestamp
                requestData.balance = parseInt(data[i].balance.balance)

                // if(data[i].balance.balance === 0 || data[i].balance.balance === null){
                //     list.push(requestData)
                // } else {
                //     console.log("error")
                // }
                list.push(requestData)
                
            } catch(error){
                console.log(error)
                continue;
            }
        }
    }

    return list
}

async function sortPaid(data){
    var list = []

   for(var i = 0; i<data.length; i++){
        if(parseInt(data[i].balance.balance) > 0){    
            try{
                var currencyContract = new web3.eth.Contract(ERC20ABI, data[i].currencyInfo.value)

                const tokenName = await currencyContract.methods.name().call()
                const tokenSymbol = await currencyContract.methods.symbol().call()

                console.log(tokenName)

                var requestData = Object()
                requestData.requestId = data[i].requestId
                requestData.currencyAddress = data[i].currencyInfo.value
                requestData.tokenName = tokenName
                requestData.tokenSymbol = tokenSymbol
                requestData.expectedAmount = data[i].expectedAmount
                requestData.payeeAddress = data[i].payee.value
                requestData.payerAddress = data[i].payer.value
                requestData.timestamp = data[i].timestamp
                requestData.balance = parseInt(data[i].balance.balance)

                // if(data[i].balance.balance === 0 || data[i].balance.balance === null){
                //     list.push(requestData)
                // } else {
                //     console.log("error")
                // }
                list.push(requestData)
                
            } catch(error){
                console.log(error)
                continue;
            }
        }
    }

    return list
}

async function retrievePendingRequest(req, res){
    try{
        const identity = req.params.address;
        const requests = await requestClient.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: identity,
        });
        const requestDatas = requests.map((request) => request.getData());

        const data = await sortPending(requestDatas)
        //console.log(JSON.stringify(requestDatas));

        res.status(200)
        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({error : error.message})
    }
}

async function retrievePaidRequests(req, res){
    try{
        const identity = req.params.address;
        const requests = await requestClient.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: identity,
        });
        const requestDatas = requests.map((request) => request.getData());

        const data = await sortPaid(requestDatas)
        //console.log(JSON.stringify(requestDatas));

        res.status(200)
        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({error : error.message})
    }
}

async function retrieveRequest(req, res){
    try{
        const identity = "0x2B1a884Dc7a8f0cc17939928895D9D7cb9146074";
        const requests = await requestClient.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: identity,
        });
        const requestDatas = requests.map((request) => request.getData());

        const data = await sortAll(requestDatas)
        //console.log(JSON.stringify(requestDatas));

        res.status(200)
        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({error : error.message})
    }
}

module.exports = {
    retrieveRequest,
    retrievePendingRequest,
    retrievePaidRequests
}