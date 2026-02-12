"use server";

import { ethers } from "ethers";
import {
  getWalletAddress,
  getTokenContractAddress,
  getTokenInfo,
} from "@/lib/ethereum";
import { formatChartDate } from "@/lib/chart-utils";
import * as etherscan from "@/lib/etherscan";
import {
  getCached,
  setCache,
  makeCacheKey,
  TTL_MS,
} from "@/app/actions/cache";
import type { ChartDataPoint, ProfitLossChartResult, TimePeriod } from "@/lib/types";

const PERIOD_MS: Record<TimePeriod, number> = {
  "1H": 60 * 60 * 1000,
  "6H": 6 * 60 * 60 * 1000,
  "1D": 24 * 60 * 60 * 1000,
  "1W": 7 * 24 * 60 * 60 * 1000,
  "1M": 30 * 24 * 60 * 60 * 1000,
  All: 365 * 24 * 60 * 60 * 1000,
};

const BUCKET_MS: Record<TimePeriod, number> = {
  "1H": 5 * 60 * 1000,
  "6H": 30 * 60 * 1000,
  "1D": 60 * 60 * 1000,
  "1W": 6 * 60 * 60 * 1000,
  "1M": 24 * 60 * 60 * 1000,
  All: 7 * 24 * 60 * 60 * 1000,
};

export const getProfitLossHistory = async (
  period: TimePeriod
): Promise<ProfitLossChartResult> => {
  const publicKey = getWalletAddress();
  const cacheKey = makeCacheKey(publicKey, "chart", period);
  const cached = getCached<ProfitLossChartResult>(cacheKey);

  if (cached) return cached;

  const contractAddress = getTokenContractAddress();

  const [ethTxs, tokenTxs, ethPrice, tokenInfo] = await Promise.all([
    etherscan.getEthTransactions(publicKey),
    etherscan.getTokenTransactions(publicKey, contractAddress),
    etherscan.getEthPrice(),
    getTokenInfo(contractAddress),
  ]);

  const tokenDecimals = tokenInfo.decimals || 18;

  type TxRow = { tsMs: number; type: "eth" | "token"; deltaEth: number; deltaToken: number };
  const rows: TxRow[] = [];

  for (const tx of ethTxs) {
    const tsMs = Number(tx.timeStamp) * 1000;
    const valueEth = Number(ethers.formatEther(tx.value));
    const isIn = tx.to?.toLowerCase() === publicKey.toLowerCase();
    rows.push({
      tsMs,
      type: "eth",
      deltaEth: isIn ? valueEth : -valueEth,
      deltaToken: 0,
    });
  }

  for (const tx of tokenTxs) {
    const tsMs = Number(tx.timeStamp) * 1000;
    const dec = tx.tokenDecimal ? parseInt(tx.tokenDecimal, 10) : tokenDecimals;
    const valueToken = Number(tx.value) / 10 ** dec;
    const isIn = tx.to?.toLowerCase() === publicKey.toLowerCase();
    rows.push({
      tsMs,
      type: "token",
      deltaEth: 0,
      deltaToken: isIn ? valueToken : -valueToken,
    });
  }

  rows.sort((a, b) => a.tsMs - b.tsMs);

  const now = Date.now();
  const periodMs = PERIOD_MS[period];
  let startMs = now - periodMs;
  const bucketMs = BUCKET_MS[period];

  if (rows.length > 0 && period === "All") {
    const firstTs = rows[0].tsMs;
    if (firstTs < startMs) startMs = firstTs;
  }

  type EventPoint = { tsMs: number; balanceEth: number };
  const events: EventPoint[] = [];
  let balanceEth = 0;

  for (const r of rows) {
    balanceEth += r.deltaEth;
    events.push({ tsMs: r.tsMs, balanceEth });
  }

  const data: ChartDataPoint[] = [];
  let eventIndex = -1;
  let t = startMs;

  while (t <= now) {
    while (eventIndex + 1 < events.length && events[eventIndex + 1].tsMs <= t) {
      eventIndex++;
    }
    const ethBalance = eventIndex >= 0 ? events[eventIndex].balanceEth : 0;
    data.push({
      timestamp: t,
      date: formatChartDate(t, period),
      value: Math.round(ethBalance * ethPrice * 100) / 100,
    });
    t += bucketMs;
  }

  if (data.length > 0 && data[data.length - 1].timestamp < now) {
    const lastBalance =
      events.length > 0 ? events[events.length - 1].balanceEth : 0;
    data.push({
      timestamp: now,
      date: formatChartDate(now, period),
      value: Math.round(lastBalance * ethPrice * 100) / 100,
    });
  }

  const firstValue = data[0]?.value ?? 0;
  const lastValue = data[data.length - 1]?.value ?? 0;
  const totalProfitLoss = lastValue - firstValue;
  const totalProfitLossPercent =
    firstValue !== 0 ? (totalProfitLoss / firstValue) * 100 : 0;

  const result = {
    data,
    totalProfitLoss,
    totalProfitLossPercent,
  };

  setCache(cacheKey, result, TTL_MS);

  return result;
};
