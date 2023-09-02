import React, { useState, useEffect } from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

interface RouterProps {
    web3auth: any;
    account: any;
}

const InvoicePaymentPay = ({ web3auth, account }: RouterProps) => {
    
    const [invoices, setInvoices] = useState<any>([]);

    const getInvoices = async () => {
        const url = '';
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setInvoices(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getInvoices();
    }, []);

    return (
        <div className="page">
            <h1>Invoice Payment Pay</h1>
            <br />
            <Table aria-label="My invoices">
            <TableHeader>
                <TableColumn>Id</TableColumn>
                <TableColumn>Brand</TableColumn>
                <TableColumn>Price</TableColumn>
            </TableHeader>
            <TableBody>
            {invoices.map((invoice: any) => (
                <TableRow key={invoice.id}>
                    <TableCell>{invoice.name}</TableCell>
                    <TableCell>{invoice.role}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                </TableRow>
            ))}
            </TableBody>
            </Table>
        </div>
    )
}

export default InvoicePaymentPay;