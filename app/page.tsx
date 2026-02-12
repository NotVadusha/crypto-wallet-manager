import { getWalletData } from "@/app/actions/wallet";
import { getProfitLossHistory } from "@/app/actions/chart";
import MyWalletCard from "@/components/cards/MyWalletCard/MyWalletCard";
import ProfitLossCard from "@/components/cards/ProfitLossCard/ProfitLossCard";

export default async function Home() {
  const [walletData, initialChart, dailyChart] = await Promise.all([
    getWalletData(),
    getProfitLossHistory("6H"),
    getProfitLossHistory("1D"),
  ]);

  const dailyChange = dailyChart.totalProfitLoss;
  const dailyChangePercent = dailyChart.totalProfitLossPercent;

  return (
    <div className="min-h-screen bg-black font-sans">
      <div className="flex min-h-screen items-center justify-center bg-primary/60">
        <main className="flex min-h-screen w-full flex-col items-center justify-center sm:items-start">
          <div className="flex flex-row gap-4 w-full items-center justify-center">
            <MyWalletCard
              walletData={walletData}
              dailyChange={dailyChange}
              dailyChangePercent={dailyChangePercent}
            />
            <ProfitLossCard initialData={initialChart} />
          </div>
        </main>
      </div>
    </div>
  );
}
