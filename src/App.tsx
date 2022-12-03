import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { AuthProvider, PaperClient } from "@paperxyz/embedded-wallet-sdk";
import { ethers } from "ethers";

function App() {
  const [paper, setPaper] = useState<PaperClient>();
  const [userStatus, setUserStatus] = useState<any>();
  const [user, setUser] = useState<any>();
  const [userWithWallet, setUserWithWallet] = useState<any>();
  const [emailAddress, setEmailAddress] = useState<string>();

  useEffect(() => {
    const paper = new PaperClient({
      clientId: "be9256b7-9e2b-405b-a1fa-a510275ff902",
      chain: "Polygon",
      // Optional: custom CSS styling properties:
      styles: {
        colorBackground: "#202020",
        colorText: "white",
        colorPrimary: "purple",
        borderRadius: 5,
      },
    });
    setPaper(paper);
  }, []);

  const fetchUserStatus = useCallback(async () => {
    if (!paper) {
      return;
    }

    const paperUserStatus = await paper.getUserStatus();
    setUserStatus(paperUserStatus);
    setUser(await paper.auth.getDetails());

    if (!paperUserStatus.wallet.isOnNewDevice) {
      const paperUserWithWallet = await paper.getUser();
      setUserWithWallet(paperUserWithWallet);
    }
  }, [paper]);

  useEffect(() => {
    if (paper && fetchUserStatus) {
      fetchUserStatus();
    }
  }, [paper, fetchUserStatus]);

  const loginWithEmail = async () => {
    const result = await paper!.auth.loginWithOTP({
      email: emailAddress,
    });
    console.log(`loginWithEmail result: ${result}`);
  };

  const loginWithGoogle = async () => {
    if (!paper) {
      return;
    }
    await paper.auth.loginWithSocialOAuth({
      provider: AuthProvider.GOOGLE,
      redirectUri: "http://localhost:3001",
    });
  };

  const googleCallback = async () => {
    if (!paper) {
      return;
    }
    const resp = await paper.auth.loginWithSocialOAuthCallback({
      provider: AuthProvider.GOOGLE,
      redirectUri: "http://localhost:3001",
    });
    console.log("googleCallback response", resp);
  };

  const activateWallet = async () => {
    const response = await paper!.getUser();
    console.log("response from activateWallet", response);
  };

  const getAuthDetails = async () => {
    const response = await paper!.auth.getDetails();
    console.log("response from getAuthDetails", response);
  };

  const getAddress = async () => {
    const wallet = userWithWallet.wallet;
    const signer = await wallet?.getEtherJsSigner();
    const address = await signer?.getAddress();
    console.log("address", address);
  };
  const signMessage = async () => {
    const wallet = userWithWallet.wallet;
    const signer = await wallet?.getEtherJsSigner({
      rpcEndpoint: "mainnet",
    });
    const signedMessage = await signer?.signMessage("hello world");
    console.log("signedMessage", signedMessage);
  };

  const signTransactionEth = async () => {
    const wallet = userWithWallet.wallet;
    const signer = await wallet?.getEtherJsSigner({
      rpcEndpoint: "mainnet",
    });
    const tx = {
      to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      value: ethers.utils.parseEther("0.1"),
    };
    const signedTransaction = await signer?.signTransaction(tx);
    console.log("signedTransaction", signedTransaction);
  };

  const signTransactionGoerli = async () => {
    const wallet = userWithWallet.wallet;
    const signer = await wallet?.getEtherJsSigner({
      rpcEndpoint: "goerli",
    });
    const tx = {
      to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      value: ethers.utils.parseEther("0.1"),
    };
    const signedTransaction = await signer?.signTransaction(tx);
    console.log("signedTransaction", signedTransaction);
  };

  const callContractGasless = async () => {
    const params = {
      contractAddress: "0xb2369209b4eb1e76a43fAd914B1d29f6508c8aae",
      method: {
        args: [userWithWallet?.walletAddress ?? "", 1, 0],
        stub: "function claimTo(address _to, uint256 _tokeIt, uint256 _quantity) external" as const,
      },
    };
    console.log("params", params);
    try {
      const result = await user?.writeTo.contract(params);
      console.log("transactionHash", result?.transactionHash);
    } catch (e) {
      console.error(`something went wrong sending gasless transaction ${e}`);
    }
  };

  const logout = async () => {
    const response = await paper!.auth.logout();
    console.log("logout response", response);
  };

  return (
    <div className="App">
      <h1>Wallets + Auth demo</h1>
      {!userStatus ? (
        <>Loading...</>
      ) : !userStatus.isLoggedIn ? (
        <>
          <input
            type="text"
            placeholder="Email address"
            onChange={(e) => {
              setEmailAddress(e.target.value);
            }}
          />
          <button onClick={loginWithEmail}>Log in with Email</button>
          <br /> - OR - <br />
          <button onClick={loginWithGoogle}>Log in with Google</button>
        </>
      ) : userStatus?.wallet.isOnNewDevice ? (
        <>
          Successfully authenticated. Wallet not found on current device.
          <br />
          <br />
          Authenticated email: {user?.email}
          <br />
          <br />
          <button onClick={activateWallet}>
            Activate wallet on this device
          </button>
        </>
      ) : (
        <>
          Successfully authenticated and wallet ready to use on this device.
          <br />
          <br />
          Authenticated email: {user?.email}
          <br />
          Wallet address:
          <br />
          <br />
          Wallet features:
          <br />
          <button
            onClick={getAddress}
            className="m-2 rounded-xl bg-orange-600 px-4 py-2 hover:bg-orange-700 active:bg-orange-800"
          >
            GetAddress
          </button>
          <button
            onClick={signMessage}
            className="m-2 rounded-xl bg-orange-600 px-4 py-2 hover:bg-orange-700 active:bg-orange-800"
          >
            SignMessage
          </button>
          <button
            onClick={signTransactionEth}
            className="m-2 rounded-xl bg-orange-600 px-4 py-2 hover:bg-orange-700 active:bg-orange-800"
          >
            SignTransaction Eth
          </button>
          <button
            onClick={signTransactionGoerli}
            className="m-2 rounded-xl bg-orange-600 px-4 py-2 hover:bg-orange-700 active:bg-orange-800"
          >
            SignTransaction Goerli
          </button>
          <button
            onClick={callContractGasless}
            className="m-2 rounded-xl bg-orange-600 px-4 py-2 hover:bg-orange-700 active:bg-orange-800"
          >
            Call contract method (gasless)
          </button>
          <button
            onClick={getAuthDetails}
            className="m-2 rounded-xl bg-orange-600 px-4 py-2 hover:bg-orange-700 active:bg-orange-800"
          >
            Get Auth Details
          </button>
          <button
            onClick={logout}
            className="m-2 rounded-xl bg-orange-600 px-4 py-2 hover:bg-orange-700 active:bg-orange-800"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default App;
