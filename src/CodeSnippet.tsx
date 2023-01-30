import { Text } from "@chakra-ui/react";
import {
  GetUserStatusType,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const CodeSnippet = ({
  userDetails,
}: {
  userDetails: GetUserStatusType;
}) => {
  let codeSnippet: string = "";
  if (userDetails.status === UserStatus.LOGGED_OUT) {
    codeSnippet = `
const Paper = new PaperEmbeddedWalletSdk({
    clientId: "YOUR_CLIENT_ID",
    chain: "Mumbai"
})

// logging in via the Paper modal
try {
    const result = await Paper.auth.loginWithPaperModal()
} catch(e) {
    // user cancelled login flow
}

// logging in via email OTP only
try {
    const result = await Paper.auth.loginWithPaperEmailOtp({
        email: "you@example.com"
    })
} catch(e) {
    // user cancelled login flow
}`;
  } else if (
    userDetails.status === UserStatus.LOGGED_IN_WALLET_UNINITIALIZED ||
    userDetails.status === UserStatus.LOGGED_IN_NEW_DEVICE
  ) {
    codeSnippet = `const Paper = new PaperEmbeddedWalletSdk({
    clientId: "YOUR_CLIENT_ID",
    chain: "Mumbai"
})
const user = await Paper.initializeUser();
if (user) {
    // user now has access to walletAddress, wallet, and authDetails
} else {
    // user is not logged into Paper yet
}
`;
  } else {
    codeSnippet = `
const Paper = new PaperEmbeddedWalletSdk({
    clientId: "YOUR_CLIENT_ID",
    chain: "Goerli"
})
const user = await Paper.initializeUser();
if (user) {
    const userPaperWallet = user.wallet;
    
    // send gasless transactions to claim an NFT on Goerli
    // Note: You need to top up Sponsored fees on the developer dashboard first
    const { transactionHash } = await userPaperWallet.gasless.callContract({
        contractAddress: "0xb2369209b4eb1e76a43fAd914B1d29f6508c8aae",
        methodArgs: [user.walletAddress, 1, 0],
        methodInterface:
          "function claimTo(address _to, uint256 _quantity, uint256 _tokenId) external",
      });

    // do native web3 ethers.js stuff
    const ethersJsSigner = await userPaperWallet.getEthersJsSigner()
    ethersJsSigner.sendTransaction({ ... })
}
    `;
  }

  return (
    <>
      <Text fontWeight="bold" my={2}>
        Paper related code snippet:
      </Text>
      <SyntaxHighlighter language="typescript" style={tomorrow}>
        {codeSnippet}
      </SyntaxHighlighter>
    </>
  );
};
