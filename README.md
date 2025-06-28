# vTrades dApp - Blockchain Frontend Integration

A decentralized application (dApp) built with Next.js, featuring MetaMask wallet integration, smart contract interactions, and state management using Zustand with localStorage persistence.

## 🚀 Features

### Wallet Integration
- **MetaMask Integration**: Seamless connection with MetaMask wallet
- **Connect/Disconnect**: Easy wallet connection and disconnection
- **Address Display**: Shows connected wallet address (shortened and full)
- **Network Information**: Displays current network and chain ID
- **Event Handling**: Automatically handles wallet and network changes
- **Session Persistence**: Wallet connection persists across browser sessions using localStorage
- **Auto-Reconnection**: Automatically reconnects to previously connected wallet on page reload
- **Session Management**: Configurable session timeouts and session validation

### Smart Contract Interaction
- **ERC-20 Token Support**: Interact with any ERC-20 token contract
- **Token Information**: Get token name, symbol, decimals, and total supply
- **Balance Checking**: View your token balance
- **Token Transfer**: Send tokens to other addresses
- **ETH Transfer**: Send native ETH to other addresses
- **Transaction Confirmation**: Real-time transaction status updates

### State Management
- **Zustand Store**: Efficient state management for wallet data
- **Persistent State**: Wallet connection state management with localStorage
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during wallet operations
- **Session Validation**: Automatic session timeout and validation
- **Data Cleanup**: Easy clearing of stored wallet data

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 15 with React 19
- **Blockchain Integration**: Ethers.js v6
- **State Management**: Zustand with persistence middleware
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
4. **Session Persistence**: Your connection will be automatically restored on future visits

### Session Management

- **Auto-Reconnection**: The app automatically reconnects to your wallet when you return
- **Session Timeout**: Sessions expire after 24 hours by default (configurable)
- **Clear Data**: Use the "Clear Stored Data" button to remove all stored wallet information
- **Session Status**: View your current session status and remaining time

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
│   └── wallet-store.ts   # Zustand wallet store with persistence
├── lib/                  # Utility functions
│   ├── utils.ts          # General utilities including localStorage helpers
│   └── ethereum-utils.ts # Ethereum-specific utilities
└── constants/            # Application constants
```

## 🔌 Key Components

### Wallet Store (`store/wallet-store.ts`)
- Manages wallet connection state with localStorage persistence
- Handles MetaMask integration and auto-reconnection
- Provides wallet actions (connect, disconnect, update)
- Session management with configurable timeouts
- Automatic cleanup of expired sessions

### Wallet Connect Component (`components/wallet-connect.tsx`)
- Displays wallet connection status and session information
- Provides connect/disconnect functionality
- Shows wallet address, network information, and session details
- Includes session management controls

### Smart Contract Demo (`components/smart-contract-demo.tsx`)
- Demonstrates smart contract interactions
- Supports ERC-20 token operations
- Includes ETH transfer functionality

### Utilities (`lib/utils.ts`)
- localStorage management functions
- Session validation utilities
- Address formatting and validation
- Wallet session timeout management

## 🔒 Security Considerations

- **Client-Side Only**: All wallet operations happen client-side
- **No Private Keys**: Private keys never leave the user's wallet
- **User Approval**: All transactions require user approval in MetaMask
- **Session Timeouts**: Automatic session expiration for security
- **Data Cleanup**: Easy removal of stored wallet data
- **Error Handling**: Comprehensive error handling for failed operations

## 🚨 Error Handling

The dApp includes comprehensive error handling for:
- MetaMask not installed
- Network connection issues
- Invalid contract addresses
- Insufficient balance
- Transaction failures
- Network switching errors
- Session expiration
- localStorage access issues

## 🔄 State Management

The application uses Zustand with persistence middleware for state management:

### Persistence Features:
- **localStorage Integration**: Automatic saving and restoration of wallet state
- **Session Management**: Configurable session timeouts (default: 24 hours)
- **Auto-Reconnection**: Seamless reconnection on page reload
- **Data Validation**: Automatic cleanup of invalid or expired sessions
- **Selective Persistence**: Only persists serializable data (excludes provider/signer)

### State Structure:
- **Wallet State**: Connection status, address, network, session info
- **Loading States**: Visual feedback during operations
- **Error States**: Error message handling
- **Session Data**: Connection timestamp and timeout settings

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
- **Session Information**: Clear display of session status and remaining time
- **Accessibility**: Built with accessibility in mind

## 🔧 Configuration

### Session Timeouts
The app supports configurable session timeouts:
- **1 Hour**: `SESSION_TIMEOUTS.ONE_HOUR`
- **6 Hours**: `SESSION_TIMEOUTS.SIX_HOURS`
- **12 Hours**: `SESSION_TIMEOUTS.TWELVE_HOURS`
- **24 Hours**: `SESSION_TIMEOUTS.ONE_DAY` (default)
- **1 Week**: `SESSION_TIMEOUTS.ONE_WEEK`

### localStorage Keys
- **Main Storage**: `vtrades-wallet-storage`
- **Data Persisted**: Address, network info, connection status, session timestamp

## 🧪 Testing

### Test Networks
The dApp works with any Ethereum-compatible network. For testing, use:
- **Sepolia Testnet** (Chain ID: 11155111)
- **Goerli Testnet** (Chain ID: 5)
- **Mumbai Testnet** (Chain ID: 80001) - Polygon testnet

### Test Tokens
Use test ERC-20 tokens available on test networks for token transfer testing.

### Session Testing
- Test auto-reconnection by refreshing the page
- Test session expiration by waiting for timeout
- Test data clearing functionality
- Test MetaMask account switching

## 🎨 UI/UX Features

- **Modern Design**: Clean, modern interface using Tailwind CSS
- **Loading Indicators**: Visual feedback during operations
- **Toast Notifications**: Success and error notifications
- **Responsive Layout**: Adapts to different screen sizes
- **Session Information**: Clear display of session status and remaining time
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
