import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { TRPCReactProvider } from "~/trpc/react";
import { headers } from "next/headers";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
    </ThemeProvider>
  );
};

export default Providers;
