"use client";

import "@/app/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "WoonExpertVlaanderen - CRM",
};
