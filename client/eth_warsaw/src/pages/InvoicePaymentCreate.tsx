import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RPC from "../utils/ethersRPC"
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { create } from "domain";
import { Button, Input, Select, SelectItem, Spinner } from "@nextui-org/react";

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
    const [brands, setBrands] = useState<any>([]);
    const [payer, setPayer] = useState<any>(null);
    const [currency, setCurrency] = useState<any>(null);
    const [amount, setAmount] = useState<any>(null);

    const allCurrencies = {
        ETH: "ethereum",
        BTC: "bitcoin",
        USDC: "usdc",
        DAI: "dai",
        USDT: "usdt",
        BUSD: "busd",
        BNB: "bnb",
        GOERLI: "goerli",
        MATIC: "matic",
        POLYGON: "polygon",
        XDAI: "xdai",
        SEPOLIA: "sepolia",
        RINKEBY: "rinkeby",
        KOVAN: "kovan",
        BSC: "bsc",
    }

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

    function getAllBrands() {
        var Airtable = require('airtable');
        Airtable.configure({
            endpointUrl: 'https://api.airtable.com',
            apiKey: process.env.REACT_APP_AIRTABLE_API || "",
        });
        var base = Airtable.base('appFQhXiLloPeeAQC');
        var brands: any = [];
        base('Data').select({
            view: "Grid view",
        }).eachPage(function page(records: any, fetchNextPage: any) {
            records.forEach(function(record: any) {
                brands.push(record.get('brand'));
            });
            fetchNextPage();
        }, function done(err: any) {
            if (err) { console.error(err); return; }
        });
        setBrands(brands);
    }

    useEffect(() => {
        getAllBrands();
    }, []);

    return(
        <div className="page">
            <h1>Invoice Payment Create</h1>
            <br />
            {
              brands.length > 0 &&
              <div className="flex">
                <Select
                  label="Payer"
                  placeholder="Select a brand"
                  className="max-w-xs width-25"
                  onChange={(e) => setPayer(e.target.value)}
                >
                  {brands.map((brand : any, index : any) => (
                    <SelectItem key={index} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Currencies"
                  placeholder="Select a currency"
                  className="max-w-xs width-25"
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {Object.keys(allCurrencies).map((currency : any, index : any) => (
                    <SelectItem key={index} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Amount"
                  placeholder="Enter an amount"
                  className="max-w-xs width-25"
                  onChange={(e) => setAmount(e.target.value)}
                />
                {
                  payer !== null && currency !== null && amount !== null ?
                  <Button onClick={createPayment} className="width-25" color="success">Create Payment</Button>
                  :
                  <Button onClick={createPayment} className="width-25 disabled" disabled>Create Payment</Button>
                }
              </div>
            }
            {
              brands.length === 0 &&
              <Spinner
                color="primary"
              />
            }
        </div>
    )
}

export default InvoicePaymentCreate;