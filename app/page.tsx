"use client";

import { useEffect, useState } from 'react';

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { SidebarProvider } from "./context/SidebarContext";
import PortfolioSection from "./components/portfolio/PortfolioSection"
import LoansSection from "./components/portfolio/LoansSection"


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

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/api/v1/lender/loans?lender=5hwJtfuFAVJMsVGkgk5k7UYh9o2hz1gDAtjXFKcpenGn');
      const json = await response.json();
      setSummaries(json);
    }

    getData()
  }, [])

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
    }
  }, [summaries])
  
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
  
  if (collections.length == 0) {
    return <div>loading</div>
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
