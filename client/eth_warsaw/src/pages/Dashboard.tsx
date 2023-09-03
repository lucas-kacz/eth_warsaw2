import { useEffect, useState } from "react";
import RPC from "../utils/ethersRPC";
import { Button, Input, Card, CardBody } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

interface RouterProps {
    web3auth: any;
}

const Dashboard = ({ web3auth }: RouterProps) => {

    const [user, setUser] = useState<any>(null);
    const [address, setAddress] = useState<any>(null);
    const [brand, setBrand] = useState<any>(null);
    const [myBrand, setMyBrand] = useState<any>(null);
    const [role, setRole] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);

    const navigate = useNavigate();

    var Airtable = require('airtable');
    Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: process.env.REACT_APP_AIRTABLE_API || "",
    });
    var base = Airtable.base('appFQhXiLloPeeAQC');

    const checkKYB = async () => {
        setLoading(true);
        var alreadyExists = false;
        if(myBrand !== null) {
            console.log("Brand is not null");
            base('Data').select({
                view: "Grid view",
            }).eachPage(function page(records: any, fetchNextPage: any) {
                records.forEach(function(record: any) {
                    if(record.get('brand') === myBrand || record.get('address') === address) {
                        console.log("already exists");
                        alreadyExists = true;
                    }
                });
                fetchNextPage();
            }, function done(err: any) {
                if (err) { console.error(err); return; }
            });
            if(!alreadyExists && myBrand !== null && address !== null && role !== null) {
                base('Data').create([
                    {
                        "fields": {
                            "address": address,
                            "brand": myBrand,
                            "role": "admin"
                        }
                    }
                ], function(err: any, records: any) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    records.forEach(function (record: any) {
                        console.log(record.getId());
                    });
                });
                setBrand(myBrand);
            }
        }
        else {
            console.log("Brand is null");
            var alreadyExists2 = false;
            base('Data').select({
                view: "Grid view",
            }).eachPage(function page(records: any, fetchNextPage: any) {
                records.forEach(function(record: any) {
                    if(record.get('address') === address) {
                        alreadyExists2 = true;
                        setBrand(record.get('brand'));
                        setRole(record.get('role'));
                    }
                });
                fetchNextPage();
            }, function done(err: any) {
                if (err) { console.error(err); return; }
            });
            if(!alreadyExists2) {
                setBrand("none");
            }
        }
        setLoading(false);
    }

    const getUserInfo = async () => {
        if (!web3auth) {
        return("web3auth not initialized yet");
        }
        const user = await web3auth.getUserInfo();
        setUser(user);
        return(user);
    };

    const getAccounts = async () => {
        if (!web3auth.provider) {
        return("provider not initialized yet");
        }
        console.log(web3auth.provider)
        const rpc = new RPC(web3auth.provider);
        const address = await rpc.getAccounts();
        setAddress(address);
        return(address);
    };

    useEffect(() => {
        if (web3auth) {
            setBrand(null);
            setMyBrand(null);
            setRole(null);
            getAccounts();
            getUserInfo();
            checkKYB();
        }
    }, [web3auth]);

    useEffect(() => {
        if (web3auth) {
            checkKYB();
        }
    }, [address]);

    return (
        <div className="page">
            <h1>Hi {user !== null && user.name}!</h1>
            {
                brand === "none" &&
                <div className="card">
                    <p>You are not KYB verified</p>
                    <Input type="text" name="brand" onChange={(e) => setMyBrand(e.target.value)}></Input>
                    <Button onClick={checkKYB}>Check KYB</Button>
                </div>
            }
            {
                (brand !== "none") &&
                <div className="card">
                    <p>You are KYB verified</p>
                    <p className="uppercase">{role} of {brand}</p>
                </div>
            }
            {
                brand !== "none" &&
                <div className="flex align-left margin-0-auto">
                    <Button onClick={() => navigate("/invoice_payment/create")} size="lg" color="success">
                        <i className="fa fa-plus"></i>
                        Create Invoice Payment
                    </Button>
                    <Button onClick={() => navigate("/invoice_payment/pay")} size="lg" color="secondary">
                        <i className="fa fa-money"></i>
                        Pay Invoice Payment
                    </Button>
                    <Button onClick={() => navigate("/invoice_payment/update")} size="lg" color="primary">
                        <i className="fa fa-edit"></i>
                        Update Invoice Payment
                    </Button>
                </div>
            }
        </div>
    );
}

export default Dashboard;