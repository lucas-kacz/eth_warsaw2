interface RouterProps {
    web3auth: any;
    account: string;
}

const InvoicePaymentUpdate = ({ web3auth, account }: RouterProps) => {
    return (
        <div className="page">
            <h1>InvoicePaymentUpdate</h1>
            <p>{account}</p>
        </div>
    )
}

export default InvoicePaymentUpdate