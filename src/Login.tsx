import { Button, Card, CardBody, Divider, Heading } from "@chakra-ui/react";
import { PaperEmbeddedWalletSdk } from "@paperxyz/embedded-wallet-service-sdk";

interface Props {
  paper: PaperEmbeddedWalletSdk | undefined;
  onLoginSuccess: () => void;
}

export const Login: React.FC<Props> = ({ paper, onLoginSuccess }) => {
  const loginWithPaper = async () => {
    const result = await paper?.auth.loginWithPaper();
    console.log(`loginWithPaper result: ${JSON.stringify(result, null, 2)}`);
    onLoginSuccess();
  };

  return (
    <Card bg="white" borderRadius={8}>
      <CardBody>
        <Heading size="md">Log in</Heading>
        <Divider my={4} />
        <Button colorScheme="blue" onClick={loginWithPaper} w="full">
          Login with Paper
        </Button>
      </CardBody>
    </Card>
  );
};
