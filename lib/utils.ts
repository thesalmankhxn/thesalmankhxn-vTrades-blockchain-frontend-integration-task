import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if localStorage is available in the current environment
 * Useful for SSR/SSG compatibility
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely get item from localStorage
 * Returns null if localStorage is not available or item doesn't exist
 */
export function getLocalStorageItem(key: string): string | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely set item in localStorage
 * Returns false if localStorage is not available
 */
export function setLocalStorageItem(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely remove item from localStorage
 * Returns false if localStorage is not available
 */
export function removeLocalStorageItem(key: string): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all wallet-related localStorage items
 * Useful for complete wallet cleanup
 */
export function clearWalletStorage(): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    // Remove the main wallet storage
    localStorage.removeItem("vtrades-wallet-storage");

    // Remove any other wallet-related items
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.includes("wallet") || key.includes("vtrades")) {
        localStorage.removeItem(key);
      }
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a wallet session is still valid
 * @param lastConnectedAt - Timestamp of last connection
 * @param sessionTimeout - Session timeout in milliseconds (default: 24 hours)
 */
export function isWalletSessionValid(
  lastConnectedAt: number | null,
  sessionTimeout: number = 24 * 60 * 60 * 1000
): boolean {
  if (!lastConnectedAt) return false;

  const now = Date.now();
  return now - lastConnectedAt < sessionTimeout;
}

/**
 * Format wallet address for display
 * Shows first 6 and last 4 characters
 */
export function formatWalletAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Validate Ethereum address format
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get session timeout options
 */
export const SESSION_TIMEOUTS = {
  ONE_HOUR: 60 * 60 * 1000,
  SIX_HOURS: 6 * 60 * 60 * 1000,
  TWELVE_HOURS: 12 * 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;
