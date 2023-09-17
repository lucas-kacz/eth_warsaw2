import { useEffect, useState } from "react";
import { NextUIProvider, Button, Spinner, User } from "@nextui-org/react";
import { Web3Auth } from "@web3auth/modal";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { BrowserRouter, Link } from "react-router-dom";
import Router from "./Router";
import RPC from "./utils/ethersRPC";

// Plugins
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";

// Adapters

// import { WalletConnectV1Adapter } from "@web3auth/wallet-connect-v1-adapter";
import {
  WalletConnectV2Adapter,
  getWalletConnectV2Settings,
} from "@web3auth/wallet-connect-v2-adapter";

import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";

const clientId = process.env.REACT_APP_CLIENT_ID || "";

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [torusPlugin, setTorusPlugin] =
    useState<TorusWalletConnectorPlugin | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [loggedIn, setLoggedIn] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x5",
            rpcTarget: process.env.REACT_APP_INFURA_LINK || "",
          },
          uiConfig: {
            appName: "W3A",
            appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
            theme: "light",
            loginMethodsOrder: ["apple", "google", "twitter"],
            defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
            loginGridCol: 3,
            primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
          },
          web3AuthNetwork: "testnet",
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "optional",
          },
          adapterSettings: {
            uxMode: "redirect", // "redirect" | "popup"
            whiteLabel: {
              name: "Your app Name",
              logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
              defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
              dark: false, // whether to enable dark mode. defaultValue: false
            },
            mfaSettings: {
              deviceShareFactor: {
                enable: true,
                priority: 1,
                mandatory: true,
              },
              backUpShareFactor: {
                enable: true,
                priority: 2,
                mandatory: false,
              },
              socialBackupFactor: {
                enable: true,
                priority: 3,
                mandatory: false,
              },
              passwordFactor: {
                enable: true,
                priority: 4,
                mandatory: false,
              },
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);

        // adding torus wallet connector plugin

        const torusPlugin = new TorusWalletConnectorPlugin({
          torusWalletOpts: {},
          walletInitOptions: {
            whiteLabel: {
              theme: { isDark: true, colors: { primary: "#00a8ff" } },
              logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            },
            useWalletConnect: true,
            enableLogging: true,
          },
        });
        setTorusPlugin(torusPlugin);
        await web3auth.addPlugin(torusPlugin);

        // adding wallet connect v2 adapter
        const defaultWcSettings = await getWalletConnectV2Settings(
          "eip155",
          [1, 137, 5],
          "04309ed1007e77d1f119b85205bb779d"
        );
        const walletConnectV2Adapter = new WalletConnectV2Adapter({
          adapterSettings: { ...defaultWcSettings.adapterSettings },
          loginSettings: { ...defaultWcSettings.loginSettings },
        });

        web3auth.configureAdapter(walletConnectV2Adapter);

        // adding metamask adapter
        const metamaskAdapter = new MetamaskAdapter({
          clientId,
          sessionTime: 86400, // 1 day in seconds
          web3AuthNetwork: "testnet",
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x5",
            rpcTarget: process.env.REACT_APP_INFURA_LINK || "",
          },
        });
        // we can change the above settings using this function
        metamaskAdapter.setAdapterSettings({
          sessionTime: 86400, // 1 day in seconds
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x5",
            rpcTarget: process.env.REACT_APP_INFURA_LINK || "",
          },
          web3AuthNetwork: "testnet",
        });

        // it will add/update  the metamask adapter in to web3auth class
        web3auth.configureAdapter(metamaskAdapter);

        const torusWalletAdapter = new TorusWalletAdapter({
          clientId,
        });

        // it will add/update  the torus-evm adapter in to web3auth class
        web3auth.configureAdapter(torusWalletAdapter);

        setWeb3auth(web3auth);

        await web3auth.initModal();

        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      if (!web3auth) {
        return("web3auth not initialized yet");
      }
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setLoading(false);
      setLoggedIn(true);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    setLoading(true);
    if (!web3auth) {
      return("web3auth not initialized yet");
    }
    await web3auth.logout();
    setLoading(false);
    window.location.href = "/";
    setProvider(null);
    setLoggedIn(false);
  };

  const getPrivateKey = async () => {
    try {
      if (!provider || !web3auth) {
          return;
      }
      const rpc = new RPC(provider);
      const privateKey = await rpc.getPrivateKey();
      setPrivateKey(privateKey);
    } catch (error) {
      console.error(error);
    }
  };

  const getAccounts = async () => {
    try {
      if (!provider || !web3auth) {
          return;
      }
      const rpc = new RPC(provider);
      const accounts = await rpc.getAccounts();
      setAccount(accounts.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const getUserInfo = async () => {
    if(loggedIn) {
      try {
        if (!provider || !web3auth) {
          return("web3auth not initialized yet");
        }
        else {
          try {
          const user = await web3auth.getUserInfo();
          setUser(user)
          return(user);
          }
          catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if(loggedIn) {
      try {
        getPrivateKey();
        getAccounts();
        getUserInfo();
      } catch (error) {
        console.error(error);
      }
    }
  }, [provider, web3auth, loggedIn]);

  const handleMouseEnter = () => {
    if(loggedIn) setShowSubElements(true);
  };

  const handleMouseLeave = () => {
    if(loggedIn) setShowSubElements(false);
  };

  const [showSubElements, setShowSubElements] = useState(false);

  interface RouterProps {
    logout: () => void;
    login: () => void;
    user: any;
  }

  const Navbar = ({ logout, login, user }: RouterProps) => {
    return (
      <nav>
        <ul className="navbar">
          {
            loading ? (
              <li>
                <Spinner color="default" />
              </li>
            )
            :
            (
              <>
              {
                loggedIn ? (
                  <>
                    {
                      user !== null &&
                      <>
                        {
                          user.profileImage === undefined ?
                          <div className="flex-100 radius-full margin-bottom-50">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png" alt="profileImage" width="40" height="40" />
                            <User
                              name={user.email.split("@")[0]}
                              description={user.email}
                            />
                          </div>
                          :
                          <div className="flex-100 radius-full margin-bottom-50">
                            <img src={user.profileImage} alt="profileImage" width="40" height="40" />
                            <User
                              name={user.name}
                              description={user.email}
                            />
                          </div>
                        }
                      </>
                    }
                    <li className='navbar_element'>
                      <i className="fa fa-home"></i>
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li
                      className='navbar_element'
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <i className="fa fa-dollar"></i>
                      <Link to="/invoice_payments">Invoice Payments</Link>
                      {showSubElements && (
                        <ul className='navbar_sublist'>
                          <li className='navbar_subelement'>
                            <Link to="/invoice_payment/create">Create Invoice Payment</Link>
                          </li>
                          <li className='navbar_subelement'>
                            <Link to="/invoice_payment/update">Update Invoice Payment</Link>
                          </li>
                          <li className='navbar_subelement'>
                            <Link to="/invoice_payment/pay">Pay Invoice Payment</Link>
                          </li>
                          <li className='navbar_subelement'>
                            <Link to="/invoice_payment/paid">Paid Invoices</Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li className='navbar_element'>
                      <i className="fa fa-address-book"></i>
                      <Link to="/contact">Contacts</Link>
                    </li>
                    <li className='navbar_element navbar_bottom'>
                      <i className="fa fa-info-circle"></i>
                      <Link to="/about_us">About us</Link>
                    </li>
                    <li className='navbar_element navbar_bottom'>
                      <i className="fa fa-cog"></i>
                      <Link to="/settings">Settings</Link>
                    </li>
                  </>
                ) : (
                  <></>
                )
              }
              <li>
                  {
                      loggedIn ? (
                        <Button fullWidth onClick={logout}>Logout</Button>
                      ) : (
                        <Button fullWidth onClick={login}>Login</Button>
                      )
                  }
              </li>
            </>
            )
          }
        </ul>
      </nav>
    );
  }

  return (
    <NextUIProvider>
      <BrowserRouter>
        <Navbar logout={logout} login={login} user={user} />
        <Router web3auth={web3auth} account={account} provider={provider} />
      </BrowserRouter>
    </NextUIProvider>
  );
}

export default App;
