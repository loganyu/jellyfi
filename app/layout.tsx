"use client"

require("@solana/wallet-adapter-react-ui/styles.css");

import { FC, PropsWithChildren } from "react";
import FlowbiteContext from "./context/FlowbiteContext";
import "./globals.css";
import WalletContextProvider from './context/WalletContextProvider'

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          <FlowbiteContext>{children}</FlowbiteContext>
        </WalletContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
