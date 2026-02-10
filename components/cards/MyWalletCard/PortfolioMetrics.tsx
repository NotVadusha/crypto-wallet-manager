import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface PortfolioMetricsProps {
  portfolioBalance: number;
  usdcBalance: number;
}

const PortfolioMetrics = ({
  portfolioBalance,
  usdcBalance,
}: PortfolioMetricsProps) => {
  return (
    <div className="flex flex-row items-center justify-center gap-4 h-10">
      <div className="flex flex-col items-center">
        <p className="text-muted-foreground text-xs">Portfolio ( Not USDC )</p>
        <span className="font-medium">${portfolioBalance}</span>
      </div>

      <Separator orientation="vertical" className="max-h-6" />

      <div className="flex flex-col items-center">
        <p className="text-muted-foreground text-xs">USDC + Portfolio</p>
        <span className="flex flex-row items-center justify-center gap-1.5">
          <Image src="/assets/finance.png" alt="USDC" width={20} height={20} />
          <span>${usdcBalance}</span>
        </span>
      </div>
    </div>
  );
};

export default PortfolioMetrics;
