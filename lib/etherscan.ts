import axios from "axios";
import type { EtherscanTx } from "./types";

const BASE_URL = "https://api.etherscan.io/v2/api";

export const ETHERSCAN_TX_URL = "https://etherscan.io/tx";

interface EtherscanResponse<T> {
  status: string;
  message: string;
  result: T;
}

const getApiKey = (): string => {
  const key = process.env.ETHERSCAN_API_KEY;
  if (!key) {
    throw new Error("ETHERSCAN_API_KEY is not set");
  }
  return key;
};

const CHAIN_ID = "1";

const NO_TRANSACTIONS = "No transactions found";

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

const MAX_REQUESTS_PER_SECOND = 3;
const MIN_INTERVAL_MS = Math.ceil(1000 / MAX_REQUESTS_PER_SECOND);

let lastRequestTime = 0;
let rateLimitTail: Promise<void> = Promise.resolve();

const rateLimit = async (): Promise<void> => {
  const prev = rateLimitTail;
  let resolve!: () => void;
  rateLimitTail = new Promise<void>((r) => {
    resolve = r;
  });

  await prev;

  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise((r) => setTimeout(r, MIN_INTERVAL_MS - elapsed));
  }

  lastRequestTime = Date.now();
  resolve();
};

const request = async <T>(
  params: Record<string, string>,
  options?: { emptyOnNoRecords?: T }
): Promise<T> => {
  const url = new URL(BASE_URL);
  url.searchParams.set("chainid", CHAIN_ID);
  url.searchParams.set("apikey", getApiKey());
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  let lastError: Error | null = null;

  // Added a few attempts to handle rate limiting errors.
  // On free plan they're quite frequent
  // And I wasn't sure how to handle them properly
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      await rateLimit();

      const res = await axios.get<EtherscanResponse<T>>(url.toString(), {
        validateStatus: () => true,
      });

      if (res.status < 200 || res.status >= 300) {
        throw new Error(`Etherscan API error: ${res.status} ${res.statusText}`);
      }

      if (res.data.status !== "1") {
        const msg = String(res.data.result ?? res.data.message);

        if (
          options?.emptyOnNoRecords != null &&
          (res.data.message === NO_TRANSACTIONS || msg === NO_TRANSACTIONS)
        ) {
          return options.emptyOnNoRecords;
        }

        throw new Error(`Etherscan API: ${res.data.message} ${res.data.result}`);
      }

      return res.data.result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < RETRY_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    }
  }

  throw lastError ?? new Error("Etherscan API: request failed");
};

export const getEthBalance = async (address: string): Promise<string> => {
  const result = await request<string>({
    module: "account",
    action: "balance",
    address,
    tag: "latest",
  });

  return String(result);
};

export const getTokenBalance = async (
  address: string,
  contractAddress: string
): Promise<string> => {
  const result = await request<string>({
    module: "account",
    action: "tokenbalance",
    contractaddress: contractAddress,
    address,
    tag: "latest",
  });

  return String(result);
};

export const getTokenTransactions = async (
  address: string,
  contractAddress: string
): Promise<EtherscanTx[]> => {
  const result = await request<EtherscanTx[] | string>(
    {
      module: "account",
      action: "tokentx",
      address,
      contractaddress: contractAddress,
    },
    { emptyOnNoRecords: [] as EtherscanTx[] }
  );
  if (typeof result === "string" || !Array.isArray(result)) {
    return [];
  }

  return result;
};

export const getEthTransactions = async (
  address: string
): Promise<EtherscanTx[]> => {
  const result = await request<EtherscanTx[] | string>(
    {
      module: "account",
      action: "txlist",
      address,
    },
    { emptyOnNoRecords: [] as EtherscanTx[] }
  );
  if (typeof result === "string" || !Array.isArray(result)) {
    return [];
  }

  return result;
};

// Returns timestamp of the first user transaction
export const getJoinedAtTimestamp = async (
  address: string
): Promise<number | null> => {
  const result = await request<EtherscanTx[] | string>(
    {
      module: "account",
      action: "txlist",
      address,
      sort: "asc",
      page: "1",
      offset: "1",
    },
    { emptyOnNoRecords: [] as EtherscanTx[] }
  );
  if (typeof result === "string" || !Array.isArray(result) || result.length === 0) {
    return null;
  }

  const ts = parseInt(result[0].timeStamp, 10);
  return Number.isNaN(ts) ? null : ts;
};

export const getEthPrice = async (): Promise<number> => {
  const result = await request<{ ethusd: string }>({
    module: "stats",
    action: "ethprice",
  });
  const ethusd =
    typeof result === "object" && result !== null && "ethusd" in result
      ? (result as { ethusd: string }).ethusd
      : null;

  if (ethusd == null) {
    throw new Error("Etherscan API: ethprice result missing ethusd");
  }

  return Number(ethusd);
};
