"use client";

import { useState } from "react";
import { useWalletStore } from "@/store/wallet-store";
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
import { Badge } from "@/components/ui/badge";
import { Contract, ethers } from "ethers";
import { Send, Coins, FileText, AlertCircle } from "lucide-react";
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
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
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

    try {
      setIsLoading(true);
      const contract = new Contract(contractAddress, ERC20_ABI, signer);

      // Get contract information
      const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
        contract.balanceOf(await signer.getAddress()),
      ]);

      setContractInfo({
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        balance: ethers.formatUnits(balance, decimals),
      });

      toast.success("Contract information retrieved successfully!");
    } catch (error) {
      console.error("Error getting contract info:", error);
      toast.error(
        "Failed to get contract information. Please check the contract address."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send tokens to another address
   */
  const sendTokens = async () => {
    if (!signer || !contractAddress || !recipientAddress || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const contract = new Contract(contractAddress, ERC20_ABI, signer);

      // Convert amount to wei based on token decimals
      const decimals = await contract.decimals();
      const amountInWei = ethers.parseUnits(amount, decimals);

      // Send transaction
      const tx = await contract.transfer(recipientAddress, amountInWei);

      toast.success("Transaction sent! Waiting for confirmation...");

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt) {
        toast.success(
          `Transaction confirmed! Hash: ${receipt.hash.slice(0, 10)}...`
        );
      } else {
        toast.success("Transaction sent successfully!");
      }

      // Refresh contract info
      await getContractInfo();

      // Clear form
      setRecipientAddress("");
      setAmount("");
    } catch (error) {
      console.error("Error sending tokens:", error);
      toast.error(
        "Failed to send tokens. Please check the details and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send ETH to another address
   */
  const sendETH = async () => {
    if (!signer || !recipientAddress || !amount) {
      toast.error("Please fill in recipient address and amount");
      return;
    }

    try {
      setIsLoading(true);

      // Convert amount to wei
      const amountInWei = ethers.parseEther(amount);

      // Send transaction
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: amountInWei,
      });

      toast.success("ETH transaction sent! Waiting for confirmation...");

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt) {
        toast.success(
          `ETH transaction confirmed! Hash: ${receipt.hash.slice(0, 10)}...`
        );
      } else {
        toast.success("ETH transaction sent successfully!");
      }

      // Clear form
      setRecipientAddress("");
      setAmount("");
    } catch (error) {
      console.error("Error sending ETH:", error);
      toast.error(
        "Failed to send ETH. Please check the details and try again."
      );
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

      {/* Token Transfer Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Token Transfer
          </CardTitle>
          <CardDescription>
            Transfer ERC-20 tokens to another address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={sendTokens}
              disabled={
                isLoading || !contractAddress || !recipientAddress || !amount
              }
              className="flex-1"
            >
              {isLoading
                ? "Sending..."
                : `Send ${contractInfo?.symbol || "Tokens"}`}
            </Button>
            <Button
              onClick={sendETH}
              disabled={isLoading || !recipientAddress || !amount}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? "Sending..." : "Send ETH"}
            </Button>
          </div>
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
