"use client";

import { useEffect, useState } from 'react';

import { duration } from 'moment';
import { FaStore, FaSkull } from "react-icons/fa"

import Header from "./components/header";
import Footer from "./components/footer";
import { SidebarProvider } from "./context/SidebarContext";

const PLATFORM_LOGOS: any = {
  "citrus": "/logos/citrus-symbol-logo.png",
  "sharky": "/logos/sharky-logo.png",
  "frakt": "/logos/frakt-logo.png",
  "rainfi": "logos/rain-logo.png"
}

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
  const [nftMintsById, setNftMintsById] = useState({} as any);
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
    console.log('orderBookPubKeys', orderBookPubKeys)
    
    if (orderBookPubKeys.length > 0) {
      getCollections(orderBookPubKeys)
    }

    const getNftMints = async (mintIds: string[]) => {
      const responses = await Promise.all(mintIds.map(mintId => fetch('https://mainnet.helius-rpc.com/?api-key=d250e974-e6c5-4428-a9ca-25f8cd271444', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: "my-id",
          jsonrpc: "2.0",
          method: "getAsset",
          params: {
            id: mintId
          }
        })
      })))
      const data = await Promise.all(responses.map(response => response.json()));
      const dataById = data.reduce((obj, item) => {
        obj[item.result.id] = item.result;
        return obj;
      }, {});
      setNftMintsById(dataById);
    }

    const mintAddresses = summaries.loanSummary.activeLoans.map((al: any) => al.nftCollateralMint)
    if (mintAddresses.length > 0) {
      getNftMints(mintAddresses)
    }
  }, [summaries])
  
  console.log('summaries', summaries);
  console.log('collections', collections);
  console.log('nftMintsById', nftMintsById);
  console.log('selectedCollection', selectedCollection)

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
  
  console.log('portfolioInfo', portfolioInfo)

  let activeLoans;
  if (selectedCollection) {
    activeLoans = summaries.loanSummary.activeLoans.filter((loan: any) => loan.orderBook === selectedCollection.id)
  } else {
    activeLoans = summaries.loanSummary.activeLoans
  }
  
  if (collections.length == 0) {
    return <div>loading</div>
  }


  return (
    <div className='flex flex-row w-full border divide-x dark:text-gray-200'>
      <section className='w-1/3 flex-grow'>
        <header>
          <div className='flex border-b'>
            <h2 className="p-4 text-4xl font-bold text-center h-20">Portfolio</h2>
          </div>
        </header>
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className='text-left'>
                <th className="p-2">Collection</th>
                <th className="p-2 text-right">Offers</th>
                <th className="p-2 text-right">Offered</th>
                <th className="p-2 text-right">Loans</th>
                <th className="p-2 text-right">Loaned</th>
                <th className="p-2 text-right">Earning</th>

              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100 cursor-pointer dark:hover:bg-blue-800 text-xs"
                onClick={() => setSelectedCollection(null)}>
                <td className="p-2 whitespace-nowrap w-16 truncate">All Collections</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {collections.map((collection: any) => {
                console.log('collection', collection)
                return (
                  <tr className={`hover:bg-gray-100 cursor-pointer dark:hover:bg-blue-800 text-xs ${collection === selectedCollection ? 'bg-gray-100 dark:bg-blue-600' : ''}`}
                    onClick={() => setSelectedCollection(collection)}>
                    <td className="p-2 w-10 truncate">{collection.name}</td>
                    <td className="p-2 text-right">{portfolioInfo[collection.id].activeOffers}</td>
                    <td className="p-2 text-right">{portfolioInfo[collection.id].totalOffered}</td>
                    <td className="p-2 text-right">{portfolioInfo[collection.id].activeLoans}</td>
                    <td className="p-2 text-right">{Number(portfolioInfo[collection.id].totalLoaned).toFixed(2)}</td>
                    <td className="p-2 text-right">{Number(portfolioInfo[collection.id].totalEarnings).toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
      <section className='w-2/3'>
        <header>
          <div className='flex border-b'>
            <h2 className="p-4 text-4xl font-bold whitespace-nowrap h-20">
              {selectedCollection ? selectedCollection.name : 'All Collections'}
            </h2>
            <div className="flex flex-row justify-end space-x-4 w-full p-4">
              <div className="flex items-end flex-col">
                <div className="text-md">Offers</div>
                <div className="text-sm">{selectedCollection ? Number(portfolioInfo[selectedCollection.id].activeOffers) : summaries.offerSummary.activeOffers.length}</div>
              </div>
              <div className="flex items-end flex-col">
                <div className="text-md">Offered</div>
                <div className="text-sm">{selectedCollection ? Number(portfolioInfo[selectedCollection.id].totalOffered) : summaries.offerSummary.totalSolOffered.toFixed(2)}</div>
              </div>
              <div className="flex items-end flex-col">
                <div className="text-md">Loans</div>
                <div className="text-sm">{selectedCollection ? Number(portfolioInfo[selectedCollection.id].activeLoans) : summaries.loanSummary.activeLoans.length}</div>
              </div>
              <div className="flex items-end flex-col">
                <div className="text-md">Under Water</div>
                <div className="text-sm text-red-500">{selectedCollection ? portfolioInfo[selectedCollection.id].underWater : totalUnderWater}</div>
              </div>
              <div className="flex items-end flex-col">
                <div className="text-md">Loaned</div>
                <div className="text-sm">{selectedCollection ? Number(portfolioInfo[selectedCollection.id].totalLoaned).toFixed(2) : summaries.loanSummary.totalSolLoaned.toFixed(2)}</div>
              </div>
              <div className="flex items-end flex-col">
                <div className="text-md">At Risk</div>
                <div className="text-sm text-red-500">{selectedCollection ? portfolioInfo[selectedCollection.id].atRisk.toFixed(2) : totalAtRisk.toFixed(2)}</div>
              </div>
              <div className="flex items-end flex-col">
                <div className="text-md">Earning</div>
                <div className="text-sm">{selectedCollection ? Number(portfolioInfo[selectedCollection.id].totalEarnings).toFixed(2) : summaries.loanSummary.totalEarnings.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </header>
        <div className='flex border-b h-18'>
          {selectedCollection &&
            <div className="flex flex-row justify-start space-x-4 w-full p-4">
              <div className="flex items-end flex-col">
                <div className="text-md">Floor</div>
                <div className="text-sm">{selectedCollection.fp.toFixed(2)}</div>
              </div>
              <div className="flex items-end flex-col">
                <div className="text-md">Loans</div>
                <div className="text-sm">{selectedCollection.loans.length}</div>
              </div>
              <div className="flex items-end flex-col">
                <div className="text-md">Under Water</div>
                <div className="text-sm text-red-500">{selectedCollection.countUnderWater}</div>
              </div>
              <div className="flex items-end flex-col">
                <div className="text-md">Best Offer</div>
                <div className="text-sm">{selectedCollection.offers.length > 0 ? selectedCollection.offers[0].amountSol.toFixed(2) : '-'}</div>
              </div>
            </div>
          }
        </div>
        <div className="overflow-y-auto max-h-[790px]">
          <table className="w-full table-auto overflow-scroll">
            <thead>
              <tr className='text-left'>
                <th className="p-2">Nft</th>
                <th className="p-2"></th>
                <th className="p-2 flex items-center justify-center h-10"><FaStore className="h-full"/></th>
                <th className="p-2 text-right">Loaned</th>
                <th className="p-2"></th>
                <th className="p-2 text-right">Earning</th>
                <th className="p-2 text-right">Ends</th>
                <th className="p-2 text-right">Duration</th>
              </tr>
            </thead>
            <tbody>
              {activeLoans
                .sort((a: any, b: any) => a.secondsUntilForeclosable - b.secondsUntilForeclosable)
                .map((loan: any) => {
                  const name = nftMintsById[loan.nftCollateralMint]?.content?.metadata?.name || '-'
                  const imgUrl = nftMintsById[loan.nftCollateralMint]?.content?.files?.[0]?.uri
                  return (
                    <tr className={`hover:bg-gray-100 cursor-pointer dark:hover:bg-blue-800 text-xs ${loan === selectedCollection ? 'bg-gray-100 dark:bg-blue-600' : ''}
                    ${loan.isForeclosable && 'bg-gray-100 dark:bg-gray-700'}`}
                    
                      >
                      <td className="p-2 w-10 truncate">
                        <img src={imgUrl} className="object-cover h-6" />
                      </td>
                      <td className="p-2 w-10 truncate">{name.substring(name.indexOf('#'))}</td>
                      <td className="p-2 w-10 truncate"><img src={PLATFORM_LOGOS[loan.platform.toLowerCase()]} /></td>
                      <td className={`{p-2 text-right ${loan.amountSol > portfolioInfo[loan.orderBook].floor && 'text-red-500'}`}>{Number(loan.amountSol).toFixed(2)}</td>
                      <td>{loan.isForeclosable && <FaSkull />}</td>
                      <td className="p-2 text-right">{Number(loan.earnings).toFixed(2)}</td>
                      <td className="p-2 text-right">{duration(loan.secondsUntilForeclosable, "seconds").humanize(true, { d: 30, h: 48, m: 60, s: 60})}</td>
                      <td className="p-2 text-right">{duration(loan.duration, "seconds").humanize(false, { d: 30, h: 48, m: 60, s: 60})}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
