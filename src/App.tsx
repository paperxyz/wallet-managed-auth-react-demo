import {
  Box,
  Button,
  Code,
  Flex,
  GridItem,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Text
} from "@chakra-ui/react";
import {
  AuthProvider,
  GetUserStatusType,
  InitializedUser,
  PaperEmbeddedWalletSdk,
  UserStatus
} from "@paperxyz/embedded-wallet-service-sdk";
import { useCallback, useEffect, useState } from "react";
import { Login } from "./Login";
import { WalletActivation } from "./WalletActivation";
import { WalletFeatures } from "./WalletFeatures";
import { WalletInfo } from "./WalletInfo";

// TODO ADD THIS
const PAPER_WALLET_KEY = ';

function App() {
  const [paper, setPaper] = useState<PaperEmbeddedWalletSdk>();
  const [userDetails, setUserDetails] = useState<GetUserStatusType>();
  const [user, setUser] = useState<InitializedUser>();

  useEffect(() => {
    const paper = new PaperEmbeddedWalletSdk({
      clientId: PAPER_WALLET_KEY,
      chain: "Mumbai",
      // Optional: custom CSS styling properties:
      styles: {
        colorBackground: "#202020",
        colorText: "white",
        colorPrimary: "blue",
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
          authProvider: AuthProvider.GOOGLE,
          redirectUri: "https://ews-demo.withpaper.com",
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
      <GridItem colSpan={2} bg="blue.500" h={12}>
        <Flex w="full" h="full" align="center" justify="center" color='white'>
          <Text fontSize="xl">
            For more information, check out{" "}
            <Link isExternal href="https://ews.withpaper.com" fontWeight="bold">
              the docs
            </Link>
          </Text>
        </Flex>
      </GridItem>
      <Box p={10} height="100vh">
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
      <Box
        bg="blue.200"
        boxShadow="-2px 0px 2px #6294b4"
        p={10}
        height="100vh"
        overflowY="auto"
      >
        {!userDetails ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="full"
          >
            <Spinner size="md" color="white" />
          </Box>
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
