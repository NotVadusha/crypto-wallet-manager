import GrowthTriangle from "@/components/GrowthTriangle";

const WalletBalance = () => {
  const todayGrowth = 12.42;
  const todayGrowthPercentage = (todayGrowth * 100).toFixed(2);

  const isGrowthPositive = todayGrowth > 0;

  const color = isGrowthPositive ? "#3CAB68" : "#FF5100";

  return (
    <div className="flex flex-col">
      <span className="text-[2.5rem]">984,42 USDC</span>
      <div className="flex flex-row gap-2">
        <span className={`text-[${color}] font-medium`}>
          {isGrowthPositive ? "+" : "-"} {todayGrowth}%
        </span>

        <span className={`text-[${color}] font-medium`}>
          <GrowthTriangle value={todayGrowth} />
          {todayGrowthPercentage}%
        </span>
        <span className="text-muted-foreground font-medium">Today</span>
      </div>
    </div>
  );
};

export default WalletBalance;
