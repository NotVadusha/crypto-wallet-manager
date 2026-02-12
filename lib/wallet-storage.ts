const WALLET_NAME_KEY_PREFIX = "walletName:";
const WALLET_AVATAR_KEY_PREFIX = "walletAvatar:";

export const DEFAULT_WALLET_NAME = "Wallet";

export const getStoredWalletName = (address: string): string => {
  if (typeof window === "undefined") return DEFAULT_WALLET_NAME;

  try {
    const stored = localStorage.getItem(`${WALLET_NAME_KEY_PREFIX}${address}`);
    return stored ?? DEFAULT_WALLET_NAME;
  } catch {
    return DEFAULT_WALLET_NAME;
  }
};

export const setStoredWalletName = (address: string, name: string): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(`${WALLET_NAME_KEY_PREFIX}${address}`, name);
  } catch (e) {
    console.error("Failed to set stored wallet name", address, name, e);
  }
};

export const getStoredAvatar = (address: string): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(
      `${WALLET_AVATAR_KEY_PREFIX}${address}`
    );
    return stored && stored.trim() ? stored.trim() : null;
  } catch {
    return null;
  }
};

export const setStoredAvatar = (address: string, url: string | null): void => {
  if (typeof window === "undefined") return;

  try {
    if (url == null || !url.trim()) {
      localStorage.removeItem(`${WALLET_AVATAR_KEY_PREFIX}${address}`);
    } else {
      localStorage.setItem(`${WALLET_AVATAR_KEY_PREFIX}${address}`, url.trim());
    }
  } catch (e) {
    console.error("Failed to set stored avatar", address, url, e);
  }
};
