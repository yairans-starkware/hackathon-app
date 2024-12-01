import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { StarknetWalletConnectors } from '@dynamic-labs/starknet';
import React from 'react';
export const StarknetContractConnectProvider = ({ children, dynamicEnvId }) => {
    return (React.createElement(DynamicContextProvider, { settings: {
            environmentId: dynamicEnvId,
            initialAuthenticationMode: 'connect-only',
            walletConnectors: [
                StarknetWalletConnectors
            ],
        } }, children));
};
//# sourceMappingURL=StarknetContractConnectProvider.js.map