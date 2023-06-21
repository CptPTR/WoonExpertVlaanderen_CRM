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
    await supabase.auth.updateUser({ password: password });
  };

  return (
    <Box maxW="sm" mx="auto" mt={8} p={4}>
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

export default UpdatePassword;
