
import dynamic from "next/dynamic";

import { FC } from "react";

const WalletMultiButtonDynamic = dynamic(
	async () =>
		(await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
	{ ssr: false }
);

const WalletButton: FC = function() {
  return (
    <div className="border-2 text-black mr-2">
      <WalletMultiButtonDynamic className="text-black hover:text-white dark:text-white" />
    </div>
  )
}

export default WalletButton;