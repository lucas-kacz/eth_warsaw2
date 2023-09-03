
const { RequestNetwork, Types } = require("@requestnetwork/request-client.js");
const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
    baseURL: "https://goerli.gateway.request.network/",
    },
});
  

async function sortResponse(data){
    var list = []

    for(var i = 0; i<data.length; i++){

        var requestData = Object()
        requestData.requestId = data[i].requestId
        requestData.currency = data[i].currency
        requestData.expectedAmount = data[i].expectedAmount
        requestData.payeeAddress = data[i].payee.value
        requestData.payerAddress = data[i].payer.value
        requestData.timestamp = data[i].timestamp
        requestData.balance = data[i].balance.balance

        list.push(requestData)
    }

    return list
}

async function retrieveRequest(req, res){
    try{
        const identity = "0x2B1a884Dc7a8f0cc17939928895D9D7cb9146074";
        const requests = await requestClient.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: identity,
        });
        const requestDatas = requests.map((request) => request.getData());

        const data = await sortResponse(requestDatas)
        //console.log(JSON.stringify(requestDatas));

        res.status(200)
        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({error : error.message})
    }
}

module.exports = {
    retrieveRequest
}