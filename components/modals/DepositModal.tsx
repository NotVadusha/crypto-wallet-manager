"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/ui/motion-button";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: string;
}

export default function DepositModal({
  open,
  onOpenChange,
  address,
}: DepositModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [address]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit</DialogTitle>
          <DialogDescription>
            Send ETH or tokens to this address. Only send assets on the Ethereum
            network to this address.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2.5">
            <code className="flex-1 truncate text-sm font-mono" title={address}>
              {address || "—"}
            </code>
            <Button
              variant="outline"
              size="icon"
              asChild
              disabled={!address}
              aria-label={copied ? "Copied" : "Copy address"}
            >
              <MotionButton onClick={handleCopy}>
                {copied ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <Copy className="size-4" />
                )}
              </MotionButton>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
