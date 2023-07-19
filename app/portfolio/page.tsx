"use client"

import { useEffect, useState } from 'react';

import { useWallet } from '@solana/wallet-adapter-react';

import WalletButton from '../components/WalletButton';
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { SidebarProvider } from "../context/SidebarContext";
import PortfolioSection from "../components/portfolio/PortfolioSection"
import LoansSection from "../components/portfolio/LoansSection"

import { PublicKey } from '@solana/web3.js'


export default function Index(): JSX.Element {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen dark:bg-gray-800">
        <Header />
        <div className="flex flex-grow">
          <main className="flex flex-grow order-2 flex-[1_0_16rem]">
            <PortfolioPage />
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );}


function PortfolioPage(): JSX.Element {
  const { publicKey } = useWallet();

  const [summaries, setSummaries] = useState({
    loanSummary: {
      activeLoans: [] as any,
      totalEarnings: 0,
      totalSolLoaned: 0
    },
    offerSummary: {
      activeOffers: [] as any,
      totalSolOffered: 0
    }
  });
  const [collections, setCollections] = useState([] as any);
  const [selectedCollection, setSelectedCollection] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async (publicKey: PublicKey) => {
      const response = await fetch(`/api/v1/lender/loans?lender=${publicKey.toString()}`);
      const json = await response.json();
      setSummaries(json);
    }
    if (publicKey) {
      getData(publicKey)
    }
  }, [publicKey])

  useEffect(() => {
    const getCollections = async (collectionIds: string[]) => {
      const response = await fetch('/api/v1/collections?' + new URLSearchParams(
        { collectionIds: collectionIds.join(',') }
      ));
      const json = await response.json();
      setCollections(json);
    }

    const orderBookPubKeys = Array.from(new Set(summaries.loanSummary.activeLoans.map((al: any) => al.orderBook))) as string[]
    if (orderBookPubKeys.length > 0) {
      getCollections(orderBookPubKeys)
    } else {
      setLoading(false)
    }
  }, [summaries])

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center w-full dark:text-white">
        <h1 className="text-4xl font-bold mb-4">🪼 Connect Wallet to View Portfolio 🪼</h1>
        <WalletButton />
      </div>
    )
  }
  
  const portfolioInfo: any = {}
  let totalUnderWater = 0;
  let totalAtRisk = 0;

  if (collections.length > 0) {
    collections.forEach((c: any) => {
      portfolioInfo[c.id] = {
        activeLoans: 0, 
        totalLoaned: 0, 
        totalEarnings: 0,
        activeOffers: 0, 
        totalOffered: 0, 
        underWater: 0, 
        atRisk: 0, 
        floor: c.fp, 
        value: 0
      }
    })

    summaries.loanSummary.activeLoans.forEach((ls: any) => {
      const info = portfolioInfo[ls.orderBook]
      info.activeLoans += 1;
      info.totalLoaned += ls.amountSol;
      info.totalEarnings += ls.earnings;
      if (ls.amountSol > info.floor) {
        info.underWater += 1;
        totalUnderWater += 1;
        info.atRisk += ls.amountSol;
        totalAtRisk += ls.amountSol;
      }
    })
    summaries.offerSummary.activeOffers.forEach((os: any) => {
      portfolioInfo[os.orderBook].activeOffers += 1;
      portfolioInfo[os.orderBook].totalOffered += os.amountSol;
    })
  }
  
  if (loading || ((summaries.loanSummary.totalSolLoaned > 0 || summaries.offerSummary.totalSolOffered > 0 ) && collections.length === 0)) {
    return (
    <div className='flex items-center justify-center h-full w-full'>
      <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
         <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
    </div>
    )
  }

  return (
    <div className='flex flex-row w-full border divide-x dark:text-gray-200'>
      <section className='w-1/3 flex-grow'>
        <PortfolioSection 
          onClickCollection={(collection: any) => setSelectedCollection(collection)} 
          portfolioInfo={portfolioInfo} 
          selectedCollection={selectedCollection} 
          collections={collections}
        />
      </section>
      <section className='w-2/3'>
        <LoansSection
          portfolioInfo={portfolioInfo}
          collections={collections}
          selectedCollection={selectedCollection}
          summaries={summaries}
          totalAtRisk={totalAtRisk}
          totalUnderWater={totalUnderWater}
        />
      </section>
    </div>
  );
}
