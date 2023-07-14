"use client";

import { useEffect, useState } from 'react';

import Header from "./components/header";
import { SidebarProvider } from "./context/SidebarContext";

export default function Index(): JSX.Element {
  return (
    <SidebarProvider>
      <Header />
      <div className="flex dark:bg-gray-900">
        <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem]">
          <HomePage />
        </main>
      </div>
    </SidebarProvider>
  );}


function HomePage(): JSX.Element {
  const [summaries, setSummaries] = useState({
    loanSummary: {
      activeLoans: [] as any,
      totalEarnings: null,
      totalSolLoaned: null
    },
    offerSummary: {
      activeOffers: [] as any,
      totalSolOffered: 0
    }
  });
  const [collections, setCollections] = useState([] as any);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/api/v1/lender/loans?');
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
  
  console.log('collections', collections)

  return (
    <div className='h-screen flex flex-row border divide-x'>
      <section className='w-1/3'>
        <header>
          <h2 className="mb-3 text-4xl font-bold dark:text-gray-200">Portfolio</h2>
        </header>
      </section>
      <section className='w-2/3'>
        <header>
          <h2 className="mb-3 text-4xl font-bold dark:text-gray-200">
            Collection
          </h2>
        </header>
      </section>
    </div>
  );
}
