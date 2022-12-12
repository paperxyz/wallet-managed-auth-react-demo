import {
  AuthProvider,
  ContractCallInputType,
  GetUserStatusType,
  InitializedUser,
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [paper, setPaper] = useState<PaperEmbeddedWalletSdk>();
  const [userDetails, setUserDetails] = useState<GetUserStatusType>();
  const [user, setUser] = useState<InitializedUser>();
  const [emailAddress, setEmailAddress] = useState<string>();

  useEffect(() => {
    const paper = new PaperEmbeddedWalletSdk({
      clientId: "992d8417-9cd1-443c-bae3-f9eac1d64767",
      chain: "Mumbai",
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
    console.log("paperUserStatus", paperUserStatus);
    setUserDetails(paperUserStatus);
    switch (paperUserStatus.status) {
      case UserStatus.LOGGED_IN_WALLET_INITIALIZED: {
        const paperUserWithWallet = await paper.initializeUser();
        setUser(paperUserWithWallet);
      }
    }
  }, [paper]);

  useEffect(() => {
    if (paper && fetchUserStatus) {
      fetchUserStatus();
    }
  }, [paper, fetchUserStatus]);

  const loginWithEmail = async () => {
    const result = await paper?.auth.loginWithOtp({
      email: emailAddress,
    });
    console.log(`loginWithEmail result: ${result}`);
    await fetchUserStatus();
  };

  const loginWithGoogle = async () => {
    await paper?.auth.initializeSocialOAuth({
      provider: AuthProvider.GOOGLE,
      redirectUri: "http://localhost:3001",
    });
  };

  const googleCallback = async () => {
    const resp = await paper?.auth.loginWithSocialOAuth({
      provider: AuthProvider.GOOGLE,
      redirectUri: "http://localhost:3001",
    });
    console.log("googleCallback response", resp);
    await fetchUserStatus();
  };

  const activateWallet = async () => {
    const response = await paper?.initializeUser();
    console.log("response from activateWallet", response);
    await fetchUserStatus();
  };

  const getAddress = async () => {
    const wallet = user?.wallet;
    const signer = await wallet?.getEthersJsSigner();
    const address = await signer?.getAddress();
    console.log("address", address);
  };
  const signMessage = async () => {
    const wallet = user?.wallet;
    const signer = await wallet?.getEthersJsSigner({
      rpcEndpoint: "mainnet",
    });
    const signedMessage = await signer?.signMessage("hello world");
    console.log("signedMessage", signedMessage);
  };

  const signTransactionEth = async () => {
    const wallet = user?.wallet;
    const signer = await wallet?.getEthersJsSigner({
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
    const wallet = user?.wallet;
    const signer = await wallet?.getEthersJsSigner({
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
      methodArgs: [user?.walletAddress ?? "", 1, 0],
      methodInterface:
        "function claimTo(address _to, uint256 _tokeIt, uint256 _quantity) external",
    } as ContractCallInputType;
    console.log("params", params);
    try {
      const result = await user?.wallet.gasless.callContract(params);
      console.log("transactionHash", result?.transactionHash);
    } catch (e) {
      console.error(`something went wrong sending gasless transaction ${e}`);
    }
  };

  const logout = async () => {
    const response = await paper?.auth.logout();
    console.log("logout response", response);
    await fetchUserStatus();
  };

  return (
    <div className="App">
      <h1>Wallets + Auth demo</h1>
      {!userDetails ? (
        <>Loading...</>
      ) : userDetails.status === UserStatus.LOGGED_OUT ? (
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
      ) : userDetails.status === UserStatus.LOGGED_IN_WALLET_UNINITIALIZED ||
        userDetails.status === UserStatus.LOGGED_IN_NEW_DEVICE ? (
        <>
          Successfully authenticated. Wallet not found on current device.
          <br />
          <br />
          Authenticated email: {userDetails.data.authDetails.email}
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
          Authenticated email: {userDetails.data.authDetails.email}
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
