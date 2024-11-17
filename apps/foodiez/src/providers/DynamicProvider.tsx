import {FC, PropsWithChildren} from 'react';

import {DynamicContextProvider} from '@dynamic-labs/sdk-react-core';
import {StarknetWalletConnectors} from '@dynamic-labs/starknet';

export const DynamicProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: import.meta.env.VITE_APP_DYNAMIC_ENV_ID,
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
