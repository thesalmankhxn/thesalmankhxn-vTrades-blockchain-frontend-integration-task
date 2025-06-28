"use client";

import { useEffect, useState } from "react";
import { WalletConnect } from "@/components/wallet-connect";
import { SmartContractDemo } from "@/components/smart-contract-info";
import { useWalletStore } from "@/store/wallet-store";

/**
 * Main application page
 * Displays wallet connection and smart contract interaction features
 */
export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { initializeWallet } = useWalletStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * Initialize wallet when component mounts
   * This handles auto-reconnection from localStorage
   */
  useEffect(() => {
    if (isClient) {
      initializeWallet();
    }
  }, [isClient, initializeWallet]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            vTrades dApp
          </h1>
          <p className="text-lg text-gray-600">
            A decentralized application with MetaMask wallet integration
          </p>
        </div>

        {/* Main Content */}
        {isClient ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wallet Connection */}
            <div>
              <WalletConnect />
            </div>

            {/* Smart Contract Demo */}
            <div>
              <SmartContractDemo />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Loading skeletons */}
            <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 text-gray-500">
          <p>Built with Next.js, Ethers.js, and Zustand</p>
        </div>
      </div>
    </div>
  );
}
