# Starknet Wallet Connect Library

A lightweight library for seamless wallet integration and smart contract interaction with **Starknet**. This library provides a reusable **Connect Wallet** button, helpful React hooks, and a provider for integrating wallet authentication into your app.

---

## Features

- **ConnectWalletButton**: A customizable button component for connecting wallets.
- **React Hooks**:
  - `useStarknetWallet`: Retrieve the user's connected StarkNet wallet.
  - `useWalletEvents`: Access wallet-related events like logout and SDK readiness.
  - `useContract`: Simplify smart contract interactions (read & write).
- **Provider**: Simplifies wrapping your app with the required context for wallet authentication.

---

## Installation

Install the library and its dependencies:

```bash
pnpm install @workspaces-name/starknet-contract-connect
```

## Usage

### 1. Wrap Your App with the Provider

Add the `StarknetContractConnectProvider` at the root level of your app to enable wallet integration and context support:

```tsx
import React from 'react';
import { StarknetContractConnectProvider } from '@workspaces-name/starknet-contract-connect';

const App = () => (
  <StarknetContractConnectProvider dynamicEnvId="your-dynamic-env-id">
    {/* Your application components */}
  </StarknetContractConnectProvider>
);

export default App;
```

### 2. Add a Connect Wallet Button

Use the `ConnectWalletButton` to trigger wallet authentication:

```tsx
import React from 'react';
import { ConnectWalletButton } from '@workspaces-name/starknet-contract-connect';

const WalletConnect = () => {
  const handleConnect = () => {
    console.log('Wallet connection initiated!');
  };

  return <ConnectWalletButton onConnect={handleConnect} />;
};

export default WalletConnect;
```

### 3. Retrieve Connected Wallet

Use the `useStarknetWallet` hook to access the user's connected StarkNet wallet:

```tsx
import React from 'react';
import { useStarknetWallet } from '@workspaces-name/starknet-contract-connect';

const WalletDetails = () => {
  const wallet = useStarknetWallet();

  return (
    <div>
      {wallet ? (
        <>
          <p>Connected Wallet: {wallet.address}</p>
          <p>Chain: {wallet.chain}</p>
        </>
      ) : (
        <p>No wallet connected</p>
      )}
    </div>
  );
};

export default WalletDetails;
```

### 4. Listen to Wallet Events

Use `useWalletEvents` to handle logout events or check SDK readiness:

```tsx
import React from 'react';
import { useWalletEvents } from '@workspaces-name/starknet-contract-connect';

const WalletEventHandler = () => {
  const { handleLogOut, isFullyLoaded } = useWalletEvents();

  return (
    <div>
      <p>SDK Loaded: {isFullyLoaded ? 'Yes' : 'No'}</p>
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default WalletEventHandler;
```

### 5. Connect to a Smart Contract

Use `useContract` to interact with a StarkNet smart contract:

```tsx
import React, { useEffect } from 'react';
import { useContract } from '@workspaces-name/starknet-contract-connect';

const abi = [/* ABI definition here */];
const contractAddress = "0xYourContractAddress";

const useMyAmazingContract = () => {
  const { write, read } = useContract({ abi, address: contractAddress });

  useEffect(() => {
    const fetchData = async () => {
      const data = await read?.yourReadFunction(/*your arguments*/);
      console.log(data);
    };
    fetchData();
  }, [read]);

  const writeData = async () => {
    await write?.yourWriteFunction(/*your arguments*/);
  };

  return (
    <div>
      <button onClick={writeData}>Write to Contract</button>
    </div>
  );
};

export default ContractInteraction;
```

## API Reference

### `ConnectWalletButton`

A button component to trigger wallet connection.

**Props**:
- `onConnect` (optional): A callback function that executes when the wallet connection process starts.

---

### `useStarknetWallet`

A hook to access the user's connected StarkNet wallet.

**Returns**:
- `StarknetWallet | undefined`: The connected StarkNet wallet instance, or `undefined` if no wallet is connected.

---

### `useWalletEvents`

A hook to handle wallet-related events.

**Returns**:
- `handleLogOut`: A function to log out the currently connected wallet.
- `isFullyLoaded`: A boolean indicating if the SDK is fully loaded and ready to use.

---

### `useContract`

A hook to simplify interactions with StarkNet smart contracts.

**Params**:
- `abi` (required): The ABI of the smart contract.
- `address` (required): The address of the smart contract.

**Returns**:
- `read`: A read-only contract instance for querying the smart contract.
- `write`: A write-enabled contract instance for performing state changes (requires a connected wallet).

---
