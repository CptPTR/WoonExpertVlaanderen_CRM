"use client";

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password",
    });
    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage(
        `We hebben een e-mail verzonden naar het opgegeven adres: ${email}. Controleer uw inbox voor verdere instructies.\nAls u de e-mail niet ziet, controleer dan uw spam- of junkmap.`
      );
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={8} p={4}>
      <Heading size="lg" mb={4}>
        Reset Password
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <Button mt={5} onClick={handleSubmit}>
          Reset Wachtwoord
        </Button>
      </form>
      {successMessage && (
        <Alert status="success" mt={4}>
          <AlertIcon />
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
};

export default ResetPassword;
