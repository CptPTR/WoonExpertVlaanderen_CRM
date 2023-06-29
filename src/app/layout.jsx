"use client";

import "@/app/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>WoonExpertVlaanderen - CRM</title>
      </head>
      <body>
        <StrictMode>
          <ChakraProvider>{children}</ChakraProvider>
        </StrictMode>
      </body>
    </html>
  );
}
