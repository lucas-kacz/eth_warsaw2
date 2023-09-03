import React, { useState, useEffect } from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import RPC from "../utils/ethersRPC"

interface RouterProps {
    web3auth: any;
    account: any;
}

const PaidInvoices = ({ web3auth, account }: RouterProps) => {
    const [invoices, setInvoices] = useState<any>([]);
    const [privateKey, setPrivateKey] = useState<any>(null);

    const getInvoices = async () => {
        try{
            await fetch(`http://localhost:5000/api/retrieve_paid_requests/0x2B1a884Dc7a8f0cc17939928895D9D7cb9146074`, {
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

    return (
        <div className="page">
            <h1>Paid Invoices</h1>
            <br />
            <Table aria-label="My invoices">
                <TableHeader>
                    <TableColumn>Id</TableColumn>
                    <TableColumn>Brand</TableColumn>
                    <TableColumn>Amount</TableColumn>
                </TableHeader>
                <TableBody>
                {invoices.map((invoice: any) => (
                    <TableRow key={invoice.id}>
                        <TableCell>{invoice.requestId}</TableCell>
                        <TableCell>{invoice.payeeAddress}</TableCell>
                        <TableCell>{invoice.expectedAmount}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default PaidInvoices;