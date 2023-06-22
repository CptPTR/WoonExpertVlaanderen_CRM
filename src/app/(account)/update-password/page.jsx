"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: password });
    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage(
        "Ga terug naar de loginpagina en gebruik uw nieuwe wachtwoord om in te loggen."
      );
    }
  };

  return (
    <Box maxW="lg" mx="auto" mt={8} p={4}>
      <Heading size="lg" mb={4}>
        Update Uw Wachtwoord
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="password" isRequired>
          <FormLabel>Wachtwoord</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button mt={5} onClick={handleSubmit}>
          Wachtwoord updaten
        </Button>
      </form>
      {successMessage && (
        <Alert status="success" variant="solid" alignItems="flex-start" mt={5}>
          <AlertIcon />
          <Box flexDirection="column">
            <AlertTitle>Wachtwoord succesvol geupdated.</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Box>
        </Alert>
      )}
      {errorMessage && (
        <Alert status="error" variant="solid" alignItems="flex-start" mt={5}>
          <AlertIcon />
          <Box flexDirection="column">
            <AlertTitle>Er is iets misgegaan.</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default UpdatePassword;
