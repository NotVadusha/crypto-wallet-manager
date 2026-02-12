"use client";

import { useState, useEffect } from "react";
import { EditableTitle } from "@/components/EditableTitle";
import { AvatarSet } from "./AvatarSet";
import {
  getStoredWalletName,
  setStoredWalletName,
  DEFAULT_WALLET_NAME,
} from "@/lib/wallet-storage";
import { LABELS } from "./constants";

interface WalletInfoProps {
  address: string;
  joinedAt?: string;
}

export const WalletInfo = ({ address, joinedAt }: WalletInfoProps) => {
  const [walletName, setWalletName] = useState(DEFAULT_WALLET_NAME);

  useEffect(() => {
    setWalletName(getStoredWalletName(address));
  }, [address]);

  const joinedLabel = joinedAt ? `Joined ${joinedAt}` : LABELS.joinedFallback;

  return (
    <div className="flex flex-row items-center gap-3">
      <AvatarSet address={address} />
      <div className="flex flex-col">
        <EditableTitle
          value={walletName}
          onSave={(next) => {
            setStoredWalletName(address, next);
            setWalletName(next);
          }}
        />
        <span className="text-muted-foreground text-xs">{joinedLabel}</span>
      </div>
    </div>
  );
};

export default WalletInfo;
