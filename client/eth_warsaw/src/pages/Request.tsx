import { useEffect, useState } from "react";
import RPC from "../utils/ethersRPC"
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";

interface RouterProps {
    web3auth: any;
    privateKey: string;
}

const Request = ({ web3auth, privateKey }: RouterProps) => {

    const [loggedIn, setLoggedIn] = useState(false);
    const { RequestNetwork } = require("@requestnetwork/request-client.js")  

    const {
        EthereumPrivateKeySignatureProvider,
    } = require("@requestnetwork/epk-signature");
    const { Types } = require("@requestnetwork/request-client.js");
    
    const epkSignatureProvider = new EthereumPrivateKeySignatureProvider({
        method: Types.Signature.METHOD.ECDSA,
        privateKey: ("0x"+privateKey).toString(), // Must include 0x prefix
    });


    // const requestClient = new RequestNetwork({
    // nodeConnectionConfig: { 
    //     baseURL: "https://goerli.gateway.request.network/",
    // },
    // signatureProvider: epkSignatureProvider,
    // });

    async function create_request(){

    }

    return(
        <div className="page">
            {privateKey}
        </div>
    )

}

export default Request;