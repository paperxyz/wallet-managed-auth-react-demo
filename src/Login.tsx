import {
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  FormControl,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PaperEmbeddedWalletSdk } from "@paperxyz/embedded-wallet-service-sdk";
import { useState } from "react";
interface Props {
  paper: PaperEmbeddedWalletSdk | undefined;
  onLoginSuccess: () => void;
}

export const Login: React.FC<Props> = ({ paper, onLoginSuccess }) => {
  const loginWithPaperModal = async () => {
    setIsLoading(true);
    try {
      const result = await paper?.auth.loginWithPaperModal();
      console.log(`loginWithPaper result: ${JSON.stringify(result, null, 2)}`);
      onLoginSuccess();
    } catch (e) {
      // use cancelled login flow
    }
    setIsLoading(false);
  };

  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loginWithPaperEmailOtp = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const result = await paper?.auth.loginWithPaperEmailOtp({
        email: email || "",
      });
      console.log("loginWithPaperEmailOtp result", result);
      onLoginSuccess();
    } catch (e) {
      // use closed login modal.
    }
    setIsLoading(false);
  };

  return (
    <Card bg="white" borderRadius={8}>
      <CardBody>
        <Heading size="md">Log in</Heading>
        <Divider my={4} />
        <Button colorScheme="blue" onClick={loginWithPaperModal} w="full">
          Login with Paper Modal
        </Button>

        <Flex my={4} alignItems="center">
          <Divider />
          <Text mx={4}>or</Text>
          <Divider />
        </Flex>
        <Stack as="form">
          <FormControl alignItems="end" as={Stack}>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email || ""}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FormControl>
          <Button
            type="submit"
            onClick={loginWithPaperEmailOtp}
            disabled={!email}
            isLoading={isLoading}
          >
            Login with Email OTP
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
};
