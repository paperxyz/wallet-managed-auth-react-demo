import {
  Box,
  Button,
  Code,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  AuthProvider,
  GetUserStatusType,
  InitializedUser,
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import { useCallback, useEffect, useState } from "react";
import { Login } from "./Login";
import { WalletActivation } from "./WalletActivation";
import { WalletFeatures } from "./WalletFeatures";
import { WalletInfo } from "./WalletInfo";

function App() {
  const [paper, setPaper] = useState<PaperEmbeddedWalletSdk>();
  const [userDetails, setUserDetails] = useState<GetUserStatusType>();
  const [user, setUser] = useState<InitializedUser>();

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

  // Callback from Google login
  useEffect(() => {
    if (!paper) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      (async () => {
        const resp = await paper?.auth.loginWithSocialOAuth({
          provider: AuthProvider.GOOGLE,
          redirectUri:
            "https://wallet-managed-auth-react-demo-mug0.zeet-paper.zeet.app",
        });
        console.log("googleCallback response", resp);
        await fetchUserStatus();
      })();
    }
  }, [fetchUserStatus, paper]);

  useEffect(() => {
    if (paper && fetchUserStatus) {
      fetchUserStatus();
    }
  }, [paper, fetchUserStatus]);

  const logout = async () => {
    const response = await paper?.auth.logout();
    console.log("logout response", response);
    await fetchUserStatus();
  };

  return (
    <SimpleGrid columns={2}>
      <Box p={10} bg="gray.100" height="100vh">
        <Stack spacing={10}>
          <Image src="/paper-logo-icon.svg" maxW={14} alt="logo" />
          <Stack spacing={0}>
            <Heading>Wallets & Auth demo</Heading>
            <Text size="sm" fontStyle="italic" color="gray.500">
              by Paper
            </Text>
          </Stack>
          <Text maxW={400}>
            Welcome to Paper's Embedded Wallet Service (EWS) Alpha Sample App.
            <br />
            <br />
            With this alpha sample app, you can explore the various features of
            our EWS platform and get a feel for how it can benefit your own
            project
          </Text>
          {!!userDetails && userDetails.status !== UserStatus.LOGGED_OUT && (
            <Button
              alignSelf="start"
              onClick={logout}
              colorScheme="blue"
              variant="outline"
            >
              Logout
            </Button>
          )}
        </Stack>
      </Box>
      <Box bg="blue.200" p={10} height="100vh" overflowY="auto">
        {!userDetails ? (
          <Spinner size="md" color="white" />
        ) : userDetails.status === UserStatus.LOGGED_OUT ? (
          <Login paper={paper} onLoginSuccess={fetchUserStatus} />
        ) : userDetails.status === UserStatus.LOGGED_IN_WALLET_UNINITIALIZED ||
          userDetails.status === UserStatus.LOGGED_IN_NEW_DEVICE ? (
          <WalletActivation
            email={userDetails.data.authDetails.email}
            onWalletActivated={fetchUserStatus}
            paper={paper}
          />
        ) : (
          <Stack spacing={10}>
            <WalletInfo
              email={userDetails.data.authDetails.email}
              walletAddress={userDetails.data.walletAddress}
            />
            <WalletFeatures user={user} />
          </Stack>
        )}
        {!!userDetails && (
          <Code
            mt={10}
            w="100%"
            bg="blue.100"
            fontSize="12px"
            borderRadius={8}
            p={6}
          >
            <pre>{JSON.stringify(userDetails, null, 2)}</pre>
          </Code>
        )}
      </Box>
    </SimpleGrid>
  );
}

export default App;
