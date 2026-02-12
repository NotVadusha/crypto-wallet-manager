"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/ui/motion-button";

interface DepositButtonProps {
  onClick?: () => void;
}

const DepositButton = ({ onClick }: DepositButtonProps) => {
  return (
    <Button variant="default" className="grow h-full" asChild>
      <MotionButton onClick={onClick}>
        <Download className="w-4 h-4" />
        Deposit
      </MotionButton>
    </Button>
  );
};

export default DepositButton;
