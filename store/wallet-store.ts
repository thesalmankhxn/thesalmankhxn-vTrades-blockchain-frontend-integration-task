import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ethers } from "ethers";
import { isWalletSessionValid, SESSION_TIMEOUTS } from "@/lib/utils";

/**
 * Wallet state interface defining the structure of wallet-related data
 */
interface WalletState {
  /** Current wallet address (shortened for display) */
  address: string;
  /** Full wallet address */
  fullAddress: string;
  /** Current network information */
  network: {
    name: string;
    chainId: number;
  } | null;
  /** Connection status */
  isConnected: boolean;
  /** Loading state for wallet operations */
  isLoading: boolean;
  /** Ethers.js provider instance */
  provider: ethers.BrowserProvider | null;
  /** Ethers.js signer instance */
  signer: ethers.JsonRpcSigner | null;
  /** Error message for wallet operations */
  error: string | null;
  /** Timestamp of last connection for session management */
  lastConnectedAt: number | null;
  /** Session timeout in milliseconds */
  sessionTimeout: number;
}

/**
 * Wallet actions interface defining available wallet operations
 */
interface WalletActions {
  /** Connect to MetaMask wallet */
  connectWallet: () => Promise<void>;
  /** Disconnect from wallet */
  disconnectWallet: () => void;
  /** Update wallet state from provider */
  updateWalletState: () => Promise<void>;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Clear error message */
  clearError: () => void;
  /** Initialize wallet from stored state */
  initializeWallet: () => Promise<void>;
  /** Manually attempt to reconnect to previously connected wallet */
  attemptReconnection: () => Promise<void>;
  /** Set session timeout */
  setSessionTimeout: (timeout: number) => void;
  /** Clear all stored wallet data */
  clearStoredData: () => void;
  /** Clear stuck connections and reset wallet state */
  clearStuckConnection: () => void;
}

/**
 * Zustand store for wallet state management
 * Handles MetaMask integration, connection state, and wallet operations
 * Includes localStorage persistence for wallet connection state
 */
export const useWalletStore = create<WalletState & WalletActions>()(
  persist(
    (set, get) => ({
      // Initial state
      address: "",
      fullAddress: "",
      network: null,
      isConnected: false,
      isLoading: false,
      provider: null,
      signer: null,
      error: null,
      lastConnectedAt: null,
      sessionTimeout: SESSION_TIMEOUTS.ONE_DAY, // Default to 24 hours

      /**
       * Set session timeout for wallet persistence
       */
      setSessionTimeout: (timeout: number) => set({ sessionTimeout: timeout }),

      /**
       * Clear all stored wallet data
       */
      clearStoredData: () => {
        set({
          address: "",
          fullAddress: "",
          network: null,
          isConnected: false,
          provider: null,
          signer: null,
          error: null,
          lastConnectedAt: null,
        });
      },

      /**
       * Clear stuck connections and reset wallet state
       * Useful when MetaMask has pending requests
       */
      clearStuckConnection: () => {
        // Remove event listeners
        if (window.ethereum) {
          window.ethereum.removeListener(
            "accountsChanged",
            get().updateWalletState
          );
          window.ethereum.removeListener(
            "chainChanged",
            get().updateWalletState
          );
        }

        // Clear all data
        get().clearStoredData();

        console.log("Cleared stuck connection and reset wallet state");
      },

      /**
       * Initialize wallet from stored state
       * Attempts to reconnect if previously connected
       */
      initializeWallet: async () => {
        const { isConnected, lastConnectedAt, sessionTimeout } = get();

        // Check if we should attempt auto-reconnection
        if (isConnected && lastConnectedAt) {
          // Validate session using utility function
          if (isWalletSessionValid(lastConnectedAt, sessionTimeout)) {
            try {
              set({ isLoading: true });

              // Check if MetaMask is available
              if (!window.ethereum) {
                console.log("MetaMask not available, clearing stored state");
                get().clearStoredData();
                return;
              }

              // Check if accounts are still available WITHOUT requesting access
              // This prevents the popup from appearing during auto-reconnection
              const accounts = (await window.ethereum.request({
                method: "eth_accounts", // Use eth_accounts instead of eth_requestAccounts
              })) as string[];

              if (accounts && accounts.length > 0) {
                // Reconnect using existing accounts
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                const network = await provider.getNetwork();

                const shortenedAddress = `${address.slice(
                  0,
                  6
                )}...${address.slice(-4)}`;

                set({
                  address: shortenedAddress,
                  fullAddress: address,
                  network: {
                    name: network.name,
                    chainId: Number(network.chainId),
                  },
                  isConnected: true,
                  provider,
                  signer,
                  isLoading: false,
                });

                // Set up event listeners
                window.ethereum.on("accountsChanged", get().updateWalletState);
                window.ethereum.on("chainChanged", get().updateWalletState);

                console.log("Wallet auto-reconnected successfully");
              } else {
                // No accounts available, clear stored state
                console.log("No accounts available, clearing stored state");
                get().clearStoredData();
              }
            } catch (error) {
              console.error("Error during wallet initialization:", error);
              // Clear stored state on error
              get().clearStoredData();
            }
          } else {
            // Session expired, clear stored state
            console.log("Wallet session expired, clearing stored state");
            get().clearStoredData();
          }
        }
      },

      /**
       * Connect to MetaMask wallet
       * Requests account access and sets up provider/signer
       */
      connectWallet: async () => {
        try {
          set({ isLoading: true, error: null });

          // Check if MetaMask is installed
          if (!window.ethereum) {
            throw new Error(
              "MetaMask is not installed. Please install MetaMask to use this dApp."
            );
          }

          // Check if there's already a pending request
          const accounts = (await window.ethereum.request({
            method: "eth_accounts",
          })) as string[];

          // If accounts are already available, use them
          if (accounts && accounts.length > 0) {
            console.log("Accounts already available, connecting without popup");
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();

            const shortenedAddress = `${address.slice(0, 6)}...${address.slice(
              -4
            )}`;

            set({
              address: shortenedAddress,
              fullAddress: address,
              network: {
                name: network.name,
                chainId: Number(network.chainId),
              },
              isConnected: true,
              provider,
              signer,
              isLoading: false,
              lastConnectedAt: Date.now(),
            });

            // Set up event listeners for wallet changes
            window.ethereum.on("accountsChanged", get().updateWalletState);
            window.ethereum.on("chainChanged", get().updateWalletState);
            return;
          }

          // Request account access with proper error handling
          try {
            const requestedAccounts = (await window.ethereum.request({
              method: "eth_requestAccounts",
            })) as string[];

            if (!requestedAccounts || requestedAccounts.length === 0) {
              throw new Error(
                "No accounts found. Please connect your MetaMask wallet."
              );
            }

            // Create provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();

            // Format address for display (shortened version)
            const shortenedAddress = `${address.slice(0, 6)}...${address.slice(
              -4
            )}`;

            set({
              address: shortenedAddress,
              fullAddress: address,
              network: {
                name: network.name,
                chainId: Number(network.chainId),
              },
              isConnected: true,
              provider,
              signer,
              isLoading: false,
              lastConnectedAt: Date.now(),
            });

            // Set up event listeners for wallet changes
            window.ethereum.on("accountsChanged", get().updateWalletState);
            window.ethereum.on("chainChanged", get().updateWalletState);
          } catch (requestError: unknown) {
            // Handle specific MetaMask errors
            const error = requestError as { code?: number; message?: string };
            if (error.code === -32002) {
              throw new Error(
                "MetaMask connection request is already pending. Please check your MetaMask extension and approve the connection request."
              );
            } else if (error.code === 4001) {
              throw new Error(
                "Connection rejected by user. Please try again and approve the connection in MetaMask."
              );
            } else {
              throw new Error(
                `Failed to request account access: ${
                  error.message || String(requestError)
                }`
              );
            }
          }
        } catch (error) {
          console.error("Error connecting wallet:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to connect wallet",
            isLoading: false,
          });
        }
      },

      /**
       * Disconnect from wallet
       * Clears all wallet state and removes event listeners
       */
      disconnectWallet: () => {
        // Remove event listeners
        if (window.ethereum) {
          window.ethereum.removeListener(
            "accountsChanged",
            get().updateWalletState
          );
          window.ethereum.removeListener(
            "chainChanged",
            get().updateWalletState
          );
        }

        // Reset state
        get().clearStoredData();
      },

      /**
       * Update wallet state from current provider
       * Called when accounts or network change
       */
      updateWalletState: async () => {
        const { provider } = get();

        if (!provider) {
          get().disconnectWallet();
          return;
        }

        try {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();

          const shortenedAddress = `${address.slice(0, 6)}...${address.slice(
            -4
          )}`;

          set({
            address: shortenedAddress,
            fullAddress: address,
            network: {
              name: network.name,
              chainId: Number(network.chainId),
            },
            signer,
          });
        } catch (error) {
          console.error("Error updating wallet state:", error);
          get().disconnectWallet();
        }
      },

      /**
       * Set loading state for wallet operations
       */
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      /**
       * Set error message for wallet operations
       */
      setError: (error: string | null) => set({ error }),

      /**
       * Clear error message
       */
      clearError: () => set({ error: null }),

      /**
       * Manually attempt to reconnect to previously connected wallet
       */
      attemptReconnection: async () => {
        const { isConnected, lastConnectedAt, sessionTimeout } = get();

        if (isConnected && lastConnectedAt) {
          if (isWalletSessionValid(lastConnectedAt, sessionTimeout)) {
            try {
              set({ isLoading: true });

              // Check if MetaMask is available
              if (!window.ethereum) {
                console.log("MetaMask not available, clearing stored state");
                get().clearStoredData();
                return;
              }

              // Check if accounts are still available WITHOUT requesting access
              // This prevents the popup from appearing during auto-reconnection
              const accounts = (await window.ethereum.request({
                method: "eth_accounts", // Use eth_accounts instead of eth_requestAccounts
              })) as string[];

              if (accounts && accounts.length > 0) {
                // Reconnect using existing accounts
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                const network = await provider.getNetwork();

                const shortenedAddress = `${address.slice(
                  0,
                  6
                )}...${address.slice(-4)}`;

                set({
                  address: shortenedAddress,
                  fullAddress: address,
                  network: {
                    name: network.name,
                    chainId: Number(network.chainId),
                  },
                  isConnected: true,
                  provider,
                  signer,
                  isLoading: false,
                });

                // Set up event listeners
                window.ethereum.on("accountsChanged", get().updateWalletState);
                window.ethereum.on("chainChanged", get().updateWalletState);

                console.log("Wallet auto-reconnected successfully");
              } else {
                // No accounts available, clear stored state
                console.log("No accounts available, clearing stored state");
                get().clearStoredData();
              }
            } catch (error) {
              console.error("Error during wallet reconnection:", error);
              // Clear stored state on error
              get().clearStoredData();
            }
          } else {
            // Session expired, clear stored state
            console.log("Wallet session expired, clearing stored state");
            get().clearStoredData();
          }
        }
      },
    }),
    {
      name: "vtrades-wallet-storage", // Unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      // Only persist these fields (exclude provider and signer as they can't be serialized)
      partialize: (state) => ({
        address: state.address,
        fullAddress: state.fullAddress,
        network: state.network,
        isConnected: state.isConnected,
        lastConnectedAt: state.lastConnectedAt,
        sessionTimeout: state.sessionTimeout,
      }),
      // Custom merge function to handle provider/signer restoration
      onRehydrateStorage: () => () => {
        // Don't auto-initialize wallet on rehydration
        // Let users explicitly connect by clicking the "Connect Wallet" button
        // This ensures the MetaMask popup always appears for new connections
        console.log("Wallet store rehydrated, waiting for user to connect");
      },
    }
  )
);

// Extend Window interface for TypeScript support
declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: unknown[]) => void
      ) => void;
    };
  }
}
