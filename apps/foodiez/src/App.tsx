import './App.css'
import { StarkitchenApp } from '@/components/StarkitchenApp'
import { DynamicProvider } from './providers/DynamicProvider'

function App() {
  return (
    <DynamicProvider>
      <StarkitchenApp />
    </DynamicProvider>
  )
}

export default App
