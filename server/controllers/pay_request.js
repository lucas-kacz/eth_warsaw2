const {
    RequestNetwork,
    Types,
    Utils,
  } = require("@requestnetwork/request-client.js");
  const {
    EthereumPrivateKeySignatureProvider,
  } = require("@requestnetwork/epk-signature");
  const {
    approveErc20,
    hasSufficientFunds,
    hasErc20Approval,
    payRequest,
  } = require("@requestnetwork/payment-processor");
  const { providers, Wallet } = require("ethers");
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

async function payUserRequest(req, res){
    try{
        const payeeIdentity = "0x2B1a884Dc7a8f0cc17939928895D9D7cb9146074";
        const payerIdentity = payeeIdentity;
        const paymentRecipient = payeeIdentity;
        const feeRecipient = "0x0000000000000000000000000000000000000000";
      
        const requestCreateParameters = {
          requestInfo: {
            currency: {
              type: Types.RequestLogic.CURRENCY.ERC20,
              value: "0x65aFADD39029741B3b8f0756952C74678c9cEC93",
              network: "goerli",
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
              paymentNetworkName: "goerli",
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
        let requestData = await request.waitForConfirmation();
        console.log(`Created Request: ${JSON.stringify(requestData)}`);
      
        const provider = new providers.JsonRpcProvider(
          "https://ethereum-goerli.publicnode.com",
        );
        const payerWallet = new Wallet(
          "0x75183db23f10504c6aca36ebb3ef2f0bfb6d74b136f014b9c0f74904b2ee1423", // Must have 0x prefix
          provider,
        );
      
        console.log(
          `Checking if payer ${payerWallet.address} has sufficient funds...`,
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
          `Checking if payer ${payerWallet.address} has sufficient approval...`,
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