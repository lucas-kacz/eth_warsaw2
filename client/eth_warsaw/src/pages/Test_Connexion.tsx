import { useState } from "react";
import {
    RequestNetwork,
    Types,
    Utils,
} from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { storageChains } from "../config/storage_chain";
import { currencies } from "../config/currency";
import { ethers } from "ethers";

interface RouterProps {
    web3auth: any;
    account: string;
    provider: any;
}

export default function Home({ web3auth, account, provider }: RouterProps){
    const [storageChain, setStorageChain] = useState("5");
    const [expectedAmount, setExpectedAmount] = useState("");
    const [currency, setCurrency] = useState(
      "5_0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc"
    );

    const payeeIdentity = '0x7eB023BFbAeE228de6DC5B92D0BeEB1eDb1Fd567';
    const payerIdentity = '0x519145B771a6e450461af89980e5C17Ff6Fd8A92';
    const paymentRecipient = payeeIdentity;
    const feeRecipient = '0x519145B771a6e450461af89980e5C17Ff6Fd8A92';

    async function createRequest() {
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/075ae4ce228c4dde8c04b5d527e6c3a0");
        const signatureProvider = new Web3SignatureProvider(provider)
        
        const requestClient = new RequestNetwork({
            nodeConnectionConfig: {
            baseURL: storageChains.get(storageChain)!.gateway,
            },
            signatureProvider,
        });


        const requestCreateParameters: Types.ICreateRequestParameters = {
            requestInfo: {
    
                // The currency in which the request is denominated
                currency: {
                  type: Types.RequestLogic.CURRENCY.ERC20,
                  value: '0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc',
                  network: 'goerli',
                },
                
                // The expected amount as a string, in parsed units, respecting `decimals`
                // Consider using `parseUnits()` from ethers or viem
                expectedAmount: '1000000000000000000',
                
                // The payee identity. Not necessarily the same as the payment recipient.
                payee: {
                  type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
                  value: payeeIdentity,
                },
                
                // The payer identity. If omitted, any identity can pay the request.
                payer: {
                  type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
                  value: payerIdentity,
                },
                
                // The request creation timestamp.
                timestamp: Utils.getCurrentTimestampInSecond(),
              },
              
              // The paymentNetwork is the method of payment and related details.
              paymentNetwork: {
                id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
                parameters: {
                  paymentNetworkName: 'goerli',
                  paymentAddress: payeeIdentity,
                  feeAddress: feeRecipient,  
                  feeAmount: '0',
                },
              },
              
              // The contentData can contain anything.
              // Consider using rnf_invoice format from @requestnetwork/data-format
              contentData: {
                reason: '🍕',
                dueDate: '2023.06.16',
              },
              
              // The identity that signs the request, either payee or payer identity.
              signer: {
                type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
                value: payeeIdentity,
            },
        };    

        try{
            const request = await requestClient.createRequest(requestCreateParameters);
            const confirmedRequestData = await request.waitForConfirmation();
        } catch (error) {
            console.log(error)
        }
    
    }

    return(
        <div className="page">
            <h3>Create a request</h3>
            <br/>
            <button onClick={createRequest}>Submit</button>
        </div>
    )
}
