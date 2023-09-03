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
    const [privateKey, setPrivateKey] = useState("");
    const [brands, setBrands] = useState<any>([]);
    const [payer, setPayer] = useState<any>(null);
    const [currency, setCurrency] = useState<any>(null);
    const [amount, setAmount] = useState<any>(null);
	const [selectedPayer, setSelectedPayer] = useState<any>([]);
	const [reason, setReason] = useState<any>(null);
	const [dueDate, setDueDate] = useState<any>(null);

    const allCurrencies = {
		ETH: "ethereum",
		USDC: "usdc",
		GOERLI: "goerli",
	};

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

    async function createPayment() {
		const requestData = {
			prvKey: privateKey,
			payeeIdentity: account,
			payerIdentity: selectedPayer[0],
			currency: currency,
			amount: amount
		}
		console.log(JSON.stringify(requestData))
		await fetch("http://localhost:5000/api/create_request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestData),
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
		var selectedPayer: any = [];
		base('Data').select({
			view: "Grid view",
		}).eachPage(function page(records: any, fetchNextPage: any) {
			records.forEach(function(record: any) {
				brands.push(record.get('brand'));
				selectedPayer.push(record.get('address'));
			});
			fetchNextPage();
		}, function done(err: any) {
			 if (err) { console.error(err); return; }
		});
		setBrands(brands);
		setSelectedPayer(selectedPayer);
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
					onChange={(e) => {
						let crypto : number = parseInt(e.target.value)
						setCurrency(Object.values(allCurrencies)[crypto]);
					}}
				>
					{Object.keys(allCurrencies).map((currencyKey, index) => (
						<SelectItem key={index} value={currencyKey}>
							{currencyKey}
						</SelectItem>
					))}
				</Select>
                <Input
                  label="Amount"
                  placeholder="Enter an amount"
                  className="max-w-xs width-25"
                  onChange={(e) => setAmount(e.target.value)}
                />
				<Input
                  label="Reason"
                  placeholder="Enter the reason"
                  className="max-w-xs width-25"
                  onChange={(e) => setReason(e.target.value)}
                />
				<Input
                  label="Due Date"
                  placeholder="Enter a due date (YYYY.MM.DD)"
                  className="max-w-xs width-25"
                  onChange={(e) => setDueDate(e.target.value)}
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