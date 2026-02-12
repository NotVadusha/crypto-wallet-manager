"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2 } from "lucide-react";
import { isValidAddress, validateWithdrawParams } from "@/lib/validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/ui/motion-button";
import { Input } from "@/components/ui/input";
import { withdraw } from "@/app/actions/transactions";
import { ETHERSCAN_TX_URL } from "@/lib/etherscan";
import type { TransactionResult } from "@/lib/types";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ethBalance: string;
  tokenBalance: string;
  tokenSymbol: string;
}

type Asset = "ETH" | "token";

export default function WithdrawModal({
  open,
  onOpenChange,
  ethBalance,
  tokenBalance,
  tokenSymbol,
}: WithdrawModalProps) {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState<Asset>("ETH");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const currentBalance = asset === "ETH" ? ethBalance : tokenBalance;
  const balanceLabel = asset === "ETH" ? "ETH" : tokenSymbol;

  const handleMax = useCallback(() => {
    setAmount(currentBalance || "0");
  }, [currentBalance]);

  const handleClose = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setRecipient("");
        setAmount("");
        setAsset("ETH");
        setResult(null);
      }

      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validated = validateWithdrawParams(recipient, amount);
      if (!validated.valid) {
        setResult({ success: false, error: validated.error });
        return;
      }

      setIsSubmitting(true);
      setResult(null);

      try {
        const res = await withdraw(
          validated.to,
          validated.amount,
          asset === "token"
        );
        setResult(res);
        if (res.success) {
          router.refresh();
          setTimeout(() => handleClose(false), 2500);
        }
      } catch (err) {
        setResult({
          success: false,
          error: err instanceof Error ? err.message : "Transaction failed",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [recipient, amount, asset, router, handleClose]
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw</DialogTitle>
          <DialogDescription>
            Send ETH or {tokenSymbol} to another address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="withdraw-recipient"
              className="text-muted-foreground text-sm font-medium"
            >
              Recipient address
            </label>
            <Input
              id="withdraw-recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="font-mono text-sm"
              disabled={isSubmitting}
              aria-invalid={recipient.length > 0 && !isValidAddress(recipient)}
            />
            {recipient.length > 0 && !isValidAddress(recipient) && (
              <p className="text-destructive text-xs">
                Enter a valid Ethereum address
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="withdraw-amount"
                className="text-muted-foreground text-sm font-medium"
              >
                Amount
              </label>
              <span className="text-muted-foreground text-xs">
                Balance: {currentBalance || "0"} {balanceLabel}
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                id="withdraw-amount"
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSubmitting}
              />
              <Button
                variant="outline"
                asChild
                disabled={
                  isSubmitting ||
                  !currentBalance ||
                  parseFloat(currentBalance) <= 0
                }
              >
                <MotionButton onClick={handleMax}>Max</MotionButton>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-muted-foreground text-sm font-medium">
              Asset
            </span>
            <div className="flex gap-2">
              <Button
                variant={asset === "ETH" ? "default" : "outline"}
                size="sm"
                asChild
                disabled={isSubmitting}
              >
                <MotionButton onClick={() => setAsset("ETH")}>ETH</MotionButton>
              </Button>
              <Button
                variant={asset === "token" ? "default" : "outline"}
                size="sm"
                asChild
                disabled={isSubmitting}
              >
                <MotionButton onClick={() => setAsset("token")}>
                  {tokenSymbol}
                </MotionButton>
              </Button>
            </div>
          </div>

          {result && (
            <div
              className={
                result.success
                  ? "rounded-md border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-700"
                  : "rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
              }
            >
              {result.success ? (
                <span className="flex items-center gap-2">
                  Transaction sent.
                  {result.txHash && (
                    <a
                      href={`${ETHERSCAN_TX_URL}/${result.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium underline"
                    >
                      View on Etherscan
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </span>
              ) : (
                result.error
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" asChild disabled={isSubmitting}>
              <MotionButton onClick={() => handleClose(false)}>
                Cancel
              </MotionButton>
            </Button>
            <Button asChild disabled={isSubmitting}>
              <MotionButton type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Confirm Withdraw"
                )}
              </MotionButton>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
