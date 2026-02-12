"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/ui/motion-button";

interface WithdrawButtonProps {
  onClick?: () => void;
}

const WithdrawButton = ({ onClick }: WithdrawButtonProps) => {
  return (
    <Button variant="secondary" className="grow h-full border" asChild>
      <MotionButton onClick={onClick}>
        <Upload className="w-4 h-4" />
        Withdraw
      </MotionButton>
    </Button>
  );
};

export default WithdrawButton;
