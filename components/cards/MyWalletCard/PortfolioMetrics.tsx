import { Separator } from "@/components/ui/separator";
import { NumberFlow } from "@/components/ui/number-flow";
import Image from "next/image";
import { LABELS } from "./constants";

export interface PortfolioMetricsProps {
  portfolioValueUsd: number;
  totalValueUsd: number;
}

export function PortfolioMetrics({
  portfolioValueUsd,
  totalValueUsd,
}: PortfolioMetricsProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-7 h-10">
      <div className="flex flex-col items-center">
        <p className="text-muted-foreground text-xs">
          {LABELS.portfolioNotUsdc}
        </p>
        <span className="font-medium">
          <NumberFlow
            value={portfolioValueUsd}
            format={{ style: "currency", currency: "USD" }}
          />
        </span>
      </div>

      <Separator orientation="vertical" className="max-h-6 min-w-0.5" />

      <div className="flex flex-col items-center">
        <p className="text-muted-foreground text-xs">
          {LABELS.usdcAndPortfolio}
        </p>
        <span className="flex flex-row items-center justify-center gap-1.5 font-medium">
          <Image src="/assets/finance.png" alt="USDC" width={24} height={24} />
          <NumberFlow
            value={totalValueUsd}
            format={{ style: "currency", currency: "USD" }}
          />
        </span>
      </div>
    </div>
  );
}
