interface RouterProps {
    web3auth: any;
    account: any;
}

const InvoicePaymentPay = ({ web3auth, account }: RouterProps) => {
    console.log(account);
    return (
        <div className="page">
            <h1>InvoicePaymentPay</h1>
            <p>{account}</p>
        </div>
    )
}

export default InvoicePaymentPay