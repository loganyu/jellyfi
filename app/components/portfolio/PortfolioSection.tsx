import { FC } from "react";

import { useWallet } from '@solana/wallet-adapter-react';

import { useSearchParams } from 'next/navigation'

interface PortfolioSectionProps {
  onClickCollection: (collection: any) => void;
  onPubKeySubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
  collections: any;
  portfolioInfo: any;
  selectedCollection: any;
}

const PortfolioSection: FC<PortfolioSectionProps> = function ({onClickCollection, onPubKeySubmit, collections, portfolioInfo, selectedCollection}) {
  const { publicKey } = useWallet();
  const search = useSearchParams()
  const pk = search.get('pk')
  const pubKey = pk ? pk : publicKey?.toString() || ''

  return (
    <>
      <header>
        <div className='flex flex-col border-b items-start'>
          <h2 className="p-4 text-4xl font-bold text-center">{pubKey.slice(0, 4)}..{pubKey.slice(-4)}</h2>
          <form onSubmit={onPubKeySubmit} className='w-full p-4'>   
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="search" id="publicKey" minLength={44} maxLength={44} className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search public key" required />
                <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            </div>
          </form>
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
              onClick={() => onClickCollection(null)}>
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
                return (
                    <tr key={collection.id} className={`hover:bg-gray-100 cursor-pointer dark:hover:bg-blue-800 text-xs ${collection === selectedCollection ? 'bg-gray-100 dark:bg-blue-600' : ''}`}
                    onClick={() => onClickCollection(collection)}>
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
    </>
  );
};

export default PortfolioSection;
