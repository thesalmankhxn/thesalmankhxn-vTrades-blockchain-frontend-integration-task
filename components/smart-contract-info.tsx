"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletStore } from "@/store/wallet-store";
import { Contract, ethers } from "ethers";
import { AlertCircle, Coins, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Example smart contract ABI for demonstration
 * This is a simple ERC-20 token interface
 */
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
] as const;

/**
 * Smart contract demo component
 * Demonstrates wallet integration with smart contract interactions
 */
export function SmartContractDemo() {
  const { signer, isConnected, address } = useWalletStore();
  const [contractAddress, setContractAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contractInfo, setContractInfo] = useState<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    balance: string;
  } | null>(null);

  /**
   * Get contract information (name, symbol, decimals, etc.)
   */
  const getContractInfo = async () => {
    if (!signer || !contractAddress) {
      toast.error("Please connect wallet and enter contract address");
      return;
    }

    // Validate contract address format
    if (!ethers.isAddress(contractAddress)) {
      toast.error("Please enter a valid contract address");
      return;
    }

    try {
      setIsLoading(true);
      const contract = new Contract(contractAddress, ERC20_ABI, signer);

      // First check if the contract exists by getting its code
      const code = await signer.provider?.getCode(contractAddress);
      if (code === "0x") {
        toast.error("No contract found at this address");
        return;
      }

      // Try to get contract information with individual error handling
      let name, symbol, decimals, totalSupply, balance;

      try {
        name = await contract.name();
      } catch (error) {
        console.warn("Contract doesn't have name() function:", error);
        name = "Unknown";
      }

      try {
        symbol = await contract.symbol();
      } catch (error) {
        console.warn("Contract doesn't have symbol() function:", error);
        symbol = "???";
      }

      try {
        decimals = await contract.decimals();
      } catch (error) {
        console.warn("Contract doesn't have decimals() function:", error);
        decimals = 18; // Default to 18 decimals
      }

      try {
        totalSupply = await contract.totalSupply();
      } catch (error) {
        console.warn("Contract doesn't have totalSupply() function:", error);
        totalSupply = ethers.parseUnits("0", decimals);
      }

      try {
        balance = await contract.balanceOf(await signer.getAddress());
      } catch (error) {
        console.warn("Contract doesn't have balanceOf() function:", error);
        balance = ethers.parseUnits("0", decimals);
      }

      setContractInfo({
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        balance: ethers.formatUnits(balance, decimals),
      });

      // Check if this is actually an ERC-20 token
      if (name === "Unknown" && symbol === "???") {
        toast.warning("This contract may not be a standard ERC-20 token");
      } else {
        toast.success("Contract information retrieved successfully!");
      }
    } catch (error) {
      console.error("Error getting contract info:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("execution reverted")) {
          toast.error(
            "Contract call reverted. This may not be an ERC-20 token."
          );
        } else if (error.message.includes("network")) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(
            "Failed to get contract information. Please check the contract address."
          );
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Smart Contract Demo
          </CardTitle>
          <CardDescription>
            Connect your wallet to interact with smart contracts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Please connect your wallet to use smart contract features
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contract Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Smart Contract Information
          </CardTitle>
          <CardDescription>Get information about ERC-20 tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter contract address (0x...)"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={getContractInfo}
              disabled={isLoading || !contractAddress}
            >
              {isLoading ? "Loading..." : "Get Info"}
            </Button>
          </div>

          {contractInfo && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-xs text-gray-600">Name</Label>
                <p className="font-medium">{contractInfo.name}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Symbol</Label>
                <p className="font-medium">{contractInfo.symbol}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Your Balance</Label>
                <p className="font-medium">{contractInfo.balance}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Total Supply</Label>
                <p className="font-medium">{contractInfo.totalSupply}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connected Wallet Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Connected Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Address:</span>
            <Badge variant="outline" className="font-mono">
              {address}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
