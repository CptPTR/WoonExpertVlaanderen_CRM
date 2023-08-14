"use client";

import "@/app/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>WoonExpertVlaanderen - CRM</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* <StrictMode> */}
        <ChakraProvider>{children}</ChakraProvider>
        {/* </StrictMode> */}
      </body>
    </html>
  );
}
