import {
  Card,
  CardBody,
  Heading,
  Divider,
  Stack,
  Button,
  Text,
} from "@chakra-ui/react";
import { PaperEmbeddedWalletSdk } from "@paperxyz/embedded-wallet-service-sdk";
import { useState } from "react";

interface Props {
  paper: PaperEmbeddedWalletSdk | undefined;
  onWalletActivated: () => void;
  email: string | undefined;
}

export const WalletActivation: React.FC<Props> = ({
  paper,
  onWalletActivated,
  email,
}) => {
  const [loading, setLoading] = useState(false);
  const activateWallet = async () => {
    setLoading(true);
    const response = await paper?.initializeUser();
    console.log("response from activateWallet", response);
    setLoading(false);
    onWalletActivated();
  };

  return (
    <Card bg="white" borderRadius={8}>
      <CardBody>
        <Heading size="md">Successfully authenticated!</Heading>
        <Divider my={4} />
        <Stack spacing={10}>
          <Stack spacing={4}>
            <Text>
              You are authenticated but a wallet was not found on the current
              device
            </Text>
            <Card variant="outline">
              <CardBody>
                <strong>Authenticated email:</strong> {email}
              </CardBody>
            </Card>
          </Stack>
          <Button
            justifySelf="end"
            colorScheme="blue"
            onClick={activateWallet}
            isLoading={loading}
          >
            Activate wallet on this device
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
};
