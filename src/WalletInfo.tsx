import {
  Card,
  CardBody,
  Heading,
  Divider,
  Stack,
  Text,
} from "@chakra-ui/react";

interface Props {
  email: string | undefined;
  walletAddress: string | undefined;
}

export const WalletInfo: React.FC<Props> = ({ email, walletAddress }) => {
  return (
    <Card bg="white" borderRadius={8}>
      <CardBody>
        <Heading size="md">Authenticated and Wallet ready!</Heading>
        <Divider my={4} />
        <Stack spacing={4}>
          <Text>
            You have successfully authenticated and your wallet is ready to use
            on this device.
          </Text>

          <Card>
            <CardBody>Authenticated email: {email}</CardBody>
          </Card>
          <Card>
            <CardBody>Wallet address: {walletAddress}</CardBody>
          </Card>
        </Stack>
      </CardBody>
    </Card>
  );
};
