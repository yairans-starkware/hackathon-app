import './App.css'
import { FoodiezApp } from '@/components/FoodiezApp'
import { DynamicProvider } from './providers/DynamicProvider'

function App() {
  return (
    <DynamicProvider>
      <FoodiezApp />
    </DynamicProvider>
  )
}

export default App
