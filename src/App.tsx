import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { AuthProvider, PaperClient } from "@paperxyz/embedded-wallet-sdk";

function App() {
  const [PaperSdk, setPaperSdk] = useState<PaperClient>();
  const [user, setUser] = useState<any>();
  const [emailAddress, setEmailAddress] = useState<string>();

  useEffect(() => {
    const Paper = new PaperClient({
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
    setPaperSdk(Paper);
  }, []);

  useEffect(() => {
    if (PaperSdk) {
      (async () => {
        const isLoggedIn = await PaperSdk.Auth.isLoggedIn();
        console.log("isLoggedIn is ", isLoggedIn);
        if (isLoggedIn) {
          console.log("auth details is ", await PaperSdk.Auth.getDetails());
          // setUser(await PaperSdk.getUser());
        }
      })();
    }
  }, [PaperSdk]);

  const loginWithEmail = async () => {
    const result = await PaperSdk!.Auth.loginWithOTP({
      email: emailAddress,
    });
    console.log(`loginWithEmail result: ${result}`);
  };

  const loginWithGoogle = async () => {
    if (!PaperSdk) {
      return;
    }
    await PaperSdk.Auth.loginWithSocialOAuth({
      provider: AuthProvider.GOOGLE,
      redirectUri: "http://localhost:3001",
    });
  };

  const googleCallback = async () => {
    if (!PaperSdk) {
      return;
    }
    const resp = await PaperSdk.Auth.loginWithSocialOAuthCallback({
      provider: AuthProvider.GOOGLE,
      redirectUri: "http://localhost:3001",
    });
    console.log("googleCallback response", resp);
  };

  return (
    <div className="App">
      <h1>Wallets + Auth demo</h1>
      {!user ? (
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
      ) : (
        <>
          {user.emailAddress}
          <br />
          {user.walletAddress}
        </>
      )}
    </div>
  );
}

export default App;
