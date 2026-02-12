import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { WalletData } from "@/lib/types";
import { MyWalletHeader } from "./MyWalletHeader";
import { WalletBalance } from "./WalletBalance";
import { WalletActions } from "./WalletActions";

export interface MyWalletCardProps {
  walletData: WalletData;
  dailyChange: number;
  dailyChangePercent: number;
}

export default function MyWalletCard({
  walletData,
  dailyChange,
  dailyChangePercent,
}: MyWalletCardProps) {
  return (
    <Card className="w-full max-w-160 h-62 gap-5 p-5 rounded-md">
      <CardHeader className="flex flex-row justify-between p-0">
        <MyWalletHeader
          address={walletData.address}
          joinedAt={walletData.joinedAt ?? undefined}
          portfolioValueUsd={walletData.portfolioValueUsd}
          totalValueUsd={walletData.totalValueUsd}
        />
      </CardHeader>

      <CardContent className="p-0">
        <WalletBalance
          totalValueUsd={walletData.totalValueUsd}
          dailyChange={dailyChange}
          dailyChangePercent={dailyChangePercent}
        />
      </CardContent>

      <CardFooter className="flex flex-row gap-2 h-11 p-0">
        <WalletActions
          address={walletData.address}
          ethBalance={walletData.ethBalance}
          tokenBalance={walletData.tokenBalance}
          tokenSymbol={walletData.tokenSymbol}
        />
      </CardFooter>
    </Card>
  );
}
