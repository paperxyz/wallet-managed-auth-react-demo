import {
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  Stack,
} from "@chakra-ui/react";
import {
  ContractCallInputType,
  InitializedUser,
} from "@paperxyz/embedded-wallet-service-sdk";
import { ethers } from "ethers";
import { useState } from "react";

interface Props {
  user: InitializedUser | undefined;
}

enum Features {
  GET_WALLET = "GET_WALLET",
  SIGN_MESSAGE = "SIGN_MESSAGE",
  SIGN_T_ETH = "SIGN_T_ETH",
  SIGN_T_GOERLI = "SIGN_T_GOERLI",
  CALL_GASLESS_CONTRACT = "CALL_GASLESS_CONTRACT",
}

export const WalletFeatures: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState<Features | null>(null);
  const wallet = user?.wallet;

  const getAddress = async () => {
    setLoading(Features.GET_WALLET);
    const signer = await wallet?.getEthersJsSigner();
    const address = await signer?.getAddress();
    setLoading(null);
    console.log("address", address);
  };

  const signMessage = async () => {
    setLoading(Features.SIGN_MESSAGE);
    const signer = await wallet?.getEthersJsSigner({
      rpcEndpoint: "mainnet",
    });
    const signedMessage = await signer?.signMessage("hello world");
    setLoading(null);
    console.log("signedMessage", signedMessage);
  };

  const signTransactionEth = async () => {
    setLoading(Features.SIGN_T_ETH);
    const signer = await wallet?.getEthersJsSigner({
      rpcEndpoint: "mainnet",
    });
    const tx = {
      to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      value: ethers.utils.parseEther("0.1"),
    };
    const signedTransaction = await signer?.signTransaction(tx);
    setLoading(null);
    console.log("signedTransaction", signedTransaction);
  };

  const signTransactionGoerli = async () => {
    setLoading(Features.SIGN_T_GOERLI);
    const signer = await wallet?.getEthersJsSigner({
      rpcEndpoint: "goerli",
    });
    const tx = {
      to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      value: ethers.utils.parseEther("0.1"),
    };
    const signedTransaction = await signer?.signTransaction(tx);
    setLoading(null);
    console.log("signedTransaction", signedTransaction);
  };

  const callContractGasless = async () => {
    setLoading(Features.CALL_GASLESS_CONTRACT);
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
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card bg="white" borderRadius={8}>
      <CardBody>
        <Heading size="md">Wallet Features</Heading>
        <Divider my={4} />
        <Stack spacing={4}>
          <Button
            onClick={getAddress}
            colorScheme="blue"
            isLoading={loading === Features.GET_WALLET}
          >
            Get Wallet Address
          </Button>
          <Button
            onClick={signMessage}
            colorScheme="blue"
            isLoading={loading === Features.SIGN_MESSAGE}
          >
            Sign Message
          </Button>
          <Button
            onClick={signTransactionEth}
            colorScheme="blue"
            isLoading={loading === Features.SIGN_T_ETH}
          >
            Sign Transaction (Eth)
          </Button>
          <Button
            onClick={signTransactionGoerli}
            colorScheme="blue"
            isLoading={loading === Features.SIGN_T_GOERLI}
          >
            Sign Transaction (Goerli)
          </Button>
          <Button
            onClick={callContractGasless}
            colorScheme="blue"
            isLoading={loading === Features.CALL_GASLESS_CONTRACT}
          >
            Call contract method (Gasless)
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
};
