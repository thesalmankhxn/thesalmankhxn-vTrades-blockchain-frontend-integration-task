"use client";

import { useEffect } from "react";
import { useWalletStore } from "@/store/wallet-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wallet, LogOut, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Wallet connection component
 * Displays wallet status and provides connect/disconnect functionality
 */
export function WalletConnect() {
  const {
    address,
    fullAddress,
    network,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    clearError,
  } = useWalletStore();

  /**
   * Handle wallet connection
   */
  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success("Wallet connected successfully!");
    } catch (error) {
      toast.error(`Failed to connect wallet: ${error}`);
    }
  };

  /**
   * Handle wallet disconnection
   */
  const handleDisconnect = () => {
    disconnectWallet();
    toast.success("Wallet disconnected");
  };

  /**
   * Clear error when component unmounts or error changes
   */
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Check if we're in browser environment
  const isBrowser = typeof window !== "undefined";
  const isMetaMaskAvailable = isBrowser && !!window.ethereum;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to interact with the dApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Connected
                </Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-gray-400" />
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-600"
                >
                  Disconnected
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Wallet Address */}
        {isConnected && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Address:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {address}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 break-all">
                {fullAddress}
              </div>
            </div>
          </>
        )}

        {/* Network Information */}
        {isConnected && network && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Network:</span>
              <Badge variant="outline">
                {network.name} (Chain ID: {network.chainId})
              </Badge>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <Separator />
        <div className="flex gap-2">
          {!isConnected ? (
            <Button
              onClick={handleConnect}
              disabled={isLoading || !isMetaMaskAvailable}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </div>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="flex-1"
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Disconnect
              </div>
            </Button>
          )}
        </div>

        {/* MetaMask Installation Notice */}
        {!isMetaMaskAvailable && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">MetaMask not detected</p>
                <p className="text-xs mt-1">
                  Please install MetaMask extension to use this dApp.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
