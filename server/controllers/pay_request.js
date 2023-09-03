const { RequestNetwork, Types, Utils } = require("@requestnetwork/request-client.js");
const { EthereumPrivateKeySignatureProvider } = require("@requestnetwork/epk-signature");
const { approveErc20, hasSufficientFunds, hasErc20Approval, payRequest } = require("@requestnetwork/payment-processor");
const { providers, Wallet } = require("ethers");
const { config } = require("dotenv");

// Load environment variables from .env file (without overriding variables already set)
config();

const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
    baseURL: "https://goerli.gateway.request.network/",
    },
});

async function payUserRequest(req, res){
    try {
		console.log("REQUETE ID", req.body.id)
		console.log("PRIVATE KEY", req.body.prvKey)
		const invoiceFromRequestID = await requestClient.fromRequestId(req.body.id);

		const requestData = invoiceFromRequestID.getData();

		console.log(requestData);

        const provider = new providers.JsonRpcProvider(
          	"https://ethereum-goerli.publicnode.com",
        );
        const payerWallet = new Wallet(
          	req.body.prvKey, // Must have 0x prefix
          	provider,
        );
      
        console.log(
          	`Checking if payer ${payerWallet.address} has sufficient funds...,`
        );
        const _hasSufficientFunds = await hasSufficientFunds(
			requestData,
			payerWallet.address,
			{
				provider: provider,
			},
        );
        console.log(`_hasSufficientFunds = ${_hasSufficientFunds}`);
        if (!_hasSufficientFunds) {
          	throw new Error(`Insufficient Funds: ${payerWallet.address}`);
        }
      
        console.log(
          `Checking if payer ${payerWallet.address} has sufficient approval...,`
        );
        const _hasErc20Approval = await hasErc20Approval(
			requestData,
			payerWallet.address,
			provider,
        );
        console.log(`_hasErc20Approval = ${_hasErc20Approval}`);
        if (!_hasErc20Approval) {
			console.log(`Requesting approval...`);
			const approvalTx = await approveErc20(requestData, payerWallet);
			await approvalTx.wait(2);
			console.log(`Approval granted. ${approvalTx.hash}`);
        }
      
        const paymentTx = await payRequest(requestData, payerWallet);
        await paymentTx.wait(2);
        console.log(`Payment complete. ${paymentTx.hash}`);
      
        let startTime = Date.now();
        while (requestData.balance?.balance < requestData.expectedAmount) {
			requestData = await request.refresh();
			console.log(`current balance = ${requestData.balance?.balance}`);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			// Check if 5 seconds have passed, and if so, break out of the loop
			if (Date.now() - startTime >= 5000) {
				console.log("Timeout: Exiting loop after 5 seconds.");
				break;
			}
        }

        res.status(200)
        res.json(requestData)
    } catch(error) {
        res.status(500)
        res.json({error : error.message})
    }
  }

module.exports = {
	payUserRequest
}