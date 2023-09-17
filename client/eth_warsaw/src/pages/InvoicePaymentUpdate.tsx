import React, { useState, useEffect } from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip} from "@nextui-org/react";

interface RouterProps {
    web3auth: any;
    account: string;
}

const InvoicePaymentUpdate = ({ web3auth, account }: RouterProps) => {

    if(web3auth === null) {
        window.location.href = "/";
    }
  
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
            <h1>Invoice Payment Update</h1>
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
            <br />
            <Chip color='danger' size='lg'>Coming soon</Chip>
        </div>
    )
}

export default InvoicePaymentUpdate