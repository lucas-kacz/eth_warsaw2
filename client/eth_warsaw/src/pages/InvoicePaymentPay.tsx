import React, { useState, useEffect } from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip} from "@nextui-org/react";
import RPC from "../utils/ethersRPC"

interface RouterProps {
    web3auth: any;
    account: any;
}



const InvoicePaymentPay = ({ web3auth, account }: RouterProps) => {

    if(web3auth === null) {
        window.location.href = "/";
    }
  
    const [invoices, setInvoices] = useState<any>([]);
    const [privateKey, setPrivateKey] = useState<any>(null);

    const getInvoices = async () => {
        try{
            await fetch(`http://localhost:5000/api/retrieve_pending_requests/0x2B1a884Dc7a8f0cc17939928895D9D7cb9146074`, {
                method:"GET",
            }).then(
                res => res.json()
            ).then(
                data => {
                    setInvoices(data)
                    console.log("ShowTokens : " , data)
                }
            )
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        getInvoices();
    }, []);

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

    async function payInvoice(id : any) {
        const requestData = {
			prvKey: privateKey,
			id: id
		}
        await fetch("http://localhost:5000/api/pay_request", {
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

    return (
        <div className="page">
            <h1>Invoice Payment Pay</h1>
            <br />
            <Table aria-label="My invoices">
                <TableHeader>
                    <TableColumn>Id</TableColumn>
                    <TableColumn>Brand</TableColumn>
                    <TableColumn>Amount</TableColumn>
                    <TableColumn>Pay</TableColumn>
                </TableHeader>
                <TableBody>
                {invoices.map((invoice: any) => (
                    <TableRow key={invoice.id}>
                        <TableCell>{invoice.requestId}</TableCell>
                        <TableCell>{invoice.payeeAddress}</TableCell>
                        <TableCell>{invoice.expectedAmount}</TableCell>
                        <TableCell><button onClick={() => payInvoice(invoice.requestId)}>Pay</button></TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default InvoicePaymentPay;