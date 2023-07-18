import { FC } from "react";

import { useWallet } from '@solana/wallet-adapter-react';

interface PortfolioSectionProps {
  onClickCollection: (collection: any) => void;
  collections: any;
  portfolioInfo: any;
  selectedCollection: any;
}

const PortfolioSection: FC<PortfolioSectionProps> = function ({onClickCollection, collections, portfolioInfo, selectedCollection}) {
  const { publicKey } = useWallet();

  return (
    <>
      <header>
        <div className='flex border-b items-center'>
          <h2 className="p-4 text-4xl font-bold text-center h-20">{publicKey?.toString().slice(0, 4)}..{publicKey?.toString().slice(-4)}</h2>
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
