import { ethers } from "ethers";
import type { TransactionResult } from "./types";

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
] as const;

let providerInstance: ethers.JsonRpcProvider | null = null;

export const getProvider = (): ethers.JsonRpcProvider => {
  const url = process.env.ETH_RPC_URL;

  if (!url) {
    throw new Error("ETH_RPC_URL is not set");
  }

  if (!providerInstance) {
    providerInstance = new ethers.JsonRpcProvider(url);
  }

  return providerInstance;
};

export const getTokenContractAddress = (): string => {
  const addr = process.env.TOKEN_CONTRACT_ADDRESS;

  if (!addr) {
    throw new Error("TOKEN_CONTRACT_ADDRESS is not set");
  }

  return addr;
};

export const getWalletAddress = (): string => {
  const mnemonic = process.env.WALLET_MNEMONIC?.trim();

  if (mnemonic) {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return wallet.address;
  }

  const key = process.env.WALLET_PUBLIC_KEY;

  if (!key) {
    throw new Error("Set WALLET_MNEMONIC (12 words) or WALLET_PUBLIC_KEY");
  }

  return key;
};

export const getWallet = (): ethers.HDNodeWallet | ethers.Wallet => {
  const mnemonic = process.env.WALLET_MNEMONIC?.trim();

  if (mnemonic) {
    return ethers.Wallet.fromPhrase(mnemonic, getProvider());
  }

  const key = process.env.WALLET_PRIVATE_KEY;

  if (!key) {
    throw new Error("Set WALLET_MNEMONIC (12 words) or WALLET_PRIVATE_KEY");
  }

  return new ethers.Wallet(key, getProvider());
};

export const sendEth = async (
  to: string,
  amountEth: string
): Promise<TransactionResult> => {
  try {
    const wallet = getWallet();
    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(amountEth),
    });
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt?.hash ?? tx.hash,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
};

export const sendToken = async (
  to: string,
  amount: string,
  contractAddress: string
): Promise<TransactionResult> => {
  try {
    const wallet = getWallet();
    const contract = new ethers.Contract(
      contractAddress,
      ERC20_ABI,
      wallet
    );
    const tx = await contract.transfer(to, amount);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt?.hash ?? tx.hash,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
};

export const getEthBalanceRpc = async (): Promise<string> => {
  const wallet = getWallet();
  const balance = await getProvider().getBalance(wallet.address);

  return balance.toString();
};

export const getTokenBalanceRpc = async (
  contractAddress: string
): Promise<string> => {
  const wallet = getWallet();
  const contract = new ethers.Contract(
    contractAddress,
    ERC20_ABI,
    getProvider()
  );
  const balance = await contract.balanceOf(wallet.address);

  return balance.toString();
};

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
}

export const getTokenInfoRpc = async (
  contractAddress: string
): Promise<TokenInfo> => {
  const contract = new ethers.Contract(
    contractAddress,
    ERC20_ABI,
    getProvider()
  );
  const [name, symbol, decimals] = await Promise.all([
    contract.name().catch(() => ""),
    contract.symbol().catch(() => ""),
    contract.decimals().then((d: bigint) => Number(d)).catch(() => 18),
  ]);

  return {
    name: typeof name === "string" ? name : "",
    symbol: typeof symbol === "string" ? symbol : "",
    decimals: Number.isFinite(decimals) ? decimals : 18,
  };
};

export const getTokenInfo = getTokenInfoRpc;
