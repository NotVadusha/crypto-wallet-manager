"use client";

import { useState } from "react";
import DepositButton from "@/components/buttons/DepositButton";
import WithdrawButton from "@/components/buttons/WithdrawButton";
import DepositModal from "@/components/modals/DepositModal";
import WithdrawModal from "@/components/modals/WithdrawModal";

export interface WalletActionsProps {
  address: string;
  ethBalance: string;
  tokenBalance: string;
  tokenSymbol: string;
}

export function WalletActions({
  address,
  ethBalance,
  tokenBalance,
  tokenSymbol,
}: WalletActionsProps) {
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <>
      <DepositButton onClick={() => setDepositOpen(true)} />
      <DepositModal
        open={depositOpen}
        onOpenChange={setDepositOpen}
        address={address}
      />

      <WithdrawButton onClick={() => setWithdrawOpen(true)} />
      <WithdrawModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        ethBalance={ethBalance}
        tokenBalance={tokenBalance}
        tokenSymbol={tokenSymbol}
      />
    </>
  );
}

export default WalletActions;
