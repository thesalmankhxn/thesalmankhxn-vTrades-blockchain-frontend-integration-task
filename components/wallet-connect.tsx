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
import {
  Wallet,
  LogOut,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { isWalletSessionValid } from "@/lib/utils";

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
    lastConnectedAt,
    sessionTimeout,
    connectWallet,
    disconnectWallet,
    clearError,
    clearStoredData,
    attemptReconnection,
    clearStuckConnection,
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
   * Handle clearing stored data
   */
  const handleClearStoredData = () => {
    clearStoredData();
    toast.success("Stored wallet data cleared");
  };

  /**
   * Handle manual reconnection attempt
   */
  const handleReconnect = async () => {
    try {
      await attemptReconnection();
      toast.success("Wallet reconnected successfully!");
    } catch (error) {
      toast.error(`Failed to reconnect wallet: ${error}`);
    }
  };

  /**
   * Handle clearing stuck connections
   */
  const handleClearStuckConnection = () => {
    clearStuckConnection();
    toast.success("Stuck connection cleared. Please try connecting again.");
  };

  /**
   * Clear error when component unmounts or error changes
   */
  useEffect(() => {
    if (error) {
      // Don't show toast for pending request errors as we have a dedicated UI for them
      if (!error.includes("pending")) {
        toast.error(error);
      }
      clearError();
    }
  }, [error, clearError]);

  // Check if we're in browser environment
  const isBrowser = typeof window !== "undefined";
  const isMetaMaskAvailable = isBrowser && !!window.ethereum;

  // Determine loading text based on context
  const getLoadingText = () => {
    if (isLoading && !isConnected) {
      return "Connecting...";
    } else if (isLoading && isConnected) {
      return "Reconnecting...";
    }
    return "Connecting...";
  };

  // Calculate session info
  const sessionInfo = lastConnectedAt
    ? {
        isValid: isWalletSessionValid(lastConnectedAt, sessionTimeout),
        timeRemaining: Math.max(
          0,
          sessionTimeout - (Date.now() - lastConnectedAt)
        ),
        formattedTime: new Date(lastConnectedAt).toLocaleString(),
      }
    : null;

  // Format remaining time
  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

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
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  {isConnected ? "Reconnecting" : "Connecting"}
                </Badge>
              </>
            ) : isConnected ? (
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

        {/* Session Information */}
        {sessionInfo && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Session:</span>
                <Badge
                  variant="outline"
                  className={
                    sessionInfo.isValid ? "text-green-600" : "text-red-600"
                  }
                >
                  {sessionInfo.isValid ? "Valid" : "Expired"}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Connected: {sessionInfo.formattedTime}</div>
                {sessionInfo.isValid && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expires in: {formatTimeRemaining(sessionInfo.timeRemaining)}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <Separator />
        <div className="flex gap-2">
          {!isConnected ? (
            <>
              <Button
                onClick={handleConnect}
                disabled={isLoading || !isMetaMaskAvailable}
                className="flex-1"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {getLoadingText()}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </div>
                )}
              </Button>
              {/* Show reconnection button if there's valid session data */}
              {sessionInfo && sessionInfo.isValid && (
                <Button
                  onClick={handleReconnect}
                  variant="outline"
                  disabled={isLoading}
                  className="flex-1"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Reconnect
                  </div>
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Disconnect
              </div>
            </Button>
          )}
        </div>

        {/* Clear Stored Data Button */}
        {(isConnected || sessionInfo) && (
          <Button
            onClick={handleClearStoredData}
            variant="ghost"
            size="sm"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Clear Stored Data
            </div>
          </Button>
        )}

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

        {/* Auto-reconnection Notice */}
        {isLoading && isConnected && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0 animate-spin" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Auto-reconnecting</p>
                <p className="text-xs mt-1">
                  Restoring your previous wallet connection...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Connection Troubleshooting */}
        {error && error.includes("pending") && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800">
                <p className="font-medium">Connection Issue Detected</p>
                <p className="text-xs mt-1 mb-2">
                  MetaMask has a pending connection request. This can happen if
                  you have multiple tabs open or a previous request is stuck.
                </p>
                <Button
                  onClick={handleClearStuckConnection}
                  variant="outline"
                  size="sm"
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  Clear Stuck Connection
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* General Connection Troubleshooting */}
        {error && !error.includes("pending") && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-800">
                <p className="font-medium">Connection Troubleshooting</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Make sure MetaMask is unlocked</li>
                  <li>• Check if you have multiple tabs open with this dApp</li>
                  <li>• Try refreshing the page and connecting again</li>
                  <li>
                    • Ensure you&apos;re on the correct network in MetaMask
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
