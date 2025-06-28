# vTrades dApp - Blockchain Frontend Integration

A decentralized application (dApp) built with Next.js, featuring MetaMask wallet integration, smart contract interactions, and state management using Zustand.

## 🚀 Features

### Wallet Integration
- **MetaMask Integration**: Seamless connection with MetaMask wallet
- **Connect/Disconnect**: Easy wallet connection and disconnection
- **Address Display**: Shows connected wallet address (shortened and full)
- **Network Information**: Displays current network and chain ID
- **Event Handling**: Automatically handles wallet and network changes

### Smart Contract Interaction
- **ERC-20 Token Support**: Interact with any ERC-20 token contract
- **Token Information**: Get token name, symbol, decimals, and total supply
- **Balance Checking**: View your token balance
- **Token Transfer**: Send tokens to other addresses
- **ETH Transfer**: Send native ETH to other addresses
- **Transaction Confirmation**: Real-time transaction status updates

### State Management
- **Zustand Store**: Efficient state management for wallet data
- **Persistent State**: Wallet connection state management
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during wallet operations

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 15 with React 19
- **Blockchain Integration**: Ethers.js v6
- **State Management**: Zustand
- **UI Components**: Radix UI + Tailwind CSS
- **Styling**: Tailwind CSS
- **Notifications**: Sonner
- **Type Safety**: TypeScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thesalmankhxn:vTrades:blockchain-frontend-integration-task
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Prerequisites

- **MetaMask Extension**: Install MetaMask browser extension
- **Test Network**: Configure MetaMask with a test network (Sepolia, Goerli, etc.)
- **Test ETH**: Get some test ETH from a faucet for testing transactions

## 🎯 Usage

### Connecting Your Wallet

1. Click the "Connect Wallet" button
2. Approve the connection in MetaMask
3. Your wallet address and network information will be displayed

### Interacting with Smart Contracts

1. **Get Token Information**:
   - Enter an ERC-20 contract address
   - Click "Get Info" to retrieve token details

2. **Send Tokens**:
   - Enter recipient address and amount
   - Click "Send Tokens" to transfer ERC-20 tokens

3. **Send ETH**:
   - Enter recipient address and amount
   - Click "Send ETH" to transfer native ETH

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── wallet-connect.tsx # Wallet connection component
│   ├── smart-contract-demo.tsx # Smart contract demo
│   └── ui/               # UI components (Radix UI)
├── store/                # State management
│   └── wallet-store.ts   # Zustand wallet store
├── lib/                  # Utility functions
│   ├── utils.ts          # General utilities
│   └── ethereum-utils.ts # Ethereum-specific utilities
└── constants/            # Application constants
```

## 🔌 Key Components

### Wallet Store (`store/wallet-store.ts`)
- Manages wallet connection state
- Handles MetaMask integration
- Provides wallet actions (connect, disconnect, update)

### Wallet Connect Component (`components/wallet-connect.tsx`)
- Displays wallet connection status
- Provides connect/disconnect functionality
- Shows wallet address and network information

### Smart Contract Demo (`components/smart-contract-demo.tsx`)
- Demonstrates smart contract interactions
- Supports ERC-20 token operations
- Includes ETH transfer functionality

### Ethereum Utils (`lib/ethereum-utils.ts`)
- Utility functions for Ethereum operations
- Address validation and formatting
- Network management functions

## 🧪 Testing

### Test Networks
The dApp works with any Ethereum-compatible network. For testing, use:
- **Sepolia Testnet** (Chain ID: 11155111)
- **Goerli Testnet** (Chain ID: 5)
- **Mumbai Testnet** (Chain ID: 80001) - Polygon testnet

### Test Tokens
Use test ERC-20 tokens available on test networks for token transfer testing.

## 🔒 Security Considerations

- **Client-Side Only**: All wallet operations happen client-side
- **No Private Keys**: Private keys never leave the user's wallet
- **User Approval**: All transactions require user approval in MetaMask
- **Error Handling**: Comprehensive error handling for failed operations

## 🚨 Error Handling

The dApp includes comprehensive error handling for:
- MetaMask not installed
- Network connection issues
- Invalid contract addresses
- Insufficient balance
- Transaction failures
- Network switching errors

## 🔄 State Management

The application uses Zustand for state management with the following features:
- **Wallet State**: Connection status, address, network
- **Loading States**: Visual feedback during operations
- **Error States**: Error message handling
- **Persistent State**: Maintains state across page refreshes

## 📱 Responsive Design

The dApp is fully responsive and works on:
- Desktop browsers
- Tablet devices
- Mobile devices

## 🎨 UI/UX Features

- **Modern Design**: Clean, modern interface using Tailwind CSS
- **Loading Indicators**: Visual feedback during operations
- **Toast Notifications**: Success and error notifications
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Built with accessibility in mind

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

**Built with ❤️ using Next.js, Ethers.js, and Zustand**
