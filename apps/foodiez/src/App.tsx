import './App.css'
import { StarkitchenApp } from '@/components/StarkitchenApp'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import {StarknetContractConnectProvider} from '@catering-app/starknet-contract-connect';

function App() {
  return (
    <ErrorBoundary>
      <StarknetContractConnectProvider dynamicEnvId={import.meta.env.VITE_APP_DYNAMIC_ENV_ID}>
        <StarkitchenApp />
      </StarknetContractConnectProvider>
    </ErrorBoundary>
  )
}

export default App
