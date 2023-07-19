import { useEffect, useState, FC } from "react";

import moment from 'moment';
import { FaStore, FaSkull  } from "react-icons/fa"

const PLATFORM_LOGOS: any = {
  "citrus": "/logos/citrus-symbol-logo.png",
  "sharky": "/logos/sharky-logo.png",
  "frakt": "/logos/frakt-logo.png",
  "rainfi": "logos/rain-logo.png"
}

interface LoansSectionProps {
  portfolioInfo: any;
  collections: any[];
  selectedCollection: any;
  summaries: any;
  totalUnderWater: number;
  totalAtRisk: number;
}

const LoansSection: FC<LoansSectionProps> = function ({summaries, portfolioInfo, collections, selectedCollection, totalUnderWater, totalAtRisk}) {
  const [nftMintsById, setNftMintsById] = useState({} as any);
  const [selectedTab, setSelectedTab] = useState('loans');

  useEffect(() => {
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
  
  let activeLoans;
  let activeOffers;
  if (selectedCollection) {
    activeLoans = summaries.loanSummary.activeLoans.filter((loan: any) => loan.orderBook === selectedCollection.id)
    activeOffers = summaries.offerSummary.activeOffers.filter((offer: any) => offer.orderBook === selectedCollection.id)
  } else {
    activeLoans = summaries.loanSummary.activeLoans
    activeOffers = summaries.offerSummary.activeOffers
  }

  const collectionsById = collections.reduce((obj: any, item: any) => {
    obj[item.id] = item;
    return obj;
  }, {});

  return (
    <>
      <header>
        <div className='flex border-b'>
          {selectedCollection && <img className="h-16 m-2 rounded-full" src={collectionsById[selectedCollection.id]?.logo} />}
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
              <div className="text-md">Interest</div>
              <div className="text-sm">{selectedCollection ? Number(portfolioInfo[selectedCollection.id].totalEarnings).toFixed(2) : summaries.loanSummary.totalEarnings.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </header>
      <div className='flex border-b h-20'>
        <div className="flex flex-row justify-between items-end space-x-4 w-full p-2">
        {selectedCollection &&
          <div className="flex flex-row justify-start space-x-4 p-2">
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
        <div className="text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
                <li className="mr-2">
                    <a
                      onClick={() => setSelectedTab('loans')}
                      className={`cursor-pointer inline-block px-2 border-b ${selectedTab === 'loans' && 'text-blue-600 border-blue-600'}`}  aria-current="page">
                        Loans
                    </a>
                </li>
                <li className="mr-2">
                    <a
                      onClick={() => setSelectedTab('offers')}
                      className={`cursor-pointer inline-block px-2 border-b  ${selectedTab === 'offers' && 'text-blue-600 border-blue-600'}`}  aria-current="page">
                        Offers
                    </a>
                </li>
                <li className="mr-2">
                    <a
                      onClick={() => setSelectedTab('history')}
                      className={`cursor-pointer inline-block px-2 border-b ${selectedTab === 'history' && 'text-blue-600 border-blue-600'}`}  aria-current="page">
                        History
                    </a>
                </li>
                {selectedCollection &&
                  <>
                    <li className="mr-2">
                      <a
                        onClick={() => setSelectedTab('collectionLoans')}
                        className={`cursor-pointer inline-block px-2 border-b  ${selectedTab === 'collectionLoans' && 'text-blue-600 border-blue-600'}`}  aria-current="page">
                          Collection Loans
                      </a>
                    </li>
                    <li className="mr-2">
                        <a
                          onClick={() => setSelectedTab('collectionOffers')}
                          className={`cursor-pointer inline-block px-2 border-b ${selectedTab === 'collectionOffers' && 'text-blue-600 border-blue-600'}`}  aria-current="page">
                            Collection Offers
                        </a>
                    </li>
                  </>
                }

            </ul>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[725px]">
      {{ 
        loans:
          <table className="w-full table-auto overflow-scroll">
            <thead>
              <tr className='text-left'>
                <th className="p-2">Nft</th>
                <th className="p-2"></th>
                <th className="p-2"></th>
                <th className="p-2 text-right">Loaned</th>
                <th className="p-2"></th>
                <th className="p-2 text-right">Interest</th>
                <th className="p-2 text-right">Status</th>
                <th className="p-2 text-right">Duration</th>
                <th className="p-2 flex items-center justify-center h-10"><FaStore className="h-full"/></th>
              </tr>
            </thead>
            <tbody>
              {activeLoans
                .sort((a: any, b: any) => a.secondsUntilForeclosable - b.secondsUntilForeclosable)
                .map((loan: any) => {
                  const name = nftMintsById[loan.nftCollateralMint]?.content?.metadata?.name || '-'
                  const imgUrl = nftMintsById[loan.nftCollateralMint]?.content?.files?.[0]?.uri
                  const collectionImgUrl = collectionsById[loan.orderBook]?.logo
                  return (
                    <tr key={loan.pubkey} className={`hover:bg-gray-100 cursor-pointer dark:hover:bg-blue-800 text-xs ${loan === selectedCollection ? 'bg-gray-100 dark:bg-blue-600' : ''}
                    ${loan.isForeclosable && 'bg-gray-100 dark:bg-gray-700'}`}
                      >
                      <td className="p-2 w-10 truncate">
                        <img src={imgUrl} className="object-cover h-6" alt="NFT picture" />
                      </td>
                      <td className="w-10 truncate">
                        <img src={collectionImgUrl} className="object-cover h-6 rounded-full" alt="Collection picture" />
                      </td>
                      <td className="p-2 w-10 truncate">{name.substring(name.indexOf('#'))}</td>
                      <td className={`p-2 text-right ${loan.amountSol > portfolioInfo[loan.orderBook].floor && 'text-red-500'}`}>{Number(loan.amountSol).toFixed(2)}</td>
                      <td>{loan.isForeclosable && <FaSkull />}</td>
                      <td className="p-2 text-right">{Number(loan.earnings).toFixed(2)}</td>
                      <td className="p-2 text-right">{loan.secondsUntilForeclosable >= 0 ? "ends" : "defaulted"} {moment.duration(loan.secondsUntilForeclosable, "seconds").humanize(true, { d: 30, h: 48, m: 120, s: 60})}</td>
                      <td className="p-2 text-right">{moment.duration(loan.duration, "seconds").humanize(false, { d: 30, h: 48, m: 60, s: 60})}</td>
                      <td className="p-2 w-10 truncate"><img src={PLATFORM_LOGOS[loan.platform.toLowerCase()]} alt="Platform logo" /></td>
                    </tr>
                  )
                })}
            </tbody>
          </table>,
        offers:
          <table className="w-full table-auto overflow-scroll">
            <thead>
              <tr className='text-left'>
                <th className="p-2">Collection</th>
                <th className="p-2 text-right">Offer</th>
                <th className="p-2"></th>
                <th className="p-2 text-right">Interest</th>
                <th className="p-2 text-right">Status</th>
                <th className="p-2"><FaStore className="h-full"/></th>
              </tr>
            </thead>
            <tbody>
              {activeOffers
                .sort((a: any, b: any) => a.secondsUntilForeclosable - b.secondsUntilForeclosable)
                .map((loan: any) => {
                  const collectionImgUrl = collectionsById[loan.orderBook]?.logo
                  return (
                    <tr key={loan.pubkey} className={`hover:bg-gray-100 cursor-pointer dark:hover:bg-blue-800 text-xs ${loan === selectedCollection ? 'bg-gray-100 dark:bg-blue-600' : ''}
                    ${loan.isForeclosable && 'bg-gray-100 dark:bg-gray-700'}`}
                      >
                      <td className="w-10 p-2 truncate">
                        <img src={collectionImgUrl} className="object-cover h-6 rounded-full" alt="Collection picture" />
                      </td>
                      <td className={`p-2 text-right ${loan.amountSol > portfolioInfo[loan.orderBook].floor && 'text-red-500'}`}>{Number(loan.amountSol).toFixed(2)}</td>
                      <td>{loan.isForeclosable && <FaSkull />}</td>
                      <td className="p-2 text-right">{Number(loan.earnings).toFixed(2)}</td>
                      <td className="p-2 text-right">made on {moment(loan.offerTime).format("DD MMM YYYY hh:mma")}</td>
                      <td className="p-2 w-10 truncate"><img src={PLATFORM_LOGOS[loan.platform.toLowerCase()]} alt="Platform logo" /></td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        }[selectedTab]}
      </div>
    </>
  )
}

export default LoansSection;