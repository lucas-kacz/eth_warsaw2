import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RPC from "../utils/ethersRPC"
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { create } from "domain";
import { Button } from "@nextui-org/react";

interface RouterProps {
    web3auth: any;
    account: any;
}

const InvoicePaymentCreate = ({ web3auth, account }: RouterProps) => {

    const { RequestNetwork } = require("@requestnetwork/request-client.js")
    const {EthereumPrivateKeySignatureProvider} = require("@requestnetwork/epk-signature");
    const { Types, Utils } = require("@requestnetwork/request-client.js"); 

    const [loggedIn, setLoggedIn] = useState(false);
    const [payeeIdentity, setPayeeIdentity] = useState("")
    const [privateKey, setPrivateKey] = useState("");

    const navigate = useNavigate();

    const paymentRecipient = payeeIdentity;
    const payerIdentity = payeeIdentity;
    const feeRecipient = "0x0000000000000000000000000000000000000000";

    console.log("privateKey3: ", privateKey);

    useEffect(() => {
        getPrivateKey();
      }, [web3auth.provider]);

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
      await fetch("http://127.0.0.1:3000/api/createRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(epkSignatureProvider),
      })
        .then((response) => response.json())
        .then((data) => {
            console.log("data:", data);
          })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    return(
        <div className="page">
            <h1>Invoice Payment Create</h1>
            <input type="text" name="payeeIdentity" onChange={(e) => setPayeeIdentity(e.target.value)}></input>
            <br/>
            {payeeIdentity}
            <br/>
            {privateKey}
            <br/>
            <Button onClick={createPayment}>Create Payment</Button>
        </div>
    )
}

export default InvoicePaymentCreate