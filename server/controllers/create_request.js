const { RequestNetwork, Types, Utils } = require("@requestnetwork/request-client.js");
const { EthereumPrivateKeySignatureProvider } = require("@requestnetwork/epk-signature");
const currencies = require("./cryptoCurrencies.json");

async function createRequest(req, res) {
	function getValueByNetwork(networkName) {
		const networkEntry = currencies.find(entry => entry.network === networkName);
		return networkEntry ? networkEntry.value : null;
	}
  	try {
		console.log("PRVKEY", req.body.prvKey)
		console.log("PAYEEIDENTITY", req.body.payeeIdentity)
		console.log("PAYERIDENTITY", req.body.payerIdentity)
		console.log("CURRENCY_NETWORK", req.body.currency)
		console.log("CURRENCY_VALUE", getValueByNetwork(req.body.currency))
		console.log("AMOUNT", req.body.amount)
		console.log("DUEDATE", req.body.dueDate)
		console.log('REASON', req.body.reason)

		const epkSignatureProvider = new EthereumPrivateKeySignatureProvider({
			method: Types.Signature.METHOD.ECDSA,
			privateKey: req.body.prvKey,
		});

		const requestClient = new RequestNetwork({
			nodeConnectionConfig: {
				baseURL: "https://goerli.gateway.request.network/",
			},
			signatureProvider: epkSignatureProvider,
		});

		const payeeIdentity = req.body.payeeIdentity;
		const payerIdentity = req.body.payerIdentity;
		const paymentRecipient = req.body.payerIdentity;
		const feeRecipient = "0x0000000000000000000000000000000000000000";
      
      	const requestCreateParameters = {
			requestInfo: {
				currency: {
					type: Types.RequestLogic.CURRENCY.ERC20,
					value: getValueByNetwork(req.body.currency),
					network: 'goerli',
				},
          		expectedAmount: req.body.amount,
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
					paymentNetworkName: 'goerli',
					paymentAddress: paymentRecipient,
					feeAddress: feeRecipient,
					feeAmount: "0",
				},
			},
			contentData: {
				reason: req.body.reason,
				dueDate: req.body.dueDate,
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