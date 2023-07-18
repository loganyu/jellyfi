"use client"

import { useWallet } from '@solana/wallet-adapter-react';

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { SidebarProvider } from "./context/SidebarContext";

import WalletButton from "./components/WalletButton";


export default function Index(): JSX.Element {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen dark:bg-gray-800">
        <Header />
        <div className="flex flex-grow">
          <main className="flex flex-grow order-2 flex-[1_0_16rem]">
            <HomePage />
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );}


function HomePage(): JSX.Element {
  const { publicKey } = useWallet(); 

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center w-full dark:text-white">
        <h1 className="text-4xl font-bold mb-4">🪼 Welcome to JellyFi!🪼</h1>
        <ul className="flex flex-col justify-around h-32 m-10">
          <li>View all your NFT loans across platforms</li>
          <li>Get high level stats on your loans</li>
          <li>View loans by collection</li>
          <li>Keep track of when loans are close to ending</li>
        </ul>
        <WalletButton />
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center justify-center w-full dark:text-white">
        <h2 className="text-2xl mb-4">🪼 Hello {publicKey.toBase58().slice(0,4)}..{publicKey.toBase58().slice(-4)} 🪼</h2>
      </div>
    )
  }
}
