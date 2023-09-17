import { Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import InvoicePaymentCreate from "./pages/InvoicePaymentCreate";
import InvoicePaymentPay from "./pages/InvoicePaymentPay";
import InvoicePaymentUpdate from "./pages/InvoicePaymentUpdate";
import InvoiceTest from "./pages/TestPayCreate";
import Home from "./pages/Test_Connexion";
import AboutUs from "./pages/AboutUs";
import PaidInvoices from "./pages/PaidInvoices";

interface RouterProps {
    web3auth: any;
    account: string;
    provider : any
  }

function Router ({ web3auth, account, provider }: RouterProps) {
    return(
        <Routes>
            <Route path="/" element={<Dashboard web3auth={web3auth} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/invoice_payment/create" element={<InvoicePaymentCreate web3auth={web3auth} account={account} />} />
            <Route path="/invoice_payment/pay" element={<InvoicePaymentPay web3auth={web3auth} account={account} />} />
            <Route path="/invoice_payment/update" element={<InvoicePaymentUpdate web3auth={web3auth} account={account} />} />
            <Route path="/invoice_payment/paid" element={<PaidInvoices web3auth={web3auth} account={account}/>}/>
            <Route path="/about_us" element={<AboutUs />} />
        </Routes>
    )
}

export default Router;