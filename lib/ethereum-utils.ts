import { ethers } from "ethers";

/**
 * Validate if a string is a valid Ethereum address
 * @param address - The address to validate
 * @returns True if valid, false otherwise
 */
export function isValidAddress(address: string): boolean {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format an Ethereum address for display (shortened version)
 * @param address - The full address to format
 * @returns Shortened address (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!isValidAddress(address)) {
    return "Invalid Address";
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format ETH balance with proper decimal places
 * @param balance - Balance in wei
 * @param decimals - Number of decimal places (default: 18 for ETH)
 * @returns Formatted balance string
 */
export function formatBalance(balance: bigint, decimals: number = 18): string {
  try {
    return ethers.formatUnits(balance, decimals);
  } catch {
    return "0";
  }
}

/**
 * Parse amount string to wei
 * @param amount - Amount string (e.g., "1.5")
 * @param decimals - Number of decimal places (default: 18 for ETH)
 * @returns Amount in wei as bigint
 */
export function parseAmount(amount: string, decimals: number = 18): bigint {
  try {
    return ethers.parseUnits(amount, decimals);
  } catch {
    throw new Error("Invalid amount format");
  }
}

/**
 * Get network name by chain ID
 * @param chainId - The chain ID
 * @returns Network name
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: "Ethereum Mainnet",
    3: "Ropsten Testnet",
    4: "Rinkeby Testnet",
    5: "Goerli Testnet",
    10: "Optimism",
    56: "Binance Smart Chain",
    137: "Polygon",
    42161: "Arbitrum One",
    43114: "Avalanche C-Chain",
    80001: "Mumbai Testnet",
    11155111: "Sepolia Testnet",
  };

  return networks[chainId] || `Chain ID ${chainId}`;
}

/**
 * Check if MetaMask is installed
 * @returns True if MetaMask is available
 */
export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

/**
 * Get current account from MetaMask
 * @returns Promise resolving to current account address
 */
export async function getCurrentAccount(): Promise<string | null> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const accounts = (await window.ethereum!.request({
      method: "eth_accounts",
    })) as string[];

    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
}

/**
 * Switch to a specific network in MetaMask
 * @param chainId - The chain ID to switch to
 * @returns Promise that resolves when network is switched
 */
export async function switchNetwork(chainId: number): Promise<void> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum!.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: unknown) {
    // If the network doesn't exist, add it
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 4902
    ) {
      throw new Error(
        `Network with chain ID ${chainId} is not configured in MetaMask`
      );
    }
    throw error;
  }
}

/**
 * Add a custom network to MetaMask
 * @param networkConfig - Network configuration object
 * @returns Promise that resolves when network is added
 */
export async function addNetwork(networkConfig: {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
}): Promise<void> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum!.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${networkConfig.chainId.toString(16)}`,
          chainName: networkConfig.chainName,
          nativeCurrency: networkConfig.nativeCurrency,
          rpcUrls: networkConfig.rpcUrls,
          blockExplorerUrls: networkConfig.blockExplorerUrls,
        },
      ],
    });
  } catch (error) {
    console.error("Error adding network:", error);
    throw error;
  }
}
