"use server";

import { ethers } from "ethers";
import {
  getWalletAddress,
  getTokenContractAddress,
  getTokenInfo,
} from "@/lib/ethereum";
import * as etherscan from "@/lib/etherscan";
import {
  getCached,
  setCache,
  makeCacheKey,
  TTL_MS,
} from "@/app/actions/cache";
import type { WalletData } from "@/lib/types";

export const getWalletData = async (): Promise<WalletData> => {
  const publicKey = getWalletAddress();
  const cacheKey = makeCacheKey(publicKey, "walletData");
  const cached = getCached<WalletData>(cacheKey);

  if (cached) return cached;

  const contractAddress = getTokenContractAddress();

  const [ethBalanceWei, tokenBalanceRaw, tokenInfo, ethPrice, joinedAtTs] =
    await Promise.all([
      etherscan.getEthBalance(publicKey),
      etherscan.getTokenBalance(publicKey, contractAddress),
      getTokenInfo(contractAddress),
      etherscan.getEthPrice(),
      etherscan.getJoinedAtTimestamp(publicKey),
    ]);

  const ethBalanceEth = ethers.formatEther(ethBalanceWei);
  const decimals = tokenInfo.decimals || 18;
  const tokenBalanceFormatted = (
    Number(BigInt(tokenBalanceRaw)) /
    10 ** decimals
  ).toFixed(Math.min(decimals, 6));

  const ethValueUsd = parseFloat(ethBalanceEth) * ethPrice;
  const symbol = (tokenInfo.symbol || "").toUpperCase();
  const tokenValueUsd =
    symbol === "USDC"
      ? parseFloat(tokenBalanceFormatted)
      : 0;
  const totalValueUsd = tokenValueUsd + ethValueUsd;

  const joinedAt =
    joinedAtTs != null
      ? new Date(joinedAtTs * 1000).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

  const data: WalletData = {
    address: publicKey,
    ethBalance: ethBalanceEth,
    tokenBalance: tokenBalanceFormatted,
    tokenSymbol: tokenInfo.symbol,
    tokenName: tokenInfo.name,
    tokenValueUsd,
    portfolioValueUsd: ethValueUsd,
    totalValueUsd,
    joinedAt,
  };

  setCache(cacheKey, data, TTL_MS);

  return data;
};

