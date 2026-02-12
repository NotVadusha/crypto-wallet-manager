"use client";

import { WalletInfo } from "./WalletInfo";
import { PortfolioMetrics } from "./PortfolioMetrics";

export interface MyWalletHeaderProps {
  address: string;
  joinedAt?: string;
  portfolioValueUsd: number;
  totalValueUsd: number;
}

export function MyWalletHeader({
  address,
  joinedAt,
  portfolioValueUsd,
  totalValueUsd,
}: MyWalletHeaderProps) {
  return (
    <div className="flex flex-row justify-between w-full p-0">
      <WalletInfo address={address} joinedAt={joinedAt} />
      <PortfolioMetrics
        portfolioValueUsd={portfolioValueUsd}
        totalValueUsd={totalValueUsd}
      />
    </div>
  );
}
