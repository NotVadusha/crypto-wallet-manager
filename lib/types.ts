export interface WalletData {
  address: string;
  ethBalance: string;
  tokenBalance: string;
  tokenSymbol: string;
  tokenName: string;
  tokenValueUsd: number;
  portfolioValueUsd: number;
  totalValueUsd: number;
  joinedAt: string | null;
}

export interface PortfolioPosition {
  token: string;
  symbol: string;
  balance: string;
  valueUsd: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface ChartDataPoint {
  timestamp: number;
  date: string;
  value: number;
}

export interface ProfitLossChartResult {
  data: ChartDataPoint[];
  totalProfitLoss: number;
  totalProfitLossPercent: number;
}

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export type TimePeriod = "1H" | "6H" | "1D" | "1W" | "1M" | "All";

export interface EtherscanTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenDecimal?: string;
  tokenSymbol?: string;
  tokenName?: string;
  contractAddress?: string;
}
