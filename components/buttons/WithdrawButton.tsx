import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const WithdrawButton = () => {
  return (
    <Button variant="secondary" className="grow h-full">
      <Upload className="w-4 h-4" />
      Withdraw
    </Button>
  );
};

export default WithdrawButton;
