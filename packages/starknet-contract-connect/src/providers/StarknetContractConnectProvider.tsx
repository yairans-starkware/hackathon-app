import {FC, PropsWithChildren} from 'react';

import {DynamicContextProvider} from '@dynamic-labs/sdk-react-core';
import {StarknetWalletConnectors} from '@dynamic-labs/starknet';

export const StarknetContractConnectProvider: FC<PropsWithChildren & { dynamicEnvId: string }> = ({children, dynamicEnvId}) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: dynamicEnvId,
        initialAuthenticationMode: 'connect-only',
        walletConnectors: [
          StarknetWalletConnectors
        ],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};
