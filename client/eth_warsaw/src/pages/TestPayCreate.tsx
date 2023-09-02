import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RPC from "../utils/ethersRPC"
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { create } from "domain";
import { Button } from "@nextui-org/react";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { RequestNetwork } from "@requestnetwork/request-client.js"

import { storageChains } from "../config/storage_chain";

const {EthereumPrivateKeySignatureProvider} = require("@requestnetwork/epk-signature");
const { Types, Utils } = require("@requestnetwork/request-client.js"); 

interface RouterProps {
    web3auth: any;
    account: string;
    provider: any;
}

const InvoiceTest = ({ web3auth, account, provider }: RouterProps) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [payeeIdentity, setPayeeIdentity] = useState("")
    const [privateKey, setPrivateKey] = useState("");
    const [storageChain, setStorageChain] = useState("5");

    const navigate = useNavigate();

    const paymentRecipient = payeeIdentity;
    const payerIdentity = payeeIdentity;
    const feeRecipient = "0x0000000000000000000000000000000000000000";
    
    const signatureProvider = new Web3SignatureProvider(provider)

    console.log(provider)
    console.log("privateKey3: ", privateKey);

    // useEffect(() => {
    //     getPrivateKey();
    //   }, [web3auth.provider]);


    const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: storageChains.get(storageChain)!.gateway,
        },
        // signatureProvider,
        // httpConfig: {
        //   getConfirmationMaxRetry: 40, // timeout after 120 seconds
        // },
      });

    const getPrivateKey = async () => {
        if (!web3auth.provider) {
            console.log("No provider")
            return;
        }
        const rpc = new RPC(web3auth.provider);
        const privateKey = await rpc.getPrivateKey();
        setPrivateKey(('0x'+privateKey));
        console.log(typeof(privateKey))
        console.log("privateKey1Create:", privateKey);
      };
    
    const epkSignatureProvider = new EthereumPrivateKeySignatureProvider({
        method: Types.Signature.METHOD.ECDSA,
        privateKey: "0x10adcce71a2b0c4c4c31c257ea0555f9a1ccdb99b6a91e3e8e930124c0c6995a",
    });

        async function createPayment(){
            // const request = await requestClient.createRequest(requestCreateParameters)
            // const requestData = await request.waitForConfirmation();
            // console.log(JSON.stringify(requestData));
        }

        // useEffect(() => {
        //     if(web3auth){
        //         // const web3SignatureProvider = new Web3SignatureProvider(web3auth.provider)
        //         // setWeb3SignatureProvider(web3SignatureProvider)
        //         console.log("provider : " + web3auth.provider)
        //     }
        // }, [web3auth])

    return(
        <div className="page">
            <h1>Invoice Payment Create</h1>
            {/* <input type="text" name="payeeIdentity" onChange={(e) => setPayeeIdentity(e.target.value)}></input>
            <br/>
            {payeeIdentity}
            <br/>
            {privateKey}
            <br/> */}
            {/* <button onClick={getPrivateKey}>Get Private Key</button> */}
            {/* <Button onClick={createPayment}>Create Payment</Button> */}
        </div>
    )
}

export default InvoiceTest