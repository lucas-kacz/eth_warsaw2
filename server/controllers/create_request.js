const {
    RequestNetwork,
    Types,
    Utils,
  } = require("@requestnetwork/request-client.js");
  const {
    EthereumPrivateKeySignatureProvider,
  } = require("@requestnetwork/epk-signature");
  const { config } = require("dotenv");

  // Load environment variables from .env file (without overriding variables already set)
  config();

  const epkSignatureProvider = new EthereumPrivateKeySignatureProvider({
    method: Types.Signature.METHOD.ECDSA,
    privateKey: "0x75183db23f10504c6aca36ebb3ef2f0bfb6d74b136f014b9c0f74904b2ee1423", // Must include 0x prefix
  });

  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://goerli.gateway.request.network/",
    },
    signatureProvider: epkSignatureProvider,
  });

async function createRequest(req, res){
    try{
        const payeeIdentity = "0x2B1a884Dc7a8f0cc17939928895D9D7cb9146074";
        const payerIdentity = payeeIdentity;
        const paymentRecipient = payeeIdentity;
        const feeRecipient = "0x0000000000000000000000000000000000000000";
        
        const requestCreateParameters = {
            requestInfo: {
            currency: {
                type: Types.RequestLogic.CURRENCY.ERC20,
                value: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
                network: "alfajores",
            },
            expectedAmount: "10",
            payee: {
                type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
                value: payeeIdentity,
            },
            payer: {
                type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
                value: payerIdentity,
            },
            timestamp: Utils.getCurrentTimestampInSecond(),
            },
            paymentNetwork: {
            id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
            parameters: {
                paymentNetworkName: "alfajores",
                paymentAddress: paymentRecipient,
                feeAddress: feeRecipient,
                feeAmount: "0",
            },
            },
            contentData: {
            reason: "🍕",
            dueDate: "2023.06.16",
            },
            signer: {
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: payeeIdentity,
            },
        };        

        const request = await requestClient.createRequest(requestCreateParameters);
        const requestData = await request.waitForConfirmation();
        console.log(JSON.stringify(requestData))        

        res.status(200)
        res.json(requestData)
    } catch (error) {
        res.status(500)
        res.json({error : error.message})
    }
}

  
module.exports = {
    createRequest
}