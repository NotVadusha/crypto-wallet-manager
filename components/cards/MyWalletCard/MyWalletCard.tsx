import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import PortfolioMetrics from "@/components/cards/MyWalletCard/PortfolioMetrics";
import WalletInfo from "@/components/cards/MyWalletCard/WalletInfo";
import WalletBalance from "@/components/cards/MyWalletCard/WalletBalance";
import DepositButton from "@/components/buttons/DepositButton";
import WithdrawButton from "@/components/buttons/WithdrawButton";

const MyWalletCard = () => {
  const usdcBalance = 984.42;
  const portfolioBalance = 100000;

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-row justify-between">
        <WalletInfo />
        <PortfolioMetrics
          portfolioBalance={portfolioBalance}
          usdcBalance={usdcBalance}
        />
      </CardHeader>

      <CardContent>
        <WalletBalance />
      </CardContent>

      <CardFooter className="flex flex-row gap-2 h-12">
        <DepositButton />
        <WithdrawButton />
      </CardFooter>
    </Card>
  );
};

export default MyWalletCard;
