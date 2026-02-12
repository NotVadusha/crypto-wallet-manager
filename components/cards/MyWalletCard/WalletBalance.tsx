"use client";

import GrowthArrow from "@/components/GrowthArrow";
import { NumberFlow } from "@/components/ui/number-flow";
import { LABELS } from "./constants";

export interface WalletBalanceProps {
  totalValueUsd: number;
  dailyChange: number;
  dailyChangePercent: number;
}

export function WalletBalance({
  totalValueUsd,
  dailyChange,
  dailyChangePercent,
}: WalletBalanceProps) {
  const isGrowthPositive = dailyChange >= 0;
  const colorClass = isGrowthPositive ? "text-profit" : "text-loss";

  return (
    <div className="flex flex-col">
      <span className="text-[2.5rem]">
        <NumberFlow
          value={totalValueUsd}
          format={{
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }}
        />
        {" USDC"}
      </span>
      <div className="flex flex-row gap-2 items-center">
        <span className={`${colorClass} font-medium text-sm`}>
          <NumberFlow
            value={dailyChange}
            format={{
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              signDisplay: "always",
            }}
          />
        </span>
        <span className={`${colorClass} font-medium text-sm space-x-1`}>
          <GrowthArrow value={dailyChange} />
          <NumberFlow
            value={dailyChangePercent}
            format={{
              style: "percent",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              signDisplay: "never",
            }}
          />
        </span>
        <span className="text-muted-foreground font-medium text-sm">
          {LABELS.today}
        </span>
      </div>
    </div>
  );
}
