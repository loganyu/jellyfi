"use client";

import { useEffect, useState } from 'react';

import Header from "./components/header";
import Footer from "./components/footer";
import { SidebarProvider } from "./context/SidebarContext";

export default function Index(): JSX.Element {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen dark:bg-black">
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
  
  console.log('summaries', summaries);
  console.log('collections', collections);
  const portfolioInfo: any = {}
  summaries.loanSummary.activeLoans.forEach((ls: any) => {
    portfolioInfo[ls.orderBook] ||= {activeLoans: 0, totalLoaned: 0, totalEarnings: 0, floor: 0, value: 0}
    portfolioInfo[ls.orderBook].activeLoans += 1;
    portfolioInfo[ls.orderBook].totalLoaned += ls.amountSol;
    portfolioInfo[ls.orderBook].totalEarnings += ls.earnings;
  })

  return (
    <div className='flex flex-row w-full border divide-x dark:text-gray-200'>
      <section className='w-1/3 flex-grow'>
        <header>
          <h2 className="my-3 text-4xl font-bold text-center">Portfolio</h2>
        </header>
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className='text-left'>
                <th className="p-2">Collection</th>
                <th className="p-2 text-right">Loans</th>
                <th className="p-2 text-right">Total</th>
                <th className="p-2 text-right">Earnings</th>
                <th className="p-2 text-right">Floor</th>
                <th className="p-2 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100 cursor-pointer dark:hover:text-black text-sm">
                <td className="p-2">All Collections</td>
              </tr>
              {collections.map((collection: any) => {
                return (
                  <tr className="hover:bg-gray-100 cursor-pointer dark:hover:text-black text-sm">
                    <td className="p-2">{collection.name}</td>
                    <td className="p-2 text-right">{portfolioInfo[collection.id].activeLoans}</td>
                    <td className="p-2 text-right">{Number(portfolioInfo[collection.id].totalLoaned).toFixed(2)}</td>
                    <td className="p-2 text-right">{Number(portfolioInfo[collection.id].totalEarnings).toFixed(2)}</td>
                    <td className="p-2 text-right">{portfolioInfo[collection.id].floor}</td>
                    <td className="p-2 text-right">{portfolioInfo[collection.id].value}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
      <section className='w-2/3'>
        <header>
          <h2 className="my-3 text-4xl font-bold text-center">
            Collection
          </h2>
        </header>
      </section>
    </div>
  );
}
