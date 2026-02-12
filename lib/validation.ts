import { ethers } from "ethers";

export const VALIDATION = {
  INVALID_ADDRESS: "Invalid recipient address",
  AMOUNT_POSITIVE: "Amount must be a positive number",
} as const;

export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress((address ?? "").trim());
};

export const validatePositiveAmount = (
  amount: string
): { valid: true; value: string } | { valid: false; error: string } => {
  const trimmed = (amount ?? "").trim();
  const num = parseFloat(trimmed);

  if (trimmed === "" || isNaN(num) || num <= 0) {
    return { valid: false, error: VALIDATION.AMOUNT_POSITIVE };
  }

  return { valid: true, value: trimmed };
};

export const validateWithdrawParams = (
  to: string,
  amount: string
): { valid: true; to: string; amount: string } | { valid: false; error: string } => {
  if (!isValidAddress(to)) {
    return { valid: false, error: VALIDATION.INVALID_ADDRESS };
  }

  const amountResult = validatePositiveAmount(amount);
  if (!amountResult.valid) {
    return { valid: false, error: amountResult.error };
  }

  return { valid: true, to: to.trim(), amount: amountResult.value };
};
