"use server";

import { ethers } from "ethers";
import * as ethereum from "@/lib/ethereum";
import { invalidateByPrefix } from "@/app/actions/cache";
import { validateWithdrawParams } from "@/lib/validation";
import type { TransactionResult } from "@/lib/types";

export type DepositResult = TransactionResult & { address?: string };

export const deposit = async (): Promise<DepositResult> => {
  const address = ethereum.getWalletAddress();

  return { success: true, address };
};

export const withdraw = async (
  to: string,
  amountEth: string,
  isToken: boolean
): Promise<TransactionResult> => {
  const contractAddress = ethereum.getTokenContractAddress();

  const validated = validateWithdrawParams(to, amountEth);
  if (!validated.valid) {
    return { success: false, error: validated.error };
  }

  const { to: validatedTo, amount } = validated;
  const publicKey = ethereum.getWalletAddress();

  if (isToken) {
    const balanceRaw = await ethereum.getTokenBalanceRpc(contractAddress);
    const tokenInfo = await ethereum.getTokenInfo(contractAddress);
    const decimals = tokenInfo.decimals || 18;
    const maxAmount = ethers.toBigInt(balanceRaw);
    const amountWei = ethers.parseUnits(amount, decimals);

    if (amountWei > maxAmount) {
      return { success: false, error: "Insufficient token balance" };
    }

    const result = await ethereum.sendToken(
      validatedTo,
      amountWei.toString(),
      contractAddress
    );
    if (result.success) {
      invalidateByPrefix(publicKey);
    }

    return result;
  }

  const balanceWei = await ethereum.getEthBalanceRpc();
  const amountWei = ethers.parseEther(amount);

  if (amountWei > BigInt(balanceWei)) {
    return { success: false, error: "Insufficient ETH balance" };
  }

  const result = await ethereum.sendEth(validatedTo, amount);
  if (result.success) {
    invalidateByPrefix(publicKey);
  }

  return result;
};
