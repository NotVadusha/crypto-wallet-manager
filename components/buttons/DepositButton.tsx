import { Download } from "lucide-react";
import { Button } from "../ui/button";

const DepositButton = () => {
  return (
    <Button variant="default" className="grow h-full">
      <Download className="w-4 h-4" />
      Deposit
    </Button>
  );
};

export default DepositButton;
